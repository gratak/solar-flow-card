
const MINI_ICONS = {
  sun: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></svg>',
  home: '<svg viewBox="0 0 24 24"><path d="m3 11 9-8 9 8v10h-6v-6H9v6H3z"/></svg>',
  import: '<svg viewBox="0 0 24 24"><path d="M4 12h14M13 7l5 5-5 5M4 5v14"/></svg>',
  export: '<svg viewBox="0 0 24 24"><path d="M20 12H6M11 7l-5 5 5 5M20 5v14"/></svg>',
  charge: '<svg viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="17" rx="3"/><path d="M9 2h6M12 8v8M8 12h8"/></svg>',
  discharge: '<svg viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="17" rx="3"/><path d="M9 2h6M8 12h8"/></svg>',
  bolt: '<svg viewBox="0 0 24 24"><path d="m13 2-8 12h6l-1 8 9-13h-6z"/></svg>',
  chip: '<svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/></svg>',
  phase: '<svg viewBox="0 0 24 24"><path d="M2 12c2.5-6 5-6 7.5 0s5 6 7.5 0 3.5-4 5-2"/></svg>',
  panel: '<svg viewBox="0 0 24 24"><path d="M4 5h16l-2 10H2z"/><path d="M8 5 6.5 15M14 5l-1 10M3 10h16M11 15v4M7 19h8"/></svg>',
};

const TILE_DEFS = [
  ["solar", "sun", "pvProduction"],
  ["load", "home", "consumption"],
  ["gridImport", "import", "gridImport"],
  ["gridExport", "export", "gridExport"],
  ["charge", "charge", "batteryCharge"],
  ["discharge", "discharge", "batteryDischarge"],
];

function periodLabels(t) {
  return {
    today: ["24H", t.periodToday],
    "3d": ["3D", t.period3d],
    "7d": ["7D", t.period7d],
    month: [t.periodMonthShort, t.periodMonth],
    all: [t.periodAllShort, t.periodAll],
  };
}

function tabsHtml(m) {
  const labels = periodLabels(m.t);
  return `
    <div class="sfc-tabs" role="radiogroup" aria-label="${escapeHtml(m.t.energy)}">
      ${PERIODS.map((period) => `
        <button type="button" role="radio" class="sfc-tab ${period === m.period ? "on" : ""}"
          aria-checked="${period === m.period}" title="${escapeHtml(labels[period][1])}"
          data-period="${period}">${escapeHtml(labels[period][0])}</button>`).join("")}
    </div>`;
}

function tilesHtml(m) {
  return `
    <div class="sfc-tiles">
      ${TILE_DEFS.filter(([name]) => (m.config.showSolar || name !== "solar") && (m.config.showBattery || (name !== "charge" && name !== "discharge"))).map(([name, icon, label]) => {
        const entityId = m.ids.energy[name];
        // Without its own sensor (e.g. consumption worked out from the others)
        // a value shows as usual, it just has nothing to open.
        const computed = !entityId && isNum(m.totals[name]);
        return `
          <button class="sfc-tile ${name}${computed ? " computed" : ""}" ${entityId ? `data-entity="${escapeHtml(entityId)}"` : `disabled${computed ? ` title="${escapeHtml(m.t.computedHint)}"` : ""}`}>
            <span class="sfc-tile-icon">${MINI_ICONS[icon]}</span>
            <span class="sfc-tile-copy">
              <small>${escapeHtml(m.t[label])}</small>
              <strong>${escapeHtml(m.energyLoading && !isNum(m.totals[name]) ? "…" : formatEnergy(m.totals[name], m.locale))}</strong>
            </span>
          </button>`;
      }).join("")}
    </div>`;
}

function summaryHtml(m) {
  if (!m.summary.length) return "";
  return `
    <div class="sfc-summary">
      ${m.summary.map(([kind, label, value]) => `
        <div class="sfc-summary-item ${kind}">
          <small>${escapeHtml(label)}</small>
          <strong>${escapeHtml(value)}</strong>
        </div>`).join("")}
    </div>`;
}

function energySectionHtml(m, { title = true } = {}) {
  if (!m.config.showEnergy) return "";
  const [kicker, label] = periodLabels(m.t)[m.period];
  const hint = m.period === "all" && m.since ? fill(m.t.since, { date: m.since }) : "";
  return `
    <section class="sfc-section sfc-energy">
      ${title ? `
        <div class="sfc-head">
          <div><span class="sfc-kicker">${escapeHtml(kicker)}</span><h3>${escapeHtml(label)}</h3></div>
          ${hint ? `<span class="sfc-hint">${escapeHtml(hint)}</span>` : ""}
        </div>` : ""}
      ${tabsHtml(m)}
      ${m.config.showChart ? chartHtml(m) : ""}
      ${tilesHtml(m)}
      ${summaryHtml(m)}
    </section>`;
}

