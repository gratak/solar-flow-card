
// [config key, label key, input step]
const EDITOR_NUMBERS = [
  ["battery_capacity", "editorBatteryCapacity", "0.1"],
  ["battery_min_soc", "editorBatteryMinSoc", "1"],
  ["pv_capacity", "editorPvCapacity", "0.1"],
  ["pv_panels", "editorPvPanels", "1"],
  ["inverter_power_rating", "editorInverterRating", "0.1"],
  ["panel_strings", "editorPanelStrings", "1"],
  ["main_fuse", "editorMainFuse", "1"],
  ["voltage_limit", "editorVoltageLimit", "1"],
];
const EDITOR_PRICES = [
  ["price_import", "editorPriceImport", "0.01"],
  ["price_export", "editorPriceExport", "0.01"],
  ["co2_factor", "editorCo2", "0.01"],
  ["price_window", "editorPriceWindow", "1"],
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
const EDITOR_DEFAULT_ON = ["show_solar", "show_battery", "battery_day", "show_chart", "show_weather", "show_self_sufficiency", "show_self_use", "show_savings", "show_co2", "show_yield", "animation"];
const EDITOR_SWITCH_GROUPS = {
  look: [["wide", "editorWide"], ["background", "editorGlass", "glass"], ["animation", "editorAnimation"], ["load_fonts", "editorFonts"], ["collapsible", "editorCollapsible"], ["show_chart", "editorShowChart"], ["show_weather", "editorShowWeather"]],
  install: [["show_solar", "editorSolar"], ["show_battery", "editorBattery"], ["battery_day", "editorBatteryDay"], ["panels_average", "editorPanelsAverage", "per_string"]],
  summary: [["show_self_sufficiency", "editorShowSelfSufficiency"], ["show_self_use", "editorShowSelfUse"], ["show_savings", "editorShowSavings"], ["show_costs", "editorShowCosts"], ["show_co2", "editorShowCo2"], ["show_yield", "editorShowYield"], ["show_insights", "editorInsights"]],
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
      ...named(["inverter_power", "inverter_rated_power", "battery_temperature", "battery_voltage", "battery_current", "generator_power", "grid_status"])]],
    ["strings", strings],
  ];
}

// ---------------------------------------------------------------------------
// Quick start: a wizard that sets up the card in three steps. It finds the
// inverter's integration and proposes its sensors by their meaning.
// ---------------------------------------------------------------------------

const INTEGRATION_NAMES = {
  solarman: "Solarman (Deye, Sofar… local)", huawei_solar: "Huawei Solar", solaredge: "SolarEdge", solaredge_modbus: "SolarEdge Modbus",
  fronius: "Fronius", goodwe: "GoodWe", victron: "Victron", victron_ble: "Victron", sma: "SMA", growatt_server: "Growatt", foxess: "FoxESS",
  foxess_modbus: "FoxESS Modbus", solax: "SolaX", sungrow: "Sungrow", sungrow_modbus: "Sungrow Modbus", enphase_envoy: "Enphase Envoy",
  powerwall: "Tesla Powerwall", sonnenbatterie: "sonnen", anker_solix: "Anker Solix", givenergy: "GivEnergy", solis: "Solis", soliscloud: "Solis Cloud",
  saj: "SAJ", kostal_plenticore: "Kostal", sofar: "Sofar", luxpower: "LuxPower", deye_local: "Deye (local)", ecoflow: "EcoFlow", hoymiles: "Hoymiles",
};

// Integrations whose signs differ from the card's (battery + discharging,
// grid + importing).
const INTEGRATION_SIGNS = {
  huawei_solar: { invert_battery: true, invert_grid: true },
};

// Integrations with power or energy sensors, the ones with the most first.
function energyIntegrations(hass) {
  const counts = new Map();
  for (const [id, entry] of Object.entries(hass?.entities || {})) {
    const stateObj = hass.states?.[id];
    if (!entry?.platform || !id.startsWith("sensor.") || !stateObj) continue;
    if (!["power", "energy"].includes(stateObj.attributes?.device_class)) continue;
    counts.set(entry.platform, (counts.get(entry.platform) || 0) + 1);
  }
  const skip = ["energy", "utility_meter", "template", "integration", "statistics", "deye_cloud", "group", "min_max"];
  return [...counts].filter(([platform, n]) => n >= 2 && !skip.includes(platform))
    .sort((a, b) => b[1] - a[1]).map(([platform]) => ({ platform, name: INTEGRATION_NAMES[platform] || platform }));
}

// What each card sensor looks like: [device class, words it should have,
// words it must not have]. The best match wins; today's counters over
// lifetime ones.
const SENSOR_GUESSES = {
  solar_power: ["power", /(pv|solar|photovolt|generation|production|dc_power|input_power|yield)/, /(batter|grid|load|export|import|consum|_l[123](_|$)|phase|string|pv[2-9])/],
  grid_power: ["power", /(grid|meter|net)/, /(export|import|voltage|current|_l[123](_|$)|phase|frequency|limit)/],
  load_power: ["power", /(load|consumption|house|home)/, /(_l[123](_|$)|phase|grid|batter|ups|backup|limit)/],
  battery_power: ["power", /batter/, /(limit|max|_l[123](_|$))/],
  battery_soc: ["battery", /(soc|state_of_charge|state_of_capacity|batter)/, /(health|soh|cycle|voltage|rated)/],
  solar_energy: ["energy", /(pv|solar|generation|yield|production)/, /(batter|grid|load|export|import|consum|forecast|pv[2-9])/],
  grid_import_energy: ["energy", /(import|purchas|bought|from_grid|forward|grid_consum|meter.*consum)/, /(export|feed|sold|reverse|cost|compensation|forecast)/],
  grid_export_energy: ["energy", /(export|feed|sold|to_grid|reverse|returned)/, /(import|purchas|cost|compensation|forecast)/],
  load_energy: ["energy", /(load|consumption|house|home)/, /(grid|meter|batter|export|import|forecast)/],
  battery_charge_energy: ["energy", /charg/, /(discharg|cost|forecast)/],
  battery_discharge_energy: ["energy", /discharg/, /(cost|forecast)/],
};

function guessSensors(hass, platform) {
  const candidates = Object.values(hass?.states || {}).filter((stateObj) => {
    if (!stateObj.entity_id.startsWith("sensor.")) return false;
    if (platform && hass.entities?.[stateObj.entity_id]?.platform !== platform) return false;
    return stateObj.state !== "unavailable" && stateObj.state !== "unknown";
  });
  const text = (stateObj) => `${stateObj.entity_id} ${stateObj.attributes?.friendly_name || ""}`.toLowerCase().replace(/[\s-]+/g, "_");
  const found = {};
  const used = new Set();
  for (const [key, [deviceClass, want, avoid]] of Object.entries(SENSOR_GUESSES)) {
    let best = null;
    let bestScore = 0;
    for (const stateObj of candidates) {
      if (used.has(stateObj.entity_id)) continue;
      const unit = stateUnit(stateObj).trim().toLowerCase();
      const fits = stateObj.attributes?.device_class === deviceClass || (deviceClass === "battery" && unit === "%");
      if (!fits) continue;
      const words = text(stateObj);
      if (!want.test(words) || avoid.test(words)) continue;
      // The battery's power both ways, not a charge-only or discharge-only one.
      if (key === "battery_power" && /charg/.test(words) && !(/discharg/.test(words) && /(^|_)charg/.test(words.replace(/discharg/g, "")))) continue;
      let score = 10;
      if (deviceClass === "energy" && /(today|daily|day)/.test(words)) score += 3;
      if (deviceClass === "energy" && stateObj.attributes?.state_class === "total_increasing") score += 2;
      if (deviceClass === "power" && /total/.test(words)) score += 1;
      if (score > bestScore) [best, bestScore] = [stateObj.entity_id, score];
    }
    if (best) {
      found[key] = best;
      used.add(best);
    }
  }
  // Daily counters only when every one of them says so; lifetime mode also
  // reads counters that reset daily, so it is the safe choice for a mix.
  const counters = Object.entries(found).filter(([key]) => /_energy$/.test(key)).map(([, id]) => text(hass.states[id]));
  const daily = counters.every((words) => /(today|daily|day)/.test(words));
  return { entities: found, daily };
}

const WIZARD_PRESETS = {
  simple: { sections: ["flow", "today", "energy"] },
  full: {},
  battery: { show_solar: false },
  chart: { sections: ["energy"] },
};

// The sections in the editor: the configured list, or every section in the
// default order without the ones a `show_…: false` hides.
const SECTION_SHOW_KEYS = { energy: "show_energy", forecast: "show_forecast", system: "show_system", panels: "show_panels" };
function editorSections(config) {
  const order = ["flow", "today", "sources", ...SECTION_ORDER, ...customIds(config)];
  const listed = sectionList(config);
  const on = listed || order.filter((id) => config[SECTION_SHOW_KEYS[id]] !== false && (id !== "insights" && id !== "comparison" || insightsShown(config)));
  return [...on.map((id) => ({ id, on: true })), ...order.filter((id) => !on.includes(id)).map((id) => ({ id, on: false }))];
}

