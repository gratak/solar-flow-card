
function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function stateNumber(stateObj) {
  if (!stateObj || ["unknown", "unavailable", "none", ""].includes(stateObj.state)) return null;
  const value = Number.parseFloat(stateObj.state);
  return Number.isFinite(value) ? value : null;
}

function stateUnit(stateObj) {
  return stateObj?.attributes?.unit_of_measurement || "";
}

function positiveNumber(value) {
  const number = Number.parseFloat(value);
  return Number.isFinite(number) && number > 0 ? number : null;
}

function isNum(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function formatNumber(value, locale, digits = 1) {
  return value.toLocaleString(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

function formatPower(value, locale) {
  if (!isNum(value)) return "—";
  const absolute = Math.abs(value);
  if (absolute >= 1000) return `${formatNumber(value / 1000, locale, absolute >= 10000 ? 1 : 2)} kW`;
  return `${Math.round(value).toLocaleString(locale)} W`;
}

// Value and unit split, for themes that style them separately.
function powerParts(value, locale) {
  if (!isNum(value)) return ["—", ""];
  const absolute = Math.abs(value);
  if (absolute >= 1000) return [formatNumber(value / 1000, locale, absolute >= 10000 ? 1 : 2), "kW"];
  return [Math.round(value).toLocaleString(locale), "W"];
}

function formatEnergy(value, locale) {
  if (!isNum(value)) return "—";
  return `${formatNumber(value, locale, Math.abs(value) < 10 ? 2 : Math.abs(value) < 1000 ? 1 : 0)} kWh`;
}

function formatPercent(value, locale) {
  if (!isNum(value)) return "—";
  return `${Math.round(value).toLocaleString(locale)}%`;
}

function formatClock(date, locale) {
  return date.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
}

// A forecast time: the clock alone today, with the weekday on another day.
function formatWhen(date, locale) {
  if (date.toDateString() === new Date().toDateString()) return formatClock(date, locale);
  return `${date.toLocaleDateString(locale, { weekday: "short" })} ${formatClock(date, locale)}`;
}

function formatDuration(hours, t) {
  const minutes = Math.max(1, Math.round(hours * 60));
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h >= 48) return `${Math.round(h / 24)} ${t.dayShort}`;
  return h ? `${h} ${t.hourShort} ${m} ${t.minShort}` : `${m} ${t.minShort}`;
}

function startOfDay(date) {
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  return day;
}

function addDays(date, days) {
  const day = new Date(date);
  day.setDate(day.getDate() + days);
  return day;
}

function niceStep(range, ticks) {
  const raw = Math.max(range, 1e-9) / ticks;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const normalized = raw / magnitude;
  return (normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10) * magnitude;
}

// history/history_during_period rows: compressed {s, lu (seconds)} or full
// {state, last_updated}.
function historyPoints(rows) {
  const points = [];
  for (const row of rows || []) {
    const time = row.lu !== undefined ? row.lu * 1000 : Date.parse(row.last_updated || row.last_changed);
    const value = Number.parseFloat(row.s ?? row.state);
    if (Number.isFinite(time) && Number.isFinite(value)) points.push([time, value]);
  }
  return points;
}

// History of a one-way sensor (charge, discharge, import, export): its size
// whatever sign it reports with, and 0 while it reports nothing. Such
// sensors often go "unknown" when nothing flows their way (DeyeCloud), and
// the last reading must not linger on the chart for hours.
function directionPoints(rows) {
  const points = [];
  for (const row of rows || []) {
    const time = row.lu !== undefined ? row.lu * 1000 : Date.parse(row.last_updated || row.last_changed);
    if (!Number.isFinite(time)) continue;
    const value = Number.parseFloat(row.s ?? row.state);
    points.push([time, Number.isFinite(value) ? Math.abs(value) : 0]);
  }
  return points;
}

// Average of the samples in each bucket; a bucket without samples keeps the
// last known value (the recorder only stores changes). Buckets after nowMs
// stay null so today's chart ends at the current time.
function bucketHistory(points, startMs, count, bucketMs, nowMs) {
  const out = new Array(count).fill(null);
  let index = 0;
  let last = null;
  for (let bucket = 0; bucket < count; bucket++) {
    const from = startMs + bucket * bucketMs;
    if (from > nowMs) break;
    const to = from + bucketMs;
    let sum = 0;
    let samples = 0;
    while (index < points.length && points[index][0] < to) {
      if (points[index][0] >= from) {
        sum += points[index][1];
        samples += 1;
      }
      last = points[index][1];
      index += 1;
    }
    out[bucket] = samples ? sum / samples : last;
  }
  return out;
}

function combineSeries(a, b, combine) {
  if (!a || !b) return null;
  return a.map((value, i) => (value === null || b[i] === null ? null : combine(value, b[i])));
}

function linePath(values, x, y) {
  let path = "";
  let open = false;
  values.forEach((value, i) => {
    if (value === null || value === undefined) {
      open = false;
      return;
    }
    path += `${open ? "L" : "M"}${x(i).toFixed(1)} ${y(value).toFixed(1)}`;
    open = true;
  });
  return path;
}

function areaPath(values, x, y, base) {
  let path = "";
  let run = [];
  const flush = () => {
    if (run.length) {
      path += `M${x(run[0]).toFixed(1)} ${base.toFixed(1)}`;
      run.forEach((i) => { path += `L${x(i).toFixed(1)} ${y(values[i]).toFixed(1)}`; });
      path += `L${x(run[run.length - 1]).toFixed(1)} ${base.toFixed(1)}Z`;
    }
    run = [];
  };
  values.forEach((value, i) => {
    if (value === null || value === undefined) flush();
    else run.push(i);
  });
  flush();
  return path;
}

function statStart(value) {
  return typeof value === "number" ? value : Date.parse(value);
}

const THEME_FONTS = {
  diorama: "Nunito:wght@600;700;800",
  aurora: "Space+Grotesk:wght@400;500;700&family=JetBrains+Mono:wght@500;700",
  paper: "Fraunces:opsz,wght@9..144,400;9..144,600&family=Inter:wght@400;500;600",
  lcars: "Antonio:wght@400;600;700",
  atlantis: "Exo+2:wght@200;300;500;700",
  expanse: "Rajdhani:wght@500;600;700&family=Share+Tech+Mono",
  foundation: "Cinzel:wght@400;600&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500",
  galaxy: "Orbitron:wght@500;700&family=Share+Tech+Mono&family=Oswald:wght@500",
  gate: "Rajdhani:wght@500;600;700&family=Share+Tech+Mono",
  reactor: "Rajdhani:wght@500;600;700&family=Orbitron:wght@500;700",
};

// Fonts declared inside a shadow root are ignored, so add the font
// stylesheet to the document once: the theme's Google Fonts with
// `load_fonts: true`, or your own (`font_url`, e.g. a self-hosted CSS in
// /config/www). By default nothing is loaded and the themes use system fonts.
function ensureThemeFonts(config) {
  const custom = typeof config.font_url === "string" && config.font_url.trim();
  const href = custom || (config.load_fonts === true && THEME_FONTS[config.theme]
    ? `https://fonts.googleapis.com/css2?family=${THEME_FONTS[config.theme]}&display=swap` : null);
  if (!href || [...document.querySelectorAll("link[data-solar-flow-card-font]")].some((el) => el.getAttribute("href") === href)) return;
  const link = document.createElement("link");
  link.dataset.solarFlowCardFont = "";
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}