function forecastHtml(m) {
  const f = m.forecast;
  if (!m.config.showForecast || f.capacity === null || !isNum(f.soc)) return "";
  const { t, locale } = m;
  let headline = t.holding;
  let detail = "";
  if (f.mode === "charging") {
    headline = fill(t.fullIn, { d: formatDuration(f.hours, t) });
    detail = fill(t.fullAt, { time: formatWhen(f.at, locale) });
  } else if (f.mode === "discharging") {
    headline = fill(t.lastsFor, { d: formatDuration(f.hours, t) });
    detail = fill(t.lastsUntil, { time: formatWhen(f.at, locale), soc: formatNumber(f.minSoc, locale, 0) });
  } else if (f.slow) {
    headline = f.slow === "charging" ? t.slowCharge : t.slowDischarge;
    detail = t.slowDetail;
  }
  return `
    <section class="sfc-section sfc-forecast" ${m.ids.live.soc ? `data-entity="${escapeHtml(m.ids.live.soc)}"` : ""}>
      <span class="sfc-forecast-icon">${MINI_ICONS.charge}</span>
      <div class="sfc-forecast-copy">
        <small>${escapeHtml(t.batteryForecast)}</small>
        <strong>${escapeHtml(headline)}</strong>
        ${detail ? `<em>${escapeHtml(detail)}</em>` : ""}
      </div>
      <b class="sfc-forecast-stored">${escapeHtml(fill(t.storedOf, { kwh: formatEnergy(f.stored, locale), cap: formatEnergy(f.capacity, locale) }))}</b>
      <div class="sfc-forecast-bar" aria-hidden="true"><i style="width:${f.soc}%"></i><b style="left:${f.minSoc}%"></b></div>
    </section>`;
}

// Virtual storage (#43): this hour's export minus import, reset at every
// full hour, for tariffs that balance per hour.
function virtualStorageHtml(m) {
  const v = m.virtualStorage;
  if (!v) return "";
  const { t, locale } = m;
  const value = v.value;
  const state = !isNum(value) ? "" : value > 0.0005 ? "surplus" : value < -0.0005 ? "deficit" : "";
  const shown = isNum(value) ? `${value > 0.0005 ? "+" : value < -0.0005 ? "−" : ""}${formatEnergy(Math.abs(value), locale)}` : "—";
  const day = v.day ? fill(t.vsDay, { h: formatNumber(v.day.surplusHours, locale, 0), kwh: formatEnergy(v.day.balanced, locale) }) : "";
  return `
    <section class="sfc-section sfc-vstore ${state}" ${v.entityId ? `data-entity="${escapeHtml(v.entityId)}"` : ""}>
      <span class="sfc-forecast-icon">${MINI_ICONS.charge}</span>
      <div class="sfc-forecast-copy">
        <small>${escapeHtml(t.vsTitle)}</small>
        <strong>${escapeHtml(state === "deficit" ? t.vsDeficit : v.deficit || !state ? t.vsNone : t.vsSurplus)}</strong>
        ${day ? `<em>${escapeHtml(day)}</em>` : ""}
      </div>
      <b class="sfc-forecast-stored sfc-vstore-value">${escapeHtml(shown)}</b>
      <div class="sfc-forecast-bar" aria-hidden="true"><i style="width:${v.progress.toFixed(1)}%"></i></div>
      <span class="sfc-vstore-reset">${escapeHtml(fill(t.vsResetsIn, { m: formatNumber(v.minutesLeft, locale, 0) }))}</span>
    </section>`;
}

function readingLabel(key) {
  return key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/_/g, " ").replace(/\s+/g, " ").trim();
}

function inverterHtml(m) {
  if (!m.inverterOpen) return "";
  const { t, locale } = m;
  const devices = m.inverter || [];
  const reading = (r) => `
    <button class="sfc-reading" data-entity="${escapeHtml(r.entityId)}">
      <small>${escapeHtml(readingLabel(r.key))}</small>
      <b>${escapeHtml(r.text ?? `${formatNumber(r.value, locale, Math.abs(r.value) < 100 ? 1 : 0)} ${r.unit}`.trim())}</b>
    </button>`;
  const group = (title, items) => items.length ? `
    <div class="sfc-group"><h4>${escapeHtml(title)}</h4><div class="sfc-readings">${items.map(reading).join("")}</div></div>` : "";
  const content = devices.length ? devices.map((device) => `
    ${devices.length > 1 && device.serial ? `<h4 class="sfc-serial">${escapeHtml(device.serial)}</h4>` : ""}
    ${device.strings.size ? `
      <div class="sfc-group">
        <h4>${escapeHtml(t.pvStrings)}</h4>
        <div class="sfc-strings">
          ${[...device.strings.entries()].sort((a, b) => a[0] - b[0]).map(([index, s]) => `
            <button class="sfc-string" data-entity="${escapeHtml((s.W || s.V || s.A).entityId)}">
              <span>${escapeHtml(fill(t.stringN, { n: index }))}</span>
              <b>${escapeHtml(s.W ? formatPower(s.W.value, locale) : "—")}</b>
              <small>${escapeHtml([s.V && `${formatNumber(s.V.value, locale, 0)} V`, s.A && `${formatNumber(s.A.value, locale, 1)} A`].filter(Boolean).join(" · "))}</small>
            </button>`).join("")}
        </div>
      </div>` : ""}
    ${group(t.temperatures, device.temperatures)}
    ${group(t.batteryDetails, device.battery)}
    ${group(t.gridDetails, device.grid)}
    ${group(t.otherDetails, device.other || [])}`).join("") : `<p class="sfc-empty-note">${escapeHtml(t.noDetails)}</p>`;
  return `
    <section class="sfc-section sfc-inverter">
      <div class="sfc-head">
        <div><span class="sfc-kicker">${MINI_ICONS.chip}</span><h3>${escapeHtml(t.inverterDetails)}</h3></div>
        ${m.config.wide ? "" : `<button type="button" class="sfc-link" data-action="inverter">${escapeHtml(t.close)}</button>`}
      </div>
      ${content}
    </section>`;
}

