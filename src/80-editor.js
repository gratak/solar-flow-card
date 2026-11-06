
// [config key, label key, input step]
const EDITOR_NUMBERS = [
  ["battery_capacity", "editorBatteryCapacity", "0.1"],
  ["battery_min_soc", "editorBatteryMinSoc", "1"],
  ["pv_capacity", "editorPvCapacity", "0.1"],
  ["pv_panels", "editorPvPanels", "1"],
  ["inverter_power_rating", "editorInverterRating", "0.1"],
];
const EDITOR_PRICES = [
  ["price_import", "editorPriceImport", "0.01"],
  ["price_export", "editorPriceExport", "0.01"],
  ["co2_factor", "editorCo2", "0.01"],
];
// "Today at a glance" and the comparison: shown in the wide layout unless
// switched off, elsewhere only when switched on.
function insightsShown(config) {
  return config.show_insights === true || (config.show_insights !== false && config.wide === true);
}

// The inverter's PV strings, for one "panels on this string" field each.
function editorStrings(hass, config) {
  try {
    const device = inverterReadings(resolveEntities(hass, config), hass, config).find((d) => d.strings.size);
    return device ? [...device.strings.entries()].sort((a, b) => a[0] - b[0]).map(([index, s]) => ({ index, voltage: s.V?.value ?? null })) : [];
  } catch (error) {
    return [];
  }
}

// Switches: [config key, label key, value when on]; on unless set to false
// (EDITOR_DEFAULT_ON) or off unless set (the rest).
const EDITOR_DEFAULT_ON = ["show_solar", "show_battery", "show_chart", "show_weather", "show_self_sufficiency", "show_self_use", "show_savings", "show_co2", "show_yield", "animation"];
const EDITOR_SWITCH_GROUPS = {
  look: [["wide", "editorWide"], ["background", "editorGlass", "glass"], ["animation", "editorAnimation"], ["load_fonts", "editorFonts"], ["collapsible", "editorCollapsible"], ["show_chart", "editorShowChart"], ["show_weather", "editorShowWeather"]],
  install: [["show_solar", "editorSolar"], ["show_battery", "editorBattery"], ["panels_average", "editorPanelsAverage", "per_string"]],
  summary: [["show_self_sufficiency", "editorShowSelfSufficiency"], ["show_self_use", "editorShowSelfUse"], ["show_savings", "editorShowSavings"], ["show_co2", "editorShowCo2"], ["show_yield", "editorShowYield"], ["show_insights", "editorInsights"]],
  sensors: [["invert_grid", "editorInvertGrid"], ["invert_battery", "editorInvertBattery"]],
};

// The sensors under `entities:`, in groups: [config key, label].
function editorEntityGroups(t) {
  const phases = (key, label) => [1, 2, 3].map((n) => [`${key}_l${n}`, fill(label, { n: `L${n}` })]);
  const strings = [1, 2, 3, 4].flatMap((n) => [[`pv${n}_power`, fill(t.editorStringPower, { n })], [`pv${n}_voltage`, fill(t.editorStringVoltage, { n })], [`pv${n}_current`, fill(t.editorStringCurrent, { n })]]);
  const named = (keys) => keys.map((key) => [key, t.editorEntities[key]]);
  return [
    ["live", named(["solar_power", "load_power", "grid_power", "grid_import_power", "grid_export_power", "battery_power", "battery_charge_power", "battery_discharge_power", "battery_soc"])],
    ["energy", named(["solar_energy", "load_energy", "grid_import_energy", "grid_export_energy", "battery_charge_energy", "battery_discharge_energy"])],
    ["system", [...phases("load_power", t.editorPhaseLoad), ...phases("grid_power", t.editorPhaseGrid), ...phases("grid_voltage", t.editorPhaseVoltage),
      ...named(["inverter_power", "inverter_rated_power", "battery_temperature", "battery_voltage", "battery_current", "generator_power"])]],
    ["strings", strings],
  ];
}