// What a sensor field expects, from its config key.
function fieldKind(key) {
  if (/^\d+$/.test(key)) return "energy";
  const base = key.replace(/_history$/, "");
  if (base === "battery_soc" || base === "soc") return "soc";
  if (/energy$/.test(base) || base === "today" || base === "remaining" || base === "days" || base === "entity_vs") return "energy";
  if (/(^|_)power(_l\d)?$/.test(base) || base === "power") return "power";
  if (/voltage(_l\d)?$/.test(base)) return "voltage";
  if (/current$/.test(base)) return "current";
  if (/temperature$/.test(base)) return "temperature";
  return "any";
}

const FIELD_UNITS = {
  power: ["w", "kw", "mw"],
  energy: ["wh", "kwh", "mwh"],
  soc: ["%"],
  voltage: ["v", "mv", "kv"],
  current: ["a", "ma"],
  temperature: ["°c", "°f", "k"],
};
const FIELD_UNIT_NAMES = { power: "W / kW", energy: "kWh", soc: "%", voltage: "V", current: "A", temperature: "°C" };

// The notes under a sensor field: its value now, or what is wrong with it.
function fieldNotes(hass, config, t, kind, value, auto) {
  const locale = t.locale;
  if (!value) return auto ? [["note", fill(t.editorAuto, { entity: auto.entityId, value: fieldValue(auto.stateObj, kind === "price" ? "any" : kind, locale) })]] : [];
  const stateObj = hass?.states?.[value];
  if (!stateObj) return [["warn", t.editorNotFound]];
  const notes = [];
  const unit = stateUnit(stateObj).trim();
  if (kind === "price") {
    if (!/wh$/i.test(unit.replace(/\s/g, ""))) notes.push(["warn", fill(t.editorPriceUnit, { unit: unit || "—" })]);
    notes.push(["note", fill(t.editorNow, { value: fieldValue(stateObj, "any", locale) })]);
    if (!stateObj.attributes?.state_class) notes.push(["warn", t.editorPriceNoStats]);
    return notes;
  }
  const wrongUnit = Boolean(FIELD_UNITS[kind] && unit && !FIELD_UNITS[kind].includes(unit.toLowerCase()));
  if (wrongUnit) notes.push(["warn", fill(t.editorWrongUnit, { unit, expected: FIELD_UNIT_NAMES[kind] })]);
  notes.push(["note", stateNumber(stateObj) === null && kind !== "any" ? t.editorUnavailable : fill(t.editorNow, { value: fieldValue(stateObj, wrongUnit ? "any" : kind, locale) })]);
  if (kind === "energy") {
    const stateClass = stateObj.attributes?.state_class;
    if (stateClass !== "total" && stateClass !== "total_increasing") notes.push(["warn", t.editorNoStats]);
  }
  return notes;
}

function fieldValue(stateObj, kind, locale) {
  if (kind === "power") return formatPower(wattsOf(stateObj), locale);
  if (kind === "energy") return formatEnergy(kwhOf(stateObj), locale);
  const number = stateNumber(stateObj);
  const shown = number === null ? stateObj.state : formatNumber(number, locale, Math.abs(number) < 10 ? 2 : Math.abs(number) < 1000 ? 1 : 0);
  return `${shown} ${stateUnit(stateObj)}`.trim();
}

// Numbers that look entered in the wrong unit: [key, limit, label key, factor].
const NUMBER_CHECKS = [["pv_capacity", 100, "editorLooksWatts", 1000], ["inverter_power_rating", 100, "editorLooksWatts", 1000], ["battery_capacity", 300, "editorLooksWh", 1000]];

class SolarFlowCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {};
    this._hass = null;
    this._open = new Set(["look"]);
    // Boxes inside the groups opened or closed by the user: id -> open.
    this._boxes = new Map();
  }

  set hass(hass) {
    const first = !this._hass;
    this._hass = hass;
    // A new card (nothing set but its type and theme): ask whether to use
    // the quick start or to set the card up by hand.
    if (first && this._config && Object.keys(this._config).every((key) => ["type", "theme"].includes(key))) this._askWizard = true;
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
    // The old type is written as the new one with the next change.
    this._legacyType = next.type === LEGACY_CARD_TYPE;
    if (this._legacyType) next.type = CARD_TYPE;
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
    // The first change writes the new type: the note about it goes.
    if (this._legacyType) {
      this._legacyType = false;
      this.shadowRoot.querySelector("p.beta")?.remove();
    }
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
  _picker(path, label, value, domain = "sensor", { kind = fieldKind(path.split(".").at(-1)), auto = null, extra = [] } = {}) {
    const t = stringsFor(languageOf(this._hass, this._config));
    const notes = domain === "sensor" || !domain ? [...fieldNotes(this._hass, this._config, t, kind, value, auto), ...extra] : extra;
    return `
      <div class="field">
        <div class="picker" data-path="${escapeHtml(path)}" data-label="${escapeHtml(label)}" data-domain="${domain}" data-value="${escapeHtml(value || "")}"></div>
        ${notes.map(([cls, text]) => `<p class="${cls}">${escapeHtml(text)}</p>`).join("")}
      </div>`;
  }

  _mountPickers(root) {
    const selector = customElements.get("ha-selector");
    for (const el of root.querySelectorAll(".picker")) {
      const { path, label, domain, value } = el.dataset;
      const changed = (v) => this._pick(path, typeof v === "string" ? v.trim() : v);
      if (selector) {
        const picker = document.createElement("ha-selector");
        picker.hass = this._hass;
        picker.selector = { entity: domain ? { domain: domain.includes(",") ? domain.split(",") : domain } : {} };
        picker.label = label;
        picker.value = value || undefined;
        picker.required = false;
        picker.addEventListener("value-changed", (e) => changed(e.detail?.value));
        el.append(picker);
      } else {
        el.innerHTML = `<label><span>${escapeHtml(label)}</span><input type="text" list="sfc-${(domain || "sensor").split(",")[0]}" value="${escapeHtml(value)}" placeholder="${(domain || "sensor").split(",")[0]}.…" /></label>`;
        el.querySelector("input").addEventListener("change", (e) => changed(e.target.value));
      }
    }
  }

  _pick(path, value) {
    const [group, key, index] = path.split(".");
    if (group === "entities") this._setIn("entities", key, value);
    else if (group === "virtual_storage") this._setVirtual(key, value);
    else if (group === "pv_forecast" && key === "days") return this._setList(["pv_forecast", "days"], Number(index), value);
    else if (group === "pv_forecast") this._setIn("pv_forecast", key, value);
    else if (group === "list") return this._setItem(key, Number(index), path.split(".")[3], value);
    else if (group === "custom") return this._setCustomEntity(Number(key), Number(index), value);
    else if (group === "ev") this._setIn("ev", key, value);
    else if (group === "wizard") {
      if (key === "priceSensor") this._wizard.priceSensor = value || "";
      else this._wizard.entities = { ...this._wizard.entities, [key]: value || undefined };
    }
    else this._set(group, value);
    // The notes under the field follow the new sensor.
    this._render();
  }

  // Lists of objects: batteries, panels, inverter details. `field` of item
  // `index`; a panel or detail with only its sensor is stored as a string.
  _items(group) {
    const list = Array.isArray(this._config[group]) ? this._config[group] : [];
    return list.map((item) => (typeof item === "string" ? { entity: item } : item && typeof item === "object" ? { ...item } : {}));
  }

  _writeItems(group, items) {
    const compact = items.map((item) => {
      const clean = Object.fromEntries(Object.entries(item).filter(([, v]) => v !== undefined && v !== "" && v !== false && v !== null));
      return (group === "panels" || group === "inverter_details") && Object.keys(clean).length === 1 && clean.entity ? clean.entity : clean;
    });
    this._set(group, compact.length ? compact : undefined);
    this._render();
  }

  _setItem(group, index, field, value) {
    const items = this._items(group);
    items[index] = { ...(items[index] || {}), [field]: value };
    this._writeItems(group, items);
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
    return list.map(([key, label, step]) => {
      const check = NUMBER_CHECKS.find(([k]) => k === key);
      const value = Number.parseFloat(this._config[key]);
      const warn = check && Number.isFinite(value) && value > check[1]
        ? fill(t[check[2]], { value: formatNumber(value, t.locale, 0), suggest: formatNumber(value / check[3], t.locale, 1) }) : "";
      return `
      <label><span>${escapeHtml(t[label])}</span><input data-number="${key}" type="number" min="0" step="${step}" inputmode="decimal" value="${escapeHtml(Number.isFinite(Number.parseFloat(this._config[key])) ? this._config[key] : "")}" />
        ${warn ? `<p class="warn">${escapeHtml(warn)}</p>` : ""}</label>`;
    }).join("");
  }

  // custom_sections: [{title, entities: [id | {entity, name, max…}]}]. The
  // editor sets the titles and the sensors; other keys stay as they are.
  _customList() {
    const list = Array.isArray(this._config.custom_sections) ? this._config.custom_sections : [];
    return list.map((c) => (c && typeof c === "object" ? { ...c, entities: Array.isArray(c.entities) ? [...c.entities] : [] } : { entities: [] }));
  }

  _writeCustom(list, next = { ...this._config }) {
    const clean = list.map((c) => {
      const out = { ...c };
      if (!out.title) delete out.title;
      return out;
    });
    if (clean.length) next.custom_sections = clean;
    else delete next.custom_sections;
    this._emit(next);
    this._render();
  }

  _setCustomEntity(si, ei, value) {
    const list = this._customList();
    if (!list[si]) return;
    const current = list[si].entities[ei];
    if (value) list[si].entities[ei] = current && typeof current === "object" ? { ...current, entity: value } : value;
    else list[si].entities.splice(ei, 1);
    this._writeCustom(list);
  }

  // A section's id is its place in the list: removing one renumbers the ones
  // after it in `sections:` and `collapsed:` too.
  _removeCustom(index) {
    const list = this._customList();
    list.splice(index, 1);
    const next = { ...this._config };
    const renumber = (ids) => ids.flatMap((id) => {
      const match = /^custom_(\d+)$/.exec(String(id));
      if (!match) return [id];
      const n = Number(match[1]) - 1;
      return n === index ? [] : [n > index ? `custom_${n}` : id];
    });
    for (const key of ["sections", "collapsed"]) if (Array.isArray(next[key])) next[key] = renumber(next[key]);
    this._writeCustom(list, next);
  }

  _addCustom() {
    const list = this._customList();
    list.push({ title: "", entities: [] });
    const next = { ...this._config };
    // With a section list, the new section is put on it.
    if (Array.isArray(next.sections)) next.sections = [...next.sections, `custom_${list.length}`];
    this._boxes.set("custom", true);
    this._writeCustom(list, next);
  }

  _sectionName(t, id) {
    const match = /^custom_(\d+)$/.exec(id);
    if (!match) return t.editorSectionNames[id];
    const c = this._config.custom_sections?.[Number(match[1]) - 1];
    return c?.title ? String(c.title) : `${t.customTitle} ${match[1]}`;
  }

  _customHtml(t) {
    const list = this._customList();
    return `
      <details class="box" data-box="custom" ${this._boxOpen("custom", list.length > 0) ? "open" : ""}>
        <summary class="title">${escapeHtml(t.editorCustom)}${list.length ? ` (${list.length})` : ""}</summary>
        <p class="hint">${escapeHtml(t.editorCustomHint)}</p>
        ${list.map((c, i) => `
          <div class="item">
            <label><span>${escapeHtml(t.editorCustomTitle)}</span><input type="text" data-custom-title="${i}" value="${escapeHtml(c.title ?? "")}" placeholder="${escapeHtml(`${t.customTitle} ${i + 1}`)}" /></label>
            <div class="pickers">${[...c.entities, ""].map((item, j) => this._picker(`custom.${i}.${j}`, fill(t.editorCustomSensor, { n: j + 1 }), typeof item === "string" ? item : item?.entity, "", { kind: "any" })).join("")}</div>
            <button type="button" class="link" data-remove-custom="${i}">${escapeHtml(t.editorRemove)}</button>
          </div>`).join("")}
        <button type="button" class="link" data-add-custom>${escapeHtml(t.editorCustomAdd)}</button>
      </details>`;
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

  _boxOpen(id, fallback) {
    return this._boxes.has(id) ? this._boxes.get(id) : fallback;
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
        ${DARK_THEMES.includes(this._config.theme || "diorama") ? `<label><span>${escapeHtml(t.editorDarkMode)}</span>
          <select data-select="dark_mode">${[["", t.editorDarkOff], ["auto", t.editorDarkAuto], ["on", t.editorDarkOn]].map(([value, label]) => `<option value="${value}" ${String(this._config.dark_mode === true ? "on" : this._config.dark_mode ?? "") === value ? "selected" : ""}>${escapeHtml(label)}</option>`).join("")}</select>
        </label>` : ""}
        <label><span>${escapeHtml(t.editorPeriod)}</span>
          <select data-select="period">${periodList(this._config).map((p) => `<option value="${p === "today" ? "" : p}" ${(this._config.period || "today") === p ? "selected" : ""}>${escapeHtml(labels[p][1])}</option>`).join("")}</select>
        </label>
        ${stations.length > 1 ? `
          <label><span>${escapeHtml(t.editorStation)}</span>
            <select data-select="station_id"><option value="">${escapeHtml(t.auto)}</option>
              ${stations.map((id) => `<option value="${escapeHtml(id)}" ${String(this._config.station_id) === id ? "selected" : ""}>${escapeHtml(id)}</option>`).join("")}
            </select>
          </label>` : ""}
      </div>
      <div class="box">
        <span class="title">${escapeHtml(t.editorPeriods)}</span>
        <div class="colors">${PERIODS.map((p) => `<label><input type="checkbox" data-period-tab="${p}" ${periodList(this._config).includes(p) ? "checked" : ""} /><span>${escapeHtml(labels[p][1])}</span></label>`).join("")}</div>
        <div class="switch"><label for="period_browse">${escapeHtml(t.editorPeriodBrowse)}</label><input id="period_browse" type="checkbox" data-browse-switch ${this._config.period_browse !== false ? "checked" : ""} /></div>
        <div class="switch"><label for="energy_title">${escapeHtml(t.editorEnergyTitle)}</label><input id="energy_title" type="checkbox" data-energy-title ${this._config.energy_title !== false ? "checked" : ""} /></div>
        <p class="hint">${escapeHtml(t.editorEnergyTitleHint)}</p>
      </div>
      <div class="box">
        <span class="title">${escapeHtml(t.editorColors)}</span>
        <div class="colors">${Object.keys(COLOR_VARS).map((key) => {
          const value = this._config.colors?.[key];
          return `<label><input type="color" data-color="${key}" value="${escapeHtml(/^#[0-9a-f]{6}$/i.test(value || "") ? value : "#888888")}" class="${value ? "" : "unset"}" /><span>${escapeHtml(t.editorColorNames[key])}</span></label>`;
        }).join("")}</div>
        ${this._config.colors ? `<button type="button" class="link" data-reset-colors>${escapeHtml(t.editorColorsReset)}</button>` : `<p class="hint">${escapeHtml(t.editorColorsHint)}</p>`}
      </div>
      ${this._switches(t, "look")}
      ${this._config.load_fonts === true ? `<p class="warn">${escapeHtml(t.editorFontsHint)}</p>` : ""}`;
  }

  // The config with the Energy dashboard's sensors for what is left empty
  // (hints only: nothing of it is written unless asked for).
  _withAuto() {
    const cached = SHARED_CACHE.get("energy-prefs");
    if (!cached && !this._prefsAsked && typeof this._hass?.callWS === "function") {
      this._prefsAsked = true;
      loadEnergyPrefs(this._hass).then((data) => {
        SHARED_CACHE.set("energy-prefs", { data, at: Date.now() });
        this._render();
      });
    }
    return withEnergyAuto(this._config, energyAuto(cached?.data, this._hass), this._hass);
  }

  // The Energy dashboard's sensors written into the card, to adjust them.
  _copyAuto() {
    const auto = this._withAuto()._energy;
    if (!auto?.live) return;
    const entities = { ...(this._config.entities || {}) };
    const free = (group) => POWER_GROUPS[group].every((key) => !entities[key]);
    for (const group of Object.keys(POWER_GROUPS)) if (free(group) && auto.sources[group]?.length === 1) entities[group] = auto.sources[group][0];
    if (!entities.battery_soc && auto.batteries.length === 1 && auto.batteries[0].soc) entities.battery_soc = auto.batteries[0].soc;
    const next = { ...this._config, entities };
    if (auto.energy) {
      for (const def of Object.values(ENERGY_METRICS)) if (auto.sources[def.key]?.length === 1) entities[def.key] = auto.sources[def.key][0];
      next.energy_sensors = "total";
    }
    this._emit(next);
    this._render();
  }

  _sensorsHtml(t) {
    const entities = this._config.entities || {};
    const effective = this._withAuto();
    // Only while a field is actually filled from the Energy dashboard.
    const fromEnergy = Boolean(effective._energy?.live) && (effective._energy.energy
      || Object.keys(POWER_GROUPS).some((group) => effective._energy.sources[group]?.length && POWER_GROUPS[group].every((key) => !entities[key])));
    let resolved = null;
    try {
      resolved = resolveEntities(this._hass, effective);
    } catch (error) {
      // No hints from the current setup.
    }
    // What DeyeCloud (or the card) found for an empty field: live power and
    // energy, the installation readings and the inverter's PV strings.
    let system = {};
    let strings = new Map();
    try {
      if (resolved) {
        system = systemEntities(this._hass, resolved, this._config);
        strings = deyeInverterReadings(resolved).find((d) => d.strings.size)?.strings || new Map();
      }
    } catch (error) {
      // No hints for these.
    }
    const autoFor = (key) => {
      if (entities[key] || !resolved) return null;
      const live = Object.entries(LIVE_METRICS).find(([, def]) => def.key === key);
      const energy = Object.entries(ENERGY_METRICS).find(([, def]) => def.key === key);
      const sys = Object.entries(SYSTEM_METRICS).find(([, def]) => def.key === key);
      const pv = key.match(/^pv(\d)_(power|voltage|current)$/);
      const reading = pv && strings.get(Number(pv[1]))?.[{ power: "W", voltage: "V", current: "A" }[pv[2]]];
      const fromReading = reading && this._hass?.states?.[reading.entityId] ? { entityId: reading.entityId, stateObj: this._hass.states[reading.entityId] } : null;
      if (key === "grid_status") return resolved.gridStatus || null;
      return (live && resolved.live[live[0]]) || (energy && resolved.energy[energy[0]]) || (sys && system[sys[0]]) || fromReading || null;
    };
    const extra = (key) => {
      const notes = [];
      if (key === "grid_power" && entities.grid_power && (entities.grid_import_power || entities.grid_export_power)) notes.push(["warn", t.editorPairConflict]);
      if (key === "battery_power" && entities.battery_power && (entities.battery_charge_power || entities.battery_discharge_power)) notes.push(["warn", t.editorBatteryPairConflict]);
      // A lifetime counter set up as a daily sensor shows its total as today.
      if (/_energy$/.test(key) && effective.energy_sensors !== "total") {
        const stateObj = this._hass?.states?.[entities[key]] || autoFor(key)?.stateObj;
        const kwh = stateObj ? kwhOf(stateObj) : null;
        if (isNum(kwh) && kwh > 500) notes.push(["warn", fill(t.editorLooksTotal, { value: formatEnergy(kwh, t.locale) })]);
      }
      return notes;
    };
    const history = Object.values(LIVE_METRICS).map((def) => def.key);
    const names = Object.fromEntries(editorEntityGroups(t).flatMap(([, items]) => items));
    return `
      <p class="hint">${escapeHtml(t.editorSensorsHint)}</p>
      ${fromEnergy ? `<div class="suggest"><p class="note">${escapeHtml(t.editorEnergyAuto)}</p><button type="button" class="link" data-copy-auto>${escapeHtml(t.editorEnergyCopy)}</button></div>` : ""}
      ${editorEntityGroups(t).map(([group, items]) => `
        <details class="box" data-box="entities-${group}" ${this._boxOpen(`entities-${group}`, group === "live" || group === "energy" || items.some(([key]) => entities[key])) ? "open" : ""}>
          <summary class="title">${escapeHtml(t.editorEntityGroups[group])}${(() => { const n = items.filter(([key]) => !entities[key] && autoFor(key)).length; return n ? ` <small class="found">${escapeHtml(fill(t.editorFoundN, { n }))}</small>` : ""; })()}</summary>
          <div class="pickers">${items.map(([key, label]) => this._picker(`entities.${key}`, label, entities[key], key === "grid_status" ? "sensor,binary_sensor" : "sensor", { auto: autoFor(key), extra: extra(key) })).join("")}</div>
          ${group === "system" ? `<div class="grid">${[0, 1, 2].map((i) => `<label><span>${escapeHtml(fill(t.editorPhaseName, { n: `L${i + 1}` }))}</span><input type="text" data-phase-name="${i}" placeholder="L${i + 1}" value="${escapeHtml(Array.isArray(this._config.phase_names) ? this._config.phase_names[i] ?? "" : "")}" /></label>`).join("")}
            <label><span>${escapeHtml(t.editorGridOffStates)}</span><input type="text" data-text="grid_off_states" placeholder="Off-grid, Pull-out" value="${escapeHtml(String(this._config.grid_off_states ?? ""))}" /></label></div>` : ""}
        </details>`).join("")}
      <details class="box" data-box="history" ${this._boxOpen("history", history.some((key) => entities[`${key}_history`])) ? "open" : ""}>
        <summary class="title">${escapeHtml(t.editorHistoryBox)}</summary>
        <p class="hint">${escapeHtml(t.editorHistoryHint)}</p>
        <div class="pickers">${history.map((key) => this._picker(`entities.${key}_history`, fill(t.editorHistoryLabel, { label: names[key] }), entities[`${key}_history`])).join("")}</div>
      </details>
      <label><span>${escapeHtml(t.editorEnergySensors)}</span>
        <select data-select="energy_sensors">
          <option value="">${escapeHtml(t.editorEnergyDaily)}</option>
          <option value="total" ${this._config.energy_sensors === "total" ? "selected" : ""}>${escapeHtml(t.editorEnergyTotal)}</option>
        </select>
      </label>
      ${this._switches(t, "sensors")}
      ${this._liveCheck(t, resolved, effective)}`;
  }

  // The power right now with the current settings, so a wrong sign shows.
  _liveCheck(t, resolved, config = this._config) {
    if (!resolved) return "";
    const live = liveValues(resolved, config);
    const locale = t.locale;
    const grid = isNum(live.grid) ? `${formatPower(Math.abs(live.grid), locale)} ${live.grid > ACTIVE_W ? t.importing.toLowerCase() : live.grid < -ACTIVE_W ? t.exporting.toLowerCase() : ""}`.trim() : "—";
    const battery = isNum(live.battery) ? `${formatPower(Math.abs(live.battery), locale)} ${live.battery > ACTIVE_W ? t.discharging.toLowerCase() : live.battery < -ACTIVE_W ? t.charging.toLowerCase() : ""}`.trim() : "—";
    const notes = [["note", fill(t.editorLive, { solar: formatPower(live.solar, locale), grid, battery })]];
    // Importing more than the panels make while they run at full tilt is
    // unusual: often a grid sensor with the other sign.
    if (isNum(live.solar) && isNum(live.grid) && live.solar > 1000 && live.grid > live.solar) notes.push(["warn", t.editorGridSignCheck]);
    return notes.map(([cls, text]) => `<p class="${cls}">${escapeHtml(text)}</p>`).join("");
  }

  _sectionsHtml(t) {
    const rows = editorSections(this._config);
    const collapsible = this._config.collapsible === true;
    const collapsed = Array.isArray(this._config.collapsed) ? this._config.collapsed : [];
    return `
      <p class="hint">${escapeHtml(t.editorSectionsHint)}</p>
      <div class="sections">${rows.map(({ id, on }, i) => `
        <div class="section ${on ? "" : "off"}">
          <input type="checkbox" data-section="${id}" ${on ? "checked" : ""} aria-label="${escapeHtml(this._sectionName(t, id))}" />
          <span>${escapeHtml(this._sectionName(t, id))}${id === "today" || id === "sources" ? ` <small>(Diorama)</small>` : ""}</span>
          ${collapsible && on && (SECTION_HTML[id] || isCustomId(id)) && id !== "inverter" ? `<label class="fold"><input type="checkbox" data-fold="${id}" ${collapsed.includes(id) ? "checked" : ""} /> ${escapeHtml(t.editorFolded)}</label>` : ""}
          ${on ? `<button type="button" data-move="${i}" data-dir="-1" title="${escapeHtml(t.editorUp)}" ${i === 0 ? "disabled" : ""}>↑</button>
          <button type="button" data-move="${i}" data-dir="1" title="${escapeHtml(t.editorDown)}" ${!rows[i + 1]?.on ? "disabled" : ""}>↓</button>` : ""}
        </div>`).join("")}
      </div>
      ${sectionList(this._config) ? `<button type="button" class="link" data-reset-sections>${escapeHtml(t.editorReset)}</button>` : ""}
      ${this._customHtml(t)}`;
  }

  _installHtml(t) {
    let rated = null;
    try {
      const entry = systemEntities(this._hass, resolveEntities(this._hass, this._config), this._config).ratedPower;
      rated = entry && !positiveNumber(this._config.inverter_power_rating) ? wattsOf(entry.stateObj) : null;
    } catch (error) {
      // Nothing detected.
    }
    return `
      <div class="grid">${this._numbers(t, EDITOR_NUMBERS)}</div>
      ${isNum(rated) && rated > 0 ? `<p class="note">${escapeHtml(fill(t.editorRatedFound, { power: formatPower(rated, t.locale) }))}</p>` : ""}
      ${this._stringsHtml(t)}
      ${this._switches(t, "install")}
      ${this._listHtml(t, "batteries", t.editorBatteries, t.editorBatteriesHint, [
        ["name", "text", t.editorItemName], ["soc", "soc", t.editorBatSoc], ["power", "power", t.editorBatPower], ["capacity", "number", t.editorBatCapacity],
        ["voltage", "voltage", t.editorBatVoltage], ["temperature", "temperature", t.editorBatTemp], ["invert", "switch", t.editorBatInvert],
      ])}
      ${this._listHtml(t, "inverters", t.editorInverters, t.editorInvertersHint, [
        ["name", "text", t.editorItemName], ["solar_power", "power", t.editorInvSolarPower], ["solar_energy", "energy", t.editorInvSolarEnergy],
        ["power", "power", t.editorInvPower], ["rated_power", "number", t.editorInvRated],
      ])}
      ${(() => {
        const ev = this._config.ev && typeof this._config.ev === "object" ? this._config.ev : {};
        return `<details class="box" data-box="ev" ${this._boxOpen("ev", Boolean(ev.power || ev.soc)) ? "open" : ""}>
          <summary class="title">${escapeHtml(t.editorEv)}</summary>
          <p class="hint">${escapeHtml(t.editorEvHint)}</p>
          <div class="pickers">
            ${this._picker("ev.power", t.editorEvPower, ev.power, "sensor", { kind: "power" })}
            ${this._picker("ev.soc", t.editorEvSoc, ev.soc, "sensor", { kind: "soc" })}
            <label><span>${escapeHtml(t.editorItemName)}</span><input type="text" data-ev-name value="${escapeHtml(ev.name ?? "")}" /></label>
            <label><span>${escapeHtml(t.editorEvColor)}</span><input type="color" data-ev-color value="${escapeHtml(/^#[0-9a-f]{6}$/i.test(ev.color || "") ? ev.color : "#e8ecf1")}" /></label>
          </div>
        </details>`;
      })()}
      ${this._listHtml(t, "consumers", t.editorConsumers, t.editorConsumersHint, [["name", "text", t.editorItemName], ["power", "power", t.editorConsPower], ["energy", "energy", t.editorConsEnergy]])}
      ${this._listHtml(t, "panels", t.editorPanels, t.editorPanelsHint, [["entity", "energy", t.editorPanelEnergy], ["power", "power", t.editorPanelPower], ["name", "text", t.editorItemName]])}`;
  }

  // A list of objects: one box per item with its fields, Add and Remove.
  _listHtml(t, group, title, hint, fields) {
    const items = this._items(group);
    return `
      <details class="box" data-box="list-${group}" ${this._boxOpen(`list-${group}`, items.length > 0) ? "open" : ""}>
        <summary class="title">${escapeHtml(title)}${items.length ? ` (${items.length})` : ""}</summary>
        <p class="hint">${escapeHtml(hint)}</p>
        ${items.map((item, i) => `
          <div class="item">
            <div class="pickers">${fields.map(([key, type, label]) => {
              const path = `list.${group}.${i}.${key}`;
              if (type === "text") return `<label><span>${escapeHtml(label)}</span><input type="text" data-item="${path}" value="${escapeHtml(item[key] ?? "")}" /></label>`;
              if (type === "number") return `<label><span>${escapeHtml(label)}</span><input type="number" min="0" step="0.1" inputmode="decimal" data-item="${path}" value="${escapeHtml(item[key] ?? "")}" /></label>`;
              if (type === "switch") return `<div class="switch"><label for="${escapeHtml(path)}">${escapeHtml(label)}</label><input id="${escapeHtml(path)}" type="checkbox" data-item="${path}" ${item[key] ? "checked" : ""} /></div>`;
              return this._picker(path, label, item[key], "sensor", { kind: type });
            }).join("")}</div>
            <button type="button" class="link danger" data-remove="${group}.${i}">${escapeHtml(t.editorRemove)}</button>
          </div>`).join("")}
        <button type="button" class="link" data-add="${group}">+ ${escapeHtml(t.editorAdd)}</button>
      </details>`;
  }

  _summaryHtml(t) {
    const mode = this._config.settlement || "";
    const sensor = (key) => priceSetting(this._config[key])?.entity || "";
    const number = (key, label) => this._numbers(t, [[key, label, "0.01"]]);
    const detected = mode === "net_billing" && !priceSetting(this._config.price_export) ? detectRcePrice(this._hass) : null;
    // What a tariff adds to a market price sensor: per kWh, then a multiplier (VAT).
    const surcharge = `
      <div class="grid">${this._numbers(t, [["price_import_add", "editorPriceImportAdd", "0.0001"], ["price_import_multiplier", "editorPriceImportMultiplier", "0.01"]])}</div>
      <p class="hint">${escapeHtml(t.editorPriceImportAddHint)}</p>`;
    // With fixed prices, an RCE price sensor in Home Assistant is offered.
    const suggested = mode === "" ? detectRcePrice(this._hass) : null;
    const ratio = formatNumber(meteringRatio({ ...this._config, metering_ratio: undefined }), t.locale, 1);
    const option = (value, label) => `<option value="${value}" ${mode === value ? "selected" : ""}>${escapeHtml(label)}</option>`;
    const ratioOption = (value, label) => `<option value="${value}" ${String(this._config.metering_ratio ?? "") === value ? "selected" : ""}>${escapeHtml(label)}</option>`;
    return `
      <label><span>${escapeHtml(t.editorSettlement)}</span>
        <select data-select="settlement">
          ${option("", t.editorSettlementFixed)}${option("net_billing", t.editorSettlementBilling)}${option("net_metering", t.editorSettlementMetering)}
        </select>
      </label>
      <p class="hint">${escapeHtml(fill(t[{ "": "editorSettlementHintFixed", net_billing: "editorSettlementHintBilling", net_metering: "editorSettlementHintMetering" }[mode]], { ratio }))}</p>
      <div class="grid">
        ${number("price_import", "editorPriceImport")}
        ${mode === "" ? number("price_export", "editorPriceExport") : ""}
        ${mode === "net_billing" ? `
          <label><span>${escapeHtml(t.editorBillingFactor)}</span><input data-number="billing_factor" type="number" min="0" step="0.01" inputmode="decimal" placeholder="1.23" value="${escapeHtml(this._config.billing_factor ?? "")}" /></label>` : ""}
        ${mode === "net_metering" ? `
          <label><span>${escapeHtml(t.editorMeteringRatio)}</span>
            <select data-select="metering_ratio">${ratioOption("", fill(t.editorMeteringAuto, { ratio }))}${ratioOption("0.8", "0,8")}${ratioOption("0.7", "0,7")}</select>
          </label>` : ""}
        ${number("co2_factor", "editorCo2")}
        <label><span>${escapeHtml(t.editorCurrency)}</span><input data-text="currency" type="text" value="${escapeHtml(this._config.currency ?? "")}" placeholder="${escapeHtml(t.currency)}" /></label>
      </div>
      <p class="hint">${escapeHtml(t.editorImportPriceHint)}</p>
      ${this._periodsHtml(t)}
      ${mode !== "net_metering" && !priceSetting(this._config.price_import) && (mode === "net_billing" || priceSetting(this._config.price_export)) ? `<p class="warn">${escapeHtml(t.editorNoImportPrice)}</p>` : ""}
      ${mode === "net_billing" ? `
        ${this._picker("price_export", t.editorRcePrice, sensor("price_export"), "sensor", { kind: "price", auto: detected ? { entityId: detected, stateObj: this._hass.states[detected] } : null })}
        ${!detected && !sensor("price_export") ? `<p class="warn">${escapeHtml(t.editorRceMissing)}</p>` : ""}` : ""}
      ${mode === "" && !sensor("price_export") && suggested ? `
        <div class="suggest">
          <p class="note">${escapeHtml(fill(t.editorRceFound, { entity: suggested, value: fieldValue(this._hass.states[suggested], "any", t.locale) }))}</p>
          <button type="button" class="link" data-use-billing>${escapeHtml(t.editorUseBilling)}</button>
        </div>` : ""}
      ${mode === "" ? `
        <details class="box" data-box="prices" ${this._boxOpen("prices", Boolean(sensor("price_import") || sensor("price_export"))) ? "open" : ""}>
          <summary class="title">${escapeHtml(t.editorPriceSensors)}</summary>
          <p class="hint">${escapeHtml(t.editorPriceSensorsHint)}</p>
          <div class="pickers">
            ${this._picker("price_import", t.editorPriceImportSensor, sensor("price_import"), "sensor", { kind: "price" })}
            ${this._picker("price_export", t.editorPriceExportSensor, sensor("price_export"), "sensor", { kind: "price" })}
          </div>
          ${surcharge}
        </details>` : `
        <details class="box" data-box="import-sensor" ${this._boxOpen("import-sensor", Boolean(sensor("price_import"))) ? "open" : ""}>
          <summary class="title">${escapeHtml(t.editorImportSensorBox)}</summary>
          <p class="hint">${escapeHtml(t.editorImportSensorHint)}</p>
          <div class="pickers">${this._picker("price_import", t.editorPriceImportSensor, sensor("price_import"), "sensor", { kind: "price" })}</div>
          ${surcharge}
        </details>`}
      ${this._switches(t, "summary")}
      <div class="box">
        <span class="title">${escapeHtml(t.paybackTitle)}</span>
        <div class="grid">${[["cost", t.editorPaybackCost], ["saved_before", t.editorPaybackBefore]].map(([key, label]) => {
          const value = typeof this._config.payback === "object" && this._config.payback ? this._config.payback[key] : key === "cost" ? this._config.payback : undefined;
          return `<label><span>${escapeHtml(label)}</span><input data-payback="${key}" type="number" min="0" step="1" inputmode="decimal" value="${escapeHtml(Number.isFinite(Number.parseFloat(value)) ? value : "")}" /></label>`;
        }).join("")}</div>
        <p class="hint">${escapeHtml(t.editorPaybackHint)}</p>
      </div>`;
  }

  // Purchase prices by period: price, hours, days and months of each.
  _periodsHtml(t) {
    const list = Array.isArray(this._config.price_import_periods) ? this._config.price_import_periods : [];
    const monthName = (n) => new Date(2024, n - 1, 1).toLocaleString(t.locale, { month: "long" });
    const months = (item) => {
      const m = String(item.months ?? "").match(/^(\d{1,2})\s*-\s*(\d{1,2})$/);
      return m ? [Number(m[1]), Number(m[2])] : [0, 0];
    };
    const select = (path, value, options) => `<select data-period="${path}">${options.map(([v, label]) => `<option value="${v}" ${String(value) === String(v) ? "selected" : ""}>${escapeHtml(label)}</option>`).join("")}</select>`;
    const monthOptions = (all) => [[0, all], ...Array.from({ length: 12 }, (_, i) => [i + 1, monthName(i + 1)])];
    return `
      <details class="box" data-box="periods" ${this._boxOpen("periods", list.length > 0) ? "open" : ""}>
        <summary class="title">${escapeHtml(t.editorPricePeriods)}${list.length ? ` (${list.length})` : ""}</summary>
        <p class="hint">${escapeHtml(t.editorPricePeriodsHint)}</p>
        ${list.map((item, i) => {
          const [m1, m2] = months(item);
          return `
          <div class="item">
            <div class="grid pairs">
              <label><span>${escapeHtml(t.editorPeriodPrice)}</span><input type="number" step="0.0001" min="0" inputmode="decimal" data-period="${i}.price" value="${escapeHtml(item.price ?? "")}" /></label>
              <label><span>${escapeHtml(t.editorPeriodDays)}</span>${select(`${i}.days`, item.days || "all", [["all", t.editorDaysAll], ["workdays", t.editorDaysWorkdays], ["weekend", t.editorDaysWeekend]])}</label>
              <label><span>${escapeHtml(t.editorPeriodFrom)}</span><input type="time" data-period="${i}.from" value="${escapeHtml(item.from ?? "")}" /></label>
              <label><span>${escapeHtml(t.editorPeriodTo)}</span><input type="time" data-period="${i}.to" value="${escapeHtml(item.to ?? "")}" /></label>
              <label><span>${escapeHtml(t.editorPeriodMonthFrom)}</span>${select(`${i}.month_from`, m1, monthOptions(t.editorMonthsAll))}</label>
              <label><span>${escapeHtml(t.editorPeriodMonthTo)}</span>${select(`${i}.month_to`, m2, monthOptions(t.editorMonthsAll))}</label>
            </div>
            <button type="button" class="link danger" data-period-remove="${i}">${escapeHtml(t.editorRemove)}</button>
          </div>`;
        }).join("")}
        <button type="button" class="link" data-period-add>+ ${escapeHtml(t.editorAdd)}</button>
        <div class="switch"><label for="holidays_as_weekend">${escapeHtml(t.editorHolidaysWeekend)}</label><input id="holidays_as_weekend" type="checkbox" data-period-holidays ${this._config.holidays_as_weekend === true ? "checked" : ""} /></div>
      </details>`;
  }

  _setPeriod(index, field, value) {
    const list = (Array.isArray(this._config.price_import_periods) ? this._config.price_import_periods : []).map((p) => ({ ...p }));
    const item = list[index] || {};
    if (field === "month_from" || field === "month_to") {
      const m = String(item.months ?? "").match(/^(\d{1,2})\s*-\s*(\d{1,2})$/);
      let [a, b] = m ? [Number(m[1]), Number(m[2])] : [0, 0];
      if (field === "month_from") a = Number(value); else b = Number(value);
      // One month chosen: from it to itself, or to the other end.
      if (a && !b) b = a;
      if (b && !a) a = b;
      item.months = a && b ? `${a}-${b}` : undefined;
    } else if (field === "price") {
      const n = Number.parseFloat(value);
      item.price = Number.isFinite(n) ? n : undefined;
    } else {
      item[field] = value || undefined;
    }
    if (item.days === "all") delete item.days;
    list[index] = Object.fromEntries(Object.entries(item).filter(([, v]) => v !== undefined));
    this._set("price_import_periods", list);
    this._render();
  }

  _vstoreHtml(t) {
    const config = virtualStorageConfig(this._config);
    return `
      <div class="switch"><label for="vs-on">${escapeHtml(t.editorVsEnable)}</label><input id="vs-on" type="checkbox" ${config ? "checked" : ""} /></div>
      ${config ? `
        ${this._picker("virtual_storage.entity", t.editorVsEntity, config.entity, "sensor", { kind: "energy" })}
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
      </div>
      ${[["hourly", t.editorPvfHourly], ["range", t.editorPvfRange]].map(([key, label]) => `
      <div class="switch"><label for="pvf-${key}">${escapeHtml(label)}</label><input id="pvf-${key}" type="checkbox" data-pvf="${key}" ${f[key] === false ? "" : "checked"} /></div>`).join("")}`;
  }

  _moreHtml(t) {
    return `
      ${this._listHtml(t, "inverter_details", t.editorDetails, t.editorDetailsHint, [["entity", "any", t.editorSensor], ["name", "text", t.editorDetailName]])}
      ${this._picker("weather_entity", t.editorWeather, this._config.weather_entity, "weather")}
      <label><span>${escapeHtml(t.editorFontUrl)}</span><input data-text="font_url" type="text" value="${escapeHtml(this._config.font_url ?? "")}" placeholder="/local/fonts/solar-flow-card.css" /></label>`;
  }

  // The wizard's answers live here until "Finish" writes them all at once.
  _startWizard() {
    const integrations = energyIntegrations(this._hass);
    const energy = SHARED_CACHE.get("energy-prefs")?.data;
    const source = deyeStations(this._hass).length ? "deye" : energyAuto(energy, this._hass) ? "energy" : integrations.length ? `int:${integrations[0].platform}` : "manual";
    const importPrice = priceSetting(this._config.price_import);
    this._wizard = {
      step: 1, source, entities: null, daily: true,
      prices: this._config.settlement === "net_billing" ? "billing" : importPrice?.entity ? "sensor" : importPrice ? "fixed" : "none",
      priceImport: importPrice?.value ?? "", priceExport: priceSetting(this._config.price_export)?.value ?? "", priceSensor: importPrice?.entity || "",
      theme: this._config.theme || "diorama", preset: Array.isArray(this._config.sections) && this._config.sections.length === 1 ? "chart" : "full",
    };
    this._withAuto();
    this._render();
  }

  _wizardHtml(t) {
    const w = this._wizard;
    const choice = (group, value, title, note, on) => `<button type="button" class="choice ${on ? "on" : ""}" data-wiz="${group}" data-value="${escapeHtml(value)}"><b>${escapeHtml(title)}</b>${note ? `<small>${escapeHtml(note)}</small>` : ""}</button>`;
    let body = "";
    if (w.step === 1) {
      const stations = deyeStations(this._hass);
      const auto = energyAuto(SHARED_CACHE.get("energy-prefs")?.data, this._hass);
      const integrations = energyIntegrations(this._hass);
      body = `<p class="hint">${escapeHtml(t.wizardSourceHint)}</p><div class="choices">
        ${stations.length ? choice("source", "deye", "DeyeCloud", t.wizardFound, w.source === "deye") : ""}
        ${auto ? choice("source", "energy", t.wizardEnergy, t.wizardEnergyNote, w.source === "energy") : ""}
        ${integrations.map((i) => choice("source", `int:${i.platform}`, i.name, t.wizardIntegrationNote, w.source === `int:${i.platform}`)).join("")}
        ${choice("source", "manual", t.wizardManual, t.wizardManualNote, w.source === "manual")}
      </div>`;
      if (w.source.startsWith("int:") || w.source === "manual") {
        if (!w.entities || w.entitiesFor !== w.source) {
          const guess = w.source === "manual" ? { entities: {}, daily: true } : guessSensors(this._hass, w.source.slice(4));
          Object.assign(w, { entities: guess.entities, daily: guess.daily, entitiesFor: w.source });
        }
        const names = Object.fromEntries(editorEntityGroups(t).flatMap(([, items]) => items));
        body += `<p class="hint">${escapeHtml(Object.keys(w.entities).length ? t.wizardGuessed : t.wizardPick)}</p>
          <div class="pickers">${Object.keys(SENSOR_GUESSES).map((key) => this._picker(`wizard.${key}`, names[key], w.entities[key], "sensor", { kind: fieldKind(key) })).join("")}</div>
          <label><span>${escapeHtml(t.editorEnergySensors)}</span><select data-wiz-daily>
            <option value="1" ${w.daily ? "selected" : ""}>${escapeHtml(t.editorEnergyDaily)}</option>
            <option value="" ${w.daily ? "" : "selected"}>${escapeHtml(t.editorEnergyTotal)}</option></select></label>
          <p class="hint">${escapeHtml(INTEGRATION_SIGNS[w.source.slice(4)] ? t.wizardSignsSet : t.wizardSignsCheck)}</p>`;
      }
    } else if (w.step === 2) {
      const rce = detectRcePrice(this._hass);
      body = `<div class="choices">
        ${choice("prices", "none", t.wizardNoPrices, "", w.prices === "none")}
        ${choice("prices", "fixed", t.editorSettlementFixed, t.wizardFixedNote, w.prices === "fixed")}
        ${choice("prices", "billing", t.editorSettlementBilling, rce ? fill(t.editorRceFound, { entity: rce, value: fieldValue(this._hass.states[rce], "any", t.locale) }) : t.wizardBillingNote, w.prices === "billing")}
        ${choice("prices", "sensor", t.wizardDynamic, t.wizardDynamicNote, w.prices === "sensor")}
      </div>
      ${w.prices === "fixed" || w.prices === "billing" ? `<label><span>${escapeHtml(t.editorPriceImport)}</span><input type="number" min="0" step="0.01" data-wiz-input="priceImport" value="${escapeHtml(String(w.priceImport))}" /></label>` : ""}
      ${w.prices === "fixed" ? `<label><span>${escapeHtml(t.editorPriceExport)}</span><input type="number" min="0" step="0.01" data-wiz-input="priceExport" value="${escapeHtml(String(w.priceExport))}" /></label>` : ""}
      ${w.prices === "sensor" ? this._picker("wizard.priceSensor", t.editorPriceImportSensor, w.priceSensor, "sensor", { kind: "price" }) : ""}`;
    } else {
      const labels = { simple: [t.wizardSimple, t.wizardSimpleNote], full: [t.wizardFull, t.wizardFullNote], battery: [t.wizardBattery, t.wizardBatteryNote], chart: [t.wizardChart, t.wizardChartNote] };
      body = `<div class="themes">${THEMES.map((theme) => `<button type="button" data-wiz="theme" data-value="${theme}" class="${w.theme === theme ? "on" : ""}">${escapeHtml(t.themeNames[theme])}</button>`).join("")}</div>
        <div class="choices">${Object.keys(WIZARD_PRESETS).map((key) => choice("preset", key, labels[key][0], labels[key][1], w.preset === key)).join("")}</div>`;
    }
    const titles = [t.wizardStepSource, t.wizardStepPrices, t.wizardStepLook];
    return `<div class="wizard">
      <div><span class="steps">${escapeHtml(fill(t.wizardStepOf, { n: w.step, total: 3 }))}</span><h3>${escapeHtml(titles[w.step - 1])}</h3></div>
      ${body}
      <div class="wiz-nav">
        <button type="button" data-wiz-nav="${w.step === 1 ? "close" : "back"}">${escapeHtml(w.step === 1 ? t.wizardCancel : t.wizardBack)}</button>
        <button type="button" class="primary" data-wiz-nav="${w.step === 3 ? "finish" : "next"}">${escapeHtml(w.step === 3 ? t.wizardFinish : t.wizardNext)}</button>
      </div>
    </div>`;
  }

  // Everything the wizard asked, written into the card at once. Options it
  // does not ask about stay as they are.
  _finishWizard() {
    const w = this._wizard;
    const next = { ...this._config, theme: w.theme };
    if (w.source.startsWith("int:") || w.source === "manual") {
      next.entities = { ...(this._config.entities || {}), ...Object.fromEntries(Object.entries(w.entities || {}).filter(([, id]) => id)) };
      if (!Object.keys(next.entities).length) delete next.entities;
      if (w.daily) delete next.energy_sensors;
      else next.energy_sensors = "total";
      Object.assign(next, INTEGRATION_SIGNS[w.source.slice(4)] || {});
    }
    for (const key of ["price_import", "price_export", "settlement"]) delete next[key];
    const number = (v) => (Number.isFinite(Number.parseFloat(v)) ? Number.parseFloat(v) : undefined);
    if (w.prices === "fixed") Object.assign(next, { price_import: number(w.priceImport), price_export: number(w.priceExport) });
    if (w.prices === "billing") Object.assign(next, { settlement: "net_billing", price_import: number(w.priceImport) });
    if (w.prices === "sensor" && w.priceSensor) next.price_import = w.priceSensor;
    delete next.sections;
    delete next.show_solar;
    Object.assign(next, WIZARD_PRESETS[w.preset] || {});
    for (const key of Object.keys(next)) if (next[key] === undefined) delete next[key];
    this._wizard = null;
    this._emit(next);
    this._render();
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
        input[type="text"], input[type="number"], input[type="time"], select {
          width: 100%; min-height: 40px; box-sizing: border-box; padding: 8px 11px; font: inherit;
          color: var(--primary-text-color); background: var(--card-background-color, transparent);
          border: 1px solid var(--divider-color, rgba(127,127,127,.35)); border-radius: 10px;
        }
        .themes { display: grid; grid-template-columns: repeat(auto-fill, minmax(96px, 1fr)); gap: 6px; }
        .themes button { padding: 10px 4px; border-radius: 10px; border: 1px solid var(--divider-color, rgba(127,127,127,.35)); background: var(--card-background-color, transparent);
          color: var(--primary-text-color); font: inherit; font-size: 12px; cursor: pointer; }
        .themes button.on { border-color: var(--primary-color, #03a9f4); box-shadow: inset 0 0 0 1px var(--primary-color, #03a9f4); font-weight: 700; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; }
        .grid.pairs { grid-template-columns: repeat(2, minmax(0, 1fr)); }
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
        .field { display: grid; gap: 3px; min-width: 0; }
        .field .note, .body > .note { margin: 0; color: var(--secondary-text-color, #727272); font-size: 11px; overflow-wrap: anywhere; }
        .found { font-weight: 400; color: var(--success-color, #43a047); }
        .warn { margin: 0; padding: 4px 8px; border-radius: 6px; background: rgba(255, 152, 0, .12); color: var(--warning-color, #b26a00); font-size: 11.5px; line-height: 1.35; }
        .item { display: grid; gap: 8px; padding: 10px; border: 1px dashed var(--divider-color, rgba(127,127,127,.35)); border-radius: 10px; }
        .danger { color: var(--error-color, #db4437) !important; }
        .suggest { display: grid; gap: 4px; padding: 8px 10px; border-radius: 10px; background: rgba(67, 160, 71, .1); }
        .colors { display: flex; flex-wrap: wrap; gap: 8px 16px; }
        .colors label { display: flex; align-items: center; gap: 6px; font-size: 13px; }
        .colors input[type=color] { width: 34px; height: 26px; padding: 0; border: 1px solid var(--divider-color, rgba(127,127,127,.35)); border-radius: 6px; background: none; }
        .colors input.unset { opacity: .45; }
        .wiz-open { justify-self: start; padding: 8px 14px; border: 1px solid var(--primary-color, #03a9f4); border-radius: 999px; background: none;
          color: var(--primary-color, #03a9f4); font: inherit; font-weight: 600; cursor: pointer; }
        .wizard { display: grid; gap: 12px; padding: 14px; border: 2px solid var(--primary-color, #03a9f4); border-radius: 14px; }
        .wizard h3 { margin: 0; font-size: 16px; }
        .wizard .steps { color: var(--secondary-text-color, #727272); font-size: 12px; }
        .choices { display: grid; gap: 8px; }
        .choice { display: grid; gap: 2px; padding: 10px 12px; border: 1px solid var(--divider-color, rgba(127,127,127,.35)); border-radius: 10px;
          background: none; color: inherit; font: inherit; text-align: left; cursor: pointer; }
        .choice.on { border-color: var(--primary-color, #03a9f4); box-shadow: inset 0 0 0 1px var(--primary-color, #03a9f4); }
        .choice b { font-size: 14px; } .choice small { color: var(--secondary-text-color, #727272); font-size: 12px; }
        .wiz-nav { display: flex; justify-content: space-between; gap: 8px; }
        .wiz-nav button { padding: 8px 16px; border-radius: 999px; border: 1px solid var(--divider-color, rgba(127,127,127,.35)); background: none; color: inherit; font: inherit; cursor: pointer; }
        .wiz-nav button.primary { border-color: var(--primary-color, #03a9f4); background: var(--primary-color, #03a9f4); color: var(--text-primary-color, #fff); font-weight: 600; }
        .link { justify-self: start; padding: 0; border: 0; background: none; color: var(--primary-color, #03a9f4); font: inherit; font-size: 13px; cursor: pointer; }
      </style>
      <datalist id="sfc-sensor">${ids("sensor").map((id) => `<option value="${escapeHtml(id)}"></option>`).join("")}</datalist>
      <datalist id="sfc-weather">${ids("weather").map((id) => `<option value="${escapeHtml(id)}"></option>`).join("")}</datalist>
      <div class="editor">
        ${this._legacyType ? `<p class="beta">${escapeHtml(t.editorRenamed)}</p>` : ""}
        ${this._askWizard ? `
        <div class="wizard ask">
          <h3>${escapeHtml(t.wizardAsk)}</h3>
          <p class="note">${escapeHtml(t.wizardAskNote)}</p>
          <div class="wiz-nav">
            <button type="button" data-wiz-ask="no">${escapeHtml(t.wizardAskNo)}</button>
            <button type="button" class="primary" data-wiz-ask="yes">✨ ${escapeHtml(t.wizardAskYes)}</button>
          </div>
        </div>` : this._wizard ? this._wizardHtml(t) : `<button type="button" class="wiz-open" data-wizard-open>✨ ${escapeHtml(t.wizardOpen)}</button>`}
        ${this._wizard || this._askWizard ? "" : `
        ${this._group("look", t, () => this._lookHtml(t))}
        ${this._group("sensors", t, () => this._sensorsHtml(t))}
        ${this._group("sections", t, () => this._sectionsHtml(t))}
        ${this._group("install", t, () => this._installHtml(t))}
        ${this._group("summary", t, () => this._summaryHtml(t))}
        ${this._group("vstore", t, () => this._vstoreHtml(t))}
        ${this._group("forecast", t, () => this._forecastHtml(t))}
        ${this._group("more", t, () => this._moreHtml(t))}`}
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
    root.querySelectorAll("details[data-box]").forEach((el) => el.addEventListener("toggle", () => this._boxes.set(el.dataset.box, el.open)));
    root.querySelectorAll("[data-theme]").forEach((button) => button.addEventListener("click", () => {
      this._set("theme", button.dataset.theme);
      this._render();
    }));
    root.querySelectorAll("[data-text]").forEach((input) => input.addEventListener("change", (e) => this._set(input.dataset.text, e.target.value.trim() || undefined)));
    root.querySelectorAll("[data-select]").forEach((select) => select.addEventListener("change", (e) => {
      this._set(select.dataset.select, e.target.value || undefined);
      if (select.dataset.select === "language" || select.dataset.select === "settlement") this._render();
    }));
    root.querySelectorAll("[data-number]").forEach((input) => input.addEventListener("change", (e) => {
      const number = Number.parseFloat(e.target.value);
      this._set(input.dataset.number, Number.isFinite(number) ? number : undefined);
      if (NUMBER_CHECKS.some(([key]) => key === input.dataset.number) || input.dataset.number.startsWith("price_")) this._render();
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
      if (key === "wide" || key === "collapsible" || key === "load_fonts" || key === "invert_grid" || key === "invert_battery") this._render();
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
    root.querySelectorAll("[data-item]").forEach((input) => input.addEventListener("change", (e) => {
      const [, group, index, field] = input.dataset.item.split(".");
      const value = input.type === "checkbox" ? e.target.checked
        : input.type === "number" ? (Number.isFinite(Number.parseFloat(e.target.value)) ? Number.parseFloat(e.target.value) : undefined)
          : e.target.value.trim();
      this._setItem(group, Number(index), field, value);
    }));
    root.querySelectorAll("[data-period]").forEach((input) => input.addEventListener("change", (e) => {
      const [index, field] = input.dataset.period.split(".");
      this._setPeriod(Number(index), field, e.target.value);
    }));
    root.querySelector("[data-period-add]")?.addEventListener("click", () => {
      this._boxes.set("periods", true);
      const list = Array.isArray(this._config.price_import_periods) ? this._config.price_import_periods : [];
      this._set("price_import_periods", [...list, { from: "07:00", to: "13:00" }]);
      this._render();
    });
    root.querySelectorAll("[data-period-remove]").forEach((button) => button.addEventListener("click", () => {
      const list = [...(Array.isArray(this._config.price_import_periods) ? this._config.price_import_periods : [])];
      list.splice(Number(button.dataset.periodRemove), 1);
      this._set("price_import_periods", list.length ? list : undefined);
      this._render();
    }));
    root.querySelector("[data-energy-title]")?.addEventListener("change", (e) => this._set("energy_title", e.target.checked ? undefined : false));
    root.querySelector("[data-browse-switch]")?.addEventListener("change", (e) => this._set("period_browse", e.target.checked ? undefined : false));
    root.querySelector("[data-period-holidays]")?.addEventListener("change", (e) => this._set("holidays_as_weekend", e.target.checked || undefined));
    root.querySelectorAll("[data-add]").forEach((button) => button.addEventListener("click", () => {
      this._boxes.set(`list-${button.dataset.add}`, true);
      this._writeItems(button.dataset.add, [...this._items(button.dataset.add), {}]);
    }));
    root.querySelectorAll("[data-remove]").forEach((button) => button.addEventListener("click", () => {
      const [group, index] = button.dataset.remove.split(".");
      const items = this._items(group);
      const filled = Object.values(items[Number(index)] || {}).some(Boolean);
      // Removing a filled item loses its settings: ask first.
      if (filled && !window.confirm(stringsFor(languageOf(this._hass, this._config)).editorConfirmRemove)) return;
      items.splice(Number(index), 1);
      this._writeItems(group, items);
    }));
    root.querySelectorAll("[data-custom-title]").forEach((input) => input.addEventListener("change", (e) => {
      const list = this._customList();
      const index = Number(input.dataset.customTitle);
      if (!list[index]) return;
      list[index].title = e.target.value.trim();
      this._writeCustom(list);
    }));
    root.querySelector("[data-add-custom]")?.addEventListener("click", () => this._addCustom());
    root.querySelectorAll("[data-remove-custom]").forEach((button) => button.addEventListener("click", () => {
      const index = Number(button.dataset.removeCustom);
      if (this._customList()[index]?.entities.length && !window.confirm(stringsFor(languageOf(this._hass, this._config)).editorConfirmRemove)) return;
      this._removeCustom(index);
    }));
    // On by default: only `false` is written.
    root.querySelectorAll("[data-pvf]").forEach((input) => input.addEventListener("change", (e) => {
      this._setIn("pv_forecast", input.dataset.pvf, e.target.checked ? undefined : false);
      this._render();
    }));
    root.getElementById("vs-on")?.addEventListener("change", (e) => {
      this._set("virtual_storage", e.target.checked ? true : undefined);
      this._render();
    });
    root.querySelector("[data-wizard-open]")?.addEventListener("click", () => this._startWizard());
    root.querySelectorAll("[data-wiz-ask]").forEach((button) => button.addEventListener("click", () => {
      this._askWizard = false;
      if (button.dataset.wizAsk === "yes") this._startWizard();
      else this._render();
    }));
    root.querySelectorAll("[data-wiz]").forEach((button) => button.addEventListener("click", () => {
      this._wizard[button.dataset.wiz] = button.dataset.value;
      this._render();
    }));
    root.querySelectorAll("[data-wiz-input]").forEach((input) => input.addEventListener("change", (e) => { this._wizard[input.dataset.wizInput] = e.target.value; }));
    root.querySelector("[data-wiz-daily]")?.addEventListener("change", (e) => { this._wizard.daily = Boolean(e.target.value); });
    root.querySelectorAll("[data-wiz-nav]").forEach((button) => button.addEventListener("click", () => {
      const action = button.dataset.wizNav;
      if (action === "close") this._wizard = null;
      else if (action === "back") this._wizard.step -= 1;
      else if (action === "next") this._wizard.step += 1;
      else return this._finishWizard();
      this._render();
    }));
    root.querySelectorAll("[data-phase-name]").forEach((input) => input.addEventListener("change", () => {
      const names = [...root.querySelectorAll("[data-phase-name]")].map((el) => el.value.trim());
      while (names.length && !names[names.length - 1]) names.pop();
      this._set("phase_names", names.length ? names : undefined);
    }));
    root.querySelector("[data-ev-name]")?.addEventListener("change", (e) => this._setIn("ev", "name", e.target.value.trim() || undefined));
    root.querySelector("[data-ev-color]")?.addEventListener("change", (e) => this._setIn("ev", "color", e.target.value.toLowerCase() === "#e8ecf1" ? undefined : e.target.value));
    root.querySelectorAll("[data-payback]").forEach((input) => input.addEventListener("change", (e) => {
      const number = Number.parseFloat(e.target.value);
      // A bare number (payback: 12000) becomes the object form.
      if (typeof this._config.payback !== "object" || !this._config.payback) {
        const cost = positiveNumber(this._config.payback);
        this._config = { ...this._config, payback: cost ? { cost } : undefined };
      }
      this._setIn("payback", input.dataset.payback, number > 0 ? number : undefined);
    }));
    root.querySelectorAll("[data-period-tab]").forEach((input) => input.addEventListener("change", () => {
      // In the fixed order; the default set is not written, and one tab stays.
      const picked = [...root.querySelectorAll("[data-period-tab]")].filter((el) => el.checked).map((el) => el.dataset.periodTab);
      if (!picked.length) { input.checked = true; return; }
      const next = { ...this._config };
      if (picked.join() === DEFAULT_PERIODS.join()) delete next.periods;
      else next.periods = picked;
      if (next.period && !picked.includes(next.period)) delete next.period;
      this._emit(next);
      this._render();
    }));
    root.querySelectorAll("[data-color]").forEach((input) => input.addEventListener("change", (e) => {
      this._setIn("colors", input.dataset.color, e.target.value);
      this._render();
    }));
    root.querySelector("[data-reset-colors]")?.addEventListener("click", () => {
      this._set("colors", undefined);
      this._render();
    });
    root.querySelector("[data-copy-auto]")?.addEventListener("click", () => this._copyAuto());
    root.querySelector("[data-use-billing]")?.addEventListener("click", () => {
      // Net-billing values the energy sold at the RCE price: a fixed export
      // price would take its place, so it goes.
      const next = { ...this._config, settlement: "net_billing" };
      delete next.price_export;
      this._emit(next);
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
      // Nothing ticked leaves an empty card: ask first.
      if (!rows.some((r) => r.on) && !window.confirm(stringsFor(languageOf(this._hass, this._config)).editorConfirmNoSections)) {
        e.target.checked = true;
        return;
      }
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
// The old names, for dashboards from before 2.0.0 (a class can be defined
// only once, hence the subclasses).
if (!customElements.get(LEGACY_CARD_TAG)) customElements.define(LEGACY_CARD_TAG, class extends SolarFlowCard {});
if (!customElements.get(LEGACY_EDITOR_TAG)) customElements.define(LEGACY_EDITOR_TAG, class extends SolarFlowCardEditor {});

window.customCards = window.customCards || [];
if (!window.customCards.some((card) => card.type === CARD_TAG)) {
  window.customCards.push({
    type: CARD_TAG,
    name: "Home Energy Hub",
    description: "Your home's energy in one card: live power flow of solar, battery, grid and home, charts, forecasts, virtual storage, phases and inverter details, in ten themes. Formerly Solar Flow Card.",
    preview: true,
    documentationURL: "https://github.com/gratak/solar-flow-card",
  });
}

console.info(
  `%c HOME ENERGY HUB %c v${CARD_VERSION} `,
  "color:#fff;background:#f5a400;font-weight:700;padding:3px 6px;border-radius:4px 0 0 4px",
  "color:#f5a400;background:#fff6dc;font-weight:700;padding:3px 6px;border-radius:0 4px 4px 0"
);