function panelsHtml(m) {
  const data = m.panels;
  if (!m.config.showPanels || !m.config.showSolar || !data) return "";
  const { t, locale } = m;
  // Estimated tiles: dashed, marked ≈, with a note on where the numbers come from.
  const est = data.estimate ? "≈ " : "";
  const statsNote = (stats) => `${fill(t.panelAvg, { kwh: formatEnergy(stats.average, locale) })} · ${stats.weakest
    ? fill(t.panelWeak, { name: stats.weakest.name, pct: formatNumber((stats.weakest.today / stats.median) * 100, locale, 0) })
    : t.panelsEven}`;
  const note = data.estimate ? t.panelsEstimateNote : statsNote(data);
  return `
    <section class="sfc-section sfc-panels" id="sfc-panels">
      <div class="sfc-head">
        <div><span class="sfc-kicker">${data.panels.length}×</span><h3>${escapeHtml(t.panelsTitle)}</h3></div>
        <span class="sfc-hint">${escapeHtml(data.estimate ? fill(t.panelsEstimateHint, { energy: formatEnergy(data.average, locale) }) : t.panelsHint)}</span>
      </div>
      ${data.strings.map((string, i) => `
        <div class="sfc-panel-string">
          ${data.strings.length > 1 || data.estimate ? `<small class="sfc-string-label">${escapeHtml(fill(t.stringModules, { n: i + 1, count: string.length }))}${data.estimate && isNum(data.stringPower[i]) ? ` · ${escapeHtml(fill(t.panelEach, { power: formatPower(data.stringPower[i], locale) }))}` : ""}</small>` : ""}
          <div class="sfc-panel-grid" style="--cols:${Math.min(string.length, 8)}">
            ${string.map((panel) => `
              <button class="sfc-panel ${panel.weak ? "weak" : ""} ${data.estimate ? "estimate" : ""}" style="--share:${(panel.share * 100).toFixed(0)}%;--share-n:${panel.share.toFixed(2)}"
                data-entity="${escapeHtml(panel.entityId)}" title="${escapeHtml(panel.serial)}">
                <small>${escapeHtml(panel.name)}</small>
                <strong>${escapeHtml(isNum(panel.today) ? `${est}${formatNumber(panel.today, locale, 2)}` : "—")}</strong>
                <span>${escapeHtml(isNum(panel.power) ? `${est}${formatPower(panel.power, locale)}` : "kWh")}</span>
              </button>`).join("")}
          </div>
          ${data.stringStats ? `<p class="sfc-panels-note ${data.stringStats[i].weakest ? "warn" : ""}">${escapeHtml(statsNote(data.stringStats[i]))}</p>` : ""}
        </div>`).join("")}
      ${data.stringStats ? "" : `<p class="sfc-panels-note ${data.weakest ? "warn" : ""} ${data.estimate ? "estimate" : ""}">${escapeHtml(note)}</p>`}
    </section>`;
}

