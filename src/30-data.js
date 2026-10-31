
// Live power sensors. `key` is the card option under `entities:`, `deye` the
// DeyeCloud metric_key used for automatic discovery.
const LIVE_METRICS = {
  solar: { key: "solar_power", deye: "generationPower" },
  load: { key: "load_power", deye: "consumptionPower" },
  gridImport: { key: "grid_import_power", deye: "purchasePower" },
  gridExport: { key: "grid_export_power", deye: "gridPower" },
  grid: { key: "grid_power", deye: "wirePower" },
  battery: { key: "battery_power", deye: "batteryPower" },
  charge: { key: "battery_charge_power", deye: "chargePower" },
  discharge: { key: "battery_discharge_power", deye: "dischargePower" },
  soc: { key: "battery_soc", deye: "batterySOC" },
};

// Inverter device keys used when the station sensor above is missing or
// has no value. Signs match: battery + discharging, grid + importing.
const LIVE_DEVICE_FALLBACK = {
  solar: ["TotalSolarPower"],
  load: ["TotalConsumptionPower", "UPSLoadPower"],
  grid: ["TotalGridPower"],
  battery: ["BatteryPower"],
  soc: ["SOC", "BMSSOC"],
};

// Daily energy sensors (reset at midnight, state_class total_increasing).
const ENERGY_METRICS = {
  solar: { key: "solar_energy", deye: "generationValue" },
  load: { key: "load_energy", deye: "consumptionValue" },
  gridImport: { key: "grid_import_energy", deye: "purchaseValue" },
  gridExport: { key: "grid_export_energy", deye: "gridValue" },
  charge: { key: "battery_charge_energy", deye: "chargeValue" },
  discharge: { key: "battery_discharge_energy", deye: "dischargeValue" },
};
const ENERGY_ORDER = ["solar", "load", "gridImport", "gridExport", "charge", "discharge"];