// The sections in the editor: the configured list, or every section in the
// default order without the ones a `show_…: false` hides.
const SECTION_SHOW_KEYS = { energy: "show_energy", forecast: "show_forecast", system: "show_system", panels: "show_panels" };
function editorSections(config) {
  const order = ["flow", "today", "sources", ...SECTION_ORDER];
  const listed = sectionList(config);
  const on = listed || order.filter((id) => config[SECTION_SHOW_KEYS[id]] !== false && (id !== "insights" && id !== "comparison" || insightsShown(config)));
  return [...on.map((id) => ({ id, on: true })), ...order.filter((id) => !on.includes(id)).map((id) => ({ id, on: false }))];
}

class SolarFlowCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {};
    this._hass = null;
    this._open = new Set(["look"]);
  }

  set hass(hass) {
    const first = !this._hass;
    this._hass = hass;
    if (first) {
      this._render();
      this._loadPicker();
    } else {
      this.shadowRoot.querySelectorAll("ha-selector").forEach((el) => { el.hass = hass; });
    }
  }

  setConfig(config) {
    // The editor writes the current option names; an old name is replaced on
    // the next change. Options it does not show are kept as they are.
    const next = migrateConfig(config || {});
    // Home Assistant hands every change back: nothing to redraw then, so the
    // field being edited keeps its focus.
    if (JSON.stringify(next) === JSON.stringify(this._config) && this.shadowRoot.childElementCount) return;
    this._config = next;
    this._render();
  }

  // Home Assistant loads its entity picker only when a built-in editor needs
  // it: open one in the background, then draw the pickers again.
  async _loadPicker() {
    if (customElements.get("ha-selector") || typeof window.loadCardHelpers !== "function") return;
    try {
      const helpers = await window.loadCardHelpers();
      const card = await helpers.createCardElement({ type: "entities", entities: [] });
      await card.constructor.getConfigElement?.();
      await customElements.whenDefined("ha-selector");
      this._render();
    } catch (error) {
      // The text fields with suggestions stay.
    }
  }

  _emit(next) {
    this._config = next;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: next }, bubbles: true, composed: true }));
  }

  _set(key, value) {
    const next = { ...this._config };
    if (value === undefined || value === null || value === "") delete next[key];
    else next[key] = value;
    this._emit(next);
  }

  // A key inside an object option (entities, virtual_storage, pv_forecast);
  // the object goes away when it is left empty.
  _setIn(group, key, value) {
    const inner = { ...(typeof this._config[group] === "object" && this._config[group] ? this._config[group] : {}) };
    if (value === undefined || value === null || value === "" || (Array.isArray(value) && !value.length)) delete inner[key];
    else inner[key] = value;
    this._set(group, Object.keys(inner).length ? inner : undefined);
  }

  _setVirtual(key, value) {
    const vs = this._config.virtual_storage;
    const inner = { ...(vs && typeof vs === "object" ? vs : {}) };
    if (value === undefined || value === "" || value === false) delete inner[key];
    else inner[key] = value;
    this._set("virtual_storage", Object.keys(inner).length ? inner : true);
  }

  // An entity field: Home Assistant's picker when it is available, else a
  // text field with the sensors as suggestions.
  _picker(path, label, value, domain = "sensor") {
    return `<div class="picker" data-path="${escapeHtml(path)}" data-label="${escapeHtml(label)}" data-domain="${domain}" data-value="${escapeHtml(value || "")}"></div>`;
  }

  _mountPickers(root) {
    const selector = customElements.get("ha-selector");
    for (const el of root.querySelectorAll(".picker")) {
      const { path, label, domain, value } = el.dataset;
      const changed = (v) => this._pick(path, typeof v === "string" ? v.trim() : v);
      if (selector) {
        const picker = document.createElement("ha-selector");
        picker.hass = this._hass;
        picker.selector = { entity: { domain } };
        picker.label = label;
        picker.value = value || undefined;
        picker.required = false;
        picker.addEventListener("value-changed", (e) => changed(e.detail?.value));
        el.append(picker);
      } else {
        el.innerHTML = `<label><span>${escapeHtml(label)}</span><input type="text" list="sfc-${domain}" value="${escapeHtml(value)}" placeholder="${domain}.…" /></label>`;
        el.querySelector("input").addEventListener("change", (e) => changed(e.target.value));
      }
    }
  }

  _pick(path, value) {
    const [group, key, index] = path.split(".");
    if (group === "entities") this._setIn("entities", key, value);
    else if (group === "virtual_storage") this._setVirtual(key, value);
    else if (group === "pv_forecast" && key === "days") this._setList(["pv_forecast", "days"], Number(index), value);
    else if (group === "pv_forecast") this._setIn("pv_forecast", key, value);
    else if (group === "inverter_details") this._setList(["inverter_details"], Number(key), value);
    else this._set(group, value);
  }

  // One item of a list option; an emptied item is removed.
  _setList([group, key], index, value) {
    const current = key ? this._config[group]?.[key] : this._config[group];
    const list = Array.isArray(current) ? [...current] : [];
    if (value) list[index] = value;
    else list.splice(index, 1);
    const clean = list.filter(Boolean);
    if (key) this._setIn(group, key, clean);
    else this._set(group, clean.length ? clean : undefined);
    this._render();
  }

  _switchOn(key, value) {
    if (key === "show_insights") return insightsShown(this._config);
    return EDITOR_DEFAULT_ON.includes(key) ? this._config[key] !== false : this._config[key] === (value ?? true);
  }

  _switches(t, group) {
    return EDITOR_SWITCH_GROUPS[group].map(([key, label, value]) => `
      <div class="switch"><label for="sw-${key}">${escapeHtml(t[label])}</label>
        <input id="sw-${key}" data-switch="${key}" data-on="${escapeHtml(String(value ?? true))}" type="checkbox" ${this._switchOn(key, value) ? "checked" : ""} /></div>`).join("");
  }

  _numbers(t, list) {
    return list.map(([key, label, step]) => `
      <label><span>${escapeHtml(t[label])}</span><input data-number="${key}" type="number" min="0" step="${step}" inputmode="decimal" value="${escapeHtml(this._config[key] ?? "")}" /></label>`).join("");
  }

  // Panels on each PV string the inverter reports (or one field when it
  // reports none), for the per-panel estimate without optimizers.
  _stringsHtml(t) {
    const setting = this._config.panels_per_string;
    const valueAt = (i) => (Array.isArray(setting) ? setting[i] ?? "" : setting ?? "");
    const strings = editorStrings(this._hass, this._config);
    const fields = strings.length
      ? strings.map((s, i) => `
          <label><span>${escapeHtml(fill(t.editorStringPanels, { n: s.index, volts: isNum(s.voltage) ? `${Math.round(s.voltage)} V` : "—" }))}</span>
            <input data-string="${i}" type="number" min="0" step="1" inputmode="numeric" value="${escapeHtml(String(valueAt(i)))}" /></label>`).join("")
      : `<label><span>${escapeHtml(t.editorPanelsPerString)}</span><input id="panels_per_string" type="number" min="0" step="1" inputmode="numeric" value="${escapeHtml(String(Array.isArray(setting) ? setting[0] ?? "" : setting ?? ""))}" /></label>`;
    return `
      <div class="box">
        <span class="title">${escapeHtml(t.editorPanelsPerString)}</span>
        <div class="grid">${fields}</div>
        <p class="hint">${escapeHtml(t.editorStringsHint)}</p>
      </div>`;
  }

  _group(id, t, body) {
    const open = this._open.has(id);
    return `
      <details data-group="${id}" ${open ? "open" : ""}>
        <summary>${escapeHtml(t.editorGroups[id])}</summary>
        <div class="body">${open ? body() : ""}</div>
      </details>`;
  }

  _lookHtml(t) {
    const stations = deyeStations(this._hass);
    const labels = periodLabels(t);
    return `
      <div class="themes">${THEMES.map((theme) => `
        <button type="button" data-theme="${theme}" class="${(this._config.theme || "diorama") === theme ? "on" : ""}">${escapeHtml(t.themeNames[theme])}</button>`).join("")}
      </div>
      <div class="grid">
        <label><span>${escapeHtml(t.editorTitle)}</span><input data-text="title" type="text" value="${escapeHtml(this._config.title ?? "")}" /></label>
        <label><span>${escapeHtml(t.editorLanguage)}</span>
          <select data-select="language">
            <option value="">${escapeHtml(t.languageAuto)}</option>
            ${Object.entries(LANGUAGE_NAMES).map(([code, name]) => `<option value="${code}" ${this._config.language === code ? "selected" : ""}>${escapeHtml(name)}</option>`).join("")}
          </select>
        </label>
        <label><span>${escapeHtml(t.editorPeriod)}</span>
          <select data-select="period">${PERIODS.map((p) => `<option value="${p === "today" ? "" : p}" ${(this._config.period || "today") === p ? "selected" : ""}>${escapeHtml(labels[p][1])}</option>`).join("")}</select>
        </label>
        ${stations.length > 1 ? `
          <label><span>${escapeHtml(t.editorStation)}</span>
            <select data-select="station_id"><option value="">${escapeHtml(t.auto)}</option>
              ${stations.map((id) => `<option value="${escapeHtml(id)}" ${String(this._config.station_id) === id ? "selected" : ""}>${escapeHtml(id)}</option>`).join("")}
            </select>
          </label>` : ""}
      </div>
      ${this._switches(t, "look")}`;
  }

  _sensorsHtml(t) {
    const entities = this._config.entities || {};
    return `
      <p class="hint">${escapeHtml(t.editorSensorsHint)}</p>
      ${editorEntityGroups(t).map(([group, items]) => `
        <details class="box" ${group === "live" || group === "energy" || items.some(([key]) => entities[key]) ? "open" : ""}>
          <summary class="title">${escapeHtml(t.editorEntityGroups[group])}</summary>
          <div class="pickers">${items.map(([key, label]) => this._picker(`entities.${key}`, label, entities[key])).join("")}</div>
        </details>`).join("")}
      <label><span>${escapeHtml(t.editorEnergySensors)}</span>
        <select data-select="energy_sensors">
          <option value="">${escapeHtml(t.editorEnergyDaily)}</option>
          <option value="total" ${this._config.energy_sensors === "total" ? "selected" : ""}>${escapeHtml(t.editorEnergyTotal)}</option>
        </select>
      </label>
      ${this._switches(t, "sensors")}`;
  }

  _sectionsHtml(t) {
    const rows = editorSections(this._config);
    const collapsible = this._config.collapsible === true;
    const collapsed = Array.isArray(this._config.collapsed) ? this._config.collapsed : [];
    return `
      <p class="hint">${escapeHtml(t.editorSectionsHint)}</p>
      <div class="sections">${rows.map(({ id, on }, i) => `
        <div class="section ${on ? "" : "off"}">
          <input type="checkbox" data-section="${id}" ${on ? "checked" : ""} aria-label="${escapeHtml(t.editorSectionNames[id])}" />
          <span>${escapeHtml(t.editorSectionNames[id])}${id === "today" || id === "sources" ? ` <small>(Diorama)</small>` : ""}</span>
          ${collapsible && on && SECTION_HTML[id] && id !== "inverter" ? `<label class="fold"><input type="checkbox" data-fold="${id}" ${collapsed.includes(id) ? "checked" : ""} /> ${escapeHtml(t.editorFolded)}</label>` : ""}
          ${on ? `<button type="button" data-move="${i}" data-dir="-1" title="${escapeHtml(t.editorUp)}" ${i === 0 ? "disabled" : ""}>↑</button>
          <button type="button" data-move="${i}" data-dir="1" title="${escapeHtml(t.editorDown)}" ${!rows[i + 1]?.on ? "disabled" : ""}>↓</button>` : ""}
        </div>`).join("")}
      </div>
      ${sectionList(this._config) ? `<button type="button" class="link" data-reset-sections>${escapeHtml(t.editorReset)}</button>` : ""}`;
  }

  _installHtml(t) {
    return `
      <div class="grid">${this._numbers(t, EDITOR_NUMBERS)}</div>
      ${this._stringsHtml(t)}
      ${this._switches(t, "install")}
      <p class="hint">${escapeHtml(t.editorYamlOnly)}</p>`;
  }

  _summaryHtml(t) {
    return `
      <div class="grid">
        ${this._numbers(t, EDITOR_PRICES)}
        <label><span>${escapeHtml(t.editorCurrency)}</span><input data-text="currency" type="text" value="${escapeHtml(this._config.currency ?? "")}" placeholder="${escapeHtml(t.currency)}" /></label>
      </div>
      ${this._switches(t, "summary")}`;
  }

  _vstoreHtml(t) {
    const config = virtualStorageConfig(this._config);
    return `
      <div class="switch"><label for="vs-on">${escapeHtml(t.editorVsEnable)}</label><input id="vs-on" type="checkbox" ${config ? "checked" : ""} /></div>
      ${config ? `
        ${this._picker("virtual_storage.entity", t.editorVsEntity, config.entity)}
        <label><span>${escapeHtml(t.editorVsNegative)}</span>
          <select data-vs="negative">
            <option value="">${escapeHtml(t.editorVsShow)}</option>
            <option value="zero" ${config.negative === "zero" ? "selected" : ""}>${escapeHtml(t.editorVsZero)}</option>
          </select>
        </label>
        <div class="switch"><label for="vs-own">${escapeHtml(t.editorVsOwn)}</label><input id="vs-own" type="checkbox" ${config.countAsOwn ? "checked" : ""} /></div>
        <p class="hint">${escapeHtml(t.editorVsHint)}</p>` : ""}`;
  }

  _forecastHtml(t) {
    const f = this._config.pv_forecast && typeof this._config.pv_forecast === "object" ? this._config.pv_forecast : {};
    const days = Array.isArray(f.days) ? f.days : [];
    return `
      ${this._picker("pv_forecast.today", t.editorPvfToday, f.today)}
      ${this._picker("pv_forecast.remaining", t.editorPvfRemaining, f.remaining)}
      <div class="box">
        <span class="title">${escapeHtml(t.editorPvfDays)}</span>
        <div class="pickers">${[...days, ""].slice(0, 13).map((id, i) => this._picker(`pv_forecast.days.${i}`, fill(t.editorDayN, { n: i + 1 }), id)).join("")}</div>
      </div>`;
  }

  _moreHtml(t) {
    const details = Array.isArray(this._config.inverter_details) ? this._config.inverter_details : [];
    return `
      <div class="box">
        <span class="title">${escapeHtml(t.editorDetails)}</span>
        <div class="pickers">${[...details, ""].map((item, i) => (typeof item === "object" && item
          ? `<p class="hint">${escapeHtml(item.name || item.entity || "")} (YAML)</p>`
          : this._picker(`inverter_details.${i}`, fill(t.editorSensorN, { n: i + 1 }), item))).join("")}</div>
      </div>
      ${this._picker("weather_entity", t.editorWeather, this._config.weather_entity, "weather")}
      <label><span>${escapeHtml(t.editorFontUrl)}</span><input data-text="font_url" type="text" value="${escapeHtml(this._config.font_url ?? "")}" placeholder="/local/fonts/solar-flow-card.css" /></label>`;
  }

  _render() {
    if (!this.shadowRoot) return;
    const t = stringsFor(languageOf(this._hass, this._config));
    const ids = (domain) => Object.keys(this._hass?.states || {}).filter((id) => id.startsWith(`${domain}.`)).sort();
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; color: var(--primary-text-color); }
        .editor { display: grid; gap: 8px; padding: 8px 0; }
        .beta { margin: 0 0 4px; padding: 8px 11px; border-radius: 10px; background: var(--secondary-background-color, rgba(127,127,127,.08)); color: var(--secondary-text-color, #727272); font-size: 12px; }
        details { border: 1px solid var(--divider-color, rgba(127,127,127,.35)); border-radius: 12px; }
        summary { padding: 12px 14px; cursor: pointer; font-weight: 600; font-size: 15px; }
        .body { display: grid; gap: 12px; padding: 4px 14px 14px; }
        label { display: grid; gap: 6px; font-size: 13px; color: var(--secondary-text-color, #727272); }
        input[type="text"], input[type="number"], select {
          width: 100%; min-height: 40px; box-sizing: border-box; padding: 8px 11px; font: inherit;
          color: var(--primary-text-color); background: var(--card-background-color, transparent);
          border: 1px solid var(--divider-color, rgba(127,127,127,.35)); border-radius: 10px;
        }
        .themes { display: grid; grid-template-columns: repeat(auto-fill, minmax(96px, 1fr)); gap: 6px; }
        .themes button { padding: 10px 4px; border-radius: 10px; border: 1px solid var(--divider-color, rgba(127,127,127,.35)); background: var(--card-background-color, transparent);
          color: var(--primary-text-color); font: inherit; font-size: 12px; cursor: pointer; }
        .themes button.on { border-color: var(--primary-color, #03a9f4); box-shadow: inset 0 0 0 1px var(--primary-color, #03a9f4); font-weight: 700; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; }
        .pickers { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px; }
        .switch { display: flex; justify-content: space-between; align-items: center; gap: 12px; color: var(--primary-text-color); font-size: 14px; }
        .switch label { color: inherit; font-size: inherit; }
        input[type="checkbox"] { width: 19px; height: 19px; flex: none; accent-color: var(--primary-color, #03a9f4); }
        .hint { margin: 0; color: var(--secondary-text-color, #727272); font-size: 12px; }
        .box { display: grid; gap: 8px; padding: 10px 12px; border: 1px solid var(--divider-color, rgba(127,127,127,.35)); border-radius: 10px; }
        .box .title { font-size: 13px; font-weight: 600; color: var(--primary-text-color); }
        details.box { border-radius: 10px; }
        details.box > summary { padding: 0; cursor: pointer; }
        details.box[open] > summary { margin-bottom: 4px; }
        .sections { display: grid; gap: 4px; }
        .section { display: flex; align-items: center; gap: 10px; min-height: 40px; padding: 0 6px 0 10px; border: 1px solid var(--divider-color, rgba(127,127,127,.35)); border-radius: 10px; font-size: 14px; }
        .section.off { opacity: .6; }
        .section > span { flex: 1; min-width: 0; }
        .section small { color: var(--secondary-text-color, #727272); }
        .section .fold { display: flex; align-items: center; gap: 4px; font-size: 12px; }
        .section .fold input { width: 15px; height: 15px; }
        .section button { width: 32px; height: 32px; border: 0; border-radius: 8px; background: none; color: var(--primary-text-color); font: inherit; font-size: 16px; cursor: pointer; }
        .section button:disabled { opacity: .25; cursor: default; }
        .link { justify-self: start; padding: 0; border: 0; background: none; color: var(--primary-color, #03a9f4); font: inherit; font-size: 13px; cursor: pointer; }
      </style>
      <datalist id="sfc-sensor">${ids("sensor").map((id) => `<option value="${escapeHtml(id)}"></option>`).join("")}</datalist>
      <datalist id="sfc-weather">${ids("weather").map((id) => `<option value="${escapeHtml(id)}"></option>`).join("")}</datalist>
      <div class="editor">
        <p class="beta">${escapeHtml(t.editorBeta)}</p>
        ${this._group("look", t, () => this._lookHtml(t))}
        ${this._group("sensors", t, () => this._sensorsHtml(t))}
        ${this._group("sections", t, () => this._sectionsHtml(t))}
        ${this._group("install", t, () => this._installHtml(t))}
        ${this._group("summary", t, () => this._summaryHtml(t))}
        ${this._group("vstore", t, () => this._vstoreHtml(t))}
        ${this._group("forecast", t, () => this._forecastHtml(t))}
        ${this._group("more", t, () => this._moreHtml(t))}
      </div>`;
    this._wire(this.shadowRoot);
  }

  _wire(root) {
    this._mountPickers(root);
    root.querySelectorAll("details[data-group]").forEach((el) => el.addEventListener("toggle", () => {
      const id = el.dataset.group;
      if (el.open === this._open.has(id)) return;
      if (el.open) this._open.add(id);
      else this._open.delete(id);
      this._render();
    }));
    root.querySelectorAll("[data-theme]").forEach((button) => button.addEventListener("click", () => {
      this._set("theme", button.dataset.theme);
      this._render();
    }));
    root.querySelectorAll("[data-text]").forEach((input) => input.addEventListener("change", (e) => this._set(input.dataset.text, e.target.value.trim() || undefined)));
    root.querySelectorAll("[data-select]").forEach((select) => select.addEventListener("change", (e) => {
      this._set(select.dataset.select, e.target.value || undefined);
      if (select.dataset.select === "language") this._render();
    }));
    root.querySelectorAll("[data-number]").forEach((input) => input.addEventListener("change", (e) => {
      const number = Number.parseFloat(e.target.value);
      this._set(input.dataset.number, Number.isFinite(number) ? number : undefined);
    }));
    root.querySelectorAll("[data-switch]").forEach((input) => input.addEventListener("change", (e) => {
      const key = input.dataset.switch;
      if (key === "show_insights") {
        // Shown by default in the wide layout: store only a change from that.
        this._set(key, e.target.checked === (this._config.wide === true) ? undefined : e.target.checked);
      } else if (EDITOR_DEFAULT_ON.includes(key)) {
        this._set(key, e.target.checked ? undefined : false);
      } else {
        const on = input.dataset.on === "true" ? true : input.dataset.on;
        this._set(key, e.target.checked ? on : undefined);
      }
      // These change what else the editor offers.
      if (key === "wide" || key === "collapsible") this._render();
    }));
    // Panels per string: one field per string gives a list, the single field a number.
    root.querySelectorAll("[data-string]").forEach((input) => input.addEventListener("change", () => {
      const counts = [...root.querySelectorAll("[data-string]")].map((el) => Math.max(0, Math.round(Number.parseFloat(el.value)) || 0));
      while (counts.length && !counts[counts.length - 1]) counts.pop();
      this._set("panels_per_string", counts.length ? counts : undefined);
    }));
    root.getElementById("panels_per_string")?.addEventListener("change", (e) => {
      const number = Math.round(Number.parseFloat(e.target.value));
      this._set("panels_per_string", number > 0 ? number : undefined);
    });
    this._wireSections(root);
    root.getElementById("vs-on")?.addEventListener("change", (e) => {
      this._set("virtual_storage", e.target.checked ? true : undefined);
      this._render();
    });
    root.querySelector('[data-vs="negative"]')?.addEventListener("change", (e) => this._setVirtual("negative", e.target.value || undefined));
    root.getElementById("vs-own")?.addEventListener("change", (e) => this._setVirtual("count_as_own", e.target.checked));
  }

  // Sections: a change writes the whole `sections:` list; the old
  // show_… switches it replaces are removed so they do not hide a section
  // that is ticked here.
  _writeSections(rows) {
    const next = { ...this._config, sections: rows.filter((r) => r.on).map((r) => r.id) };
    for (const key of Object.values(SECTION_SHOW_KEYS)) delete next[key];
    delete next.show_insights;
    this._emit(next);
    this._render();
  }

  _wireSections(root) {
    root.querySelectorAll("[data-section]").forEach((input) => input.addEventListener("change", (e) => {
      const rows = editorSections(this._config);
      const row = rows.find((r) => r.id === input.dataset.section);
      row.on = e.target.checked;
      // A newly ticked section goes after the other ticked ones.
      const ordered = [...rows.filter((r) => r.on && r !== row), ...(row.on ? [row] : []), ...rows.filter((r) => !r.on)];
      this._writeSections(ordered);
    }));
    root.querySelectorAll("[data-move]").forEach((button) => button.addEventListener("click", () => {
      const rows = editorSections(this._config);
      const i = Number(button.dataset.move);
      const j = i + Number(button.dataset.dir);
      if (!rows[j]?.on) return;
      [rows[i], rows[j]] = [rows[j], rows[i]];
      this._writeSections(rows);
    }));
    root.querySelectorAll("[data-fold]").forEach((input) => input.addEventListener("change", (e) => {
      const set = new Set(Array.isArray(this._config.collapsed) ? this._config.collapsed : []);
      if (e.target.checked) set.add(input.dataset.fold);
      else set.delete(input.dataset.fold);
      this._set("collapsed", set.size ? [...set] : undefined);
    }));
    root.querySelector("[data-reset-sections]")?.addEventListener("click", () => {
      this._set("sections", undefined);
      this._render();
    });
  }
}

if (!customElements.get(CARD_TAG)) customElements.define(CARD_TAG, SolarFlowCard);
if (!customElements.get(EDITOR_TAG)) customElements.define(EDITOR_TAG, SolarFlowCardEditor);

window.customCards = window.customCards || [];
if (!window.customCards.some((card) => card.type === CARD_TAG)) {
  window.customCards.push({
    type: CARD_TAG,
    name: "Solar Flow Card",
    description: "Solar, battery, grid and home power flow with charts, forecasts and nine themes.",
    preview: true,
    documentationURL: "https://github.com/gratak/solar-flow-card",
  });
}

console.info(
  `%c SOLAR FLOW CARD %c v${CARD_VERSION} `,
  "color:#fff;background:#f5a400;font-weight:700;padding:3px 6px;border-radius:4px 0 0 4px",
  "color:#f5a400;background:#fff6dc;font-weight:700;padding:3px 6px;border-radius:0 4px 4px 0"
);