// Sections every theme shows below its main view.
// Installation: power per phase, inverter load, battery (BMS) and generator.
function systemHtml(m) {
  const bank = m.config.showBattery && m.bank?.items.length > 1 ? m.bank : null;
  if (!m.config.showSystem || !(m.system || bank)) return "";
  const data = { phases: null, inverter: null, battery: [], batteryWarn: null, generator: null, ...m.system };
  if (bank) {
    // The bank's own readings replace the inverter's combined battery ones.
    const temps = bank.items.map((b) => b.temperature).filter(isNum);
    data.battery = [];
    data.batteryWarn = temps.some((v) => v < BATTERY_COLD) ? "cold" : temps.some((v) => v > BATTERY_HOT) ? "hot" : data.batteryWarn;
  }
  const { t, locale } = m;
  const attr = (entityId) => (entityId ? `data-entity="${escapeHtml(entityId)}"` : "");
  // Each battery of a bank: charge with a bar, then power, voltage and temperature.
  const batteries = bank ? `
    <div class="sfc-phases sfc-bank" style="--n:${Math.min(bank.items.length, 3)}">
      ${bank.items.map((b) => `
        <button class="sfc-phase sfc-bat" ${attr(b.entityId)}>
          <small>${escapeHtml(b.name)}</small>
          <strong>${escapeHtml(formatPercent(b.soc, locale))}</strong>
          <i style="--p:${isNum(b.soc) ? clamp(b.soc, 0, 100).toFixed(0) : 0}%"></i>
          <span>${escapeHtml([
            isNum(b.power) && (Math.abs(b.power) <= ACTIVE_W ? t.idle : `${b.power > 0 ? "−" : "+"}${formatPower(Math.abs(b.power), locale)}`),
            isNum(b.voltage) && `${formatNumber(b.voltage, locale, 1)} V`,
            isNum(b.temperature) && `${formatNumber(b.temperature, locale, 1)} °C`,
            b.capacity && formatEnergy(b.capacity, locale),
          ].filter(Boolean).join(" · "))}</span>
        </button>`).join("")}
    </div>` : "";
  const phases = data.phases ? `
    <div class="sfc-phases" style="--n:${data.phases.length}">
      ${data.phases.map((p) => `
        <button class="sfc-phase ${p.main === "grid" && isNum(p.grid) ? (p.grid < -ACTIVE_W ? "export" : p.grid > ACTIVE_W ? "import" : "") : ""}" ${attr(p.entityId)}>
          <small>${escapeHtml(p.main === "grid" ? `${p.name} · ${t.grid}` : p.name)}</small>
          <strong>${escapeHtml(formatPower(p.main === "grid" ? p.grid : p.load, locale))}</strong>
          <i style="--p:${(() => { const v = p.main === "grid" ? Math.abs(p.grid ?? 0) : p.load; return isNum(v) ? ((v / data.phaseMax) * 100).toFixed(0) : 0; })()}%"></i>
          <span>${escapeHtml([p.main !== "grid" && isNum(p.grid) && fill(t.phaseGrid, { power: formatPower(p.grid, locale) }), isNum(p.voltage) && `${formatNumber(p.voltage, locale, 0)} V`].filter(Boolean).join(" · "))}</span>
        </button>`).join("")}
    </div>` : "";
  const labels = { temperature: t.batteryTemperature, voltage: t.batteryVoltage, current: t.batteryCurrent };
  const meters = [
    data.inverter && `
      <button class="sfc-meter inverter" ${attr(data.inverter.entityId)}>
        <small>${escapeHtml(t.inverterLoad)}</small>
        <b>${escapeHtml(isNum(data.inverter.share) ? formatPercent(data.inverter.share, locale) : formatPower(data.inverter.power, locale))}</b>
        ${isNum(data.inverter.share) ? `<i style="--p:${data.inverter.share.toFixed(0)}%"></i><span>${escapeHtml(fill(t.inverterOf, { power: formatPower(data.inverter.power, locale), rated: formatPower(data.inverter.rated, locale) }))}</span>` : ""}
      </button>`,
    ...data.battery.map((r) => `
      <button class="sfc-meter battery ${r.kind === "temperature" && data.batteryWarn ? "warn" : ""}" ${attr(r.entityId)}>
        <small>${escapeHtml(labels[r.kind])}</small>
        <b>${escapeHtml(`${formatNumber(r.value, locale, 1)} ${r.unit}`)}</b>
      </button>`),
    data.generator && `
      <button class="sfc-meter generator on" ${attr(data.generator.entityId)}>
        <small>${escapeHtml(t.generatorRunning)}</small>
        <b>${escapeHtml(formatPower(data.generator.power, locale))}</b>
      </button>`,
  ].filter(Boolean).join("");
  const warn = data.batteryWarn ? `<p class="sfc-panels-note warn">${escapeHtml(data.batteryWarn === "cold" ? t.batteryCold : t.batteryHot)}</p>` : "";
  return `
    <section class="sfc-section sfc-system">
      <div class="sfc-head">
        <div><span class="sfc-kicker">${MINI_ICONS.phase}</span><h3>${escapeHtml(t.systemTitle)}</h3></div>
        ${isNum(data.phaseSpread) && data.phases ? `<span class="sfc-hint">${escapeHtml(fill(t.phaseSpread, { power: formatPower(data.phaseSpread, locale) }))}</span>` : ""}
      </div>
      ${batteries}
      ${phases}
      ${meters ? `<div class="sfc-meters">${meters}</div>` : ""}
      ${warn}
    </section>`;
}

// Today at a glance and the comparison table.
function insightsHtml(m) {
  const data = m.insights;
  if (!data?.day) return "";
  const { t, locale } = m;
  const d = data.day;
  const kv = (cls, label, value, note) => `<div class="sfc-insight ${cls}"><small>${escapeHtml(label)}</small><b>${escapeHtml(value)}</b>${note ? `<span>${escapeHtml(note)}</span>` : ""}</div>`;
  const tiles = d ? [
    m.config.showSolar && d.solarPeak && kv("pv", t.peakSolar, formatPower(d.solarPeak.value, locale), fill(t.atTime, { time: formatClock(d.solarPeak.at, locale) })),
    d.loadPeak && kv("load", t.peakLoad, formatPower(d.loadPeak.value, locale), fill(t.atTime, { time: formatClock(d.loadPeak.at, locale) })),
    m.config.showBattery && isNum(d.socMin) && kv("battery", t.socRange, `${formatNumber(d.socMin, locale, 0)}–${formatPercent(d.socMax, locale)}`, ""),
    m.config.showBattery && isNum(d.cycles) && kv("battery", t.batteryCycles, formatNumber(d.cycles, locale, 2), ""),
    isNum(d.offGridMinutes) && kv("grid", t.offGrid, formatDuration(d.offGridMinutes / 60, t), ""),
  ].filter(Boolean).join("") : "";
  return tiles ? `
    <section class="sfc-section sfc-insights">
      <div class="sfc-head"><div><span class="sfc-kicker">${MINI_ICONS.bolt}</span><h3>${escapeHtml(t.insightsTitle)}</h3></div></div>
      <div class="sfc-insight-grid">${tiles}</div>
    </section>` : "";
}

