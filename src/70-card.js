
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

// History and statistics requests, shared by all cards on the page.
const SHARED_CACHE = new Map();

// The sensors a request reads, by role, for its cache key: two cards may use
// the same sensor for different things.
function sourcesKey(sources) {
  return Object.entries(sources).filter(([, entry]) => entry?.entityId).map(([name, entry]) => `${name}=${entityIds(entry).join("+")}`).join(",");
}

// Sections the viewer collapsed (`collapsible: true`), remembered in this
// browser. `collapsed:` in the config sets the starting state; changing it
// starts over from the new list.
const COLLAPSED_KEY = "solar-flow-card:collapsed";

function loadCollapsed(config) {
  const defaults = Array.isArray(config.collapsed) ? config.collapsed.map((id) => String(id).trim().toLowerCase()) : [];
  try {
    const saved = JSON.parse(localStorage.getItem(COLLAPSED_KEY) || "null");
    if (saved && JSON.stringify(saved.defaults) === JSON.stringify(defaults) && Array.isArray(saved.ids)) return new Set(saved.ids);
  } catch (error) {
    // Unavailable storage (private mode): start from the config.
  }
  return new Set(defaults);
}

function saveCollapsed(config, collapsed) {
  const defaults = Array.isArray(config.collapsed) ? config.collapsed.map((id) => String(id).trim().toLowerCase()) : [];
  try {
    localStorage.setItem(COLLAPSED_KEY, JSON.stringify({ defaults, ids: [...collapsed] }));
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

// `sections:` without `flow`: the theme's main view is left out. Diorama
// leaves out its parts itself; LCARS and Gate keep their frame.
function withoutFlow(theme, html, flowShown) {
  if (flowShown || ["diorama", "lcars", "gate"].includes(theme)) return html;
  const at = html.lastIndexOf('<div class="sfc-sections">');
  return at < 0 ? html : html.slice(at);
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

// One signed series from two one-way ones (discharge − charge, import −
// export): a gap in one counts as 0 while the other has a reading.
function flowSeries(plus, minus) {
  const length = (plus || minus).length;
  return Array.from({ length }, (_, i) => {
    const [a, b] = [plus?.[i] ?? null, minus?.[i] ?? null];
    return a === null && b === null ? null : (a || 0) - (b || 0);
  });
}

// dark_mode: true, or auto to follow Home Assistant's dark mode (Diorama).
const DARK_THEMES = ["diorama"];
function darkMode(config, hass) {
  if (!DARK_THEMES.includes(config.theme)) return false;
  if (config.dark_mode === true || config.dark_mode === "on") return true;
  return config.dark_mode === "auto" && Boolean(hass?.themes?.darkMode);
}

class SolarFlowCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = { ...DEFAULT_CONFIG };
    this._hass = null;
    this._period = null;
    // Browsing with the arrows: how many periods back (0 = the current one).
    this._offset = 0;
    this._inverterOpen = false;
    this._hiddenSeries = loadHiddenSeries();
    this._collapsed = new Set();
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
    // As set in the dashboard; _config also carries what the Energy
    // dashboard adds (see withEnergyAuto).
    this._ownConfig = this._config;
    this._collapsed = loadCollapsed(this._config);
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
        this._fitPills();
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

  // Cached async loader, shared by every card on the page: several cards
  // showing parts of the same installation ask Home Assistant once. A
  // finished request re-renders each card that waits for it.
  _fetch(key, ttl, loader) {
    const cached = SHARED_CACHE.get(key);
    if (cached && (cached.loading || Date.now() - cached.at < ttl)) {
      if (cached.loading) cached.waiters.add(this);
      return cached;
    }
    const entry = { data: cached?.data, at: cached?.at, error: cached?.error, loading: true, waiters: new Set([this]) };
    SHARED_CACHE.set(key, entry);
    loader()
      .then((data) => SHARED_CACHE.set(key, { data, at: Date.now() }))
      .catch((error) => {
        console.warn("Home Energy Hub: history unavailable", error);
        SHARED_CACHE.set(key, { error: true, data: cached?.data, at: Date.now() });
      })
      .finally(() => {
        for (const card of entry.waiters) {
          card._signature = "";
          card._render();
        }
      });
    return entry;
  }

  _periodEnergy(resolved, period, today, offset = 0) {
    if (period === "today" && !offset) return { totals: today, buckets: null, spec: null };
    const ids = ENERGY_ORDER.map((name) => resolved.energy[name]?.entityId).filter(Boolean);
    if (!ids.length || typeof this._hass.callWS !== "function") return { totals: {}, error: true };
    const spec = statsSpec(period, offset);
    const entry = this._fetch(`stats|${period}|${sourcesKey(resolved.energy)}|${spec.start.toDateString()}|${spec.end ? spec.end.getTime() : ""}`, spec.ttl, () =>
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
    const entry = this._fetch(`today-stats|${sourcesKey(resolved.energy)}|${new Date().toDateString()}`, 5 * 60000, () => loadTodayStats(this._hass, resolved.energy));
    return entry.data || null;
  }

  // Virtual storage (#43): the current hour, the full hours of today, and the
  // import left after hourly balancing for the selected period.
  _virtualStorage(resolved, config, period, now, totals, offset = 0) {
    const vs = virtualStorageConfig(config);
    if (!vs) return { store: null, net: null };
    const ids = GRID_COUNTERS.map((name) => resolved.energy[name]?.entityId);
    const counters = ids.every(Boolean) && typeof this._hass.callWS === "function";
    let current = null;
    let todayHours = null;
    let net = null;
    if (counters) {
      const hourStart = startOfHour(now).getTime();
      current = hourSoFar(resolved, this._fetch(`vs-hour|${ids.join(",")}|${hourStart}`, 5 * 60000, () => loadCurrentHour(this._hass, resolved.energy)).data);
      const hourly = (start) => this._fetch(`vs-hours|${ids.join(",")}|${start.getTime()}`, 5 * 60000, () => loadHourlyGrid(this._hass, resolved.energy, start)).data || null;
      const today = startOfDay(now);
      todayHours = hourly(today);
      if (period !== "today" && !MONTHLY_PERIODS.includes(period) && !statsSpec(period, offset).end) {
        const start = statsSpec(period).start;
        net = hourlyNet(hourly(start), start.getTime(), current);
      }
    }
    const store = virtualStorage(this._hass, resolved, vs, todayHours, current, now);
    // Today: the same counters as the rest of the card, less what was balanced.
    if (period === "today" && !offset && store.day && isNum(totals.gridImport)) {
      net = { gridImport: Math.max(0, totals.gridImport - store.day.balanced), gridExport: isNum(totals.gridExport) ? Math.max(0, totals.gridExport - store.day.balanced) : null };
    }
    return { store, net };
  }

  // Savings when a price comes from a sensor: hour by hour (month by month
  // for all time), each with its mean price. undefined with fixed prices
  // (the summary works them out from the totals), null while loading.
  // `since`: hour by hour from that date, whatever the period (payback with
  // hourly prices).
  _savings(resolved, period, energy, net, since = null, offset = 0) {
    const config = this._config;
    const prices = effectivePrices(this._hass, config);
    // Net-metering: a kWh sent back is worth `ratio` of a kWh bought.
    if (prices.ratio && prices.import) prices.export = prices.import.entity || prices.import.schedule ? { entity: prices.import.entity, ratio: prices.ratio } : { value: prices.import.value * prices.ratio };
    // Only an export price: the value of the energy sold.
    const kind = prices.import ? "savings" : "exportValue";
    if (!prices.import && !prices.export) return undefined;
    // Prices that change over time: from a sensor, or by period.
    const changing = (setting) => Boolean(setting?.entity || setting?.schedule);
    if (!changing(prices.import) && !changing(prices.export)) {
      const totals = energy.totals || {};
      if (!prices.import) return isNum(totals.gridExport) ? { kind, value: totals.gridExport * prices.export.value * prices.factor } : undefined;
      // Fixed prices as given: the summary works them out from the totals.
      if (!config.settlement) return undefined;
      if (!isNum(totals.load) || !isNum(totals.gridImport)) return undefined;
      const billedImport = net ? net.gridImport : totals.gridImport;
      const billedExport = net ? net.gridExport : totals.gridExport || 0;
      const sold = billedExport * (prices.export?.value || 0) * prices.factor;
      return { kind, value: (totals.load - billedImport) * prices.import.value + sold, cost: billedImport * prices.import.value, sold };
    }
    if (!prices.import) prices.import = { value: 0 };
    if (typeof this._hass.callWS !== "function") return undefined;
    const sources = sourcesKey(resolved.energy);
    if (!sources) return undefined;
    const states = this._hass.states;
    const now = { import: currentPrice(states, prices.import), export: prices.export?.ratio ? null : currentPrice(states, prices.export) ?? 0 };
    let rows;
    let start;
    let statPeriod = "hour";
    const ended = period === "today" && !offset ? null : statsSpec(period, offset).end || null;
    // Prices by period need the hours, also for the year and all time.
    if (MONTHLY_PERIODS.includes(period) && !since && prices.import?.schedule) {
      if (!energy.buckets) return { kind, value: null };
      const first = energy.buckets.find((b) => ENERGY_ORDER.some((name) => isNum(b[name]) && b[name] > 0));
      if (!first) return { kind, value: 0, cost: 0, sold: 0 };
      since = startOfDay(first.start);
    }
    const monthly = MONTHLY_PERIODS.includes(period) && !since;
    if (monthly) {
      if (!energy.buckets) return { kind, value: null };
      rows = energy.buckets.map((b) => ({ ...b, at: b.start.getTime() }));
      start = energy.spec.start;
      statPeriod = "month";
    } else {
      start = since || (period === "today" && !offset ? startOfDay(new Date()) : statsSpec(period, offset).start);
      const hourly = this._fetch(`hourly-energy|${sources}|${start.getTime()}`, since ? 60 * 60000 : 15 * 60000, () => loadHourlyEnergy(this._hass, resolved.energy, start));
      if (!hourly.data) return { kind, value: null };
      const hours = new Map();
      for (const [name, map] of Object.entries(hourly.data)) {
        for (const [at, kwh] of map) if (!ended || at < ended.getTime()) hours.set(at, { ...(hours.get(at) || { at }), [name]: kwh });
      }
      // Each hour with its consumption worked out, as in the totals.
      rows = [...hours.values()].map((row) => ({ ...deriveLoadEnergy(row), at: row.at }));
    }
    const ids = Object.fromEntries(["import", "export"].filter((name) => prices[name]?.entity && !prices[name].ratio).map((name) => [name, prices[name].entity]));
    const stats = this._fetch(`prices|${JSON.stringify(ids)}|${start.getTime()}|${statPeriod}`, 15 * 60000, () => loadPriceStats(this._hass, ids, start, statPeriod));
    if (!stats.data) return { kind, value: null };
    const price = (kind, at) => (kind === "export" ? prices.factor : 1) * basePrice(kind, at);
    const basePrice = (kind, at) => {
      const setting = prices[kind];
      if (!setting) return 0;
      if (setting.ratio) return setting.ratio * basePrice("import", at);
      if (setting.schedule) return periodPrice(setting, at === null ? Date.now() : at);
      if (!setting.entity) return setting.value;
      const mean = at === null ? undefined : stats.data[kind]?.get(at);
      return mean === undefined ? now[kind] ?? 0 : adjustPrice(setting, mean);
    };
    // What the hourly statistics do not cover yet (the current hour).
    let rest = null;
    if (!monthly && !ended) {
      const total = energy.totals || {};
      const sum = (name) => rows.reduce((acc, r) => acc + (r[name] || 0), 0);
      rest = Object.fromEntries(ENERGY_ORDER.filter((name) => isNum(total[name])).map((name) => [name, Math.max(0, total[name] - sum(name))]));
    }
    // Without an import price, only what was sold counts.
    const counted = kind === "exportValue" ? rows.map((r) => ({ ...r, load: 0, gridImport: 0 })) : rows;
    const left = kind === "exportValue" && rest ? { ...rest, load: 0, gridImport: 0 } : rest;
    const priced = pricedSavings(counted, left, price, Boolean(virtualStorageConfig(config)));
    return { kind, value: priced.saved, cost: kind === "savings" ? priced.cost : null, sold: priced.sold };
  }

  // Payback: the savings for all time, whatever period is shown.
  _payback(resolved, today) {
    const setup = paybackConfig(this._config);
    if (!setup) return null;
    const all = this._periodEnergy(resolved, "all", today);
    if (!all.buckets?.length) return null;
    const first = all.buckets.find((b) => ENERGY_ORDER.some((name) => isNum(b[name]) && b[name] > 0));
    // Hourly prices: hour by hour since the statistics begin, so a battery
    // charged when it is cheap and used when it is dear counts as it does on
    // the bill. Months would hide that.
    const prices = effectivePrices(this._hass, this._config);
    const hourly = Boolean(first && (prices.import?.entity || prices.import?.schedule || prices.export?.entity || prices.ratio));
    let money = this._savings(resolved, "all", all, null, hourly ? startOfDay(first.start) : null);
    if (money === undefined) {
      // Fixed prices: from the totals, as in the summary.
      const totals = all.totals;
      const buy = positiveNumber(this._config.price_import);
      const sell = positiveNumber(this._config.price_export) || 0;
      if (!buy || !isNum(totals.load) || !isNum(totals.gridImport)) return null;
      money = { value: (totals.load - totals.gridImport) * buy + (totals.gridExport || 0) * sell };
    }
    return paybackData(setup, money?.value, first?.start || null);
  }

  // Recorder history of the power sensors for today or the last 3 days,
  // shared by the chart and the day's highlights.
  _powerHistory(resolved, period, offset = 0) {
    const live = { ...resolved.live, ...bankHistorySources(this._hass, this._config) };
    // `<key>_history` under entities: a recorded twin of a live sensor (e.g.
    // a 5-minute copy of a sensor kept out of the recorder) for the charts.
    const configured = this._config.entities || {};
    for (const [name, def] of Object.entries(LIVE_METRICS)) {
      const id = configured[`${def.key}_history`];
      if (id && this._hass.states?.[id]) live[name] = { entityId: id, stateObj: this._hass.states[id] };
    }
    const ids = Object.values(live).filter(Boolean).map((entry) => entry.entityId);
    if (!ids.length || typeof this._hass.callWS !== "function") return null;
    const spec = powerSpec(period, offset);
    const entry = this._fetch(`history|${period}|${sourcesKey(live)}|${spec.start.toDateString()}|${spec.end ? spec.end.getTime() : ""}`, spec.ttl, () =>
      loadPowerHistory(this._hass, spec, live)
    );
    return { entry, spec };
  }

  // Today at a glance and the comparison with yesterday, the week and the
  // month. Shown in the wide layout, or anywhere with show_insights: true.
  _insights(resolved, today, forecast) {
    const config = this._config;
    const listed = sectionList(config);
    if (listed ? !listed.includes("insights") && !listed.includes("comparison") : !insightsShown(config)) return null;
    const history = this._powerHistory(resolved, "today");
    const day = history?.entry.data ? dayHighlights(this._powerChartData(history.entry.data.series, history.spec), history.spec, today, forecast) : null;
    const week = this._periodEnergy(resolved, "7d", today);
    const month = this._periodEnergy(resolved, "month", today);
    // The same days of this month a year ago, where the statistics go back that far.
    const sources = sourcesKey(resolved.energy);
    const yearAgo = sources && typeof this._hass.callWS === "function"
      ? this._fetch(`year-ago|${sources}|${new Date().toDateString()}`, 6 * 3600000, () => loadYearAgo(this._hass, resolved.energy)).data
      : null;
    const compare = comparisonRows(today, week, month, yearAgo);
    if (!day && !compare) return { loading: Boolean(history?.entry.loading || week.loading) };
    return { day, compare, at: [history?.entry.at, week.buckets?.length, month.buckets?.length, Boolean(yearAgo)] };
  }

  _chartState(resolved, period, energy, offset = 0) {
    const chart = this._chartStateBase(resolved, period, energy, offset);
    if (period !== "today" || offset || chart?.data?.kind !== "power" || this._config.show_solar === false) return chart;
    // The hourly PV forecast as a line next to the production.
    const forecast = this._forecastHours();
    const series = forecastSeries(forecast.hours, chart.data.spec);
    if (!series) return forecast.loading ? { ...chart, at: [chart.at, "forecast"] } : chart;
    return { ...chart, at: [chart.at, forecast.at], data: { ...chart.data, forecast: series } };
  }

  // Solcast's hourly attributes, or else Home Assistant's energy forecast
  // (Forecast.Solar and the like), only with pv_forecast configured.
  // `always`: also without pv_forecast (the battery's day ahead).
  _forecastHours(always = false) {
    const config = this._config;
    const fromStates = forecastHoursFromStates(this._hass, config);
    if (fromStates) return { hours: fromStates, at: [...fromStates].slice(0, 30).map(([, w]) => Math.round(w)).join(",") };
    const f = config.pv_forecast;
    if (typeof this._hass.callWS !== "function") return {};
    if (!always && (!f || typeof f !== "object" || f.hourly === false)) return {};
    const entry = this._fetch(`solar-forecast|${startOfDay(new Date()).getTime()}`, 30 * 60000, () => loadEnergyForecastHours(this._hass));
    return { hours: entry.data, at: entry.at, loading: entry.loading };
  }

  // The battery's charge level over the next day (see simulateBattery):
  // needs the capacity, an hourly PV forecast (with solar) and a week of
  // hourly energy statistics. `battery_day: false` turns it off.
  _batteryDay(resolved, forecast, showSolar) {
    if (this._config.battery_day === false || !forecast.capacity || !isNum(forecast.soc) || typeof this._hass.callWS !== "function") return null;
    const pv = showSolar ? this._forecastHours(true).hours : null;
    if (showSolar && !pv?.size) return null;
    const sources = sourcesKey(resolved.energy);
    if (!sources) return null;
    const start = startOfDay(addDays(new Date(), -7));
    const history = this._fetch(`load-profile|${sources}|${start.getTime()}`, 60 * 60000, () => loadHourlyEnergy(this._hass, resolved.energy, start));
    return simulateBattery(forecast, pv, loadProfile(history.data));
  }

  _chartStateBase(resolved, period, energy, offset = 0) {
    if (this._config.show_chart === false) return null;
    if (period === "today" || period === "3d") {
      const history = this._powerHistory(resolved, period, offset);
      if (!history) return null;
      const { entry, spec } = history;
      const data = entry.data ? this._powerChartData(entry.data.series, spec) : null;
      const chart = { loading: entry.loading, error: entry.error, at: entry.at, data };
      if (!entry.data || hasPowerSeries(data)) return chart;
      // No power history (sensors kept out of the recorder): the average
      // power of each hour from the energy statistics instead.
      chart.missing = entry.data.missing;
      const sources = sourcesKey(resolved.energy);
      if (!sources) return chart;
      const hourly = this._fetch(`hourly-energy|${sources}|${spec.start.getTime()}`, 15 * 60000, () => loadHourlyEnergy(this._hass, resolved.energy, spec.start));
      const fallback = hourly.data ? this._powerChartData(hourlyPowerSeries(hourly.data, spec), spec) : null;
      return {
        ...chart,
        loading: entry.loading || hourly.loading,
        at: [entry.at, hourly.at],
        data: hasPowerSeries(fallback) ? { ...fallback, soc: null, fallback: true } : data,
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
      battery = flowSeries(series.discharge, series.charge);
    } else if (series.battery) {
      battery = series.battery.map((v) => (v === null ? null : v * batteryFactor));
    }
    let grid = null;
    if (!(quiet(series.gridImport) && quiet(series.gridExport)) && (series.gridImport || series.gridExport)) {
      grid = flowSeries(series.gridImport, series.gridExport);
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
      const prefs = typeof this._hass.callWS === "function" ? this._fetch("energy-prefs", 10 * 60000, () => loadEnergyPrefs(this._hass)) : null;
      this._config = withEnergyAuto(this._ownConfig || this._config, energyAuto(prefs?.data, this._hass), this._hass);
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
        this._paint(BASE_CSS + THEME_CSS[theme] + FIT_CSS + colorCss(config), `sfc theme-${theme}`, `<div class="sfc-empty"><h2>${escapeHtml(t.noData)}</h2><p>${escapeHtml(t.noDataHelp)}</p></div>`);
        return;
      }
      const periods = periodList(config);
      const period = periods.includes(this._period) ? this._period : periods.includes(config.period) ? config.period : periods[0];
      // All time has nothing before it; `period_browse: false` hides the arrows.
      const browse = config.period_browse !== false && period !== "all";
      const offset = browse ? this._offset || 0 : 0;
      const showSolar = config.show_solar !== false;
      const live = liveValues(resolved, config);
      live.gridOff = gridOffline(resolved.gridStatus, config) === true;
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
      const energy = this._periodEnergy(resolved, period, today, offset);
      const chart = this._chartState(resolved, period, energy, offset);
      const forecast = batteryForecast(live, bank?.capacity && !positiveNumber(config.battery_capacity) ? { ...config, battery_capacity: bank.capacity } : config);
      const batteryDay = showBattery && config.show_forecast !== false ? this._batteryDay(resolved, forecast, showSolar) : null;
      forecast.day = batteryDay;
      if (batteryDay && period === "today" && !offset && chart?.data?.kind === "power" && chart.data.soc) {
        chart.data = { ...chart.data, socAhead: socAheadSeries(batteryDay, chart.data.spec) };
      }
      const readings = inverterReadings(resolved, this._hass, config);
      const panels = showSolar ? panelData(this._hass, resolved, config) || estimatePanels(readings, config, today) : null;
      const pvForecast = showSolar ? pvForecastData(this._hass, config, today) : null;
      const priceChart = priceChartData(this._hass, config);
      // The hourly PV forecast, for the cheapest hours' note.
      const pvHours = priceChart?.window && showSolar ? this._forecastHours(true).hours || null : null;
      const custom = customSections(this._hass, config);
      const ev = theme === "diorama" ? evData(this._hass, config) : null;
      const consumerSensors = consumerList(this._hass, config);
      const consumerStats = consumerSensors.some((item) => item.energy) && typeof this._hass.callWS === "function"
        ? this._fetch(`consumers|${consumerSensors.map((item) => item.energy || "").join("+")}|${new Date().toDateString()}`, 5 * 60000, () => loadConsumersToday(this._hass, consumerSensors)).data
        : null;
      const consumers = consumersData(this._hass, config, live, today, consumerStats);
      const insights = this._insights(resolved, today, forecast);
      const weather = theme === "diorama" || theme === "reactor" ? weatherData(this._hass, config) : null;
      // The wide layout has room for everything: inverter details stay open.
      const sections = sectionList(config);
      const flowShown = !sections || sections.includes("flow");
      // The wide layout puts the sections beside the theme's main view.
      const wide = config.wide === true && flowShown;
      // Nothing to show: no details section and no link to it.
      const hasDetails = readings.length > 0;
      const inverterOpen = hasDetails && (wide || this._inverterOpen);
      const inverter = inverterOpen ? readings : null;
      const system = config.show_system !== false ? systemData(this._hass, resolved, config, this._energyBaseline(resolved)) : null;
      if (system && !showBattery) Object.assign(system, { battery: [], batteryWarn: null });
      const gridGuard = system?.voltagePhases?.length && typeof this._hass.callWS === "function"
        ? this._fetch(`voltage|${system.voltagePhases.map((p) => p.voltageId).join("+")}|${system.voltageLimit}|${new Date().toDateString()}`, 5 * 60000,
          () => loadVoltageDay(this._hass, system.voltagePhases, startOfDay(new Date()), system.voltageLimit)).data || null
        : null;
      const since = period === "all" && energy.buckets?.length
        ? energy.buckets[0].start.toLocaleDateString(locale, { month: "short", year: "numeric" })
        : null;
      const ids = {
        live: Object.fromEntries(Object.entries(resolved.live).map(([k, v]) => [k, v?.entityId || null])),
        energy: Object.fromEntries(Object.entries(resolved.energy).map(([k, v]) => [k, v?.entityId || null])),
      };
      if (bank && !ids.live.soc && !ids.live.battery) ids.live.soc = bank.items[0].entityId;
      const now = new Date();
      const vstore = this._virtualStorage(resolved, config, period, now, today, offset);
      const money = this._savings(resolved, period, energy, vstore.net, null, offset);
      const payback = this._payback(resolved, today);
      this._introAt ??= Date.now();
      const introElapsed = (Date.now() - this._introAt) / 1000;
      const introAt = introElapsed < 2.6 ? introElapsed : null;
      const signature = JSON.stringify([
        language, config, darkMode(config, this._hass), period, offset, [...this._hiddenSeries], live, status.state, today, energy.totals, Boolean(energy.loading),
        chart && [Boolean(chart.loading), Boolean(chart.error), chart.at], forecast.mode, Math.round(forecast.hours * 60 || 0),
        panels?.panels.map((p) => [p.today, p.power]), system, bank, insights && [insights.loading, insights.at, insights.day?.offGridMinutes], weather && [weather.condition, weather.temperature], inverterOpen,
        inverter?.map((d) => [[...d.strings.values()].map((s) => Object.values(s).map((r) => r.value)), d.temperatures.map((r) => r.value), d.battery.map((r) => r.value), d.grid.map((r) => r.value)]),
        vstore,
        [...this._collapsed],
        payback && [Math.round(payback.saved), payback.at && payback.at.getMonth()],
        money && [money.kind, isNum(money.value) ? Math.round(money.value * 100) : null, isNum(money.cost) ? Math.round(money.cost * 100) : null],
        pvForecast && [pvForecast.total, pvForecast.remaining, pvForecast.days.map((d) => d.value)],
        priceChart && [priceChart.nowAt, priceChart.current, priceChart.hours.length, priceChart.window?.from, pvHours?.size],
        custom.map((c) => c.items.map((item) => item.state)),
        ev && [Math.round(ev.power || 0), ev.soc],
        gridGuard && [Math.round(gridGuard.max * 10), Math.round(gridGuard.minutes)],
        batteryDay && [Math.round(batteryDay.low.soc), batteryDay.fullAt && Math.round(batteryDay.fullAt / 300000), batteryDay.reserveAt && Math.round(batteryDay.reserveAt / 300000)],
        consumers && [consumers.items.map((item) => [item.power, isNum(item.today) ? Math.round(item.today * 100) : null]), consumers.other],
        Math.floor(now.getTime() / 60000),
      ]);
      if (signature === this._signature) return;
      this._signature = signature;

      const model = {
        t,
        locale,
        now,
        theme,
        dark: darkMode(config, this._hass),
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
          collapsible: config.collapsible === true,
        },
        ids,
        live,
        status,
        today,
        period,
        periods,
        // The period shown, when the arrows browse: its dates and how far back.
        browse: browse ? { offset, label: periodRangeLabel(energy.spec || statsSpec(period, offset), locale) } : null,
        totals: energy.totals || {},
        energyLoading: Boolean(energy.loading),
        payback,
        summary: periodSummary(energy.totals || {}, config, t, locale, vstore.net, money),
        virtualStorage: vstore.store,
        since,
        chart,
        forecast,
        panels,
        pvForecast,
        priceChart,
        pvHours,
        custom,
        ev,
        consumers,
        gridGuard,
        inverter,
        system,
        bank,
        insights,
        weather,
        inverterOpen,
        hasDetails,
        sections,
        collapsed: this._collapsed,
        hiddenSeries: this._hiddenSeries,
        // Seconds since the card was first shown, during its start-up
        // animation (re-renders continue it), then null.
        intro: introAt,
      };
      model.systemStatus = systemStatus(status, forecast, panels, system, live.gridOff);

      const painted = this._paint(
        BASE_CSS + THEME_CSS[theme] + FIT_CSS + colorCss(config),
        ["sfc", `theme-${theme}`, darkMode(config, this._hass) && "dark", config.animation === false && "no-anim", config.background === "glass" && "glass", !flowShown && theme !== "lcars" && theme !== "gate" && "parts", live.gridOff ? "grid-off" : live.exportActive ? "grid-export" : live.importActive && "grid-import"].filter(Boolean).join(" "),
        wide ? wideLayout(theme, THEME_RENDER[theme](model)) : withoutFlow(theme, THEME_RENDER[theme](model), flowShown),
      );
      if (!painted) return;
      this._wire(model);
      if (wide) this._balanceWide();
      if (theme === "diorama") this._fitPills();
    } catch (error) {
      console.error("Home Energy Hub render error", error);
      this._paint(BASE_CSS + THEME_CSS.diorama + FIT_CSS, "sfc", `<div class="sfc-empty"><h2>Home Energy Hub</h2><p>${escapeHtml(error?.message || error)}</p></div>`);
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

  // Diorama: a value pill on the right of the scene is longer than the room
  // left beside it on a narrow card; move it back inside the scene.
  _fitPills(tries = 0) {
    cancelAnimationFrame(this._pillFrame);
    const scene = this.shadowRoot?.querySelector(".dio-scene");
    if (!scene) return;
    const box = scene.getBoundingClientRect();
    if (!box.width) {
      if (tries < 20) this._pillFrame = requestAnimationFrame(() => this._fitPills(tries + 1));
      return;
    }
    const pills = [...scene.querySelectorAll(".dio-pill, .sr-chip")].map((el) => {
      el.style.translate = "";
      const r = el.getBoundingClientRect();
      const box2 = { el, left: r.left, right: r.right, top: r.top, bottom: r.bottom, dx: 0, dy: 0 };
      box2.dx = Math.min(0, box.right - 6 - r.right) || Math.max(0, box.left + 6 - r.left);
      return box2;
    }).sort((a, b) => a.left - b.left);
    // A pill moved in from the edge must not cover its neighbour in the
    // same row: the neighbour moves left as far as there is room, then the
    // moved pill goes under it.
    const at = (p) => ({ left: p.left + p.dx, right: p.right + p.dx, top: p.top + p.dy, bottom: p.bottom + p.dy });
    for (let i = 0; i < pills.length; i++) {
      for (let j = 0; j < i; j++) {
        const a = at(pills[j]), b = at(pills[i]);
        if (a.bottom <= b.top || b.bottom <= a.top || a.right + 6 <= b.left) continue;
        const room = Math.max(0, a.left - (box.left + 6));
        const left = Math.min(room, a.right + 6 - b.left);
        pills[j].dx -= left;
        if (at(pills[j]).right + 6 <= b.left) continue;
        // Under the neighbour, or above it when there is no room below.
        const down = a.bottom - b.top + 4;
        pills[i].dy += b.bottom + down <= box.bottom - 4 ? down : a.top - b.bottom - 4;
      }
    }
    for (const p of pills) if (p.dx || p.dy) p.el.style.translate = `${Math.round(p.dx)}px ${Math.round(p.dy)}px`;
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
    // A custom tile's tap, hold and double-tap actions (#168).
    const run = (act, entity) => {
      if (!act || act.action === "none") return;
      if (act.action === "more-info") {
        this.dispatchEvent(new CustomEvent("hass-more-info", { bubbles: true, composed: true, detail: { entityId: act.entity || entity } }));
      } else if (act.action === "navigate" && /^[/#]/.test(act.navigation_path || "")) {
        window.history.pushState(null, "", act.navigation_path);
        window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: false } }));
      } else if (act.action === "url" && /^(https?:\/\/|\/)/i.test(act.url_path || "")) {
        window.open(act.url_path, "_blank", "noopener");
      }
    };
    root.querySelectorAll("[data-act]").forEach((element) => {
      let acts;
      try { acts = JSON.parse(element.dataset.act); } catch (error) { return; }
      let holdTimer = null;
      let tapTimer = null;
      let held = false;
      element.addEventListener("pointerdown", () => {
        held = false;
        if (acts.hold) holdTimer = setTimeout(() => { held = true; run(acts.hold, acts.entity); }, 500);
      });
      for (const type of ["pointerup", "pointerleave", "pointercancel"]) element.addEventListener(type, () => clearTimeout(holdTimer));
      element.addEventListener("contextmenu", (event) => { if (acts.hold) event.preventDefault(); });
      element.addEventListener("click", (event) => {
        event.stopPropagation();
        if (held) { held = false; return; }
        if (!acts.double_tap) { run(acts.tap, acts.entity); return; }
        if (tapTimer) { clearTimeout(tapTimer); tapTimer = null; run(acts.double_tap, acts.entity); return; }
        tapTimer = setTimeout(() => { tapTimer = null; run(acts.tap, acts.entity); }, 250);
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
        this._offset = 0;
        this._render();
      });
    });
    // The arrows: a period back or forward; the dates between them return to
    // the current period.
    root.querySelectorAll("[data-browse]").forEach((element) => {
      element.addEventListener("click", () => {
        const step = element.dataset.browse;
        const next = step === "now" ? 0 : Math.max(0, (this._offset || 0) + Number(step));
        if (next === this._offset) return;
        this._offset = next;
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
    root.querySelectorAll("[data-fold-toggle]").forEach((element) => {
      const toggle = (event) => {
        event.stopPropagation();
        const id = element.dataset.foldToggle;
        if (this._collapsed.has(id)) this._collapsed.delete(id);
        else this._collapsed.add(id);
        saveCollapsed(this._config, this._collapsed);
        this._signature = "";
        this._render();
      };
      element.addEventListener("click", toggle);
      element.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggle(event);
        }
      });
    });
    wireChart(root, model.chart?.data, model.t, model.locale, model.hiddenSeries);
  }
}