function deyeStations(hass) {
  const ids = new Set();
  for (const stateObj of Object.values(hass?.states || {})) {
    const attrs = stateObj?.attributes || {};
    if (attrs.sensor_type && attrs.station_id !== undefined && attrs.station_id !== null) ids.add(String(attrs.station_id));
  }
  return [...ids].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

function resolveEntities(hass, config) {
  const states = hass?.states || {};
  const stations = deyeStations(hass);
  const station = config.station_id ? String(config.station_id) : stations[0] || null;
  const candidates = station === null
    ? []
    : Object.entries(states).filter(([, s]) => String(s?.attributes?.station_id) === station);
  const pick = (entityId) => (entityId && states[entityId] ? { entityId, stateObj: states[entityId] } : null);
  const find = (test) => {
    const match = candidates.find(([, s]) => test(s.attributes || {}));
    return match ? { entityId: match[0], stateObj: match[1] } : null;
  };
  const configured = config.entities || {};
  const live = {};
  for (const [name, def] of Object.entries(LIVE_METRICS)) {
    live[name] = pick(configured[def.key])
      || (def.deye ? find((a) => a.sensor_type === "station_latest" && a.metric_key === def.deye) : null);
  }
  // Station values DeyeCloud leaves empty: fall back to the inverter's own
  // device sensor with the same meaning (same sign conventions).
  const devices = candidates.filter(([, s]) => s.attributes?.sensor_type === "device"
    && String(s.attributes?.device_type || "").includes("INVERTER"));
  const numeric = (entry) => entry && stateNumber(entry.stateObj) !== null;
  for (const [name, keys] of Object.entries(LIVE_DEVICE_FALLBACK)) {
    if (configured[LIVE_METRICS[name].key] || numeric(live[name])) continue;
    const wanted = keys.map(normalizeKey);
    const match = devices.find(([, s]) => wanted.includes(normalizeKey(deviceKey(s))) && stateNumber(s) !== null);
    if (match) live[name] = { entityId: match[0], stateObj: match[1] };
  }
  const energy = {};
  for (const [name, def] of Object.entries(ENERGY_METRICS)) {
    energy[name] = pick(configured[def.key])
      || find((a) => a.sensor_type === "daily" && a.metric_key === def.deye && a.relative_day === "today");
  }
  const named = candidates.find(([, s]) => s.attributes?.station_name);
  return {
    station,
    stations,
    candidates,
    live,
    energy,
    name: config.title || named?.[1].attributes.station_name || null,
  };
}

function hasAnyEntity(resolved) {
  return Object.values(resolved.live).some(Boolean) || Object.values(resolved.energy).some(Boolean);
}

// Live power in W. Battery and grid are also given as signed values:
// battery > 0 discharging into the home, grid > 0 importing.
function liveValues(resolved, config) {
  const value = (entry) => wattsOf(entry?.stateObj);
  const positive = (entry) => Math.max(0, value(entry) ?? 0);
  const { live } = resolved;
  let charge = positive(live.charge);
  let discharge = positive(live.discharge);
  // DeyeCloud often leaves charge/discharge at 0 and only reports the signed
  // battery power: negative while charging, positive while discharging.
  const signedBattery = value(live.battery);
  if (charge <= ACTIVE_W && discharge <= ACTIVE_W && signedBattery !== null) {
    const battery = signedBattery * (config.invert_battery ? -1 : 1);
    if (battery < 0) charge = -battery;
    else discharge = battery;
  }
  let gridImport = positive(live.gridImport);
  let gridExport = positive(live.gridExport);
  const signedGrid = value(live.grid);
  if (gridImport <= ACTIVE_W && gridExport <= ACTIVE_W && signedGrid !== null) {
    const grid = signedGrid * (config.invert_grid ? -1 : 1);
    if (grid > 0) gridImport = grid;
    else gridExport = -grid;
  }
  const solar = positive(live.solar);
  // No consumption sensor: the home takes what the panels, the grid and the
  // battery deliver (grid and battery signed: + import, + discharge).
  const hasGrid = [live.grid, live.gridImport, live.gridExport].some((entry) => value(entry) !== null);
  const loadComputed = value(live.load) === null && (value(live.solar) !== null || hasGrid);
  const load = loadComputed
    ? Math.max(0, solar + (gridImport - gridExport) + (discharge - charge))
    : positive(live.load);
  return {
    solar,
    load,
    charge,
    discharge,
    gridImport,
    gridExport,
    battery: discharge - charge,
    grid: gridImport - gridExport,
    soc: stateNumber(live.soc?.stateObj),
    loadComputed,
    solarActive: solar > ACTIVE_W,
    loadActive: load > ACTIVE_W,
    chargeActive: charge > ACTIVE_W,
    dischargeActive: discharge > ACTIVE_W,
    importActive: gridImport > ACTIVE_W,
    exportActive: gridExport > ACTIVE_W,
  };
}

function liveStatus(resolved) {
  const dates = Object.values(resolved.live)
    .map((entry) => entry?.stateObj?.last_updated || entry?.stateObj?.last_changed)
    .filter(Boolean)
    .map((value) => new Date(value).getTime())
    .filter(Number.isFinite);
  const available = Object.values(resolved.live).some((entry) => stateNumber(entry?.stateObj) !== null);
  if (!available || !dates.length) return { state: "offline", at: null };
  const at = new Date(Math.max(...dates));
  return { state: Date.now() - at.getTime() <= 3 * 60 * 1000 ? "live" : "delayed", at };
}

// Home consumption from the other flows, for installations without a
// consumption sensor: what the panels, the grid and the battery deliver
// minus what goes back to the grid and into the battery.
function deriveLoadEnergy(values) {
  if (isNum(values.load) || !(isNum(values.solar) || isNum(values.gridImport))) return values;
  const v = (name) => (isNum(values[name]) ? values[name] : 0);
  return { ...values, load: Math.max(0, v("solar") + v("gridImport") - v("gridExport") + v("discharge") - v("charge")) };
}

// Today's energy. Daily sensors (reset at midnight) are read as they are.
// Lifetime counters (`energy_sensors: total`) use Home Assistant's hourly
// statistics: the change of every hour since midnight, plus what the
// sensor added since the last full hour (`stats`, null while it loads).
// Statistics keep counting while a sensor is unavailable (an inverter at
// night), unlike a reading taken at midnight.
function todayEnergy(resolved, stats) {
  const values = {};
  for (const name of ENERGY_ORDER) {
    const now = kwhOf(resolved.energy[name]?.stateObj);
    if (stats === undefined) values[name] = now;
    else {
      const s = stats?.[name];
      values[name] = s ? s.change + (isNum(now) && isNum(s.last) ? Math.max(0, now - s.last) : 0) : null;
    }
  }
  return deriveLoadEnergy(values);
}

// Hourly statistics since midnight for lifetime energy counters. The hour
// before midnight is included only for its closing reading (`last` when no
// hour of today has been compiled yet).
async function loadTodayStats(hass, energy) {
  const sources = Object.fromEntries(ENERGY_ORDER.map((name) => [name, energy[name]?.entityId]).filter(([, id]) => id));
  const midnight = startOfDay(new Date()).getTime();
  const response = await hass.callWS({
    type: "recorder/statistics_during_period",
    start_time: new Date(midnight - 3600000).toISOString(),
    end_time: new Date().toISOString(),
    statistic_ids: [...new Set(Object.values(sources))],
    period: "hour",
    types: ["change", "state"],
    units: { energy: "kWh" },
  });
  const out = {};
  for (const [name, entityId] of Object.entries(sources)) {
    const rows = response?.[entityId] || [];
    if (!rows.length) continue;
    let change = 0;
    let last = null;
    for (const row of rows) {
      if (statStart(row.start) >= midnight) change += Math.max(0, Number(row.change) || 0);
      const state = Number(row.state);
      if (Number.isFinite(state)) last = state;
    }
    out[name] = { change, last };
  }
  return out;
}

// Virtual storage (#43): `virtual_storage: true` or an object with an
// optional ready net balance `entity` and `negative: show|zero`.
function virtualStorageConfig(config) {
  const vs = config.virtual_storage;
  if (vs === true) return { entity: null, negative: "show", countAsOwn: false };
  if (!vs || typeof vs !== "object" || Array.isArray(vs)) return null;
  return {
    entity: typeof vs.entity === "string" && vs.entity ? vs.entity : null,
    negative: vs.negative === "zero" ? "zero" : "show",
    countAsOwn: vs.count_as_own === true,
  };
}

function startOfHour(date) {
  const d = new Date(date);
  d.setMinutes(0, 0, 0);
  return d;
}

const GRID_COUNTERS = ["gridImport", "gridExport"];

// Grid import and export of every full hour since `start`, from the hourly
// statistics: Map(hour start ms -> { gridImport, gridExport }) in kWh.
async function loadHourlyGrid(hass, energy, start) {
  const ids = GRID_COUNTERS.map((name) => energy[name]?.entityId);
  const response = await hass.callWS({
    type: "recorder/statistics_during_period",
    start_time: start.toISOString(),
    end_time: new Date().toISOString(),
    statistic_ids: [...new Set(ids)],
    period: "hour",
    types: ["change"],
    units: { energy: "kWh" },
  });
  const hours = new Map();
  GRID_COUNTERS.forEach((name, i) => {
    for (const row of response?.[ids[i]] || []) {
      const at = statStart(row.start);
      const hour = hours.get(at) || { gridImport: 0, gridExport: 0 };
      hour[name] += Math.max(0, Number(row.change) || 0);
      hours.set(at, hour);
    }
  });
  return hours;
}

// The current hour so far, from the 5-minute statistics: the change since
// the full hour and the last compiled reading, which the live state
// continues (see hourSoFar()).
async function loadCurrentHour(hass, energy) {
  const ids = GRID_COUNTERS.map((name) => energy[name]?.entityId);
  const hourStart = startOfHour(new Date()).getTime();
  const response = await hass.callWS({
    type: "recorder/statistics_during_period",
    start_time: new Date(hourStart - 15 * 60000).toISOString(),
    end_time: new Date().toISOString(),
    statistic_ids: [...new Set(ids)],
    period: "5minute",
    types: ["change", "state"],
    units: { energy: "kWh" },
  });
  const out = {};
  GRID_COUNTERS.forEach((name, i) => {
    const rows = response?.[ids[i]] || [];
    if (!rows.length) return;
    let change = 0;
    let last = null;
    for (const row of rows) {
      if (statStart(row.start) >= hourStart) change += Math.max(0, Number(row.change) || 0);
      const state = Number(row.state);
      if (Number.isFinite(state)) last = state;
    }
    out[name] = { change, last };
  });
  return out;
}

// Import and export within the current hour: the compiled 5-minute change
// plus what the counter added since (a counter that went down was reset).
function hourSoFar(resolved, current) {
  if (!current) return null;
  const out = {};
  for (const name of GRID_COUNTERS) {
    const s = current[name];
    if (!s) return null;
    const now = kwhOf(resolved.energy[name]?.stateObj);
    out[name] = s.change + (isNum(now) && isNum(s.last) ? (now >= s.last ? now - s.last : now) : 0);
  }
  return out;
}

// What the utility bills with hourly balancing: the import left after each
// hour's balancing, and the export left over.
function hourlyNet(hours, since, current) {
  if (!hours) return null;
  const net = { gridImport: 0, gridExport: 0 };
  const add = (h) => {
    net.gridImport += Math.max(0, h.gridImport - h.gridExport);
    net.gridExport += Math.max(0, h.gridExport - h.gridImport);
  };
  for (const [at, h] of hours) if (at >= since) add(h);
  if (current) add(current);
  return net;
}

// The virtual storage: this hour's balance (export minus import), the time
// until it resets, and today's hours.
function virtualStorage(hass, resolved, vs, todayHours, current, now = new Date()) {
  const hourStart = startOfHour(now);
  const minutesLeft = Math.max(0, Math.ceil((hourStart.getTime() + 3600000 - now.getTime()) / 60000));
  let value = null;
  let entityId = null;
  if (vs.entity) {
    entityId = vs.entity;
    value = kwhOf(hass.states?.[vs.entity]);
  } else if (current) {
    value = current.gridExport - current.gridImport;
    entityId = resolved.energy.gridExport?.entityId || null;
  }
  let day = null;
  if (todayHours) {
    const hours = [...todayHours.entries()].filter(([at]) => at >= startOfDay(now).getTime() && at < hourStart.getTime()).map(([, h]) => h);
    if (current) hours.push(current);
    day = {
      surplusHours: hours.filter((h) => h.gridExport - h.gridImport > 0.005).length,
      balanced: hours.reduce((sum, h) => sum + Math.min(h.gridImport, h.gridExport), 0),
    };
  }
  const deficit = isNum(value) && value < -0.0005;
  if (deficit && vs.negative === "zero") value = 0;
  return { value, deficit, countAsOwn: vs.countAsOwn, entityId, minutesLeft, progress: ((60 - minutesLeft) / 60) * 100, day };
}

// Today's self-sufficiency, with the energy balanced within the hour counted
// as your own when `virtual_storage: { count_as_own: true }`.
function todayOwnShare(m) {
  const { load, gridImport } = m.today;
  if (!isNum(load) || !isNum(gridImport) || load <= 0.05) return null;
  const v = m.virtualStorage;
  const fromGrid = v?.countAsOwn && v.day ? Math.max(0, gridImport - v.day.balanced) : gridImport;
  return clamp(((load - fromGrid) / load) * 100, 0, 100);
}

// Long-term statistics query for a period other than today.
function statsSpec(period) {
  const now = new Date();
  if (period === "3d") return { period, start: startOfDay(addDays(now, -2)), statPeriod: "day", ttl: 15 * 60000 };
  if (period === "7d") return { period, start: startOfDay(addDays(now, -6)), statPeriod: "day", ttl: 15 * 60000 };
  if (period === "month") {
    const start = startOfDay(now);
    start.setDate(1);
    return { period, start, statPeriod: "day", ttl: 15 * 60000 };
  }
  return { period, start: new Date(2015, 0, 1), statPeriod: "month", ttl: 60 * 60000 };
}

async function loadStatistics(hass, spec, energy) {
  const sources = Object.fromEntries(ENERGY_ORDER.map((name) => [name, energy[name]?.entityId]).filter(([, id]) => id));
  const response = await hass.callWS({
    type: "recorder/statistics_during_period",
    start_time: spec.start.toISOString(),
    end_time: new Date().toISOString(),
    statistic_ids: Object.values(sources),
    period: spec.statPeriod,
    types: ["change"],
    units: { energy: "kWh" },
  });
  const byKey = new Map();
  for (const [name, entityId] of Object.entries(sources)) {
    for (const row of response?.[entityId] || []) {
      const start = new Date(statStart(row.start));
      const key = spec.statPeriod === "month" ? `${start.getFullYear()}-${start.getMonth()}` : start.toDateString();
      const bucket = byKey.get(key) || { start };
      bucket[name] = Math.max(0, Number(row.change) || 0);
      byKey.set(key, bucket);
    }
  }
  let buckets;
  if (spec.statPeriod === "day") {
    // A fixed day axis, so a missing day shows as a gap instead of shifting.
    buckets = [];
    for (let day = new Date(spec.start); day <= new Date(); day = addDays(day, 1)) {
      buckets.push(byKey.get(day.toDateString()) || { start: new Date(day) });
    }
  } else {
    buckets = [...byKey.values()].sort((a, b) => a.start - b.start);
  }
  return { buckets };
}

// Statistics are compiled hourly; today's bucket comes from the live Today
// sensors instead so the totals do not lag behind.
function withLiveToday(buckets, spec, today) {
  if (spec.statPeriod !== "day") return buckets;
  const key = new Date().toDateString();
  return buckets.map((bucket) => {
    if (bucket.start.toDateString() !== key) return bucket;
    const next = { ...bucket };
    for (const name of ENERGY_ORDER) if (isNum(today[name])) next[name] = today[name];
    return next;
  });
}

function sumBuckets(buckets) {
  const totals = {};
  for (const name of ENERGY_ORDER) {
    const values = buckets.map((bucket) => bucket[name]).filter(isNum);
    totals[name] = values.length ? values.reduce((sum, value) => sum + value, 0) : null;
  }
  return totals;
}

// Options renamed before 1.0; the old names keep working.
const OPTION_ALIASES = { show_autarky: "show_self_sufficiency" };

function migrateConfig(config) {
  const next = { ...config };
  for (const [old, current] of Object.entries(OPTION_ALIASES)) {
    if (old in next) {
      if (!(current in next)) next[current] = next[old];
      delete next[old];
    }
  }
  return next;
}

// `net`: with virtual storage, the import and export left after hourly
// balancing (see hourlyNet()).
function periodSummary(totals, config, t, locale, net = null) {
  const { solar, load, gridImport, gridExport } = totals;
  const items = [];
  const show = (key) => config[key] !== false;
  const hasSolar = show("show_solar");
  const countAsOwn = Boolean(net) && virtualStorageConfig(config)?.countAsOwn;
  const ownImport = countAsOwn ? net.gridImport : gridImport;
  if (show("show_self_sufficiency") && isNum(load) && isNum(ownImport) && load > 0.05) {
    items.push(["autarky", t.autarky, formatPercent(clamp(((load - ownImport) / load) * 100, 0, 100), locale)]);
  }
  // Both values, unless the balanced energy already counts as your own.
  if (!countAsOwn && net && show("show_self_sufficiency") && isNum(load) && load > 0.05) {
    items.push(["autarky", t.autarkyHourly, formatPercent(clamp(((load - net.gridImport) / load) * 100, 0, 100), locale)]);
  }
  if (hasSolar && show("show_self_use") && isNum(solar) && isNum(gridExport) && solar > 0.05) {
    items.push(["selfuse", t.selfUse, formatPercent(clamp(((solar - gridExport) / solar) * 100, 0, 100), locale)]);
  }
  const priceImport = positiveNumber(config.price_import);
  if (show("show_savings") && priceImport !== null && isNum(load) && isNum(gridImport)) {
    const priceExport = positiveNumber(config.price_export) || 0;
    // Hourly balancing: billed are only the import and export left after it.
    const billedImport = net ? net.gridImport : gridImport;
    const billedExport = net ? net.gridExport : gridExport;
    const saved = Math.max(0, load - billedImport) * priceImport + (isNum(billedExport) ? billedExport : 0) * priceExport;
    items.push(["money", t.savings, `${formatNumber(saved, locale, 2)} ${config.currency ?? t.currency}`.trim()]);
  }
  if (hasSolar && show("show_co2") && isNum(solar)) {
    const factor = Number.parseFloat(config.co2_factor);
    const kg = solar * (Number.isFinite(factor) && factor >= 0 ? factor : 0.5);
    items.push(["co2", t.co2, kg >= 1000 ? `${formatNumber(kg / 1000, locale, 2)} t` : `${formatNumber(kg, locale, kg < 10 ? 1 : 0)} kg`]);
  }
  const pvCapacity = positiveNumber(config.pv_capacity);
  if (hasSolar && show("show_yield") && pvCapacity !== null && isNum(solar)) {
    const yieldValue = solar / pvCapacity;
    items.push(["yield", t.specificYield, `${formatNumber(yieldValue, locale, yieldValue < 10 ? 2 : 0)} kWh/kWp`]);
  }
  return items;
}

const FORECAST_MAX_HOURS = 48;

// Time until full while charging, until the reserve while discharging.
function batteryForecast(live, config) {
  const capacity = positiveNumber(config.battery_capacity);
  const minSoc = clamp(Number.parseFloat(config.battery_min_soc ?? 10) || 0, 0, 90);
  if (!isNum(live.soc)) return { capacity, minSoc, soc: null, mode: "unknown" };
  const soc = clamp(live.soc, 0, 100);
  const forecast = { capacity, minSoc, soc, stored: capacity !== null ? (soc / 100) * capacity : null, mode: "idle" };
  if (capacity === null) return forecast;
  if (live.charge > 50 && soc < 99.5) {
    forecast.mode = "charging";
    forecast.hours = (((100 - soc) / 100) * capacity) / (live.charge / 1000);
  } else if (live.discharge > 50 && soc > minSoc) {
    forecast.mode = "discharging";
    forecast.hours = (((soc - minSoc) / 100) * capacity) / (live.discharge / 1000);
  }
  // Beyond two days the rate is too small for a useful time (a trickle of
  // charge in the evening); report the direction without one.
  if (forecast.hours > FORECAST_MAX_HOURS) {
    forecast.slow = forecast.mode;
    forecast.mode = "idle";
    delete forecast.hours;
  }
  if (forecast.hours !== undefined) forecast.at = new Date(Date.now() + forecast.hours * 3600000);
  return forecast;
}

// DeyeCloud device sensors are named "<key> <serial>"; newer versions also
// expose the key as an attribute.
function deviceKey(stateObj) {
  const attrs = stateObj.attributes || {};
  if (attrs.device_key) return String(attrs.device_key);
  const serial = String(attrs.device_sn || "");
  const words = String(attrs.friendly_name || "").split(/\s+/);
  const index = serial ? words.lastIndexOf(serial) : -1;
  return index > 0 ? words[index - 1] : "";
}

// Inverter readings set in the card config, for any inverter: string power,
// voltage and current (`entities: pv1_power … pv4_current`, the power is
// worked out from voltage × current when missing) and `inverter_details:`,
// a list of any sensors.
function configuredInverter(hass, config) {
  const states = hass?.states || {};
  const configured = config.entities || {};
  const device = { serial: "", strings: new Map(), temperatures: [], battery: [], grid: [], other: [] };
  const read = (entityId, key) => {
    const stateObj = states[entityId];
    if (!stateObj) return null;
    const value = stateNumber(stateObj);
    return { entityId, key, value, unit: stateUnit(stateObj), text: value === null ? String(stateObj.state) : null };
  };
  for (let n = 1; n <= 4; n++) {
    const string = {};
    const power = configured[`pv${n}_power`] ? read(configured[`pv${n}_power`], `PV${n} power`) : null;
    if (isNum(power?.value)) string.W = { ...power, value: wattsOf(states[power.entityId]), unit: "W" };
    for (const [unit, name] of [["V", "voltage"], ["A", "current"]]) {
      const r = configured[`pv${n}_${name}`] ? read(configured[`pv${n}_${name}`], `PV${n} ${name}`) : null;
      if (isNum(r?.value)) string[unit] = r;
    }
    if (!string.W && string.V && string.A) string.W = { ...string.V, key: `PV${n} power`, value: string.V.value * string.A.value, unit: "W" };
    if (Object.keys(string).length) device.strings.set(n, string);
  }
  const details = Array.isArray(config.inverter_details) ? config.inverter_details : [];
  for (const item of details) {
    const entityId = typeof item === "string" ? item : item?.entity;
    const r = entityId ? read(entityId, (typeof item === "object" && item?.name) || states[entityId]?.attributes?.friendly_name || entityId) : null;
    if (r) device.other.push(r);
  }
  return device.strings.size || device.other.length ? device : null;
}

function inverterReadings(resolved, hass, config = {}) {
  const own = configuredInverter(hass, config);
  return own ? [own, ...deyeInverterReadings(resolved)] : deyeInverterReadings(resolved);
}

function deyeInverterReadings(resolved) {
  const devices = resolved.candidates.filter(([, s]) => s.attributes?.sensor_type === "device");
  const inverters = devices.filter(([, s]) => String(s.attributes?.device_type || "").includes("INVERTER"));
  const bySerial = new Map();
  for (const [entityId, stateObj] of inverters.length ? inverters : devices) {
    const key = deviceKey(stateObj);
    const value = stateNumber(stateObj);
    if (!key || value === null) continue;
    const serial = String(stateObj.attributes?.device_sn || "");
    const device = bySerial.get(serial) || { serial, strings: new Map(), temperatures: [], battery: [], grid: [], other: [] };
    const unit = stateUnit(stateObj);
    const reading = { entityId, key, value, unit };
    const stringMatch = key.match(/PV\s*(\d+)/i);
    if (stringMatch && ["V", "A", "W", "kW"].includes(unit) && !/total|daily|energy/i.test(key)) {
      const index = Number(stringMatch[1]);
      const string = device.strings.get(index) || {};
      string[unit === "kW" ? "W" : unit] = { ...reading, value: unit === "kW" ? value * 1000 : value };
      device.strings.set(index, string);
    } else if (/^(battery|bms|bat)/i.test(key) && ["V", "A", "°C", "W"].includes(unit)) {
      device.battery.push(reading);
    } else if (unit === "°C" || /temp/i.test(key)) {
      device.temperatures.push(reading);
    } else if ((unit === "Hz" || (unit === "V" && /grid|ac|phase|l\d|ua|ub|uc/i.test(key))) && device.grid.length < 6) {
      device.grid.push(reading);
    }
    bySerial.set(serial, device);
  }
  return [...bySerial.values()].filter((d) => d.strings.size || d.temperatures.length || d.battery.length || d.grid.length);
}

// Optimizer / per-panel production: DeyeCloud optimizer sensors, or the
// `panels:` option (entity ids of each panel's energy today).
function panelData(hass, resolved, config) {
  const states = hass?.states || {};
  let panels = [];
  if (Array.isArray(config.panels) && config.panels.length) {
    panels = config.panels.map((item, i) => {
      const entityId = typeof item === "string" ? item : item?.entity;
      const powerId = typeof item === "object" ? item?.power : null;
      return {
        serial: entityId || String(i),
        name: (typeof item === "object" && item?.name) || `#${i + 1}`,
        entityId,
        today: stateNumber(states[entityId]),
        power: powerId ? stateNumber(states[powerId]) : null,
      };
    }).filter((panel) => panel.entityId);
  } else {
    const byDevice = new Map();
    for (const [entityId, stateObj] of resolved.candidates) {
      const attrs = stateObj.attributes || {};
      if (attrs.sensor_type !== "optimizer" || !attrs.device_sn) continue;
      const panel = byDevice.get(attrs.device_sn) || { serial: String(attrs.device_sn) };
      if (attrs.metric_key === "today") {
        panel.today = stateNumber(stateObj);
        panel.entityId = entityId;
      } else if (attrs.metric_key === "power") {
        panel.power = stateNumber(stateObj);
      }
      byDevice.set(attrs.device_sn, panel);
    }
    panels = [...byDevice.values()]
      .filter((panel) => panel.entityId)
      .sort((a, b) => a.serial.localeCompare(b.serial, undefined, { numeric: true }))
      .map((panel, i) => ({ ...panel, name: `#${i + 1}` }));
  }
  if (!panels.length) return null;
  const max = Math.max(0.01, ...panels.map((p) => p.today).filter(isNum));
  for (const panel of panels) panel.share = isNum(panel.today) ? clamp(panel.today / max, 0, 1) : 0;
  // Strings: the panels on each string (`panels_per_string`, a list or one
  // number) in panel order, otherwise `panel_strings` equal parts.
  const setting = config.panels_per_string;
  const counts = (Array.isArray(setting) ? setting : []).map((n) => Math.round(Number(n)) || 0).filter((n) => n > 0);
  const each = Array.isArray(setting) ? 0 : Math.round(Number(setting)) || 0;
  const strings = [];
  if (counts.length || each > 0) {
    let i = 0;
    for (const n of counts) {
      if (i >= panels.length) break;
      strings.push(panels.slice(i, i + n));
      i += n;
    }
    const size = each > 0 ? each : panels.length;
    for (; i < panels.length; i += size) strings.push(panels.slice(i, i + size));
  } else {
    const stringCount = clamp(Math.round(Number(config.panel_strings) || (panels.length > 8 ? 2 : 1)), 1, panels.length);
    const perString = Math.ceil(panels.length / stringCount);
    for (let i = 0; i < panels.length; i += perString) strings.push(panels.slice(i, i + perString));
  }
  // Average, median and weakest panel: over all panels, or for each string
  // on its own (`panels_average: per_string`, for strings facing different
  // ways). A panel is weak below 85% of the median of its group.
  const perString = config.panels_average === "per_string" && strings.length > 1;
  const groups = (perString ? strings : [panels]).map(panelStats);
  for (const group of groups) if (group.weakest) group.weakest.weak = true;
  const weak = groups.map((g) => g.weakest && { ...g, ratio: g.weakest.today / g.median }).filter(Boolean)
    .sort((a, b) => a.ratio - b.ratio)[0];
  return {
    panels,
    strings,
    stringStats: perString ? groups : null,
    median: weak ? weak.median : groups[0].median,
    weakest: weak ? weak.weakest : null,
    average: panelStats(panels).average,
  };
}

function panelStats(list) {
  const values = list.map((p) => p.today).filter(isNum);
  const sorted = [...values].sort((a, b) => a - b);
  const median = sorted.length ? sorted[Math.floor((sorted.length - 1) / 2)] : 0;
  let weakest = null;
  for (const panel of list) if (isNum(panel.today) && (!weakest || panel.today < weakest.today)) weakest = panel;
  if (!(median >= 0.05 && weakest && weakest.today < median * 0.85)) weakest = null;
  return { median, weakest, average: values.length ? values.reduce((s, v) => s + v, 0) / values.length : null };
}

// Installation details: power per phase, inverter load, battery (BMS) and
// generator. `key` is the option under `entities:`, `deye` the DeyeCloud
// device keys tried in order (an inverter's device sensors).
const SYSTEM_METRICS = {
  loadL1: { key: "load_power_l1", deye: ["LoadPowerL1", "LoadPhasePowerA"] },
  loadL2: { key: "load_power_l2", deye: ["LoadPowerL2", "LoadPhasePowerB"] },
  loadL3: { key: "load_power_l3", deye: ["LoadPowerL3", "LoadPhasePowerC"] },
  gridL1: { key: "grid_power_l1", deye: ["GridPowerL1"] },
  gridL2: { key: "grid_power_l2", deye: ["GridPowerL2"] },
  gridL3: { key: "grid_power_l3", deye: ["GridPowerL3"] },
  voltL1: { key: "grid_voltage_l1", deye: ["GridVoltageL1", "LoadVoltageL1", "ACVoltageRUA"] },
  voltL2: { key: "grid_voltage_l2", deye: ["GridVoltageL2", "LoadVoltageL2", "ACVoltageSVB"] },
  voltL3: { key: "grid_voltage_l3", deye: ["GridVoltageL3", "LoadVoltageL3", "ACVoltageTWC"] },
  batteryTemp: { key: "battery_temperature", deye: ["Temperature- Battery", "BatteryTemperature", "BMSTemperature"] },
  batteryVoltage: { key: "battery_voltage", deye: ["BatteryVoltage", "BMSVoltage"] },
  batteryCurrent: { key: "battery_current", deye: ["BatteryTotalCurrent", "BatteryCurrent", "BMSCurrent", "BatteryCurrent1"] },
  inverterPower: { key: "inverter_power", deye: ["TotalInverterOutputPower"] },
  ratedPower: { key: "inverter_rated_power", deye: ["RatedPower"] },
  generator: { key: "generator_power", deye: ["TotalGeneratorPower", "GeneratorActivePower"] },
};
// Battery temperatures outside this range limit charging on most LiFePO4 packs.
const BATTERY_COLD = 10;
const BATTERY_HOT = 45;

function normalizeKey(key) {
  return String(key).toLowerCase().replace(/[^a-z0-9]/g, "");
}

// Power in W and energy in kWh, whichever of the usual units a sensor
// reports (W/kW/MW, Wh/kWh/MWh). Other units are taken as they are.
const POWER_SCALE = { w: 1, kw: 1000, mw: 1e6 };
const ENERGY_SCALE = { wh: 0.001, kwh: 1, mwh: 1000 };
function unitScale(stateObj, table) {
  return table[stateUnit(stateObj).trim().toLowerCase()] ?? 1;
}
function wattsOf(stateObj) {
  const value = stateNumber(stateObj);
  return value === null ? null : value * unitScale(stateObj, POWER_SCALE);
}
function kwhOf(stateObj) {
  const value = stateNumber(stateObj);
  return value === null ? null : value * unitScale(stateObj, ENERGY_SCALE);
}

function systemData(hass, resolved, config) {
  const states = hass?.states || {};
  const configured = config.entities || {};
  // Device sensors of the first inverter, by normalized key.
  const devices = resolved.candidates.filter(([, s]) => s.attributes?.sensor_type === "device"
    && String(s.attributes?.device_type || "").includes("INVERTER"));
  const serial = devices.length ? String(devices[0][1].attributes?.device_sn || "") : "";
  const byKey = new Map();
  for (const [entityId, stateObj] of devices) {
    if (String(stateObj.attributes?.device_sn || "") !== serial) continue;
    const key = deviceKey(stateObj);
    if (key) byKey.set(normalizeKey(key), { entityId, stateObj });
  }
  const found = {};
  for (const [name, def] of Object.entries(SYSTEM_METRICS)) {
    const id = configured[def.key];
    if (id && states[id]) found[name] = { entityId: id, stateObj: states[id] };
    else found[name] = def.deye.map((key) => byKey.get(normalizeKey(key))).find((entry) => entry && stateNumber(entry.stateObj) !== null) || null;
  }
  const watts = (name) => (found[name] ? wattsOf(found[name].stateObj) : null);
  const number = (name) => (found[name] ? stateNumber(found[name].stateObj) : null);
  const gridSign = config.invert_grid ? -1 : 1;
  const phases = [1, 2, 3].map((n) => ({
    name: `L${n}`,
    load: watts(`loadL${n}`),
    grid: isNum(watts(`gridL${n}`)) ? watts(`gridL${n}`) * gridSign : null,
    voltage: number(`voltL${n}`),
    entityId: found[`loadL${n}`]?.entityId || found[`gridL${n}`]?.entityId || found[`voltL${n}`]?.entityId || null,
  }));
  // A single-phase inverter may still report L2/L3 as 0 W / 0 V: a phase
  // counts when it has voltage or carries power. Without voltage sensors,
  // any phase with a power sensor counts.
  const hasVoltage = phases.some((p) => isNum(p.voltage) && p.voltage > 50);
  const present = phases.filter((p) => (hasVoltage
    ? (isNum(p.voltage) && p.voltage > 50) || Math.abs(p.load || 0) > ACTIVE_W || Math.abs(p.grid || 0) > ACTIVE_W
    : isNum(p.load) || isNum(p.grid)));
  const hasPhases = present.length >= 2;
  // Without per-phase consumption (e.g. only a grid meter), the grid power
  // of each phase is the main reading.
  const gridOnly = !present.some((p) => isNum(p.load)) && present.some((p) => isNum(p.grid));
  if (gridOnly) for (const p of present) p.main = "grid";
  const loads = present.map((p) => (gridOnly ? (isNum(p.grid) ? Math.abs(p.grid) : null) : p.load)).filter(isNum);
  const rated = positiveNumber(config.inverter_power_rating) ? positiveNumber(config.inverter_power_rating) * 1000 : watts("ratedPower");
  const inverterPower = watts("inverterPower");
  const batteryTemp = number("batteryTemp");
  const generator = watts("generator");
  const data = {
    phases: hasPhases ? present : null,
    phaseMax: Math.max(1, ...loads),
    phaseSpread: loads.length >= 2 ? Math.max(...loads) - Math.min(...loads) : null,
    inverter: isNum(inverterPower) ? {
      power: inverterPower,
      rated: isNum(rated) && rated > 0 ? rated : null,
      share: isNum(rated) && rated > 0 ? clamp((Math.abs(inverterPower) / rated) * 100, 0, 100) : null,
      entityId: found.inverterPower.entityId,
    } : null,
    battery: [
      ["temperature", found.batteryTemp, batteryTemp, "°C"],
      ["voltage", found.batteryVoltage, number("batteryVoltage"), "V"],
      ["current", found.batteryCurrent, isNum(number("batteryCurrent")) ? Math.abs(number("batteryCurrent")) : null, "A"],
    ].filter(([, entry, value]) => entry && isNum(value)).map(([kind, entry, value, unit]) => ({ kind, entityId: entry.entityId, value, unit })),
    batteryTemp,
    batteryWarn: isNum(batteryTemp) ? (batteryTemp < BATTERY_COLD ? "cold" : batteryTemp > BATTERY_HOT ? "hot" : null) : null,
    generator: isNum(generator) && generator > ACTIVE_W ? { power: generator, entityId: found.generator.entityId } : null,
  };
  return data.phases || data.inverter || data.battery.length || data.generator ? data : null;
}

// Several batteries (the `batteries:` option): the themes show them as one
// combined battery, the Installation section lists each. Power is signed
// like battery_power (+ discharging); `invert: true` flips one battery.
function batteryBank(hass, config) {
  if (!Array.isArray(config.batteries) || !config.batteries.length) return null;
  const states = hass?.states || {};
  const flip = config.invert_battery ? -1 : 1;
  const items = config.batteries.map((item, i) => {
    if (!item || typeof item !== "object") return null;
    const entity = (id) => (typeof id === "string" && states[id] ? states[id] : null);
    const watts = entity(item.power) ? wattsOf(entity(item.power)) : null;
    return {
      name: item.name ? String(item.name) : `#${i + 1}`,
      soc: entity(item.soc) ? stateNumber(entity(item.soc)) : null,
      power: isNum(watts) ? watts * flip * (item.invert ? -1 : 1) : null,
      capacity: positiveNumber(item.capacity),
      voltage: entity(item.voltage) ? stateNumber(entity(item.voltage)) : null,
      temperature: entity(item.temperature) ? stateNumber(entity(item.temperature)) : null,
      entityId: (entity(item.soc) && item.soc) || (entity(item.power) && item.power) || null,
    };
  }).filter((item) => item && (isNum(item.soc) || isNum(item.power)));
  if (!items.length) return null;
  const powered = items.filter((item) => isNum(item.power));
  const charged = items.filter((item) => isNum(item.soc));
  const weighted = charged.length && charged.every((item) => item.capacity);
  const total = (list, read) => list.reduce((sum, item) => sum + read(item), 0);
  return {
    items,
    power: powered.length ? total(powered, (item) => item.power) : null,
    soc: !charged.length ? null : weighted
      ? total(charged, (item) => item.soc * item.capacity) / total(charged, (item) => item.capacity)
      : total(charged, (item) => item.soc) / charged.length,
    capacity: items.every((item) => item.capacity) ? total(items, (item) => item.capacity) : null,
  };
}

// History sources for each battery of the bank: bank_power_<i>, bank_soc_<i>.
function bankHistorySources(hass, config) {
  const states = hass?.states || {};
  const sources = {};
  if (config.show_battery === false || !Array.isArray(config.batteries)) return sources;
  config.batteries.forEach((item, i) => {
    if (!item || typeof item !== "object") return;
    if (typeof item.power === "string" && states[item.power]) sources[`bank_power_${i}`] = { entityId: item.power, stateObj: states[item.power] };
    if (typeof item.soc === "string" && states[item.soc]) sources[`bank_soc_${i}`] = { entityId: item.soc, stateObj: states[item.soc] };
  });
  return sources;
}

// Combined battery power and charge over time from the bank's history.
function combineBankSeries(series, config) {
  if (config.show_battery === false || !Array.isArray(config.batteries)) return {};
  const flip = config.invert_battery ? -1 : 1;
  const powers = [];
  const socs = [];
  config.batteries.forEach((item, i) => {
    if (series[`bank_power_${i}`]) powers.push([series[`bank_power_${i}`], flip * (item?.invert ? -1 : 1)]);
    if (series[`bank_soc_${i}`]) socs.push([series[`bank_soc_${i}`], positiveNumber(item?.capacity) || 1]);
  });
  const combine = (list, value, weight) => {
    if (!list.length) return null;
    return list[0][0].map((_, k) => {
      const points = list.filter(([values]) => isNum(values[k]));
      if (!points.length) return null;
      const total = points.reduce((sum, entry) => sum + value(entry, k), 0);
      return weight ? total / points.reduce((sum, [, w]) => sum + w, 0) : total;
    });
  };
  return {
    battery: combine(powers, ([values, sign], k) => values[k] * sign, false),
    soc: combine(socs, ([values, w], k) => values[k] * w, true),
  };
}

// Today's highlights from the power history (5-minute buckets): the solar
// and consumption peaks with their time, the battery's range, battery
// cycles and the time the home ran without the grid.
function dayHighlights(data, spec, today, forecast) {
  if (!data || data.kind !== "power") return null;
  const at = (i) => new Date(spec.start.getTime() + (i + 0.5) * spec.bucketMs);
  const peak = (values) => {
    if (!values) return null;
    let best = -1;
    values.forEach((v, i) => { if (isNum(v) && (best < 0 || v > values[best])) best = i; });
    return best >= 0 && values[best] > ACTIVE_W ? { value: values[best], at: at(best) } : null;
  };
  const socs = (data.soc || []).filter(isNum);
  let offGrid = 0;
  let measured = 0;
  (data.load || []).forEach((load, i) => {
    if (!isNum(load)) return;
    measured++;
    const grid = data.grid?.[i];
    if (load > ACTIVE_W && (!isNum(grid) || grid <= 4 * ACTIVE_W)) offGrid++;
  });
  const minutes = spec.bucketMs / 60000;
  return {
    solarPeak: peak(data.solar),
    loadPeak: peak(data.load),
    socMin: socs.length ? Math.min(...socs) : null,
    socMax: socs.length ? Math.max(...socs) : null,
    cycles: forecast?.capacity && isNum(today.charge) ? today.charge / forecast.capacity : null,
    offGridMinutes: measured && data.grid ? offGrid * minutes : null,
  };
}

// Today against yesterday, the 7-day average and this month, per flow.
function comparisonRows(today, week, month) {
  const days = week.buckets || [];
  const yesterday = days.length >= 2 ? days[days.length - 2] : null;
  const rows = ["solar", "load", "gridImport", "gridExport"].map((name) => {
    const values = days.map((d) => d[name]).filter(isNum);
    return {
      name,
      today: today[name],
      yesterday: yesterday ? yesterday[name] : null,
      average: values.length ? values.reduce((s, v) => s + v, 0) / values.length : null,
      month: month.totals?.[name] ?? null,
    };
  }).filter((row) => [row.today, row.yesterday, row.month].some(isNum));
  return rows.length ? rows : null;
}

// Weather from a Home Assistant weather entity (the `weather_entity` option,
// otherwise the first one found), for themes that draw the sky.
const WEATHER_LOOK = {
  "sunny": { clouds: 0 },
  "clear-night": { clouds: 0 },
  "partlycloudy": { clouds: 2 },
  "cloudy": { clouds: 4, grey: 0.35, sun: false },
  "fog": { clouds: 1, grey: 0.45, sun: false, fog: true },
  "rainy": { clouds: 4, grey: 0.45, sun: false, rain: 1 },
  "pouring": { clouds: 5, grey: 0.6, sun: false, rain: 2 },
  "snowy": { clouds: 4, grey: 0.35, sun: false, snow: true },
  "snowy-rainy": { clouds: 4, grey: 0.45, sun: false, rain: 1, snow: true },
  "hail": { clouds: 5, grey: 0.55, sun: false, rain: 2 },
  "lightning": { clouds: 5, grey: 0.6, sun: false, lightning: true },
  "lightning-rainy": { clouds: 5, grey: 0.6, sun: false, rain: 2, lightning: true },
  "windy": { clouds: 3, wind: true },
  "windy-variant": { clouds: 4, grey: 0.25, wind: true },
  "exceptional": { clouds: 3, grey: 0.3 },
};

function weatherData(hass, config) {
  if (config.show_weather === false) return null;
  const states = hass?.states || {};
  const entityId = config.weather_entity && states[config.weather_entity]
    ? config.weather_entity
    : Object.keys(states).find((id) => id.startsWith("weather."));
  const stateObj = entityId ? states[entityId] : null;
  if (!stateObj || !(stateObj.state in WEATHER_LOOK)) return null;
  const temperature = Number.parseFloat(stateObj.attributes?.temperature);
  return {
    entityId,
    condition: stateObj.state,
    temperature: Number.isFinite(temperature) ? temperature : null,
    unit: stateObj.attributes?.temperature_unit || "°C",
    ...WEATHER_LOOK[stateObj.state],
  };
}

// Panels without optimizers (`panels_per_string`): an estimate per panel
// from the inverter's string power, split evenly over the string's panels,
// and today's PV energy split evenly over all panels. Strings are taken in
// order; a single number applies to every string in use.
function estimatePanels(readings, config, today) {
  const setting = config.panels_per_string;
  const counts = Array.isArray(setting) ? setting.map((n) => Math.round(Number(n)) || 0) : [];
  const each = Math.round(Number(setting)) || 0;
  if (!counts.some((n) => n > 0) && each <= 0) return null;
  const device = (readings || []).find((d) => d.strings.size);
  if (!device) return null;
  let strings = [...device.strings.entries()].sort((a, b) => a[0] - b[0]);
  if (counts.length) strings = strings.slice(0, counts.length);
  else {
    const total = positiveNumber(config.pv_panels);
    const inUse = strings.filter(([, s]) => (s.V?.value ?? 0) > 50 || (s.W?.value ?? 0) > ACTIVE_W);
    strings = total ? strings.slice(0, Math.max(1, Math.round(total / each))) : inUse.length ? inUse : strings;
  }
  const groups = strings.map(([index, s], i) => ({ index, count: counts.length ? counts[i] : each, power: s.W?.value ?? null, entityId: (s.W || s.V || s.A)?.entityId }))
    .filter((g) => g.count > 0);
  const totalPanels = groups.reduce((sum, g) => sum + g.count, 0);
  if (!totalPanels) return null;
  const perPanelToday = isNum(today.solar) ? today.solar / totalPanels : null;
  const maxPer = Math.max(1, ...groups.map((g) => (isNum(g.power) ? g.power / g.count : 0)));
  let n = 0;
  const panelGroups = groups.map((g) => {
    const power = isNum(g.power) ? Math.max(0, g.power) / g.count : null;
    return Array.from({ length: g.count }, () => ({
      serial: `PV${g.index}`,
      name: `#${++n}`,
      entityId: g.entityId,
      today: perPanelToday,
      power,
      share: isNum(power) ? clamp(power / maxPer, 0, 1) : 0,
    }));
  });
  return {
    estimate: true,
    panels: panelGroups.flat(),
    strings: panelGroups,
    stringPower: groups.map((g) => (isNum(g.power) ? Math.max(0, g.power) / g.count : null)),
    median: perPanelToday,
    weakest: null,
    average: perPanelToday,
  };
}

// Status used by themes that show one (LCARS): alert when offline or the
// battery reached its reserve, caution when delayed, close to the reserve,
// a panel is underperforming or the battery is too cold or hot.
function systemStatus(status, forecast, panels, system) {
  if (status.state === "offline" || (isNum(forecast.soc) && forecast.soc <= forecast.minSoc + 1)) return "alert";
  if (status.state === "delayed" || (isNum(forecast.soc) && forecast.soc < forecast.minSoc + 15) || panels?.weakest || system?.batteryWarn) return "warn";
  return "nominal";
}