function compareTableRows(m) {
  return (m.insights?.compare || []).filter((row) => m.config.showSolar || row.name !== "solar");
}

// Today compared with yesterday, the 7-day average and this month.
function comparisonHtml(m) {
  const rows = compareTableRows(m);
  if (!rows.length) return "";
  const { t, locale } = m;
  const labels = { solar: t.pvProduction, load: t.consumption, gridImport: t.gridImport, gridExport: t.gridExport };
  const cell = (v) => `<td>${escapeHtml(isNum(v) ? formatNumber(v, locale, v < 10 ? 1 : 0) : "—")}</td>`;
  const trend = (row) => {
    if (!isNum(row.today) || !isNum(row.yesterday) || row.yesterday < 0.05) return "<td></td>";
    const pct = ((row.today - row.yesterday) / row.yesterday) * 100;
    // More production or export is good news, more consumption or import is not.
    const good = (pct >= 0) === (row.name === "solar" || row.name === "gridExport");
    return `<td class="${good ? "good" : "bad"}">${pct >= 0 ? "▲" : "▼"} ${escapeHtml(formatNumber(Math.abs(pct), locale, 0))}%</td>`;
  };
  return `
    <section class="sfc-section sfc-compare">
      <div class="sfc-head"><div><span class="sfc-kicker">kWh</span><h3>${escapeHtml(t.compareTitle)}</h3></div></div>
      <div class="sfc-compare-scroll"><table class="sfc-compare-table">
        <thead><tr><th></th><th>${escapeHtml(t.periodToday)}</th><th>${escapeHtml(t.colYesterday)}</th><th></th><th>${escapeHtml(t.colAvg7)}</th><th>${escapeHtml(t.colMonth)}</th></tr></thead>
        <tbody>${rows.map((row) => `<tr class="${row.name}"><th><i></i>${escapeHtml(labels[row.name])}</th>${cell(row.today)}${cell(row.yesterday)}${trend(row)}${cell(row.average)}${cell(row.month)}</tr>`).join("")}</tbody>
      </table></div>
    </section>`;
}

// The sections below a theme's main view, and the `sections:` option that
// picks and orders them. `flow`, `today` and `sources` are parts of the
// themes' main view (the last two in Diorama).
const SECTION_HTML = {
  inverter: inverterHtml,
  forecast: forecastHtml,
  virtual_storage: virtualStorageHtml,
  system: systemHtml,
  energy: energySectionHtml,
  insights: insightsHtml,
  comparison: comparisonHtml,
  panels: panelsHtml,
};
const SECTION_IDS = ["flow", "today", "sources", ...Object.keys(SECTION_HTML)];
const SECTION_ORDER = ["inverter", "forecast", "virtual_storage", "system", "energy", "insights", "comparison", "panels"];
const SECTION_ORDER_WIDE = ["energy", "inverter", "forecast", "virtual_storage", "insights", "comparison", "system", "panels"];

// The listed sections in order, or null without the option.
function sectionList(config) {
  if (!Array.isArray(config.sections)) return null;
  return [...new Set(config.sections.map((id) => String(id).trim().toLowerCase()).filter((id) => SECTION_IDS.includes(id)))];
}

function sectionShown(m, id) {
  return !m.sections || m.sections.includes(id);
}

function sectionOrder(m, defaults) {
  return m.sections ? m.sections.filter((id) => SECTION_HTML[id]) : defaults;
}

// What a collapsed section still shows: its title and one key value.
function foldSummary(m, id) {
  const { t, locale } = m;
  if (id === "energy") {
    const solar = m.config.showSolar && isNum(m.totals.solar);
    return [periodLabels(t)[m.period][1], solar ? t.pvProduction : t.consumption, formatEnergy(solar ? m.totals.solar : m.totals.load, locale)];
  }
  if (id === "forecast") return [t.batteryForecast, t.battery, formatPercent(m.forecast.soc, locale)];
  if (id === "virtual_storage") {
    const v = m.virtualStorage?.value;
    return [t.vsTitle, "", isNum(v) ? `${v > 0.0005 ? "+" : v < -0.0005 ? "−" : ""}${formatEnergy(Math.abs(v), locale)}` : "—"];
  }
  if (id === "system") {
    const inv = m.system?.inverter;
    return isNum(inv?.share) ? [t.systemTitle, t.inverterLoad, formatPercent(inv.share, locale)] : [t.systemTitle, "", ""];
  }
  if (id === "insights") {
    const peak = m.insights?.day?.solarPeak;
    return peak && m.config.showSolar ? [t.insightsTitle, t.peakSolar, formatPower(peak.value, locale)] : [t.insightsTitle, "", ""];
  }
  if (id === "comparison") {
    const row = compareTableRows(m)[0];
    const names = { solar: t.pvProduction, load: t.consumption, gridImport: t.gridImport, gridExport: t.gridExport };
    return row ? [t.compareTitle, names[row.name], formatEnergy(row.today, locale)] : [t.compareTitle, "", ""];
  }
  if (id === "panels") return [t.panelsTitle, "", isNum(m.panels?.average) ? fill(t.panelAvg, { kwh: formatEnergy(m.panels.average, locale) }) : ""];
  return null;
}

