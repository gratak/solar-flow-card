
const DEFAULT_CONFIG = {
  theme: "diorama",
  show_energy: true,
  show_chart: true,
  show_forecast: true,
  show_panels: true,
  animation: true,
};

// Chart series the viewer switched off by clicking the legend; remembered in
// this browser for every card. Storage can be unavailable (private mode).
const HIDDEN_SERIES_KEY = "solar-flow-card:hidden-series";

function loadHiddenSeries() {
  try {
    const saved = JSON.parse(localStorage.getItem(HIDDEN_SERIES_KEY) || "[]");
    return new Set(Array.isArray(saved) ? saved.filter((kind) => typeof kind === "string") : []);
  } catch (error) {
    return new Set();
  }
}

function saveHiddenSeries(hidden) {
  try {
    localStorage.setItem(HIDDEN_SERIES_KEY, JSON.stringify([...hidden]));
  } catch (error) {
    // Not persisted; the choice still applies until the page reloads.
  }
}

// Wide layout: the theme's main view on the left, the sections beside it in
// a grid that flows, so a missing section leaves no gap. Below ~880 px the
// card falls back to the normal stacked layout. LCARS and Gate arrange
// their own columns.
function wideLayout(theme, html) {
  if (theme === "lcars" || theme === "gate") return html;
  const at = html.lastIndexOf('<div class="sfc-sections">');
  if (at < 0) return html;
  return `<div class="sfc-wide"><div class="sfc-wide-main">${html.slice(0, at)}<div class="sfc-wide-fill"></div></div>${html.slice(at)}</div>`;
}

// Wide layout: deal the sections, in order, to the shorter of the two
// columns (under the main view or under the energy section), so both end at
// about the same height. Returns false while the card is not laid out yet
// (Home Assistant's ha-card renders its slot a moment later).
function balanceWide(root) {
  const wide = root.querySelector(".sfc-wide");
  const main = wide?.querySelector(":scope > .sfc-wide-main");
  const fill = main?.querySelector(":scope > .sfc-wide-fill");
  const energy = wide?.querySelector(":scope > .sfc-sections > .sfc-energy");
  const rest = wide?.querySelector(".sfc-wide-rest");
  if (!fill || !energy || !rest || wide.dataset.balanced) return true;
  if (!main.offsetHeight || !energy.offsetHeight) return false;
  if (getComputedStyle(wide).display !== "grid") return true;
  wide.dataset.balanced = "1";
  const bottom = (el) => el.getBoundingClientRect().bottom;
  const sections = [...rest.children];
  sections.forEach((section) => section.remove());
  for (const section of sections) {
    const right = rest.lastElementChild ? bottom(rest.lastElementChild) : bottom(energy);
    (bottom(main) < right ? fill : rest).append(section);
  }
  return true;
}

class SolarFlowCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = { ...DEFAULT_CONFIG };
    this._hass = null;
    this._period = null;
    this._inverterOpen = false;
    this._cache = new Map();
    this._hiddenSeries = loadHiddenSeries();
    this._signature = "";
  }

  static get version() {
    return CARD_VERSION;
  }

  static getStubConfig() {
    return { theme: "diorama" };
  }

  static getConfigElement() {
    return document.createElement(EDITOR_TAG);
  }

  setConfig(config) {
    // Never throw: Home Assistant can pass an incomplete config while the
    // editor initializes, and a throw replaces the card with an error card.
    const normalized = config && typeof config === "object" && !Array.isArray(config) ? config : {};
    this._config = { ...DEFAULT_CONFIG, ...migrateConfig(normalized) };
    if (!THEMES.includes(this._config.theme)) this._config.theme = "diorama";
    this._signature = "";
    this._render();
  }

  connectedCallback() {
    // The wide layout depends on the card's width: lay it out again on resize.
    if (!this._resizeObserver && typeof ResizeObserver !== "undefined") {
      this._resizeObserver = new ResizeObserver(() => {
        const width = Math.round(this.getBoundingClientRect().width);
        if (width === this._width) return;
        this._width = width;
        if (this._config?.wide !== true) return;
        this._signature = "";
        this._html = null;
        this._render();
      });
    }
    this._resizeObserver?.observe(this);
  }

  disconnectedCallback() {
    this._resizeObserver?.disconnect();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  getCardSize() {
    return 8 + (this._config.show_system !== false ? 2 : 0) + (this._config.show_energy !== false ? 5 : 0) + (this._config.show_panels !== false ? 2 : 0);
  }

  getGridOptions() {
    return { columns: 12, rows: "auto", min_columns: 6 };
  }

  // Cached async loader; a finished request re-renders the card.
  _fetch(key, ttl, loader) {
    const cached = this._cache.get(key);
    if (cached && (cached.loading || Date.now() - cached.at < ttl)) return cached;
    const entry = { ...(cached || {}), loading: true };
    this._cache.set(key, entry);
    loader()
      .then((data) => this._cache.set(key, { data, at: Date.now() }))
      .catch((error) => {
        console.warn("Solar Flow Card: history unavailable", error);
        this._cache.set(key, { error: true, data: cached?.data, at: Date.now() });
      })
      .finally(() => {
        this._signature = "";
        this._render();
      });
    return entry;
  }

  _periodEnergy(resolved, period, today) {
    if (period === "today") return { totals: today, buckets: null, spec: null };
    const ids = ENERGY_ORDER.map((name) => resolved.energy[name]?.entityId).filter(Boolean);
    if (!ids.length || typeof this._hass.callWS !== "function") return { totals: {}, error: true };
    const spec = statsSpec(period);
    const entry = this._fetch(`stats|${period}|${ids.join(",")}|${spec.start.toDateString()}`, spec.ttl, () =>
      loadStatistics(this._hass, spec, resolved.energy)
    );
    if (!entry.data) return { totals: {}, loading: entry.loading, error: entry.error, spec };
    const buckets = withLiveToday(entry.data.buckets, spec, today).map(deriveLoadEnergy);
    return { totals: sumBuckets(buckets), buckets, spec, loading: entry.loading, error: entry.error };
  }

  // Lifetime energy counters (`energy_sensors: total`): today's hourly
  // statistics, refreshed every few minutes. undefined for daily sensors.
  _energyBaseline(resolved) {
    if (this._config.energy_sensors !== "total") return undefined;
    const ids = ENERGY_ORDER.map((name) => resolved.energy[name]?.entityId).filter(Boolean);
    if (!ids.length || typeof this._hass.callWS !== "function") return null;
    const entry = this._fetch(`today-stats|${ids.join(",")}|${new Date().toDateString()}`, 5 * 60000, () => loadTodayStats(this._hass, resolved.energy));
    return entry.data || null;
  }

  // Virtual storage (#43): the current hour, the full hours of today, and the
  // import left after hourly balancing for the selected period.
  _virtualStorage(resolved, config, period, now) {
    const vs = virtualStorageConfig(config);
    if (!vs) return { store: null, netImport: null };
    const ids = GRID_COUNTERS.map((name) => resolved.energy[name]?.entityId);
    const counters = ids.every(Boolean) && typeof this._hass.callWS === "function";
    let current = null;
    let todayHours = null;
    let netImport = null;
    if (counters) {
      const hourStart = startOfHour(now).getTime();
      current = hourSoFar(resolved, this._fetch(`vs-hour|${ids.join(",")}|${hourStart}`, 5 * 60000, () => loadCurrentHour(this._hass, resolved.energy)).data);
      const hourly = (start) => this._fetch(`vs-hours|${ids.join(",")}|${start.getTime()}`, 5 * 60000, () => loadHourlyGrid(this._hass, resolved.energy, start)).data || null;
      const today = startOfDay(now);
      todayHours = hourly(today);
      if (period !== "all") {
        const start = period === "today" ? today : statsSpec(period).start;
        netImport = hourlyNetImport(period === "today" ? todayHours : hourly(start), start.getTime(), current);
      }
    }
    return { store: virtualStorage(this._hass, resolved, vs, todayHours, current, now), netImport };
  }

  // Recorder history of the power sensors for today or the last 3 days,
  // shared by the chart and the day's highlights.
  _powerHistory(resolved, period) {
    const live = { ...resolved.live, ...bankHistorySources(this._hass, this._config) };
    const ids = Object.values(live).filter(Boolean).map((entry) => entry.entityId);
    if (!ids.length || typeof this._hass.callWS !== "function") return null;
    const spec = powerSpec(period);
    const entry = this._fetch(`history|${period}|${ids.join(",")}|${spec.start.toDateString()}`, spec.ttl, () =>
      loadPowerHistory(this._hass, spec, live)
    );
    return { entry, spec };
  }

  // Today at a glance and the comparison with yesterday, the week and the
  // month. Shown in the wide layout, or anywhere with show_insights: true.
  _insights(resolved, today, forecast) {
    const config = this._config;
    if (!insightsShown(config)) return null;
    const history = this._powerHistory(resolved, "today");
    const day = history?.entry.data ? dayHighlights(this._powerChartData(history.entry.data.series, history.spec), history.spec, today, forecast) : null;
    const week = this._periodEnergy(resolved, "7d", today);
    const month = this._periodEnergy(resolved, "month", today);
    const compare = comparisonRows(today, week, month);
    if (!day && !compare) return { loading: Boolean(history?.entry.loading || week.loading) };
    return { day, compare, at: [history?.entry.at, week.buckets?.length, month.buckets?.length] };
  }

  _chartState(resolved, period, energy) {
    if (this._config.show_chart === false) return null;
    if (period === "today" || period === "3d") {
      const history = this._powerHistory(resolved, period);
      if (!history) return null;
      const { entry, spec } = history;
      return {
        loading: entry.loading,
        error: entry.error,
        at: entry.at,
        data: entry.data ? this._powerChartData(entry.data.series, spec) : null,
      };
    }
    if (energy.error && !energy.buckets) return { error: true };
    return {
      loading: energy.loading,
      error: energy.error,
      at: energy.buckets ? energy.buckets.length : 0,
      data: energy.buckets ? { kind: "energy", spec: energy.spec, buckets: energy.buckets, noSolar: this._config.show_solar === false } : null,
    };
  }

  // Signed battery and grid series, with the same fallbacks as liveValues().
  _powerChartData(series, spec) {
    const quiet = (values) => !values || values.every((v) => v === null || Math.abs(v) <= ACTIVE_W);
    const batteryFactor = this._config.invert_battery ? -1 : 1;
    const gridFactor = this._config.invert_grid ? -1 : 1;
    let battery = null;
    if (!(quiet(series.charge) && quiet(series.discharge))) {
      battery = combineSeries(series.discharge || series.charge.map(() => 0), series.charge || series.discharge.map(() => 0), (d, c) => d - c);
    } else if (series.battery) {
      battery = series.battery.map((v) => (v === null ? null : v * batteryFactor));
    }
    let grid = null;
    if (!(quiet(series.gridImport) && quiet(series.gridExport)) && (series.gridImport || series.gridExport)) {
      grid = combineSeries(series.gridImport || series.gridExport.map(() => 0), series.gridExport || series.gridImport.map(() => 0), (i, e) => i - e);
    } else if (series.grid) {
      grid = series.grid.map((v) => (v === null ? null : v * gridFactor));
    } else if (series.gridImport) {
      grid = series.gridImport;
    }
    const noBattery = this._config.show_battery === false;
    // Several batteries: their summed power and capacity-weighted charge.
    const bankSeries = combineBankSeries(series, this._config);
    if (bankSeries.battery) battery = bankSeries.battery;
    const soc = bankSeries.soc || series.soc || null;
    // No consumption sensor: the same balance as liveValues(), point by point.
    let load = series.load || null;
    if (!load && (series.solar || grid)) {
      const length = (series.solar || grid).length;
      load = Array.from({ length }, (_, i) => {
        const [s, g, b] = [series.solar?.[i], grid?.[i], battery?.[i]];
        if (!isNum(s) && !isNum(g) && !isNum(b)) return null;
        return Math.max(0, Math.max(0, isNum(s) ? s : 0) + (isNum(g) ? g : 0) + (isNum(b) ? b : 0));
      });
    }
    return {
      kind: "power",
      spec,
      solar: this._config.show_solar === false ? null : series.solar || null,
      load,
      battery: noBattery ? null : battery,
      grid,
      soc: noBattery ? null : soc,
    };
  }

  _render() {
    if (!this.shadowRoot || !this._hass) return;
    try {
      const config = this._config;
      const language = languageOf(this._hass, config);
      const t = stringsFor(language);
      const locale = t.locale;
      const theme = config.theme;
      ensureThemeFonts(config);
      const resolved = resolveEntities(this._hass, config);
      if (!hasAnyEntity(resolved)) {
        const signature = `empty|${language}|${theme}`;
        if (signature === this._signature) return;
        this._signature = signature;
        this._paint(BASE_CSS + THEME_CSS[theme], `sfc theme-${theme}`, `<div class="sfc-empty"><h2>${escapeHtml(t.noData)}</h2><p>${escapeHtml(t.noDataHelp)}</p></div>`);
        return;
      }
      const period = PERIODS.includes(this._period) ? this._period : PERIODS.includes(config.period) ? config.period : "today";
      const showSolar = config.show_solar !== false;
      const live = liveValues(resolved, config);
      if (!showSolar) {
        live.solar = 0;
        live.solarActive = false;
      }
      const showBattery = config.show_battery !== false;
      const bank = showBattery ? batteryBank(this._hass, config) : null;
      if (bank) {
        if (isNum(bank.power)) {
          const p = bank.power;
          Object.assign(live, { battery: p, charge: Math.max(0, -p), discharge: Math.max(0, p), chargeActive: -p > ACTIVE_W, dischargeActive: p > ACTIVE_W });
          if (live.loadComputed) {
            live.load = Math.max(0, live.solar + live.grid + p);
            live.loadActive = live.load > ACTIVE_W;
          }
        }
        if (isNum(bank.soc)) live.soc = bank.soc;
      }
      if (!showBattery) {
        Object.assign(live, { charge: 0, discharge: 0, battery: 0, soc: null, chargeActive: false, dischargeActive: false });
      }
      const status = liveStatus(resolved);
      const today = todayEnergy(resolved, this._energyBaseline(resolved));
      const energy = this._periodEnergy(resolved, period, today);
      const chart = this._chartState(resolved, period, energy);
      const forecast = batteryForecast(live, bank?.capacity && !positiveNumber(config.battery_capacity) ? { ...config, battery_capacity: bank.capacity } : config);
      const readings = inverterReadings(resolved, this._hass, config);
      const panels = showSolar ? panelData(this._hass, resolved, config) || estimatePanels(readings, config, today) : null;
      const insights = this._insights(resolved, today, forecast);
      const weather = theme === "diorama" || theme === "reactor" ? weatherData(this._hass, config) : null;
      // The wide layout has room for everything: inverter details stay open.
      const wide = config.wide === true;
      // Nothing to show: no details section and no link to it.
      const hasDetails = readings.length > 0;
      const inverterOpen = hasDetails && (wide || this._inverterOpen);
      const inverter = inverterOpen ? readings : null;
      const system = config.show_system !== false ? systemData(this._hass, resolved, config) : null;
      if (system && !showBattery) Object.assign(system, { battery: [], batteryWarn: null });
      const since = period === "all" && energy.buckets?.length
        ? energy.buckets[0].start.toLocaleDateString(locale, { month: "short", year: "numeric" })
        : null;
      const ids = {
        live: Object.fromEntries(Object.entries(resolved.live).map(([k, v]) => [k, v?.entityId || null])),
        energy: Object.fromEntries(Object.entries(resolved.energy).map(([k, v]) => [k, v?.entityId || null])),
      };
      if (bank && !ids.live.soc && !ids.live.battery) ids.live.soc = bank.items[0].entityId;
      const now = new Date();
      const vstore = this._virtualStorage(resolved, config, period, now);
      this._introAt ??= Date.now();
      const introElapsed = (Date.now() - this._introAt) / 1000;
      const introAt = introElapsed < 2.6 ? introElapsed : null;
      const signature = JSON.stringify([
        language, config, period, [...this._hiddenSeries], live, status.state, today, energy.totals, Boolean(energy.loading),
        chart && [Boolean(chart.loading), Boolean(chart.error), chart.at], forecast.mode, Math.round(forecast.hours * 60 || 0),
        panels?.panels.map((p) => [p.today, p.power]), system, bank, insights && [insights.loading, insights.at, insights.day?.offGridMinutes], weather && [weather.condition, weather.temperature], inverterOpen,
        inverter?.map((d) => [[...d.strings.values()].map((s) => Object.values(s).map((r) => r.value)), d.temperatures.map((r) => r.value), d.battery.map((r) => r.value), d.grid.map((r) => r.value)]),
        vstore,
        Math.floor(now.getTime() / 60000),
      ]);
      if (signature === this._signature) return;
      this._signature = signature;

      const model = {
        t,
        locale,
        now,
        theme,
        station: resolved.station,
        name: resolved.name || t.defaultTitle,
        config: {
          ...config,
          showEnergy: config.show_energy !== false,
          showChart: config.show_chart !== false,
          showForecast: config.show_forecast !== false,
          showPanels: config.show_panels !== false,
          showSolar,
          showSystem: config.show_system !== false,
          showBattery,
          wide,
        },
        ids,
        live,
        status,
        today,
        period,
        totals: energy.totals || {},
        energyLoading: Boolean(energy.loading),
        summary: periodSummary(energy.totals || {}, config, t, locale, vstore.netImport),
        virtualStorage: vstore.store,
        since,
        chart,
        forecast,
        panels,
        inverter,
        system,
        bank,
        insights,
        weather,
        inverterOpen,
        hasDetails,
        hiddenSeries: this._hiddenSeries,
        // Seconds since the card was first shown, during its start-up
        // animation (re-renders continue it), then null.
        intro: introAt,
      };
      model.systemStatus = systemStatus(status, forecast, panels, system);

      const painted = this._paint(
        BASE_CSS + THEME_CSS[theme],
        ["sfc", `theme-${theme}`, config.animation === false && "no-anim", config.background === "glass" && "glass", live.exportActive ? "grid-export" : live.importActive && "grid-import"].filter(Boolean).join(" "),
        wide ? wideLayout(theme, THEME_RENDER[theme](model)) : THEME_RENDER[theme](model),
      );
      if (!painted) return;
      this._wire(model);
      if (wide) this._balanceWide();
    } catch (error) {
      console.error("Solar Flow Card render error", error);
      this._paint(BASE_CSS + THEME_CSS.diorama, "sfc", `<div class="sfc-empty"><h2>Solar Flow Card</h2><p>${escapeHtml(error?.message || error)}</p></div>`);
    }
  }

  // Update the card in place: the <style> and the ha-card element stay
  // between renders, only their contents change. A new ha-card on every
  // render was empty for a moment in Home Assistant (it fills its slot
  // asynchronously), so the dashboard got shorter and the page jumped to the
  // top at every refresh (#55).
  _paint(css, className, html) {
    const root = this.shadowRoot;
    let style = [...root.children].find((el) => el.localName === "style");
    let card = [...root.children].find((el) => el.localName === "ha-card");
    if (!style || !card) {
      root.innerHTML = "<style></style><ha-card></ha-card>";
      [style, card] = [root.querySelector("style"), root.querySelector("ha-card")];
      this._css = null;
      this._html = null;
    }
    if (this._css !== css) {
      style.textContent = css;
      this._css = css;
    }
    if (card.className !== className) card.className = className;
    if (this._html === html) return false;
    this._html = html;
    // Keep the card's height while its contents are replaced and laid out
    // (the wide layout moves sections into columns afterwards): a card that
    // is shorter even for a moment makes Safari on iOS jump to the top while
    // scrolling (#70). Released once the new contents have their own height.
    const height = card.offsetHeight;
    if (height) {
      card.style.minHeight = `${height}px`;
      cancelAnimationFrame(this._holdFrame);
      this._holdFrame = requestAnimationFrame(() => {
        this._holdFrame = requestAnimationFrame(() => { card.style.minHeight = ""; });
      });
    }
    card.innerHTML = html;
    return true;
  }

  // Balance once the card has a layout; retried for a few frames while
  // ha-card is still rendering.
  _balanceWide(tries = 0) {
    cancelAnimationFrame(this._balanceFrame);
    if (balanceWide(this.shadowRoot) || tries > 20) return;
    this._balanceFrame = requestAnimationFrame(() => this._balanceWide(tries + 1));
  }

  _wire(model) {
    const root = this.shadowRoot;
    root.querySelectorAll("[data-entity]").forEach((element) => {
      element.addEventListener("click", (event) => {
        event.stopPropagation();
        this.dispatchEvent(new CustomEvent("hass-more-info", {
          bubbles: true,
          composed: true,
          detail: { entityId: element.dataset.entity },
        }));
      });
    });
    root.querySelectorAll('[data-action="inverter"]').forEach((element) => {
      element.addEventListener("click", (event) => {
        event.stopPropagation();
        if (!model.hasDetails) return;
        if (model.config.wide) {
          root.querySelector(".sfc-inverter")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
          return;
        }
        this._inverterOpen = !this._inverterOpen;
        this._signature = "";
        this._render();
      });
    });
    root.querySelectorAll('[data-action="panels"]').forEach((element) => {
      element.addEventListener("click", () => root.getElementById("sfc-panels")?.scrollIntoView({ behavior: "smooth", block: "nearest" }));
    });
    root.querySelectorAll("[data-period]").forEach((element) => {
      element.addEventListener("click", () => {
        if (element.dataset.period === model.period) return;
        this._period = element.dataset.period;
        this._render();
      });
    });
    root.querySelectorAll("[data-series]").forEach((element) => {
      element.addEventListener("click", () => {
        const kind = element.dataset.series;
        if (this._hiddenSeries.has(kind)) this._hiddenSeries.delete(kind);
        else this._hiddenSeries.add(kind);
        saveHiddenSeries(this._hiddenSeries);
        this._signature = "";
        this._render();
      });
    });
    wireChart(root, model.chart?.data, model.t, model.locale, model.hiddenSeries);
  }
}