// `collapsible: true`: the section's title folds it. A collapsed section
// becomes one line with its title and key value.
function foldable(m, id, html) {
  if (!m.config.collapsible || !html.trim() || id === "inverter") return html;
  if (m.collapsed.has(id)) {
    const [title, label, value] = foldSummary(m, id);
    return `
    <section class="sfc-section sfc-folded" data-fold="${id}">
      <button type="button" class="sfc-fold-head" data-fold-toggle="${id}" aria-expanded="false">
        <span>${escapeHtml(title)}</span>${value ? `<b>${label ? `<small>${escapeHtml(label)}</small> ` : ""}${escapeHtml(value)}</b>` : ""}<i aria-hidden="true"></i>
      </button>
    </section>`;
  }
  const toggle = `data-fold-toggle="${id}" role="button" tabindex="0" aria-expanded="true"`;
  if (html.includes('<div class="sfc-head">')) return html.replace('<div class="sfc-head">', `<div class="sfc-head sfc-foldable" ${toggle}>`);
  // The forecast and the virtual storage: their small title folds them.
  return html.replace("<small>", `<small class="sfc-foldable" ${toggle}>`);
}

function sectionHtml(m, id) {
  return SECTION_HTML[id] ? foldable(m, id, SECTION_HTML[id](m)) : "";
}

// `defaults`: a theme's own set and order, `exclude`: sections the theme
// places itself (Gate: the energy section; it shows the battery on its dial).
function standardSections(m, defaults, exclude = []) {
  if (m.config.wide && !defaults) {
    // Wide: the energy section leads across the full width, the rest flow
    // into balanced columns below it.
    const rest = sectionOrder(m, SECTION_ORDER_WIDE).filter((id) => id !== "energy");
    return `${sectionShown(m, "energy") ? sectionHtml(m, "energy") : ""}<div class="sfc-wide-rest">${rest.map((id) => sectionHtml(m, id)).join("")}</div>`;
  }
  return sectionOrder(m, defaults || SECTION_ORDER).filter((id) => !exclude.includes(id)).map((id) => sectionHtml(m, id)).join("");
}

// ---------------------------------------------------------------------------
// Chart: power over the day for 24H / 3D (recorder history), energy bars for
// 7D / month / all (long-term statistics).
// ---------------------------------------------------------------------------

function chartHtml(m) {
  const chart = m.chart;
  if (!chart) return "";
  let body;
  if (chart.data?.kind === "power" && ["solar", "load", "battery", "grid"].some((k) => chart.data[k]?.some((v) => v !== null))) {
    body = powerChartHtml(chart.data, m.t, m.locale, m.hiddenSeries);
  } else if (chart.data?.kind === "energy" && chart.data.buckets?.some((b) => b.solar || b.load)) {
    body = energyChartHtml(chart.data, m.t, m.locale, m.hiddenSeries);
  } else {
    const message = chart.loading ? m.t.chartLoading : chart.error ? m.t.chartError : m.t.chartEmpty;
    body = `<div class="sfc-chart-empty">${escapeHtml(message)}</div>`;
  }
  return `<div class="sfc-chart ${chart.loading ? "loading" : ""}">${body}</div>`;
}

// Legend entries are buttons: a click hides or shows that series.
function chartFrame(legend, svg, yLabels, xLabels, hint, hidden) {
  return `
    <div class="sfc-legend">${legend.map(([kind, label]) => `
      <button type="button" class="${kind} ${hidden.has(kind) ? "off" : ""}" data-series="${kind}" aria-pressed="${!hidden.has(kind)}"><i></i>${escapeHtml(label)}</button>`).join("")}</div>
    <div class="sfc-plot">
      ${svg}
      ${yLabels}
      <i class="sfc-cursor" hidden></i>
      <div class="sfc-tip" hidden></div>
    </div>
    <div class="sfc-xaxis">${xLabels}</div>
    ${hint ? `<p class="sfc-chart-hint">${escapeHtml(hint)}</p>` : ""}`;
}

function powerChartHtml(source, t, locale, hidden) {
  const { spec } = source;
  // Hidden series are left out of the drawing and of the scale.
  const show = (kind, series) => (series && !hidden.has(kind) ? series : null);
  const data = {
    solar: show("pv", source.solar),
    load: show("load", source.load),
    battery: show("battery", source.battery),
    grid: show("grid", source.grid),
    soc: show("soc", source.soc),
  };
  const W = 1000;
  const H = 300;
  const signed = [data.battery, data.grid].filter(Boolean).flat().filter((v) => v !== null);
  const positive = [data.solar, data.load].filter(Boolean).flat().filter((v) => v !== null);
  const maxValue = Math.max(100, ...positive, ...signed);
  const minValue = Math.min(0, ...signed);
  const step = niceStep(maxValue - minValue, 4);
  const top = Math.ceil(maxValue / step) * step;
  const bottom = Math.floor(minValue / step) * step;
  const y = (v) => H - ((v - bottom) / (top - bottom)) * H;
  const x = (i) => ((i + 0.5) / spec.count) * W;
  const zero = y(0);
  const ticks = [];
  for (let v = bottom; v <= top + step / 2; v += step) ticks.push(v);
  const xLabels = [];
  if (spec.period === "today") {
    for (let hour = 0; hour <= 24; hour += 6) xLabels.push([hour / 24, `${String(hour).padStart(2, "0")}:00`]);
  } else {
    const span = spec.axisEnd - spec.start;
    for (let day = new Date(spec.start); day < spec.axisEnd; day = addDays(day, 1)) {
      xLabels.push([(day - spec.start) / span, day.toLocaleDateString(locale, { weekday: "short" })]);
    }
  }
  const socY = (v) => H - (clamp(v, 0, 100) / 100) * H;
  const legend = [
    ["pv", t.legendPv, source.solar],
    ["load", t.legendLoad, source.load],
    ["battery", t.legendBattery, source.battery],
    ["grid", t.legendGrid, source.grid],
    ["soc", t.legendSoc, source.soc],
  ].filter(([, , series]) => series);
  const svg = `
    <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">
      ${ticks.map((v) => `<line class="sfc-gridline ${v === 0 ? "zero" : ""}" x1="0" x2="${W}" y1="${y(v).toFixed(1)}" y2="${y(v).toFixed(1)}" />`).join("")}
      ${data.solar ? `<path class="sfc-area pv" d="${areaPath(data.solar, x, y, zero)}" />` : ""}
      ${data.battery ? `<path class="sfc-area battery" d="${areaPath(data.battery, x, y, zero)}" />` : ""}
      ${data.solar ? `<path class="sfc-line pv" d="${linePath(data.solar, x, y)}" />` : ""}
      ${data.battery ? `<path class="sfc-line battery" d="${linePath(data.battery, x, y)}" />` : ""}
      ${data.grid ? `<path class="sfc-line grid" d="${linePath(data.grid, x, y)}" />` : ""}
      ${data.load ? `<path class="sfc-line load" d="${linePath(data.load, x, y)}" />` : ""}
      ${data.soc ? `<path class="sfc-line soc" d="${linePath(data.soc, x, socY)}" />` : ""}
    </svg>`;
  return chartFrame(
    legend,
    svg,
    ticks.map((v) => `<span class="sfc-ylabel" style="top:${((y(v) / H) * 100).toFixed(2)}%">${escapeHtml(formatPower(v, locale))}</span>`).join(""),
    xLabels.map(([pos, label]) => `<span style="left:${(pos * 100).toFixed(2)}%">${escapeHtml(label)}</span>`).join(""),
    t.chartPowerHint,
    hidden
  );
}

function energyChartHtml(data, t, locale, hidden) {
  const { buckets, spec } = data;
  const W = 1000;
  const H = 300;
  const available = [["solar", "pv"], ["load", "load"], ["gridImport", "grid"]].filter(([key]) => !data.noSolar || key !== "solar");
  const kinds = available.filter(([, cls]) => !hidden.has(cls));
  const maxValue = Math.max(0.1, ...buckets.flatMap((b) => kinds.map(([k]) => b[k] || 0)));
  const step = niceStep(maxValue, 4);
  const top = Math.ceil(maxValue / step) * step;
  const y = (v) => H - (v / top) * H;
  const groupWidth = W / buckets.length;
  const barWidth = Math.max(1, (groupWidth * 0.78) / Math.max(1, kinds.length));
  const ticks = [];
  for (let v = 0; v <= top + step / 2; v += step) ticks.push(v);
  const label = (start, i) => {
    if (spec.period === "3d" || spec.period === "7d") return start.toLocaleDateString(locale, { weekday: "short" });
    if (spec.period === "month") {
      const day = start.getDate();
      return day === 1 || day % 5 === 0 ? String(day) : "";
    }
    if (buckets.length <= 12 || start.getMonth() % 3 === 0) {
      return start.getMonth() === 0 || i === 0
        ? start.toLocaleDateString(locale, { month: "short", year: "2-digit" })
        : start.toLocaleDateString(locale, { month: "short" });
    }
    return "";
  };
  const svg = `
    <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">
      ${ticks.map((v) => `<line class="sfc-gridline ${v === 0 ? "zero" : ""}" x1="0" x2="${W}" y1="${y(v).toFixed(1)}" y2="${y(v).toFixed(1)}" />`).join("")}
      ${buckets.map((bucket, i) => kinds.map(([key, cls], k) => {
        const value = bucket[key] || 0;
        const left = i * groupWidth + groupWidth * 0.11 + k * barWidth;
        return value > 0
          ? `<rect class="sfc-bar ${cls}" x="${left.toFixed(1)}" y="${y(value).toFixed(1)}" width="${(barWidth * 0.9).toFixed(1)}" height="${(H - y(value)).toFixed(1)}" />`
          : "";
      }).join("")).join("")}
    </svg>`;
  return chartFrame(
    [["pv", t.pvProduction], ["load", t.consumption], ["grid", t.gridImport]].filter(([kind]) => !data.noSolar || kind !== "pv"),
    svg,
    ticks.map((v) => `<span class="sfc-ylabel" style="top:${((y(v) / H) * 100).toFixed(2)}%">${escapeHtml(formatNumber(v, locale, step < 1 ? 1 : 0))} kWh</span>`).join(""),
    buckets.map((bucket, i) => {
      const text = label(bucket.start, i);
      return text ? `<span style="left:${(((i + 0.5) / buckets.length) * 100).toFixed(2)}%">${escapeHtml(text)}</span>` : "";
    }).join(""),
    "",
    hidden
  );
}

function chartTipHtml(data, index, t, locale, hidden) {
  if (data.kind === "power") {
    const { spec } = data;
    if (index < 0 || index >= spec.count) return null;
    const at = new Date(spec.start.getTime() + index * spec.bucketMs);
    const rows = [
      ["pv", t.legendPv, data.solar],
      ["load", t.legendLoad, data.load],
      ["battery", t.legendBattery, data.battery],
      ["grid", t.legendGrid, data.grid],
    ].filter(([kind, , series]) => series && !hidden.has(kind) && series[index] !== null);
    if (!rows.length) return null;
    const time = spec.period === "today"
      ? formatClock(at, locale)
      : `${at.toLocaleDateString(locale, { weekday: "short" })} ${formatClock(at, locale)}`;
    const soc = hidden.has("soc") ? null : data.soc?.[index];
    return `<strong>${escapeHtml(time)}</strong>
      ${rows.map(([kind, label, series]) => `<span class="${kind}"><i></i>${escapeHtml(label)}<b>${escapeHtml(formatPower(series[index], locale))}</b></span>`).join("")}
      ${isNum(soc) ? `<span class="soc"><i></i>${escapeHtml(t.legendSoc)}<b>${escapeHtml(formatPercent(soc, locale))}</b></span>` : ""}`;
  }
  const bucket = data.buckets[index];
  if (!bucket) return null;
  const title = data.spec.statPeriod === "month"
    ? bucket.start.toLocaleDateString(locale, { month: "long", year: "numeric" })
    : bucket.start.toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short" });
  const rows = [
    ["pv", t.pvProduction, data.noSolar ? undefined : bucket.solar],
    ["load", t.consumption, bucket.load],
    ["grid", t.gridImport, bucket.gridImport],
    ["export", t.gridExport, bucket.gridExport],
    ["battery", t.batteryCharge, bucket.charge],
    ["battery", t.batteryDischarge, bucket.discharge],
  ].filter(([kind, , value]) => value !== undefined && !hidden.has(kind));
  return `<strong>${escapeHtml(title)}</strong>
    ${rows.map(([kind, label, value]) => `<span class="${kind}"><i></i>${escapeHtml(label)}<b>${escapeHtml(formatEnergy(value, locale))}</b></span>`).join("")}`;
}

function wireChart(root, data, t, locale, hidden) {
  const plot = root.querySelector(".sfc-plot");
  if (!plot || !data) return;
  const cursor = plot.querySelector(".sfc-cursor");
  const tip = plot.querySelector(".sfc-tip");
  const count = data.kind === "power" ? data.spec.count : data.buckets.length;
  const hide = () => {
    cursor.hidden = true;
    tip.hidden = true;
  };
  const show = (event) => {
    const box = plot.getBoundingClientRect();
    const index = Math.floor(clamp((event.clientX - box.left) / box.width, 0, 0.9999) * count);
    const html = chartTipHtml(data, index, t, locale, hidden);
    if (!html) return hide();
    const left = ((index + 0.5) / count) * 100;
    cursor.hidden = false;
    cursor.style.left = `${left}%`;
    tip.hidden = false;
    tip.innerHTML = html;
    tip.classList.toggle("flip", left > 55);
    tip.style.left = `${left}%`;
  };
  plot.addEventListener("pointermove", show);
  plot.addEventListener("pointerdown", show);
  plot.addEventListener("pointerleave", hide);
}

function powerSpec(period) {
  const now = new Date();
  const start = startOfDay(period === "3d" ? addDays(now, -2) : now);
  const axisEnd = period === "3d" ? now : addDays(start, 1);
  const bucketMs = (period === "3d" ? 15 : 5) * 60000;
  return { period, start, axisEnd, bucketMs, count: Math.max(1, Math.ceil((axisEnd - start) / bucketMs)), ttl: 5 * 60000 };
}

async function loadPowerHistory(hass, spec, live) {
  const sources = Object.fromEntries(
    ["solar", "load", "battery", "charge", "discharge", "gridImport", "gridExport", "grid", "soc", ...Object.keys(live).filter((name) => name.startsWith("bank_"))]
      .map((name) => [name, live[name]?.entityId])
      .filter(([, id]) => id)
  );
  const nowMs = Date.now();
  const response = await hass.callWS({
    type: "history/history_during_period",
    start_time: spec.start.toISOString(),
    end_time: new Date(nowMs).toISOString(),
    entity_ids: [...new Set(Object.values(sources))],
    minimal_response: true,
    no_attributes: true,
    significant_changes_only: false,
  });
  const series = {};
  for (const [name, entityId] of Object.entries(sources)) {
    // Power history in W, whatever unit the sensor reports (% stays as is).
    const scale = unitScale(live[name]?.stateObj, POWER_SCALE);
    series[name] = bucketHistory(historyPoints(response?.[entityId]).map(([t, v]) => [t, v * scale]), spec.start.getTime(), spec.count, spec.bucketMs, nowMs);
  }
  return { series };
}
