
// Each theme renders the whole card body: its own main view plus the shared
// sections (styled by the theme's CSS).

function entityAttr(entityId) {
  return entityId ? `data-entity="${escapeHtml(entityId)}"` : "";
}

function liveBadge(m) {
  const state = m.status.state;
  return `<span class="sfc-badge ${state}"><i></i>${escapeHtml(m.t[state])}</span>`;
}

function gridEntityId(m) {
  const ids = m.ids.live;
  if (m.live.importActive) return ids.gridImport || ids.grid;
  if (m.live.exportActive) return ids.gridExport || ids.grid;
  return ids.grid || ids.gridImport || ids.gridExport;
}

function batteryEntityId(m) {
  return m.ids.live.soc || m.ids.live.battery || m.ids.live.discharge;
}

function batteryStatus(m) {
  return m.live.chargeActive ? m.t.charging : m.live.dischargeActive ? m.t.discharging : m.t.idle;
}

function gridStatus(m) {
  return m.live.importActive ? m.t.importing : m.live.exportActive ? m.t.exporting : m.t.balanced;
}

function batteryWhen(m) {
  const f = m.forecast;
  if (f.mode === "charging") return { label: m.t.chipFull, value: formatWhen(f.at, m.locale) };
  if (f.mode === "discharging") return { label: m.t.chipLasts, value: formatWhen(f.at, m.locale) };
  if (isNum(f.stored)) return { label: m.t.chipStored, value: formatEnergy(f.stored, m.locale) };
  return { label: m.t.battery, value: formatPercent(f.soc, m.locale) };
}

// The inverter at the centre of a theme: its measured output when known,
// otherwise what it delivers from the panels and the battery.
function inverterHub(m) {
  const inverter = m.system?.inverter;
  if (inverter) return { power: Math.abs(inverter.power), share: inverter.share };
  const { live } = m;
  return { power: Math.max(0, live.solar + live.discharge - live.charge), share: null };
}

// Battery label for a theme's battery node: "Battery 37%".
function batteryLabel(m) {
  return isNum(m.live.soc) ? `${m.t.battery} ${formatPercent(m.live.soc, m.locale)}` : m.t.battery;
}

// When the battery will be full or reach the reserve, with an arrow.
function batteryWhenShort(m) {
  const f = m.forecast;
  return f.at ? `${f.mode === "charging" ? "▲" : "▼"} ${formatWhen(f.at, m.locale)}` : "";
}

function clockText(m) {
  return formatClock(m.now, m.locale);
}

function flowPath(d, active, reverse, cls, extra = "") {
  return `<path class="sfc-flow-base ${cls}" d="${d}" ${extra}/>`
    + (active ? `<path class="sfc-flow ${cls} ${reverse ? "rev" : ""}" d="${d}" ${extra}/>` : "");
}

// --------------------------------------------------------------------------
// Diorama: an isometric house whose sky follows the time of day.
// --------------------------------------------------------------------------

function dioramaSky(now) {
  const h = now.getHours() + now.getMinutes() / 60;
  if (h < 5.5 || h >= 21) return { phase: "night", sky: ["#0b1630", "#253563"], ground: ["#4a6b57", "#3a5747", "#2f4a3b"] };
  if (h < 8) return { phase: "dawn", sky: ["#f2a07a", "#fde3c4"], ground: ["#bfe3c6", "#a9d6b2", "#98c9a2"] };
  if (h < 17.5) return { phase: "day", sky: ["#7fc3f0", "#bfe4f8"], ground: ["#bfe3c6", "#a9d6b2", "#98c9a2"] };
  return { phase: "dusk", sky: ["#e7855c", "#f6c48d"], ground: ["#b3d6b6", "#9bc8a3", "#8bbb94"] };
}

function dioramaScene(m) {
  const S = 26;
  const CX = 250;
  const CY = 205;
  const P = (x, y, z = 0) => [CX + (x - y) * S * 0.866, CY + (x + y) * S * 0.5 - z * S];
  const pts = (...ps) => ps.map((p) => P(...p).map((v) => v.toFixed(1)).join(",")).join(" ");
  const poly = (fill, ...ps) => `<polygon points="${pts(...ps)}" fill="${fill}"/>`;
  const box = (x, y, w, d, h, top, left, right, z = 0) =>
    poly(left, [x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h])
    + poly(right, [x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h])
    + poly(top, [x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]);
  const sky = dioramaSky(m.now);
  const night = sky.phase === "night";
  const h = m.now.getHours() + m.now.getMinutes() / 60;
  let g = "";
  const w = m.weather;
  const clear = !w || w.sun !== false;
  // Overcast skies turn grey.
  if (w?.grey) g += `<rect x="0" y="0" width="520" height="360" fill="${night ? "#0a0f1c" : "#8d99a8"}" opacity="${w.grey}"/>`;
  if (night) {
    if (clear) {
      const stars = [[40, 30], [90, 70], [150, 24], [210, 52], [300, 28], [360, 64], [460, 36], [500, 80], [120, 110], [260, 96]];
      g += stars.map(([x, y], i) => `<circle class="dio-star" style="--d:${(i * 0.7) % 4}s" cx="${x}" cy="${y}" r="${i % 3 ? 1.2 : 1.8}" fill="#fff" opacity="${0.5 + (i % 4) * 0.12}"/>`).join("");
      g += '<circle cx="430" cy="62" r="17" fill="#f4f1dc"/><circle cx="438" cy="56" r="15" fill="#253563" opacity=".9"/>';
    }
  } else if (clear) {
    const p = clamp((h - 6) / 14, 0, 1);
    const sx = 70 + p * 380;
    const sy = 140 - Math.sin(Math.PI * p) * 100;
    g += `<circle class="dio-glow" cx="${sx.toFixed(0)}" cy="${sy.toFixed(0)}" r="44" fill="#ffe27a" opacity=".22"/><circle cx="${sx.toFixed(0)}" cy="${sy.toFixed(0)}" r="26" fill="#ffe27a"/>`;
  }
  // Clouds drift across the sky; more and darker ones in bad weather.
  const cloudCount = w ? w.clouds : night ? 0 : 3;
  const cloudFill = w?.grey ? (night ? "#4a5468" : "#dfe4ea") : night ? "#5a6886" : "#fff";
  // Heights and sizes; the drift spreads them across the sky.
  const cloudSpots = [[70, 1], [48, 1.3], [105, 0.8], [88, 1.1], [36, 1.4], [122, 0.9]];
  for (let i = 0; i < cloudCount; i++) {
    const [y, k] = cloudSpots[i];
    const x = 0;
    const speed = (w?.wind ? 40 : 90) + i * 17;
    g += `<g class="dio-cloud" style="--t:${speed}s;--d:${loopPhase(speed, speed * (0.2 + (0.6 * i) / cloudCount))}" fill="${cloudFill}" opacity="${w?.grey ? 0.95 : 0.85}">
      <g transform="translate(${x} ${y}) scale(${k})"><ellipse cx="0" cy="0" rx="34" ry="12"/><ellipse cx="18" cy="-8" rx="22" ry="12"/><ellipse cx="-16" cy="-4" rx="16" ry="9"/></g></g>`;
  }
  if (w?.rain) {
    const drops = w.rain > 1 ? 70 : 36;
    g += `<g class="dio-rain ${w.rain > 1 ? "heavy" : ""}" stroke="${night ? "#7f95c2" : "#7d93ad"}" stroke-width="1.4" stroke-linecap="round">`
      + Array.from({ length: drops }, (_, i) => {
        const x = (i * 137) % 540 - 10;
        const y = (i * 61) % 260;
        return `<line style="--d:-${((i * 0.37) % 1.2).toFixed(2)}s" x1="${x}" y1="${y}" x2="${x - 4}" y2="${y + 12}"/>`;
      }).join("") + "</g>";
  }
  if (w?.snow) {
    g += '<g class="dio-snow" fill="#fff">' + Array.from({ length: 40 }, (_, i) => {
      const x = (i * 131) % 520;
      const y = (i * 53) % 260;
      return `<circle style="--d:-${((i * 0.53) % 6).toFixed(2)}s" cx="${x}" cy="${y}" r="${i % 3 ? 1.6 : 2.4}"/>`;
    }).join("") + "</g>";
  }
  if (w?.fog) {
    g += '<g class="dio-fog" fill="#eef1f4">'
      + [[60, 150], [200, 185], [360, 165], [120, 230]].map(([x, y], i) => `<rect style="--d:-${i * 5}s" x="${x - 150}" y="${y}" width="300" height="18" rx="9" opacity=".45"/>`).join("")
      + "</g>";
  }
  if (w?.lightning) g += '<rect class="dio-flash" x="0" y="0" width="520" height="360" fill="#fff"/>';
  g += poly(sky.ground[0], [-4, -3, 0], [7, -3, 0], [7, 6, 0], [-4, 6, 0]);
  g += poly(sky.ground[1], [-4, 6, 0], [7, 6, 0], [7, 6, -0.35], [-4, 6, -0.35]);
  g += poly(sky.ground[2], [7, -3, 0], [7, 6, 0], [7, 6, -0.35], [7, -3, -0.35]);
  // House, clickable for the inverter details.
  const windows = night ? "#ffd86b" : "#9fd3f5";
  g += `<g class="sfc-click" data-action="inverter">`;
  g += box(0, 0, 4, 3, 2.2, "#f4efe6", "#f8f4ec", "#e3dccd");
  g += poly("#c7865a", [1.5, 3, 0], [2.3, 3, 0], [2.3, 3, 1.3], [1.5, 3, 1.3]);
  g += poly(windows, [0.4, 3, 0.9], [1.1, 3, 0.9], [1.1, 3, 1.6], [0.4, 3, 1.6]);
  g += poly(windows, [2.8, 3, 0.9], [3.6, 3, 0.9], [3.6, 3, 1.6], [2.8, 3, 1.6]);
  g += poly(windows, [4, 0.6, 0.9], [4, 1.4, 0.9], [4, 1.4, 1.6], [4, 0.6, 1.6]);
  g += poly("#d9573f", [-0.2, 3.2, 2.2], [4.2, 3.2, 2.2], [4.2, 1.5, 3.5], [-0.2, 1.5, 3.5]);
  g += poly("#e8e0d2", [4.2, -0.2, 2.2], [4.2, 3.2, 2.2], [4.2, 1.5, 3.5]);
  // PV modules on the front slope, one per optimizer when known.
  const panelList = m.panels?.panels || [];
  const count = m.config.showSolar ? clamp(panelList.length || Math.round(positiveNumber(m.config.pv_panels) || 8), 1, 24) : 0;
  const rows = count > 16 ? 3 : count > 8 ? 2 : 1;
  const cols = Math.max(1, Math.ceil(count / rows));
  const slope = (s) => [3.0 - 1.25 * s, 2.32 + 0.96 * s];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const k = r * cols + c;
      if (k >= count) continue;
      const x0 = 0.15 + c * (3.7 / cols);
      const x1 = x0 + 3.7 / cols - 0.07;
      const [ya, za] = slope(r / rows + 0.02);
      const [yb, zb] = slope((r + 1) / rows - 0.02);
      const weak = panelList[k]?.weak;
      g += poly(weak ? "#e8902c" : "#1f3d6b", [x0, ya, za], [x1, ya, za], [x1, yb, zb], [x0, yb, zb]);
      const [yc, zc] = slope(r / rows + 0.06);
      const [yd, zd] = slope((r + 1) / rows - 0.06);
      g += poly(weak ? "#f2b36a" : "#2c5591", [x0 + 0.05, yc, zc], [x1 - 0.05, yc, zc], [x1 - 0.05, yd, zd], [x0 + 0.05, yd, zd]);
    }
  }
  g += "</g>";
  // Battery cabinet with its charge level.
  if (m.config.showBattery) {
    g += `<g class="sfc-click" ${entityAttr(batteryEntityId(m))}>`;
    g += box(-2.6, 1.6, 1.0, 0.8, 1.6, "#e6f6ef", "#d4efe3", "#b9e2d0");
    const level = isNum(m.live.soc) ? clamp(m.live.soc, 0, 100) / 100 : 0;
    g += poly("#cfe7dc", [-2.45, 2.4, 0.3], [-1.75, 2.4, 0.3], [-1.75, 2.4, 1.3], [-2.45, 2.4, 1.3]);
    g += poly(level < 0.2 ? "#f26b5b" : "#1fbf86", [-2.45, 2.4, 0.3], [-1.75, 2.4, 0.3], [-1.75, 2.4, 0.3 + level], [-2.45, 2.4, 0.3 + level]);
    g += "</g>";
  }
  // Pylon.
  const base = P(6, 1.2);
  const top = P(6, 1.2, 5.2);
  g += `<g stroke="#6e7f93" stroke-width="2.2" fill="none" class="sfc-click" ${entityAttr(gridEntityId(m))}>
    <path d="M${base[0] - 14} ${base[1]} L${top[0]} ${top[1]} L${base[0] + 14} ${base[1]}"/>
    <path d="M${top[0] - 22} ${top[1] + 16} H${top[0] + 22} M${top[0] - 16} ${top[1] + 40} H${top[0] + 16} M${base[0] - 9} ${base[1] - 30} L${base[0] + 9} ${base[1] - 60} M${base[0] + 9} ${base[1] - 30} L${base[0] - 9} ${base[1] - 60}"/>
  </g>`;
  // Flows.
  const roof = P(2, 2.4, 2.9);
  const inside = P(2, 1.5, 1.0);
  const bat = P(-1.6, 2.0, 1.2);
  const wallL = P(0, 2.0, 1.0);
  const pole = P(6, 1.2, 4.7);
  const wallR = P(4, 1.0, 1.9);
  const L = m.live;
  g += '<g fill="none" stroke-linecap="round">';
  g += flowPath(`M${roof} Q${roof[0] + 40} ${roof[1] + 30} ${inside}`, L.solarActive, false, "pv");
  if (m.config.showBattery) g += flowPath(`M${bat} Q${(bat[0] + wallL[0]) / 2} ${bat[1] - 30} ${wallL}`, L.chargeActive || L.dischargeActive, L.chargeActive, "battery");
  g += flowPath(`M${pole} Q${(pole[0] + wallR[0]) / 2} ${pole[1] + 30} ${wallR}`, L.importActive || L.exportActive, L.exportActive, "grid");
  g += "</g>";
  const tree = P(5.6, 4.6);
  g += `<rect x="${tree[0] - 3}" y="${tree[1] - 26}" width="6" height="26" fill="#8a6b4a"/><circle cx="${tree[0]}" cy="${tree[1] - 38}" r="18" fill="${night ? "#3f7a55" : "#5fb878"}"/><circle cx="${tree[0] + 10}" cy="${tree[1] - 30}" r="12" fill="${night ? "#356a49" : "#4fa868"}"/>`;
  return { svg: g, sky };
}

function renderDiorama(m) {
  const { t, locale, live } = m;
  const { svg, sky } = dioramaScene(m);
  const pill = (x, y, cls, value, note, entityId) => `
    <button class="dio-pill ${cls}" style="left:${((x / 520) * 100).toFixed(1)}%;top:${((y / 360) * 100).toFixed(1)}%" ${entityAttr(entityId)}>
      <i class="${cls}"></i>${escapeHtml(value)} <small>${escapeHtml(note)}</small>
    </button>`;
  const batteryNote = live.dischargeActive ? `−${formatPower(live.discharge, locale)}` : live.chargeActive ? `+${formatPower(live.charge, locale)}` : t.idle;
  const gridValue = live.importActive ? live.gridImport : live.exportActive ? live.gridExport : Math.abs(live.grid);
  const when = batteryWhen(m);
  const today = m.today;
  const load = today.load;
  const imported = isNum(today.gridImport) ? today.gridImport : 0;
  const fromBattery = isNum(today.discharge) ? today.discharge : 0;
  // Virtual storage: the import balanced by export within the same hour.
  const fromVirtual = m.virtualStorage?.day ? clamp(m.virtualStorage.day.balanced, 0, imported) : 0;
  const fromGrid = imported - fromVirtual;
  const shares = isNum(load) && load > 0.05
    ? [Math.max(0, load - imported - fromBattery) / load, fromBattery / load, fromVirtual / load, fromGrid / load].map((v) => clamp(v * 100, 0, 100))
    : null;
  const ownShare = todayOwnShare(m);
  return `
    <div class="dio-scene" style="--sky-a:${sky.sky[0]};--sky-b:${sky.sky[1]}">
      <svg viewBox="0 0 520 360" aria-hidden="true">${svg}</svg>
      <div class="dio-title"><h1>${escapeHtml(m.name)}</h1>${liveBadge(m)}</div>
      <div class="dio-clock">${escapeHtml(clockText(m))}${isNum(m.weather?.temperature) ? ` <button class="dio-temp" ${entityAttr(m.weather.entityId)}>${escapeHtml(`${formatNumber(m.weather.temperature, locale, 0)}${m.weather.unit}`)}</button>` : ""}</div>
      ${m.config.showSolar ? pill(288, 78, "pv", formatPower(live.solar, locale), t.fromRoof, m.ids.live.solar) : ""}
      ${m.config.showBattery ? pill(22, 208, "battery", formatPercent(live.soc, locale), batteryNote, batteryEntityId(m)) : ""}
      ${pill(378, 240, "grid", formatPower(gridValue, locale), `${live.exportActive ? "↑ " : live.importActive ? "↓ " : ""}${t.grid.toLowerCase()}`, gridEntityId(m))}
      ${pill(120, 296, "load", formatPower(live.load, locale), t.inHome, m.ids.live.load)}
    </div>
    <div class="dio-bottom">
      <div class="dio-chips">
        ${m.config.showSolar
          ? `<button class="dio-chip sun" ${entityAttr(m.ids.energy.solar)}><small>${escapeHtml(t.chipRoof)}</small><b>${escapeHtml(formatEnergy(today.solar, locale))}</b></button>`
          : `<button class="dio-chip grid" ${entityAttr(m.ids.energy.gridImport)}><small>${escapeHtml(t.gridImport)}</small><b>${escapeHtml(formatEnergy(today.gridImport, locale))}</b></button>`}
        ${m.config.showBattery
          ? `<button class="dio-chip bat" ${entityAttr(batteryEntityId(m))}><small>${escapeHtml(when.label)}</small><b>${escapeHtml(when.value)}</b></button>`
          : `<button class="dio-chip grid" ${entityAttr(m.ids.energy.gridExport)}><small>${escapeHtml(t.gridExport)}</small><b>${escapeHtml(formatEnergy(today.gridExport, locale))}</b></button>`}
        <button class="dio-chip home" ${entityAttr(m.ids.energy.load)}><small>${escapeHtml(t.chipHome)}</small><b>${escapeHtml(formatEnergy(today.load, locale))}</b></button>
      </div>
      ${shares ? `
        <div class="dio-share">
          <header>${escapeHtml(t.whereFrom)}<span>${escapeHtml(t.autarky.toLowerCase())} ${escapeHtml(formatPercent(ownShare, locale))}</span></header>
          <div class="dio-track">${[["pv", t.solar], ["battery", t.battery], ["vstore", t.vsShort], ["grid", t.grid]]
            .map(([cls, name], i) => `<div class="${cls}" style="width:${shares[i]}%" title="${escapeHtml(`${name} ${formatPercent(shares[i], locale)}`)}"></div>`).join("")}</div>
          ${m.virtualStorage ? `<div class="dio-legend">${[["pv", t.solar], ["battery", t.battery], ["vstore", t.vsShort], ["grid", t.grid]]
            .map(([cls, name], i) => (shares[i] >= 0.5 ? `<span class="${cls}">${escapeHtml(name)} ${escapeHtml(formatPercent(shares[i], locale))}</span>` : "")).join("")}</div>` : ""}
        </div>` : ""}
    </div>
    <div class="sfc-sections">${standardSections(m)}</div>`;
}

// --------------------------------------------------------------------------
// Aurora: neon rings on a night sky.
// --------------------------------------------------------------------------

function renderAurora(m) {
  const { t, locale, live } = m;
  const W = 476;
  const H = 330;
  const pos = (x, y) => `left:${((x / W) * 100).toFixed(2)}%;top:${((y / H) * 100).toFixed(2)}%`;
  const ring = (cls, x, y, label, value, unit, note, entityId, extra = "") => {
    const [number, u] = value;
    return `
      <button class="aur-node ${cls}" style="${pos(x, y)}" ${entityId === "inverter" ? 'data-action="inverter"' : entityAttr(entityId)}>
        <span class="aur-ring">${extra}<span><small>${escapeHtml(label)}</small><b>${escapeHtml(number)}</b><small>${escapeHtml(unit || u)}</small></span></span>
        ${note ? `<em>${escapeHtml(note)}</em>` : ""}
      </button>`;
  };
  const soc = isNum(live.soc) ? clamp(live.soc, 0, 100) : 0;
  const socArc = `<svg class="aur-soc" viewBox="0 0 110 110"><circle cx="55" cy="55" r="52"/><circle class="on" cx="55" cy="55" r="52" stroke-dasharray="${(soc / 100 * 326.7).toFixed(1)} 326.7" transform="rotate(-90 55 55)"/></svg>`;
  const f = m.forecast;
  const batteryNote = f.mode === "charging" || f.mode === "discharging" ? `${f.mode === "charging" ? t.chipFull : t.chipLasts} ${formatWhen(f.at, locale)}` : batteryStatus(m);
  const batteryFlow = live.dischargeActive ? -live.discharge : live.charge;
  const gridValue = live.importActive ? live.gridImport : live.exportActive ? live.gridExport : Math.abs(live.grid);
  const flowLabel = (x, y, cls, active, value) => active
    ? `<text class="aur-flow-label ${cls}" x="${x}" y="${y}">${escapeHtml(formatPower(value, locale))}</text>` : "";
  const sub = [m.config.showSolar && positiveNumber(m.config.pv_capacity) && `${formatNumber(positiveNumber(m.config.pv_capacity), locale, 1)} kWp`,
    f.capacity && formatEnergy(f.capacity, locale)].filter(Boolean).join(" · ");
  return `
    <div class="aur-grain"></div>
    <header class="aur-header">
      <div><h1>${escapeHtml(m.name)}</h1>${sub ? `<div class="aur-sub">${escapeHtml(sub)}</div>` : ""}</div>
      <div class="aur-live ${m.status.state}"><i></i>${escapeHtml(m.t[m.status.state])} ${escapeHtml(clockText(m))}</div>
    </header>
    <div class="aur-stage">
      <svg viewBox="0 0 ${W} ${H}" aria-hidden="true">
        <defs><filter id="aur-glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
        <g fill="none" stroke-linecap="round">
          ${m.config.showSolar ? flowPath("M238 104 L238 147", live.solarActive, false, "pv", 'filter="url(#aur-glow)"') : ""}
          ${m.config.showBattery ? flowPath("M108 165 Q165 148 220 165", live.chargeActive || live.dischargeActive, live.chargeActive, "battery", 'filter="url(#aur-glow)"') : ""}
          ${flowPath("M256 165 Q311 148 368 165", live.importActive || live.exportActive, live.importActive, "grid", 'filter="url(#aur-glow)"')}
          ${flowPath("M238 183 L238 236", live.loadActive, false, "load", 'filter="url(#aur-glow)"')}
        </g>
        ${flowLabel(248, 130, "pv", live.solarActive, live.solar)}
        ${flowLabel(132, 146, "battery", live.chargeActive || live.dischargeActive, Math.abs(batteryFlow))}
        ${flowLabel(300, 146, "grid", live.importActive || live.exportActive, gridValue)}
      </svg>
      ${m.config.showSolar ? ring("pv", 238, 58, t.legendPv, powerParts(live.solar, locale), "", live.solarActive ? "" : t.idle, m.ids.live.solar) : ""}
      ${!m.config.showBattery ? "" : ring("battery", 62, 165, t.legendSoc, [formatPercent(live.soc, locale), ""], batteryFlow ? `${batteryFlow < 0 ? "−" : "+"}${formatPower(Math.abs(batteryFlow), locale)}` : t.idle, batteryNote, batteryEntityId(m), socArc)}
      ${ring("grid", 414, 165, t.grid, powerParts(gridValue, locale), "", gridStatus(m), gridEntityId(m))}
      ${ring("home", 238, 282, t.home, powerParts(live.load, locale), "", "", m.ids.live.load)}
      <button class="aur-hub" style="${pos(238, 165)}" data-action="inverter" title="${escapeHtml(t.inverterDetails)}">${MINI_ICONS.chip}</button>
    </div>
    <div class="sfc-sections">${standardSections(m)}</div>`;
}

// --------------------------------------------------------------------------
// Paper: an editorial page with a Sankey diagram of where the power goes.
// --------------------------------------------------------------------------

// Where the power comes from right now, as shares that add up to 100%.
// Sources are allocated to the uses in proportion, as in the Sankey.
function liveSources(m) {
  const { live } = m;
  const items = [
    ["pv", m.t.solar, m.config.showSolar ? live.solar : 0, m.ids.live.solar],
    ["battery", m.t.battery, live.discharge, batteryEntityId(m)],
    ["grid", m.t.grid, live.gridImport, gridEntityId(m)],
  ];
  const total = items.reduce((sum, [, , value]) => sum + (value > ACTIVE_W ? value : 0), 0);
  const shares = items.map(([, , value]) => (total > 0 && value > ACTIVE_W ? (value / total) * 100 : 0));
  const rounded = shares.map(Math.round);
  const drift = 100 - rounded.reduce((a, b) => a + b, 0);
  if (total > 0 && drift) rounded[shares.indexOf(Math.max(...shares))] += drift;
  return { items, total, shares: rounded };
}

function sankeyHtml(m) {
  const { live, t, locale } = m;
  const sources = liveSources(m).items.filter(([, , value]) => value > ACTIVE_W);
  const sinks = [
    ["load", t.home, live.load, m.ids.live.load],
    ["battery", t.battery, live.charge, batteryEntityId(m)],
    ["grid", t.grid, live.gridExport, gridEntityId(m)],
  ].filter(([, , value]) => value > ACTIVE_W);
  if (!sources.length || !sinks.length) return `<div class="pap-quiet">${escapeHtml(t.idle)}</div>`;
  // Balance both sides: what goes in but is not measured going out is the
  // inverter's losses and own use; the reverse is an unmeasured source.
  const sourceTotal = sources.reduce((s, [, , v]) => s + v, 0);
  const sinkTotal = sinks.reduce((s, [, , v]) => s + v, 0);
  if (sourceTotal - sinkTotal > ACTIVE_W) sinks.push(["loss", t.losses, sourceTotal - sinkTotal, null]);
  if (sinkTotal - sourceTotal > ACTIVE_W) sources.push(["other", t.otherSource, sinkTotal - sourceTotal, null]);
  const total = Math.max(sourceTotal, sinkTotal);
  const W = 468;
  const H = 200;
  const gap = 14;
  const scale = (H - gap * (Math.max(sources.length, sinks.length) - 1)) / total;
  const stack = (items) => {
    let y = 0;
    return items.map(([kind, label, value, entityId]) => {
      const node = { kind, label, value, entityId, y, h: Math.max(2, value * scale), used: 0 };
      y += node.h + gap;
      return node;
    });
  };
  const left = stack(sources);
  const right = stack(sinks);
  let ribbons = "";
  let flows = "";
  // Each source feeds every use in proportion to the use's share.
  for (const s of left) {
    for (const k of right) {
      const h = ((s.value * k.value) / total) * scale;
      if (h < 0.5) continue;
      const y0 = s.y + s.used;
      const y1 = k.y + k.used;
      s.used += h;
      k.used += h;
      ribbons += `<path class="pap-ribbon ${s.kind}" d="M10 ${y0.toFixed(1)} C${W / 2} ${y0.toFixed(1)} ${W / 2} ${y1.toFixed(1)} ${W - 10} ${y1.toFixed(1)} L${W - 10} ${(y1 + h).toFixed(1)} C${W / 2} ${(y1 + h).toFixed(1)} ${W / 2} ${(y0 + h).toFixed(1)} 10 ${(y0 + h).toFixed(1)} Z"/>`;
      // Dots running along the middle of the ribbon, source to use.
      if (h >= 3) {
        const a = y0 + h / 2;
        const b = y1 + h / 2;
        flows += `<path class="sfc-flow pap-flow" d="M14 ${a.toFixed(1)} C${W / 2} ${a.toFixed(1)} ${W / 2} ${b.toFixed(1)} ${W - 14} ${b.toFixed(1)}"/>`;
      }
    }
  }
  const bars = left.map((s) => `<rect class="pap-node ${s.kind}" x="0" y="${s.y.toFixed(1)}" width="10" height="${s.h.toFixed(1)}"/>`).join("")
    + right.map((k) => `<rect class="pap-node sink ${k.kind}" x="${W - 10}" y="${k.y.toFixed(1)}" width="10" height="${k.h.toFixed(1)}"/>`).join("");
  const label = (node, side) => `
    <button class="pap-label ${side} ${node.kind}" style="top:${((Math.max(0, node.y + node.h / 2 - 16) / H) * 100).toFixed(1)}%" ${entityAttr(node.entityId)}>
      <b>${escapeHtml(formatPower(node.value, locale))}</b>${escapeHtml(node.label)}${node.kind === "battery" && isNum(live.soc) ? ` · ${escapeHtml(formatPercent(live.soc, locale))}` : ""}
    </button>`;
  return `
    <div class="pap-cols"><span>${escapeHtml(t.sankeyFrom)}</span><span>${escapeHtml(t.sankeyTo)}</span></div>
    <div class="pap-sankey">
      <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="pap-fade" x1="0" x2="1" y1="0" y2="0">
            <stop offset=".3" stop-color="#fff" stop-opacity="0"/><stop offset=".4" stop-color="#fff"/>
            <stop offset=".6" stop-color="#fff"/><stop offset=".7" stop-color="#fff" stop-opacity="0"/>
          </linearGradient>
          <mask id="pap-mask" maskContentUnits="objectBoundingBox"><rect width="1" height="1" fill="url(#pap-fade)"/></mask>
        </defs>
        ${ribbons}<g mask="url(#pap-mask)">${flows}</g>${bars}</svg>
      ${left.map((n) => label(n, "left")).join("")}
      ${right.map((n) => label(n, "right")).join("")}
    </div>`;
}

// One or two sentences about the moment, as HTML with <em> highlights.
// Used by Paper and by the crawl of the Galaxy theme.
function liveSentence(m) {
  const { t, locale, live } = m;
  let lede = "";
  const sourcesNow = liveSources(m);
  if (live.load > ACTIVE_W && sourcesNow.total > 0) {
    const names = [t.paperSun, t.paperBattery, t.paperGrid];
    const parts = sourcesNow.shares.map((pct, i) => [names[i], pct]).filter(([, pct]) => pct > 0);
    lede = parts.length === 1
      ? fill(t.paperOnly, { source: `<em>${parts[0][0]}</em>` })
      : fill(t.paperMix, { parts: parts.map(([name, pct]) => `${name} <em>${pct}%</em>`).join(", ") });
  }
  const f = m.forecast;
  if (f.mode === "discharging") lede += ` ${fill(t.paperLasts, { time: `<em>${formatWhen(f.at, locale)}</em>` })}`;
  if (f.mode === "charging") lede += ` ${fill(t.paperFull, { time: `<em>${formatWhen(f.at, locale)}</em>` })}`;
  if (live.exportActive) lede += ` ${fill(t.paperExport, { power: `<em>${formatPower(live.gridExport, locale)}</em>` })}`;
  return lede.trim().replace(/<(?!\/?em>)/g, "&lt;");
}

function renderPaper(m) {
  const { t, locale, live } = m;
  const load = live.load;
  const lede = liveSentence(m);
  const date = m.now.toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short" });
  return `
    <div class="pap-eyebrow"><span>${escapeHtml(m.name)}</span><span>${escapeHtml(date)} · ${escapeHtml(clockText(m))} ${liveBadge(m)}</span></div>
    <h1 class="pap-headline" ${entityAttr(m.ids.live.load)}>${escapeHtml(fill(t.paperHeadline, { power: formatPower(load, locale) }))}</h1>
    ${lede ? `<p class="pap-lede">${lede}</p>` : ""}
    <hr>
    ${sankeyHtml(m)}
    ${m.hasDetails ? `<button type="button" class="sfc-link pap-inverter" data-action="inverter">${escapeHtml(t.inverterDetails)} →</button>` : ""}
    <div class="sfc-sections">${standardSections(m)}</div>`;
}

// --------------------------------------------------------------------------
// LCARS: a starship operations panel.
// --------------------------------------------------------------------------

function lcarsSegments(value, max, count = 16) {
  const on = isNum(value) && value > ACTIVE_W ? clamp(Math.ceil((value / max) * count), 1, count) : 0;
  return Array.from({ length: count }, (_, i) => (i < on ? `<i class="on" style="--i:${i};--n:${on - 1}"></i>` : "<i></i>")).join("");
}

function renderLcars(m) {
  const { t, locale, live } = m;
  const max = Math.max(3000, (positiveNumber(m.config.pv_capacity) || 0) * 1000, live.solar, live.load, live.charge, live.discharge, live.gridImport, live.gridExport);
  const row = (cls, label, value, entityId) => `
    <button class="lc-row ${cls}" ${entityAttr(entityId)}>
      <span class="lc-label">${escapeHtml(label)}</span>
      <span class="lc-track">${lcarsSegments(value, max)}</span>
      <span class="lc-value">${escapeHtml(isNum(value) ? `${formatNumber(value / 1000, locale, value < 100 ? 3 : 2)} kW` : "—")}</span>
    </button>`;
  const cellsOn = isNum(live.soc) ? Math.round(clamp(live.soc, 0, 100) / 10) : 0;
  const f = m.forecast;
  const status = m.systemStatus;
  const autarkyToday = formatPercent(todayOwnShare(m), locale);
  const code = String(m.station || "47").replace(/\D/g, "").slice(-5).padStart(5, "0");
  const side = [
    ...(m.panels ? [["c1", "01", t.lcarsPanels, 'data-action="panels"']] : []),
    ...(m.config.showBattery ? [["c2", "02", t.battery, entityAttr(batteryEntityId(m))]] : []),
    ["c3", "03", t.grid, entityAttr(gridEntityId(m))],
    ["c4", "04", t.inverter, 'data-action="inverter"'],
    ["c5", "05", t.home, entityAttr(m.ids.live.load)],
  ];
  return `
    <div class="lc-frame">
      <div class="lc-elbow top"><span>${escapeHtml(`${code.slice(0, 2)}-${code.slice(2)}`)}</span></div>
      <div class="lc-topbar"><h1>${escapeHtml(fill(t.lcarsTitle, { name: m.name }))}</h1><i class="b1"></i><i class="b2"></i><i class="b3"></i></div>
      <nav class="lc-side">
        ${side.map(([cls, num, label, attr]) => `<button class="${cls}" ${attr}><small>${num}-${(label.length * 7) % 10}</small>${escapeHtml(label)}</button>`).join("")}
        <span class="lc-fill"></span>
      </nav>
      <div class="lc-main ${m.config.wide ? "wide" : ""}">
        <div class="lc-panel">
        ${m.config.showSolar ? row("pv", t.lcarsPvIn, live.solar, m.ids.live.solar) : ""}
        ${!m.config.showBattery ? "" : row(live.chargeActive ? "battery rev" : "battery", live.chargeActive ? t.lcarsBatIn : t.lcarsBatOut, live.chargeActive ? live.charge : live.discharge, batteryEntityId(m))}
        ${row(live.exportActive ? "grid rev" : "grid", live.exportActive ? t.lcarsGridOut : t.lcarsGridIn, live.exportActive ? live.gridExport : live.gridImport, gridEntityId(m))}
        ${row("home", t.lcarsHome, live.load, m.ids.live.load)}
        <div class="lc-soc ${m.config.showBattery ? "" : "no-battery"}">
          ${m.config.showBattery ? `<div class="lc-cells">${Array.from({ length: 10 }, (_, i) => `<i class="${i < cellsOn ? "on" : ""}"></i>`).join("")}</div>` : ""}
          <div class="lc-readout">
            ${m.config.showBattery ? `
            <div><span>${escapeHtml(t.stateOfCharge)}</span><b>${escapeHtml(formatPercent(live.soc, locale))}</b></div>
            <div><span>${escapeHtml(t.stored)}</span><b>${escapeHtml(isNum(f.stored) ? formatEnergy(f.stored, locale) : "—")}</b></div>
            <div><span>${escapeHtml(f.mode === "charging" ? t.chipFull : t.autonomy)}</span><b>${escapeHtml(f.at ? formatWhen(f.at, locale) : "—")}</b></div>` : `
            <div><span>${escapeHtml(t.consumption)}</span><b>${escapeHtml(formatEnergy(m.today.load, locale))}</b></div>
            <div><span>${escapeHtml(t.gridImport)}</span><b>${escapeHtml(formatEnergy(m.today.gridImport, locale))}</b></div>
            <div><span>${escapeHtml(t.gridExport)}</span><b>${escapeHtml(formatEnergy(m.today.gridExport, locale))}</b></div>`}
            <div><span>${escapeHtml(t.autarkyToday)}</span><b>${escapeHtml(autarkyToday)}</b></div>
          </div>
        </div>
        <div class="lc-status ${status}">${escapeHtml(t[`status${status[0].toUpperCase()}${status.slice(1)}`])}</div>
        </div>
        <div class="sfc-sections">${standardSections(m)}</div>
      </div>
      <div class="lc-elbow bottom"></div>
      <div class="lc-botbar"><span>${escapeHtml(clockText(m))}</span><i></i><span>${escapeHtml(m.t[m.status.state])}</span></div>
    </div>`;
}

// --------------------------------------------------------------------------
// Atlantis: a holographic power core.
// --------------------------------------------------------------------------

function renderAtlantis(m) {
  const { t, locale, live } = m;
  // The core is the inverter; its ring shows the load against rated power.
  const hub = inverterHub(m);
  const arc = (((hub.share ?? 0) / 100) * 603.2).toFixed(1);
  const batteryFlow = live.dischargeActive ? live.discharge : live.charge;
  const gridValue = live.importActive ? live.gridImport : live.exportActive ? live.gridExport : Math.abs(live.grid);
  const ticks = Array.from({ length: 72 }, (_, i) => {
    const a = (i / 72) * Math.PI * 2;
    const r1 = 128;
    const r2 = i % 6 ? 134 : 140;
    return `<line x1="${(Math.cos(a) * r1).toFixed(1)}" y1="${(Math.sin(a) * r1).toFixed(1)}" x2="${(Math.cos(a) * r2).toFixed(1)}" y2="${(Math.sin(a) * r2).toFixed(1)}"/>`;
  }).join("");
  const label = (style, small, value, note, entityId, cls = "") => `
    <button class="atl-label ${cls}" style="${style}" ${entityId === "inverter" ? 'data-action="inverter"' : entityAttr(entityId)}>
      ${small ? `<small>${escapeHtml(small)}</small>` : ""}<b>${escapeHtml(value)}</b>${note ? `<small>${escapeHtml(note)}</small>` : ""}
    </button>`;
  return `
    <div class="atl-scan"></div>
    <header class="atl-header">
      <div><h1>${escapeHtml(t.coreTitle)}</h1><div class="atl-sub">${escapeHtml(m.name)} · ${escapeHtml(t.sector)} ${escapeHtml(String(m.station || "—"))} · ${escapeHtml(clockText(m))}</div></div>
      <div class="atl-glyphs ${m.status.state}">◇ ⟡ ◈ ⟐</div>
    </header>
    <div class="atl-core">
      <svg viewBox="0 0 480 330" aria-hidden="true">
        <defs>
          <filter id="atl-glow"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <radialGradient id="atl-fill" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#7ff3ff" stop-opacity=".55"/><stop offset=".6" stop-color="#00b6e6" stop-opacity=".18"/><stop offset="1" stop-color="#00b6e6" stop-opacity="0"/></radialGradient>
        </defs>
        <g transform="translate(240 165)" fill="none">
          <g class="atl-ticks">${ticks}</g>
          <circle r="104" class="atl-thin"/>
          <circle r="96" class="atl-track"/>
          <circle r="96" class="atl-arc ${live.chargeActive ? "charging" : ""}" stroke-dasharray="${arc} 603.2" transform="rotate(-90)" filter="url(#atl-glow)"/>
          <circle r="72" fill="url(#atl-fill)" class="atl-pulse ${live.chargeActive ? "charging" : live.dischargeActive ? "discharging" : ""}"/>
          <path d="M0 -62 L54 -31 L54 31 L0 62 L-54 31 L-54 -31 Z" class="atl-crystal" filter="url(#atl-glow)"/>
        </g>
        <g fill="none" stroke-linecap="round" filter="url(#atl-glow)">
          ${m.config.showSolar ? flowPath("M240 18 L240 69", live.solarActive, false, "pv") : ""}
          ${m.config.showBattery ? flowPath("M60 165 L144 165", live.chargeActive || live.dischargeActive, live.chargeActive, "battery") : ""}
          ${flowPath("M420 165 L336 165", live.importActive || live.exportActive, live.exportActive, "grid")}
          ${flowPath("M240 261 L240 312", live.loadActive, false, "load")}
        </g>
      </svg>
      <button class="atl-center" data-action="inverter" title="${escapeHtml(t.inverterDetails)}">
        <small>${escapeHtml(t.inverter)}</small><b>${escapeHtml(formatPower(hub.power, locale))}</b>
        ${isNum(hub.share) ? `<small>${escapeHtml(formatPercent(hub.share, locale))}</small>` : ""}
      </button>
      ${m.config.showSolar ? label("left:50%;top:3%", "", formatPower(live.solar, locale), t.sun, m.ids.live.solar, "pv") : ""}
      ${!m.config.showBattery ? "" : label("left:10%;top:50%", batteryLabel(m), formatPower(batteryFlow, locale), [live.chargeActive ? t.absorbing : live.dischargeActive ? t.supplying : t.idle, batteryWhenShort(m)].filter(Boolean).join(" "), batteryEntityId(m))}
      ${label("left:90%;top:50%", t.grid, formatPower(gridValue, locale), gridStatus(m), gridEntityId(m), "grid")}
      ${label("left:50%;top:97%", "", formatPower(live.load, locale), t.home, m.ids.live.load, "load")}
    </div>
    <div class="sfc-sections">${standardSections(m)}</div>`;
}

// --------------------------------------------------------------------------
// Expanse: a ship's power distribution display with orbital trajectories.
// --------------------------------------------------------------------------

function renderExpanse(m) {
  const { t, locale, live } = m;
  const W = 480;
  const H = 330;
  const pos = (x, y) => `left:${((x / W) * 100).toFixed(2)}%;top:${((y / H) * 100).toFixed(2)}%`;
  const batteryFlow = live.dischargeActive ? live.discharge : live.charge;
  const gridValue = live.importActive ? live.gridImport : live.exportActive ? live.gridExport : Math.abs(live.grid);
  const box = (cls, x, y, code, label, value, note, attr) => `
    <button class="exp-box ${cls}" style="${pos(x, y)}" ${attr}>
      <span class="exp-code">${escapeHtml(code)}</span><small>${escapeHtml(label)}</small>
      <b>${escapeHtml(value)}</b>${note ? `<em>${escapeHtml(note)}</em>` : ""}
    </button>`;
  const soc = isNum(live.soc) ? clamp(live.soc, 0, 100) : 0;
  const minSoc = clamp(m.forecast.minSoc ?? 10, 0, 100);
  const segments = Array.from({ length: 25 }, (_, i) => {
    const from = i * 4;
    return `<i class="${from < soc ? "on" : ""} ${from < minSoc ? "reserve" : ""}"></i>`;
  }).join("");
  const f = m.forecast;
  const code = String(m.station || "").replace(/\D/g, "").slice(-4).padStart(4, "0");
  return `
    <div class="exp-grid"></div>
    <header class="exp-header">
      <div class="exp-tag">${escapeHtml(code)}</div>
      <div class="exp-title"><h1>${escapeHtml(m.name)}</h1><span>${escapeHtml(t.expanseTitle)}</span></div>
      <div class="exp-clock ${m.status.state}"><small>${escapeHtml(m.t[m.status.state])}</small><b>${escapeHtml(clockText(m))}</b></div>
    </header>
    <div class="exp-stage">
      <svg viewBox="0 0 ${W} ${H}" aria-hidden="true">
        <g class="exp-orbits" fill="none">
          <ellipse cx="240" cy="165" rx="210" ry="128"/><ellipse cx="240" cy="165" rx="150" ry="92"/>
          <line x1="20" y1="165" x2="460" y2="165"/><line x1="240" y1="22" x2="240" y2="308"/>
        </g>
        <g fill="none" stroke-linecap="round">
          ${m.config.showSolar ? flowPath("M150 72 Q218 72 222 140", live.solarActive, false, "pv") : ""}
          ${flowPath("M330 72 Q262 72 258 140", live.importActive || live.exportActive, live.exportActive, "grid")}
          ${m.config.showBattery ? flowPath("M150 258 Q218 258 222 190", live.chargeActive || live.dischargeActive, live.chargeActive, "battery") : ""}
          ${flowPath("M330 258 Q262 258 258 190", live.loadActive, true, "load")}
        </g>
        <g transform="translate(240 165)" fill="none">
          <circle r="34" class="exp-ring"/>
          <circle r="27" class="exp-spin"/>
          <path d="M-8 0 H8 M0 -8 V8" class="exp-cross"/>
        </g>
      </svg>
      <button class="exp-core" style="${pos(240, 165)}" data-action="inverter" title="${escapeHtml(t.inverterDetails)}"></button>
      ${m.config.showSolar ? box("pv", 92, 72, "SOL-01", t.solar, formatPower(live.solar, locale), live.solarActive ? "" : t.idle, entityAttr(m.ids.live.solar)) : ""}
      ${box("grid", 388, 72, "GRD-02", t.grid, formatPower(gridValue, locale), gridStatus(m), entityAttr(gridEntityId(m)))}
      ${!m.config.showBattery ? "" : box("battery", 92, 258, "BAT-03", t.battery, formatPower(batteryFlow, locale), batteryStatus(m), entityAttr(batteryEntityId(m)))}
      ${box("load", 388, 258, "HAB-04", t.home, formatPower(live.load, locale), "", entityAttr(m.ids.live.load))}
    </div>
    ${m.config.showBattery ? `
    <button class="exp-soc" ${entityAttr(batteryEntityId(m))}>
      <span class="exp-soc-head"><small>${escapeHtml(t.stateOfCharge)}</small><b>${escapeHtml(formatPercent(live.soc, locale))}</b>
        <em>${escapeHtml(f.at ? `${f.mode === "charging" ? t.chipFull : t.chipLasts} ${formatWhen(f.at, locale)}` : isNum(f.stored) ? formatEnergy(f.stored, locale) : "")}</em></span>
      <span class="exp-soc-bar">${segments}</span>
    </button>` : ""}
    <div class="sfc-sections">${standardSections(m)}</div>`;
}

// --------------------------------------------------------------------------
// Foundation: a radiant of slowly turning orbits that forecasts the battery.
// --------------------------------------------------------------------------

// A negative start offset that follows the wall clock, so a looping
// animation continues where it was when the card re-renders.
function loopPhase(seconds, shift = 0) {
  return `-${(((Date.now() / 1000) + shift) % seconds).toFixed(2)}s`;
}

// One orbit of the radiant: a still ellipse with a planet travelling the
// whole way round it (SVG motion, so it follows the ellipse exactly).
function foundationOrbit(rx, ry, angle, r, seconds, reverse, m) {
  const path = reverse
    ? `M${rx} 0 A${rx} ${ry} 0 1 0 ${-rx} 0 A${rx} ${ry} 0 1 0 ${rx} 0`
    : `M${rx} 0 A${rx} ${ry} 0 1 1 ${-rx} 0 A${rx} ${ry} 0 1 1 ${rx} 0`;
  const still = m.config.animation === false || (typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches);
  const planet = still
    ? `<circle cx="${rx}" r="${r}"/>`
    : `<circle r="${r}"><animateMotion dur="${seconds}s" begin="${loopPhase(seconds)}" repeatCount="indefinite" path="${path}"/></circle>`;
  return `<g class="fnd-orbit" transform="rotate(${angle})"><ellipse rx="${rx}" ry="${ry}"/>${planet}</g>`;
}

function renderFoundation(m) {
  const { t, locale, live } = m;
  const W = 480;
  const H = 340;
  const pos = (x, y) => `left:${((x / W) * 100).toFixed(2)}%;top:${((y / H) * 100).toFixed(2)}%`;
  const batteryFlow = live.dischargeActive ? live.discharge : live.charge;
  const gridValue = live.importActive ? live.gridImport : live.exportActive ? live.gridExport : Math.abs(live.grid);
  const node = (cls, x, y, label, value, note, attr) => `
    <button class="fnd-node ${cls}" style="${pos(x, y)}" ${attr}>
      <small>${escapeHtml(label)}</small><b>${escapeHtml(value)}</b>${note ? `<em>${escapeHtml(note)}</em>` : ""}
    </button>`;
  // Points on the orbits; a fixed pattern so the picture is stable between renders.
  const stars = Array.from({ length: 46 }, (_, i) => {
    const a = i * 2.39996;
    const r = 30 + ((i * 37) % 120);
    return `<circle cx="${(Math.cos(a) * r).toFixed(1)}" cy="${(Math.sin(a) * r * 0.62).toFixed(1)}" r="${i % 7 ? 0.8 : 1.6}"/>`;
  }).join("");
  const f = m.forecast;
  const forecast = !m.config.showBattery
    ? liveSentence(m) || escapeHtml(t.galaxyQuiet)
    : f.mode === "discharging"
      ? fill(t.paperLasts, { time: `<em>${formatWhen(f.at, locale)}</em>` })
      : f.mode === "charging"
        ? fill(t.paperFull, { time: `<em>${formatWhen(f.at, locale)}</em>` })
        : escapeHtml(t.foundationSteady);
  return `
    <div class="fnd-dust"></div>
    <header class="fnd-header">
      <small>${escapeHtml(t.foundationTitle)}</small>
      <h1>${escapeHtml(m.name)}</h1>
      <span>${escapeHtml(m.now.toLocaleDateString(locale, { day: "numeric", month: "long" }))} · ${escapeHtml(clockText(m))} ${liveBadge(m)}</span>
    </header>
    <div class="fnd-stage">
      <svg viewBox="0 0 ${W} ${H}" aria-hidden="true">
        <defs>
          <radialGradient id="fnd-sphere" cx="50%" cy="45%" r="50%"><stop offset="0" stop-color="#fff4d6"/><stop offset=".35" stop-color="#e8c47a" stop-opacity=".7"/><stop offset="1" stop-color="#b8862e" stop-opacity="0"/></radialGradient>
          <filter id="fnd-glow"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <g transform="translate(240 170)" fill="none">
          ${foundationOrbit(150, 58, 0, 2.5, 48, false, m)}
          ${foundationOrbit(128, 74, 32, 2, 70, true, m)}
          ${foundationOrbit(128, 74, -32, 2, 95, false, m)}
          <g class="fnd-stars">${stars}</g>
          <circle r="62" fill="url(#fnd-sphere)" class="fnd-sphere"/>
          <circle r="44" class="fnd-ring"/>
        </g>
        <g fill="none" stroke-linecap="round" filter="url(#fnd-glow)">
          ${m.config.showSolar ? flowPath("M240 48 L240 120", live.solarActive, false, "pv") : ""}
          ${m.config.showBattery ? flowPath("M108 170 L190 170", live.chargeActive || live.dischargeActive, live.chargeActive, "battery") : ""}
          ${flowPath("M372 170 L290 170", live.importActive || live.exportActive, live.exportActive, "grid")}
          ${flowPath("M240 292 L240 220", live.loadActive, true, "load")}
        </g>
      </svg>
      <button class="fnd-center" style="${pos(240, 170)}" data-action="inverter" title="${escapeHtml(t.inverterDetails)}">
        <b>${escapeHtml(formatPower(inverterHub(m).power, locale))}</b><small>${escapeHtml(t.inverter)}</small>
      </button>
      ${m.config.showSolar ? node("pv", 240, 22, t.sun, formatPower(live.solar, locale), "", entityAttr(m.ids.live.solar)) : ""}
      ${!m.config.showBattery ? "" : node("battery", 60, 170, batteryLabel(m), formatPower(batteryFlow, locale), batteryStatus(m), entityAttr(batteryEntityId(m)))}
      ${node("grid", 420, 170, t.grid, formatPower(gridValue, locale), gridStatus(m), entityAttr(gridEntityId(m)))}
      ${node("load", 240, 318, t.home, formatPower(live.load, locale), "", entityAttr(m.ids.live.load))}
    </div>
    <p class="fnd-forecast"><small>${escapeHtml(t.foundationForecast)}</small>${forecast.replace(/<(?!\/?em>)/g, "&lt;")}</p>
    <div class="sfc-sections">${standardSections(m)}</div>`;
}

// --------------------------------------------------------------------------
// Galaxy: a targeting computer flying down a trench, with an opening crawl.
// --------------------------------------------------------------------------

function renderGalaxy(m) {
  const { t, locale, live } = m;
  const W = 480;
  const H = 300;
  const pos = (x, y) => `left:${((x / W) * 100).toFixed(2)}%;top:${((y / H) * 100).toFixed(2)}%`;
  const batteryFlow = live.dischargeActive ? live.discharge : live.charge;
  const gridValue = live.importActive ? live.gridImport : live.exportActive ? live.gridExport : Math.abs(live.grid);
  const readout = (cls, x, y, label, value, note, attr) => `
    <button class="gal-readout ${cls}" style="${pos(x, y)}" ${attr}>
      <small>${escapeHtml(label)}</small><b>${escapeHtml(value)}</b>${note ? `<em>${escapeHtml(note)}</em>` : ""}
    </button>`;
  const crawl = liveSentence(m) || escapeHtml(t.galaxyQuiet);
  const soc = isNum(live.soc) ? clamp(live.soc, 0, 100) : 0;
  const lock = m.config.showBattery && soc <= (m.forecast.minSoc ?? 10) + 1 ? "low" : "";
  return `
    <div class="gal-stars"></div>
    <header class="gal-header">
      <small>${escapeHtml(t.galaxyTitle)}</small>
      <h1>${escapeHtml(m.name)}</h1>
      <div class="gal-crawl"><p>${crawl}</p></div>
    </header>
    <div class="gal-scope">
      <svg viewBox="0 0 ${W} ${H}" aria-hidden="true">
        <g class="gal-trench" fill="none">
          ${[0, 1, 2, 3].map((i) => `<rect class="gal-warp" style="--d:${i}" x="190" y="115" width="100" height="70"/>`).join("")}
          <rect x="190" y="115" width="100" height="70" class="gal-target ${lock}"/>
          <path d="M240 100 V125 M240 175 V200 M175 150 H200 M280 150 H305" class="gal-cross ${lock}"/>
        </g>
        <g fill="none" stroke-linecap="round">
          ${m.config.showSolar ? flowPath("M14 12 L190 115", live.solarActive, false, "pv") : ""}
          ${flowPath("M466 12 L290 115", live.importActive || live.exportActive, live.exportActive, "grid")}
          ${m.config.showBattery ? flowPath("M14 288 L190 185", live.chargeActive || live.dischargeActive, live.chargeActive, "battery") : ""}
          ${flowPath("M466 288 L290 185", live.loadActive, true, "load")}
        </g>
      </svg>
      <button class="gal-center" style="${pos(240, 150)}" data-action="inverter" title="${escapeHtml(t.inverterDetails)}">
        <b>${escapeHtml(formatPower(inverterHub(m).power, locale))}</b>
        <small>${escapeHtml(t.inverter)}</small>
      </button>
      ${m.config.showSolar ? readout("pv", 62, 118, t.solar, formatPower(live.solar, locale), "", entityAttr(m.ids.live.solar)) : ""}
      ${!m.config.showBattery ? "" : readout(`battery ${lock}`, 62, 182, batteryLabel(m), formatPower(batteryFlow, locale), batteryStatus(m), entityAttr(batteryEntityId(m)))}
      ${readout("grid", 418, 118, t.grid, formatPower(gridValue, locale), gridStatus(m), entityAttr(gridEntityId(m)))}
      ${readout("load", 418, 182, t.home, formatPower(live.load, locale), "", entityAttr(m.ids.live.load))}
      <div class="gal-hud"><span>${escapeHtml(clockText(m))}</span><span class="${m.status.state}">${escapeHtml(m.t[m.status.state])}</span></div>
    </div>
    <div class="sfc-sections">${standardSections(m)}</div>`;
}

// --------------------------------------------------------------------------
// Gate: a gate control room. Nine chevrons show the battery level, the
// dialing computer lists every flow, MALP telemetry is the energy section.
// --------------------------------------------------------------------------

// The compact gate: a smaller gate whose four chevrons are the connection
// points of the panels, grid, home and battery, each linked to a picture in
// a corner; the other five chevrons show the battery level. Chevron i sits
// at -90° + 40° × i. The wide layout keeps all nine chevrons for the level.
const GATE_PORTS = { pv: 8, grid: 1, load: 3, battery: 6 };
const GATE_LEVEL = [0, 2, 4, 5, 7];
const GATE_SCALE = 0.66;
const GATE_ICONS = { pv: [-258, -196], grid: [258, -196], load: [258, 176], battery: [-258, 176] };

// The 39 gate symbols, clockwise from the point of origin at the top,
// traced from a drawing of the gate: outlines in a cell of ±24 units,
// negative y pointing out of the ring.
const GATE_GLYPHS = [
  "M0.0 -2.0 -15.8 18.5 -16.0 20.5 -9.1 20.5 -9.8 17.5 -9.0 15.5 -3.0 6.7 1.0 2.6 2.5 3.8 11.1 16.0 11.5 17.5 10.5 19.5 10.8 20.5 17.5 20.6 17.5 18.5 5.0 2.0 1.8 -2.0 0.0 -2.0Z",
  "M10.0 -13.5 8.5 -13.0 8.4 -12.0 11.0 -9.5 14.1 -4.5 10.5 1.8 9.0 2.8 -3.0 3.3 -10.1 -1.5 -10.0 -10.0 -12.5 -9.9 -13.8 -9.0 -12.9 0.0 -4.6 6.0 -6.7 15.5 -6.0 17.9 -3.0 18.1 10.0 16.2 12.4 15.0 12.5 4.5 17.3 -4.5 12.4 -13.0 10.0 -13.5ZM4.5 6.0 0.0 6.3 -1.4 7.0 -3.1 13.0 -3.0 15.0 9.5 13.1 9.5 6.5 8.0 5.7 4.5 6.0Z",
  "M9.5 -14.3 8.8 -13.5 8.7 -8.5 8.0 -7.3 -6.0 -4.4 -14.3 -3.5 -14.3 -1.0 -13.5 -0.1 -5.0 -1.8 -3.5 -0.8 -2.2 4.5 -7.9 19.0 -6.5 20.6 -4.5 20.2 -1.4 10.5 1.0 5.9 7.0 4.2 8.8 4.5 8.9 8.5 6.0 12.0 7.0 13.7 8.5 13.9 11.8 10.5 16.2 3.0 16.4 0.0 11.9 -4.0 11.3 -13.5 10.5 -14.4 9.5 -14.3ZM6.0 -4.0 -0.5 -2.4 -0.7 -1.0 0.5 2.1 2.0 2.4 8.5 0.6 8.5 -4.0 6.0 -4.0ZM12.5 0.5 11.8 1.5 12.0 3.5 13.3 2.0 12.5 0.5Z",
  "M-6.0 -14.2 -6.8 -13.0 -5.5 -11.5 10.5 -11.1 11.9 -12.5 10.5 -13.9 -6.0 -14.2ZM-5.0 -7.2 -5.5 -5.3 -3.0 -4.1 -2.5 -3.0 -1.0 9.0 -6.5 15.0 -7.1 17.0 -6.4 18.0 -4.0 18.6 5.0 19.3 6.0 17.0 2.4 8.5 3.9 -3.0 4.5 -3.7 7.0 -4.1 7.4 -6.0 2.5 -7.1 -5.0 -7.2ZM-0.5 12.9 -2.5 15.6 2.0 16.1 1.0 13.4 -0.5 12.9Z",
  "M2.5 -14.7 2.0 -14.5 2.5 -7.5 -10.0 -5.4 -12.5 -5.6 -13.5 -4.5 -13.0 -2.0 4.5 -4.1 15.0 6.1 16.5 6.2 17.8 5.0 17.7 4.0 6.7 -5.5 2.5 -14.7ZM2.0 -0.0 0.8 1.0 -0.2 8.0 1.0 9.8 2.5 9.0 3.6 2.0 3.3 0.5 2.0 -0.0ZM0.0 12.3 -5.9 17.0 -6.3 19.5 -4.0 20.6 5.0 21.4 6.2 20.0 5.7 18.5 2.1 13.0 0.0 12.3ZM0.0 15.9 -1.4 17.0 -1.3 18.0 1.7 18.0 1.2 16.5 0.0 15.9Z",
  "M-1.0 -18.5 -2.2 -17.0 -5.5 -7.1 -16.0 -2.2 -16.8 -1.0 -16.0 0.3 -15.0 0.4 -3.5 -4.6 -0.3 -13.0 0.5 -13.7 1.7 -13.0 17.2 2.0 6.5 14.4 6.4 18.5 7.0 19.8 8.0 20.0 9.1 19.0 9.7 15.0 20.9 2.5 18.7 -13.5 18.0 -15.2 16.0 -16.2 2.0 -18.6 -1.0 -18.5ZM4.5 -15.1 5.2 -13.5 16.5 -3.0 17.3 -3.0 15.5 -13.0 4.5 -15.1Z",
  "M-11.0 -15.6 -11.9 -14.0 -11.5 -13.1 -9.0 -11.9 -3.0 -7.2 -3.6 1.5 -2.8 3.5 11.0 13.4 12.5 13.5 13.5 12.0 13.0 10.8 -0.5 1.6 0.2 -6.5 -0.4 -9.0 -9.0 -15.4 -11.0 -15.6Z",
  "M16.0 -8.0 10.5 -7.1 9.3 -5.5 12.3 0.0 15.0 2.7 17.3 1.5 20.8 -6.5 19.0 -8.4 16.0 -8.0ZM15.0 -5.1 13.2 -4.0 15.0 -1.6 16.8 -4.5 15.0 -5.1ZM-6.0 -2.0 -12.5 -1.2 -14.5 0.0 -14.0 2.5 -9.0 9.0 -6.7 8.0 -3.5 0.5 -4.0 -1.4 -6.0 -2.0ZM-10.0 1.3 -10.6 2.5 -8.5 4.4 -7.7 3.5 -7.5 1.5 -10.0 1.3Z",
  "M-9.5 -20.6 -9.6 -18.5 -9.0 -17.7 -2.6 -17.5 -1.5 -7.6 3.5 -1.2 11.4 5.0 9.8 12.0 8.5 13.6 5.5 13.9 2.5 9.0 0.0 9.7 -0.3 11.5 4.5 17.0 11.0 15.9 12.7 12.0 14.5 3.7 6.5 -2.2 0.9 -9.5 1.0 -16.5 2.5 -16.6 7.5 -14.3 8.5 -14.9 8.9 -16.5 -0.5 -20.8 -9.5 -20.6Z",
  "M-3.5 -12.3 -4.8 -11.0 -7.5 -4.5 -6.0 -2.7 1.0 -5.9 2.5 -7.5 2.0 -9.1 -3.5 -12.3ZM-4.0 -9.1 -4.7 -8.0 -4.0 -6.6 -2.4 -8.0 -4.0 -9.1ZM11.5 -2.2 10.4 -1.0 7.5 6.4 0.0 11.8 -4.5 11.8 -6.5 10.4 -8.3 7.0 -7.0 0.5 -7.7 -0.5 -9.0 -0.6 -11.2 6.5 -10.8 9.0 -6.5 14.4 0.5 14.7 10.0 8.7 18.0 7.6 19.0 6.0 18.6 4.5 13.9 -1.5 11.5 -2.2ZM12.5 2.4 11.6 5.0 14.3 5.0 14.1 3.5 12.5 2.4Z",
  "M-7.0 -17.0 -8.7 -15.0 -1.4 -4.0 5.0 13.5 6.0 14.3 7.5 14.2 8.3 13.5 13.8 -4.0 13.7 -6.5 11.5 -7.3 1.0 -6.3 -4.6 -14.5 -5.1 -17.0 -7.0 -17.0ZM7.0 -4.1 3.0 -3.2 2.3 -2.5 6.5 8.2 7.5 6.6 10.5 -3.5 9.5 -4.2 7.0 -4.1ZM-4.5 -3.6 -5.5 -2.5 -5.3 -1.5 -3.5 2.2 -2.0 2.5 -1.1 1.5 -2.2 -1.5 -3.5 -3.4 -4.5 -3.6Z",
  "M-4.5 -19.1 -12.0 -11.4 -12.8 -9.5 -11.5 -7.9 -6.0 -5.8 -4.9 -4.0 -4.1 1.0 -6.0 2.5 -7.6 6.5 -7.3 7.5 -5.5 7.9 -3.4 6.0 -1.1 13.5 1.5 15.2 4.0 15.6 14.3 8.5 14.9 4.5 16.3 1.5 15.5 0.3 14.0 0.5 11.9 4.0 11.5 7.2 4.0 12.4 3.0 12.6 1.5 11.9 -3.0 -7.0 -2.3 -8.5 3.2 -13.5 3.9 -15.5 3.0 -16.7 -1.5 -19.1 -4.5 -19.1ZM-3.5 -16.1 -8.5 -10.5 -7.6 -9.5 -6.0 -9.4 -0.5 -13.9 -0.5 -15.4 -3.5 -16.1Z",
  "M-8.0 -20.2 -12.2 -3.0 -11.5 -1.5 -9.0 -0.9 7.5 -2.2 9.1 -1.5 -0.7 15.0 0.0 16.5 2.0 17.1 13.4 -3.5 12.5 -4.7 11.0 -5.2 -8.5 -4.1 -8.7 -5.5 -6.0 -16.5 -4.5 -18.5 -5.9 -20.0 -8.0 -20.2Z",
  "M13.5 -4.1 11.6 -2.0 15.2 2.5 15.0 3.8 -10.0 12.0 -12.5 11.8 -13.1 13.0 -12.5 15.6 -11.5 15.9 -6.0 13.5 18.5 5.8 19.4 4.5 19.4 3.0 13.5 -4.1ZM-12.5 -3.0 -13.3 0.5 -12.5 1.9 -11.5 2.3 -3.0 -0.1 -1.8 -1.5 -2.0 -2.1 -4.0 -2.3 -9.0 -1.4 -12.5 -3.0Z",
  "M2.0 -12.0 -14.5 -5.6 -15.8 -4.5 -15.9 -3.5 -15.0 -2.6 -12.5 -3.2 -11.0 -2.6 8.0 12.0 12.0 13.8 13.2 12.0 13.6 2.0 4.8 -11.0 3.5 -12.0 2.0 -12.0ZM1.0 -8.6 -7.5 -5.2 -8.1 -4.0 10.1 9.5 11.0 6.5 10.6 2.5 3.3 -8.0 2.5 -8.7 1.0 -8.6Z",
  "M0.5 -17.2 -2.6 -14.0 -3.7 -7.5 -7.6 -2.0 -9.5 7.5 -6.5 10.3 -0.5 10.0 8.0 6.0 14.8 -4.0 14.2 -7.5 11.1 -15.5 0.5 -17.2ZM3.0 -14.0 2.8 -13.5 5.0 -11.7 10.5 -8.4 9.0 -13.2 3.0 -14.0ZM0.5 -11.2 -0.2 -10.5 -1.2 -6.0 -4.7 -1.5 -6.4 6.0 -5.5 7.4 0.0 6.8 6.5 3.5 10.8 -3.0 10.0 -4.5 0.5 -11.2Z",
  "M-11.5 -17.1 -12.9 -16.0 -17.7 -8.0 -17.3 -6.5 -15.0 -5.7 -11.5 -12.7 -10.0 -13.1 11.7 6.5 11.0 7.7 2.5 9.8 -0.3 9.5 0.5 13.2 1.5 13.5 4.0 12.3 14.0 10.1 15.9 9.0 16.3 7.5 15.0 5.8 -9.0 -16.1 -11.5 -17.1Z",
  "M-19.5 -11.7 -20.5 -10.9 -20.5 -9.5 -10.0 7.1 2.0 12.3 13.0 10.5 13.1 9.0 10.9 7.5 9.8 4.0 11.2 -0.5 13.4 -2.0 9.0 -2.5 6.9 3.0 7.5 8.5 5.5 9.2 1.5 9.2 -7.9 4.5 -3.5 0.0 -1.4 -7.0 -1.8 -8.5 -3.7 -8.5 -6.3 -1.0 -10.0 1.2 -18.0 -10.7 -19.5 -11.7Z",
  "M7.5 -17.7 6.7 -17.0 5.3 -13.0 -6.6 -8.0 -9.7 -3.0 -9.5 -2.0 -8.0 -1.5 -5.5 -3.5 1.4 1.5 1.5 2.8 -2.1 13.5 -2.1 15.0 -1.0 15.8 0.5 14.5 5.0 2.0 16.0 -4.5 17.3 -6.5 18.5 -12.0 18.0 -12.9 17.0 -13.1 15.8 -12.0 13.7 -6.5 4.5 -1.2 2.5 -1.4 -3.2 -5.5 -2.5 -6.7 7.5 -10.8 9.2 -16.5 7.5 -17.7ZM-13.5 4.4 -14.5 6.0 -13.5 9.7 -12.5 10.7 -10.5 10.6 -8.2 8.0 -8.0 6.0 -9.5 4.9 -13.5 4.4Z",
  "M-4.5 -18.7 -15.5 -12.3 -16.4 -11.0 -15.9 -9.0 -5.5 4.5 14.0 17.0 15.5 17.1 16.1 16.0 15.3 14.5 -2.8 2.5 -1.7 -16.5 -2.5 -18.5 -4.5 -18.7ZM-6.0 -14.7 -12.9 -10.0 -7.2 -2.0 -6.0 -1.4 -4.7 -13.5 -5.0 -14.6 -6.0 -14.7Z",
  "M7.5 -17.0 5.0 -15.1 -17.0 -12.3 -18.5 -11.5 -18.1 -9.0 -11.2 -3.0 -6.9 2.5 -6.0 7.5 -8.5 10.5 -9.1 13.5 -7.7 16.5 -5.5 17.9 -2.5 18.1 0.1 16.5 1.2 14.5 1.3 11.5 0.0 9.2 -3.0 6.9 -4.2 1.5 -5.5 -0.8 -13.5 -9.5 5.0 -12.3 8.5 -10.6 10.0 -10.8 13.1 -13.0 13.4 -15.0 9.5 -17.3 7.5 -17.0ZM-4.0 10.5 -5.5 11.2 -6.3 13.0 -5.5 14.5 -3.5 15.3 -2.1 14.5 -1.4 12.5 -2.5 10.8 -4.0 10.5Z",
  "M-12.5 -15.6 -13.1 -13.0 -10.1 4.5 -8.5 4.9 -6.7 3.5 -8.1 -1.5 -7.5 -2.9 0.0 -4.8 0.6 0.0 2.2 3.5 2.1 8.0 4.4 11.5 4.3 16.0 6.0 16.9 10.0 15.6 11.4 14.0 11.7 12.0 10.4 10.0 10.6 6.5 8.1 3.0 8.2 -1.0 5.8 -5.0 5.0 -10.0 2.0 -12.3 -10.0 -15.8 -12.5 -15.6ZM-9.5 -12.5 -9.2 -7.5 -8.0 -5.9 1.9 -8.5 0.0 -9.9 -9.5 -12.5ZM3.5 -1.6 3.6 0.0 5.0 1.4 5.1 -1.0 4.5 -1.8 3.5 -1.6ZM5.5 5.2 5.1 7.5 7.0 9.1 7.4 7.0 5.5 5.2Z",
  "M0.5 -15.2 -19.6 10.5 -20.6 12.5 -20.0 13.7 -18.5 14.1 -14.5 12.9 15.0 3.2 16.9 2.0 17.4 0.5 16.6 -1.0 3.1 -15.0 0.5 -15.2ZM1.0 -11.6 -14.6 8.5 -14.6 9.5 13.1 0.5 12.5 -1.2 2.5 -11.7 1.0 -11.6Z",
  "M2.5 -21.0 1.0 -20.7 0.6 -20.0 1.7 -10.0 1.8 -0.5 -3.0 15.0 -4.5 18.0 -2.5 19.4 -0.9 18.5 4.9 -0.5 4.2 -20.0 2.5 -21.0Z",
  "M-1.0 -21.0 -4.0 -20.2 -4.5 -18.5 -3.5 -17.6 1.0 -17.8 7.0 -11.5 8.0 -1.2 1.0 5.3 -4.5 1.2 -9.5 -5.1 -11.5 -4.8 -15.5 -2.0 -17.0 0.5 -15.5 2.3 -2.5 10.0 3.0 16.0 5.0 16.9 6.8 15.5 9.6 11.0 13.8 3.5 14.5 1.0 10.8 -4.0 9.4 -13.0 2.5 -20.4 -1.0 -21.0ZM-11.0 -1.5 -12.5 -0.5 -12.6 0.5 -5.5 4.5 -9.5 -0.9 -11.0 -1.5ZM10.0 0.9 1.8 9.0 2.0 10.5 4.0 12.8 5.3 12.5 11.2 2.5 11.0 1.0 10.0 0.9Z",
  "M-4.5 -16.5 -6.3 -15.0 -18.9 6.5 -18.0 8.7 -6.0 16.2 -4.5 16.5 -2.8 15.5 4.0 4.1 8.5 3.1 12.5 0.9 18.5 -6.1 20.6 -7.5 19.3 -10.0 18.0 -10.7 11.5 -2.0 7.5 0.4 5.5 0.5 4.2 -0.5 -2.4 -15.0 -4.5 -16.5ZM-4.5 -11.6 -15.4 6.0 -14.6 7.5 -5.0 13.0 -4.0 12.3 1.9 2.0 -3.5 -10.9 -4.5 -11.6Z",
  "M-5.5 -2.1 -9.8 16.5 -9.7 17.5 -8.5 18.2 -6.3 17.5 -6.5 15.5 -4.1 4.0 1.7 -2.0 -5.5 -2.1Z",
  "M-8.0 -19.0 -11.5 -17.5 -12.7 -16.0 -12.1 -9.5 -16.1 3.0 -15.0 5.5 -6.0 12.8 -4.8 12.0 -5.2 10.5 -13.0 3.0 -8.0 -12.5 -5.6 -13.0 12.5 -9.4 14.4 -10.5 13.0 -12.1 -1.5 -15.0 -5.0 -18.9 -8.0 -19.0ZM9.5 -0.5 8.1 0.5 5.8 6.0 5.8 7.5 7.0 8.9 13.6 7.0 14.9 5.5 14.6 4.0 12.7 1.5 11.0 -0.3 9.5 -0.5Z",
  "M-14.0 -18.1 -16.3 -12.0 -16.1 -10.0 -12.0 -7.6 -7.0 -8.8 -4.9 -8.0 -3.6 -5.5 -5.5 -3.0 -5.8 -1.5 -3.3 1.0 -3.3 6.0 -0.5 8.4 6.0 11.2 6.5 17.0 7.5 18.6 9.5 19.4 11.5 18.9 12.9 16.5 11.0 7.9 7.5 5.4 0.0 2.4 -1.1 -3.0 -0.4 -6.0 -1.0 -7.5 -3.1 -10.5 -5.0 -11.6 -12.6 -11.0 -13.2 -12.0 -11.9 -17.0 -12.5 -18.1 -14.0 -18.1Z",
  "M11.0 -10.5 9.5 -8.2 3.5 -4.8 -3.0 -3.5 -7.1 -4.0 -13.0 -6.7 -16.5 -9.1 -18.5 -8.2 -19.1 -7.0 -17.9 -5.5 -17.1 -1.5 -14.9 11.0 -15.8 13.0 -15.2 14.0 -12.5 14.9 -11.0 12.2 -2.3 5.5 5.5 3.7 13.0 4.7 15.0 6.1 16.6 5.0 17.2 3.5 15.7 1.5 13.7 -6.5 14.5 -9.5 13.0 -10.5 11.0 -10.5ZM10.0 -5.1 4.5 -2.2 -0.0 -1.0 -0.4 1.0 0.5 1.7 5.0 0.9 12.0 1.5 12.4 0.5 11.5 -3.7 10.0 -5.1ZM-14.0 -3.8 -14.5 -3.0 -12.6 8.5 -12.0 9.0 -6.0 4.0 -5.6 1.5 -6.5 -0.5 -14.0 -3.8Z",
  "M1.5 -15.0 -1.5 2.6 -4.0 4.0 -19.5 9.1 -20.6 10.5 -20.0 12.5 -7.5 21.6 -0.9 21.5 1.6 5.5 15.5 0.6 17.5 -0.3 18.2 -1.5 17.5 -2.3 14.0 -2.1 2.5 1.6 2.2 -1.0 4.0 -11.5 2.8 -14.5 1.5 -15.0ZM-3.5 6.8 -14.5 10.4 -16.0 12.0 -5.0 19.9 -4.0 20.0 -1.9 7.5 -2.5 6.6 -3.5 6.8Z",
  "M-6.0 -21.0 -12.7 -9.5 -11.5 -7.2 -4.6 -2.0 -7.0 3.5 -8.2 9.5 -6.5 19.0 -5.5 20.2 -3.2 19.0 -5.3 10.0 -4.0 3.5 -2.7 4.0 2.1 16.0 3.5 17.6 5.7 17.0 9.8 9.5 9.1 8.0 0.0 -2.4 -9.4 -9.5 -3.3 -19.0 -4.1 -20.5 -6.0 -21.0ZM0.5 2.8 0.4 4.0 3.5 12.1 4.5 13.0 6.0 11.0 6.1 9.0 0.5 2.8Z",
  "M-5.5 -15.1 -7.3 -13.0 -11.3 10.5 -14.9 14.5 -15.0 15.9 -13.5 16.7 -10.5 14.5 -9.0 14.3 7.0 17.2 10.0 18.4 10.7 17.5 11.0 14.3 7.5 14.5 6.0 13.0 10.2 -9.5 9.9 -11.5 8.5 -12.7 -5.5 -15.1ZM-3.5 -12.1 -4.5 -11.5 -5.0 -9.7 -8.3 11.0 -7.0 11.8 2.5 13.2 4.2 7.0 7.1 -9.5 6.0 -10.2 -3.5 -12.1Z",
  "M3.5 -17.1 -0.5 -15.4 -1.3 -10.0 -0.7 -8.5 1.0 -7.7 5.8 -8.5 3.7 3.0 4.5 3.9 6.0 4.1 7.4 3.5 9.3 -11.0 5.5 -16.1 3.5 -17.1ZM2.5 -13.7 1.6 -12.0 2.5 -10.8 4.1 -11.5 4.6 -12.5 3.9 -13.5 2.5 -13.7ZM-6.0 -5.1 -8.2 -3.5 -8.4 -0.5 -7.3 2.0 -10.1 7.5 -7.0 11.0 -10.2 16.5 -7.8 21.5 -6.0 21.8 -4.7 21.5 -7.0 16.5 -4.3 12.0 -3.9 10.0 -6.1 6.0 -5.4 2.5 -3.5 1.0 -2.8 -1.0 -3.5 -4.1 -6.0 -5.1Z",
  "M0.0 -19.8 -1.6 -18.5 -1.7 -17.5 5.5 -6.9 5.9 -3.0 3.5 2.0 -4.5 9.7 -5.3 11.5 -4.0 16.7 -0.6 21.5 1.5 21.8 3.2 21.5 -1.6 15.0 -2.3 12.0 5.9 3.5 8.0 -0.5 9.0 -5.0 8.1 -8.0 1.6 -19.5 0.0 -19.8Z",
  "M3.0 -17.3 2.2 -16.0 3.5 -6.5 2.4 0.5 -1.5 6.0 -11.0 11.5 -10.5 13.6 -9.5 14.5 0.5 8.0 5.2 1.5 6.4 -6.0 5.6 -16.5 5.0 -17.2 3.0 -17.3ZM2.0 17.9 0.7 19.5 1.0 21.5 7.5 21.5 7.5 19.5 6.5 18.0 2.0 17.9Z",
  "M-8.0 -19.3 -9.7 -17.5 -9.4 -16.5 -5.2 -13.5 1.0 -7.0 2.8 -8.0 3.5 -9.0 3.1 -10.0 -5.6 -17.5 -6.5 -19.1 -8.0 -19.3ZM2.0 -2.7 1.1 -1.0 2.2 5.0 3.0 6.5 4.0 6.7 5.1 5.0 4.2 -1.5 3.5 -2.7 2.0 -2.7ZM2.0 13.5 -1.3 17.0 -2.3 19.5 0.0 21.0 5.0 21.4 6.2 20.0 6.2 18.5 4.2 14.0 3.0 13.2 2.0 13.5Z",
  "M-5.5 -18.8 -7.0 -17.5 -7.1 -16.5 2.7 -6.0 4.3 -3.0 7.4 10.0 7.5 17.0 5.6 21.5 9.0 21.6 10.2 17.5 10.1 7.5 6.4 -5.5 -4.0 -18.6 -5.5 -18.8Z",
  "M-15.0 -12.0 -16.8 -10.0 -15.0 -8.2 -11.4 -1.5 -9.5 -0.6 -6.5 -2.1 -5.3 -1.5 -3.0 14.6 -0.5 14.4 0.2 13.5 -2.5 -4.0 11.0 -5.9 12.0 -5.5 10.3 -1.5 11.2 13.0 9.6 17.0 10.5 18.1 13.0 18.8 15.0 18.3 15.5 17.0 13.9 12.0 13.3 -1.0 16.0 -6.5 15.5 -8.7 14.0 -9.2 -3.0 -7.2 -9.5 -4.2 -12.8 -10.0 -13.1 -12.0 -14.0 -12.5 -15.0 -12.0Z",
];

// The ring, chevrons and event horizon, centred on 0,0 at full size.
function gateRingMarkup(m, { lit, active, ports, id }) {
  // Symbol i sits at -90° + i × 360°/39; the source cell (67 px of ring) is
  // scaled to this ring's 22 units.
  let g = "";
  for (let i = 0; i < 39; i++) {
    const a = -Math.PI / 2 + (i / 39) * Math.PI * 2;
    const b = a + Math.PI / 39;
    g += `<path d="${GATE_GLYPHS[i]}" class="${i ? "" : "origin"}" transform="translate(${(Math.cos(a) * 214).toFixed(1)} ${(Math.sin(a) * 214).toFixed(1)}) rotate(${((a * 180) / Math.PI + 90).toFixed(1)}) scale(0.33)"/>`
      + `<line x1="${(Math.cos(b) * 203).toFixed(1)}" y1="${(Math.sin(b) * 203).toFixed(1)}" x2="${(Math.cos(b) * 225).toFixed(1)}" y2="${(Math.sin(b) * 225).toFixed(1)}" class="gt-seam"/>`;
  }
  const portOf = ports ? Object.fromEntries(Object.entries(GATE_PORTS).map(([kind, i]) => [i, kind])) : {};
  let chevrons = "";
  for (let i = 0; i < 9; i++) {
    const angle = -90 + i * 40;
    const a = (angle * Math.PI) / 180;
    const kind = portOf[i];
    const port = kind && ports[kind];
    const cls = !ports ? (i < lit ? "on" : "")
      : port ? `port ${kind} ${port[0] ? "on" : ""}` : kind ? "unused" : GATE_LEVEL.indexOf(i) < lit ? "on" : "";
    chevrons += `<g class="gt-chevron ${cls}" transform="translate(${(Math.cos(a) * 252).toFixed(1)} ${(Math.sin(a) * 252).toFixed(1)}) rotate(${angle + 90})">
      <path d="M-16 -27 L16 -27 L13 -19 L-13 -19 Z" class="gt-chevron-clamp"/>
      <path d="M-28 -18 L28 -18 L24 -8 L9 20 L-9 20 L-24 -8 Z" class="gt-chevron-body"/>
      <path d="M-24 -8 L-9 20 M24 -8 L9 20 M-28 -18 L28 -18" class="gt-chevron-rib"/>
      <path d="M-19 -11 L19 -11 L0 17 Z" class="gt-chevron-recess"/>
      <path d="M-14 -8 L14 -8 L0 12 Z" class="gt-chevron-light"/></g>`;
  }
  const spin = m.live.chargeActive ? "cw" : m.live.dischargeActive ? "ccw" : "";
  const ripples = Array.from({ length: 6 }, (_, i) => `<circle r="${(i + 1) * 26}" style="--d:${loopPhase(6, i)}"/>`).join("");
  return `
    <g class="gt-horizon ${active ? "open" : ""}"><circle r="190" class="gt-eh" fill="url(#gt-eh-${id})"/><g class="gt-ripples">${ripples}</g></g>
    <circle r="220" class="gt-ring-base"/>
    <circle r="246" class="gt-ring-edge"/><circle r="194" class="gt-ring-edge"/>
    <circle r="214" class="gt-ring-track"/>
    <g class="gt-glyphs ${spin}" style="--d:${loopPhase(180)}">${g}</g>
    ${chevrons}`;
}

// Each gate gets its own gradient ids: both are in the card, and a gradient
// inside the hidden one would not paint the visible one.
const gateDefs = (id) => `<defs>
  <radialGradient id="gt-eh-${id}" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#e6fbff" stop-opacity=".95"/><stop offset=".35" stop-color="#5fc8ff" stop-opacity=".75"/><stop offset=".8" stop-color="#1b5fb8" stop-opacity=".55"/><stop offset="1" stop-color="#0a2a5c" stop-opacity=".2"/></radialGradient>
  <linearGradient id="gt-zpm-${id}" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff7a18"/><stop offset="1" stop-color="#ffd27a"/></linearGradient>
</defs>`;

// Wide layout: the full gate, nine chevrons for the battery level.
// Wide layout: the full gate, nine chevrons for the battery level, with
// the corner pictures beside it (viewBox -400…400 × -300…300).
const GATE_FULL_ICONS = { pv: [-345, -232], grid: [345, -232], load: [345, 196], battery: [-345, 196] };

function gateFull(m, lit, active) {
  const icons = Object.entries(GATE_FULL_ICONS)
    .filter(([kind]) => (kind !== "pv" || m.config.showSolar) && (kind !== "battery" || m.config.showBattery))
    .map(([kind, [x, y]]) => `<g transform="translate(${x} ${y})">${gateIcon(kind, m, "full")}</g>`).join("");
  return `<svg class="gt-svg" viewBox="-400 -300 800 600" aria-hidden="true">${gateDefs("full")}${icons}${gateRingMarkup(m, { lit, active, ports: null, id: "full" })}</svg>`;
}

// Pictures for the corners, drawn around 0,0 within about ±40.
function gateIcon(kind, m, id) {
  const { live } = m;
  if (kind === "pv") {
    // An array of solar cells on a stand.
    const cells = [];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) cells.push(`<path d="M${-30 + c * 15 + r * 3} ${-18 + r * 11} h13 l2 9 h-13 z"/>`);
    return `<g class="gt-icon pv ${live.solarActive ? "on" : ""}"><path class="gt-icon-stand" d="M0 15 V30 M-12 30 H12"/><g class="gt-icon-cells">${cells.join("")}</g></g>`;
  }
  if (kind === "battery") {
    // A zero point module: a crystal filled to the battery level.
    const level = isNum(live.soc) ? clamp(live.soc, 0, 100) / 100 : 0;
    const top = 30 - level * 56;
    return `<g class="gt-icon battery ${live.chargeActive || live.dischargeActive ? "on" : ""}">
      <clipPath id="gt-zpm-clip-${id}"><path d="M-11 -28 L11 -28 L16 -20 L16 22 L11 30 L-11 30 L-16 22 L-16 -20 Z"/></clipPath>
      <path class="gt-zpm-glass" d="M-11 -28 L11 -28 L16 -20 L16 22 L11 30 L-11 30 L-16 22 L-16 -20 Z"/>
      <rect clip-path="url(#gt-zpm-clip-${id})" x="-16" y="${top.toFixed(1)}" width="32" height="${(30 - top).toFixed(1)}" fill="url(#gt-zpm-${id})" class="gt-zpm-core"/>
      <path class="gt-zpm-band" d="M-14 -34 H14 V-28 H-14 Z M-14 30 H14 V36 H-14 Z"/>
      <path class="gt-zpm-edge" d="M0 -28 V30"/></g>`;
  }
  if (kind === "grid") {
    // A dial home device: rings of glyph keys round a red dome.
    // Seen from the front and above: a pedestal, a round console with two
    // rings of nineteen keys, and the red dome in the middle.
    const ring = (rx, ry, w, cy) => Array.from({ length: 19 }, (_, i) => {
      const a = (i / 19) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(a) * rx;
      const y = cy + Math.sin(a) * ry;
      return `<rect x="${(x - w / 2).toFixed(1)}" y="${(y - w * 0.22).toFixed(1)}" width="${w}" height="${(w * 0.44).toFixed(1)}" rx="1" transform="rotate(${((a * 180) / Math.PI + 90).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
    }).join("");
    return `<g class="gt-icon grid ${live.importActive || live.exportActive ? "on" : ""}">
      <ellipse class="gt-dhd-foot" cx="0" cy="32" rx="24" ry="5"/>
      <path class="gt-dhd-stand" d="M-34 -2 C-30 14 -14 18 -12 30 L12 30 C14 18 30 14 34 -2 Z"/>
      <ellipse class="gt-dhd-rim" cx="0" cy="-2" rx="42" ry="15"/>
      <ellipse class="gt-dhd-top" cx="0" cy="-4" rx="40" ry="13.5"/>
      <g class="gt-dhd-keys outer">${ring(33, 10.5, 6, -4)}</g>
      <g class="gt-dhd-keys inner">${ring(21, 6.5, 4.4, -4)}</g>
      <ellipse class="gt-dhd-dome" cx="0" cy="-5" rx="11" ry="5.5"/>
      <ellipse class="gt-dhd-shine" cx="-3" cy="-7" rx="4" ry="1.6"/></g>`;
  }
  // The base inside the mountain.
  return `<g class="gt-icon load ${live.loadActive ? "on" : ""}">
    <path class="gt-sgc-mountain" d="M-40 28 L-16 -18 L-4 -8 L10 -30 L40 28 Z"/>
    <path class="gt-sgc-door" d="M-12 28 V8 H12 V28"/><path class="gt-sgc-door-line" d="M0 8 V28"/>
    <path class="gt-sgc-lights" d="M-26 20 h4 M-18 14 h4 M18 16 h4 M26 22 h4"/></g>`;
}

// Compact layout: a smaller gate with the corner pictures linked to their
// connection chevrons.
function gateCompact(m, lit, active) {
  const { live, config } = m;
  const ports = {
    pv: config.showSolar && [live.solarActive, false],
    grid: [live.importActive || live.exportActive, live.exportActive],
    load: [live.loadActive, true],
    battery: config.showBattery && [live.chargeActive || live.dischargeActive, live.chargeActive],
  };
  let lines = "";
  let icons = "";
  for (const [kind, index] of Object.entries(GATE_PORTS)) {
    const port = ports[kind];
    if (!port) continue;
    const angle = ((-90 + index * 40) * Math.PI) / 180;
    const tip = [Math.cos(angle) * 276 * GATE_SCALE, Math.sin(angle) * 276 * GATE_SCALE];
    const [x, y] = GATE_ICONS[kind];
    const start = [x + (x < 0 ? 44 : -44), y + (y < 0 ? 18 : -14)];
    lines += flowPath(`M${start[0]} ${start[1]} Q${((start[0] + tip[0]) / 2).toFixed(0)} ${start[1]} ${tip[0].toFixed(1)} ${tip[1].toFixed(1)}`, port[0], port[1], kind);
    icons += `<g transform="translate(${x} ${y})">${gateIcon(kind, m, "compact")}</g>`;
  }
  return `<svg class="gt-svg" viewBox="-330 -280 660 560" aria-hidden="true">${gateDefs("compact")}
    <g class="gt-lines" fill="none" stroke-linecap="round">${lines}</g>
    ${icons}
    <g transform="scale(${GATE_SCALE})">${gateRingMarkup(m, { lit, active, ports, id: "compact" })}</g></svg>`;
}

function renderGate(m) {
  const { t, locale, live, config } = m;
  const f = m.forecast;
  const hub = inverterHub(m);
  const soc = isNum(live.soc) ? clamp(live.soc, 0, 100) : null;
  const pvCapacity = positiveNumber(config.pv_capacity);
  // Chevrons: the battery level in nine steps; without a battery, the
  // inverter's load (or the panels' share of their size).
  const level = config.showBattery && isNum(soc) ? soc
    : isNum(hub.share) ? hub.share
      : pvCapacity ? clamp((live.solar / (pvCapacity * 1000)) * 100, 0, 100) : 0;
  const active = live.loadActive || live.solarActive;
  const atReserve = config.showBattery && isNum(soc) && soc <= f.minSoc + 1;
  const gridValue = live.importActive ? live.gridImport : live.exportActive ? live.gridExport : Math.abs(live.grid);
  const batteryFlow = live.dischargeActive ? live.discharge : live.charge;
  const max = Math.max(1000, (pvCapacity || 0) * 1000, live.solar, live.load, live.charge, live.discharge, live.gridImport, live.gridExport);
  const rows = [
    config.showSolar && ["pv", t.solar, live.solar, live.solarActive, pvCapacity ? fill(t.gateOfCapacity, { pct: formatNumber((live.solar / (pvCapacity * 1000)) * 100, locale, 0), size: `${formatNumber(pvCapacity, locale, 1)} kWp` }) : "", m.ids.live.solar],
    config.showBattery && ["battery", t.battery, batteryFlow, live.chargeActive || live.dischargeActive, batteryStatus(m), batteryEntityId(m)],
    ["grid", t.grid, gridValue, live.importActive || live.exportActive, gridStatus(m), gridEntityId(m)],
    ["load", t.home, live.load, live.loadActive, t.consumption, m.ids.live.load],
    ["inverter", t.inverter, hub.power, hub.power > ACTIVE_W, isNum(hub.share) ? fill(t.gateOfCapacity, { pct: formatNumber(hub.share, locale, 0), size: formatPower(m.system.inverter.rated, locale) }) : "", "inverter"],
  ].filter(Boolean);
  const locked = rows.filter((r) => r[3]).length;
  const status = atReserve ? ["alert", t.gateReserve]
    : live.chargeActive ? ["on", t.gateInbound]
      : live.dischargeActive ? ["on", t.gateOutbound]
        : live.exportActive ? ["on", t.gateExport]
          : live.importActive ? ["on", t.gateImport]
            : ["", t.gateIdle];
  const kv = (label, value) => `<div class="gt-kv"><small>${escapeHtml(label)}</small><b>${escapeHtml(value)}</b></div>`;
  const own = formatPercent(todayOwnShare(m), locale);
  const corner = (cls, pos, label, value) => `<div class="gt-node ${cls}" style="${pos}">${escapeHtml(label)}<b>${escapeHtml(value)}</b></div>`;
  const values = {
    pv: [t.solar, formatPower(live.solar, locale), m.ids.live.solar],
    grid: [t.grid, formatPower(gridValue, locale), gridEntityId(m)],
    battery: [t.battery, `${live.dischargeActive ? "−" : live.chargeActive ? "+" : ""}${formatPower(batteryFlow, locale)}`, batteryEntityId(m)],
    load: [t.home, formatPower(live.load, locale), m.ids.live.load],
  };
  // Readouts under the corner pictures of the compact gate (viewBox -330…330 × -280…280).
  // A readout under a corner picture; positions follow each gate's viewBox.
  const label = (kind, wide = false) => {
    const [x, y] = (wide ? GATE_FULL_ICONS : GATE_ICONS)[kind];
    const [w, h] = wide ? [800, 600] : [660, 560];
    const [name, value, entity] = values[kind];
    return `<button class="gt-label ${kind}" style="left:${(((x + w / 2) / w) * 100).toFixed(1)}%;top:${(((y + 44 + h / 2) / h) * 100).toFixed(1)}%" ${entityAttr(entity)}>${escapeHtml(name)}<b>${escapeHtml(value)}</b></button>`;
  };
  const shown = ["pv", "grid", "battery", "load"].filter((kind) => (kind !== "pv" || config.showSolar) && (kind !== "battery" || config.showBattery));
  const center = `
        <button class="gt-center" data-action="inverter" title="${escapeHtml(t.inverterDetails)}">
          ${config.showBattery ? `
            <small>${escapeHtml(t.battery)}</small><b>${escapeHtml(formatPercent(soc, locale))}</b>
            ${f.capacity ? `<span>${escapeHtml(`${isNum(f.stored) ? formatNumber(f.stored, locale, 1) : "—"} / ${formatEnergy(f.capacity, locale)}`)}</span>` : ""}
            ${f.at ? `<em>${escapeHtml(`${f.mode === "charging" ? "▲" : "▼"} ${formatWhen(f.at, locale)}`)}</em>` : ""}` : `
            <small>${escapeHtml(t.inverter)}</small><b>${escapeHtml(formatPower(hub.power, locale))}</b>`}
        </button>`;
  return `
    <header class="gt-top">
      <span class="gt-tag">SGC-E</span>
      <div class="gt-title"><h1>${escapeHtml(m.name)} · ${escapeHtml(t.gateTitle)}</h1><span>${escapeHtml(t.gateSub)} · ${escapeHtml(String(m.station || "—"))}</span></div>
      <div class="gt-right"><span>${escapeHtml(m.now.toLocaleDateString(locale, { day: "numeric", month: "short" }))} · ${escapeHtml(clockText(m))}</span><span class="gt-live ${m.status.state}">${escapeHtml(m.t[m.status.state])}</span></div>
    </header>
    <div class="gt-layout ${config.wide ? "wide" : ""}">
      <div class="gt-gate gt-compact">
        ${gateCompact(m, Math.round((level / 100) * GATE_LEVEL.length), active)}
        ${center}
        ${shown.map((kind) => label(kind)).join("")}
      </div>
      <div class="gt-gate gt-full">
        ${gateFull(m, Math.round((level / 100) * 9), active)}
        ${center}
        ${shown.map((kind) => label(kind, true)).join("")}
      </div>
      <div class="gt-panel gt-dial">
        <div class="gt-ph"><span>${escapeHtml(t.gateDial)}</span><b>${escapeHtml(fill(t.gateLocked, { n: locked, total: rows.length }))}</b></div>
        ${rows.map(([cls, label, value, active, note, entity], i) => `
          <button class="gt-row ${cls}" ${entity === "inverter" ? 'data-action="inverter"' : entityAttr(entity)}>
            <i class="gt-ch ${active ? "on" : ""}"></i>
            <span><small>${escapeHtml(fill(t.gateChevron, { n: i + 1 }))}</small><strong>${escapeHtml(label)}</strong><i class="gt-bar"><i style="width:${clamp((value / max) * 100, active ? 2 : 0, 100).toFixed(0)}%"></i></i></span>
            <span class="gt-v">${escapeHtml(formatPower(value, locale))}${note ? `<em>${escapeHtml(note)}</em>` : ""}</span>
          </button>`).join("")}
        <div class="gt-status ${status[0]}">◆ ${escapeHtml(status[1])} ◆</div>
        <div class="gt-kvs">
          ${config.showBattery ? kv(f.mode === "charging" ? t.chipFull : t.chipLasts, f.at ? formatWhen(f.at, locale) : "—") : kv(t.gridImport, formatEnergy(m.today.gridImport, locale))}
          ${config.showBattery ? kv(t.stored, isNum(f.stored) ? formatEnergy(f.stored, locale) : "—") : kv(t.gridExport, formatEnergy(m.today.gridExport, locale))}
          ${config.showBattery ? kv(t.gateReserveLabel, formatPercent(f.minSoc, locale)) : kv(t.consumption, formatEnergy(m.today.load, locale))}
          ${kv(t.autarkyToday, own)}
        </div>
      </div>
      <div class="gt-energy">${energySectionHtml(m)}</div>
      <div class="sfc-sections">${inverterHtml(m)}${virtualStorageHtml(m)}${insightsHtml(m)}${systemHtml(m)}${panelsHtml(m)}</div>
    </div>`;
}

// --------------------------------------------------------------------------
// Reactor: a helmet HUD around an arc reactor. Its light segments glow with
// the solar power (PV share of the installation), the weather shows on the
// visor glass, and the inner arcs turn while the battery charges/discharges.
// --------------------------------------------------------------------------

const REACTOR_WEATHER_ICON = {
  sunny: "☀", "clear-night": "☾", partlycloudy: "⛅", cloudy: "☁", fog: "≋", rainy: "☂", pouring: "☂",
  snowy: "❄", "snowy-rainy": "❄", hail: "☂", lightning: "ϟ", "lightning-rainy": "ϟ", windy: "≈", "windy-variant": "≈", exceptional: "!",
};

// How hard the reactor runs, 0–1: solar power against the installation's
// size (pv_capacity, else the inverter's rating, else today's peak).
function reactorHeat(m) {
  const { live, config } = m;
  if (!config.showSolar) return clamp((inverterHub(m).share ?? 0) / 100, 0, 1);
  const size = (positiveNumber(config.pv_capacity) || 0) * 1000 || m.system?.inverter?.rated || m.insights?.day?.solarPeak?.value || 5000;
  return clamp(live.solar / size, 0, 1);
}

function reactorCore(heat, live) {
  const cx = 260, cy = 250;
  const rad = (a) => (a - 90) * Math.PI / 180;
  const P = (r, a) => [cx + r * Math.cos(rad(a)), cy + r * Math.sin(rad(a))];
  const f = (v) => v.toFixed(1);
  const band = (r1, r2, a0, a1) => {
    const [x0, y0] = P(r2, a0), [x1, y1] = P(r2, a1), [x2, y2] = P(r1, a1), [x3, y3] = P(r1, a0);
    return `M${f(x0)} ${f(y0)}A${r2} ${r2} 0 0 1 ${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}A${r1} ${r1} 0 0 0 ${f(x3)} ${f(y3)}Z`;
  };
  const lit = Math.round(heat * 10);
  let segs = "", coils = "", holes = "", arms = "", arcs = "", mesh = "";
  for (let i = 0; i < 10; i++) {
    const a = i * 36;
    segs += `<path class="rx-seg ${i < lit ? "on" : ""}" style="--i:${i}" d="${band(63, 101, a + 7, a + 29)}"/>`;
    let wind = "";
    for (let r = 67; r <= 97; r += 2.2) wind += `M${cx - 12} ${f(cy - r)}H${cx + 12}`;
    coils += `<g transform="rotate(${a} ${cx} ${cy})"><rect x="${cx - 14}" y="${cy - 99}" width="28" height="34" rx="2" fill="#1b1f24"/>`
      + `<rect x="${cx - 12}" y="${cy - 98}" width="24" height="32" rx="1.5" fill="url(#rx-cu)"/><path d="${wind}" stroke="#3d1a06" stroke-width=".9" opacity=".75"/>`
      + `<rect x="${cx - 12}" y="${cy - 98}" width="24" height="32" rx="1.5" fill="none" stroke="#f3b27a" stroke-opacity=".35"/></g>`;
  }
  for (let i = 0; i < 24; i++) {
    const [x, y] = P(55, i * 15 + 7.5);
    holes += `<rect x="${f(x - 2)}" y="${f(y - 2)}" width="4" height="4" transform="rotate(${i * 15} ${f(x)} ${f(y)})"/>`;
  }
  for (const a of [30, 150, 270]) {
    const [x1, y1] = P(22, a), [x2, y2] = P(60, a), [bx, by] = P(50, a);
    arms += `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="#14181c" stroke-width="13" stroke-linecap="round"/>`
      + `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="#2c333a" stroke-width="9" stroke-linecap="round"/><circle cx="${f(bx)}" cy="${f(by)}" r="2.6" fill="#8c98a3"/>`;
    arcs += `<path d="${band(31, 40, a + 14, a + 106)}"/>`;
  }
  for (let y = -20; y <= 20; y += 5) {
    for (let x = -22; x <= 22; x += 5.8) {
      const ox = x + (Math.round((y + 20) / 5) % 2 ? 2.9 : 0);
      if (ox * ox + y * y < 20 * 20) mesh += `M${f(cx + ox)} ${f(cy + y - 2.6)}l2.2 1.3v2.6l-2.2 1.3l-2.2-1.3v-2.6z`;
    }
  }
  const spin = live.chargeActive ? "charging" : live.dischargeActive ? "discharging" : "";
  return `
    <circle class="rx-halo" cx="${cx}" cy="${cy}" r="${(125 + heat * 80).toFixed(0)}" fill="url(#rx-halo)"/>
    ${heat >= 0.8 ? `<g class="rx-rays">${Array.from({ length: 24 }, (_, i) => { const [x, y] = P(190 + (i % 3) * 16, i * 15 + 7); return `<line x1="${cx}" y1="${cy}" x2="${f(x)}" y2="${f(y)}" stroke-width="${2 + (i % 3)}" opacity="${0.05 + (i % 2) * 0.05}"/>`; }).join("")}</g>` : ""}
    <circle cx="${cx}" cy="${cy}" r="120" fill="#2b3036" stroke="#121518" stroke-width="2"/>
    <circle cx="${cx}" cy="${cy}" r="120" fill="#000" filter="url(#rx-tex)"/>
    <circle cx="${cx}" cy="${cy}" r="102" fill="#0b1820"/>
    <g class="rx-segs">${segs}</g>${coils}
    <circle cx="${cx}" cy="${cy}" r="62" fill="#15191d" stroke="#0a0c0e"/>
    <g class="rx-holes">${holes}</g>
    <circle cx="${cx}" cy="${cy}" r="44" fill="#0b1820"/>
    <g class="rx-arcs ${spin}">${arcs}</g>${arms}
    <circle cx="${cx}" cy="${cy}" r="26" fill="#1a1f24"/>
    <circle class="rx-core" cx="${cx}" cy="${cy}" r="23" fill="url(#rx-core)" filter="url(#rx-glow)"/>
    <path class="rx-mesh" d="${mesh}"/>`;
}

// The world outside the visor: sky by time of day, then the weather on the glass.
function reactorWeather(m) {
  const phase = dioramaSky(m.now).phase;
  const w = m.weather;
  const clear = !w || w.sun !== false;
  let g = "";
  let glass = "";
  if (phase === "night") {
    if (clear) g += [[40, 60], [96, 110], [150, 40], [380, 52], [440, 96], [490, 40], [70, 180], [470, 170], [330, 30], [210, 70]]
      .map(([x, y], i) => `<circle class="rx-star" style="--d:${(i * 0.7) % 4}s" cx="${x}" cy="${y}" r="${i % 3 ? 1 : 1.6}"/>`).join("");
  } else if (clear) {
    g += '<circle class="rx-sun" cx="440" cy="36" r="80" fill="url(#rx-flare)"/><circle cx="360" cy="112" r="8" fill="#ffe7b0" opacity=".22"/><circle cx="318" cy="150" r="14" fill="#9fe6ff" opacity=".1"/>';
  }
  if (w?.grey) g += `<rect width="520" height="560" fill="#7d8a99" opacity="${(w.grey * 0.35).toFixed(2)}"/>`;
  if (w?.fog) g += '<g class="rx-fog"><ellipse cx="160" cy="190" rx="260" ry="60" fill="url(#rx-haze)"/><ellipse cx="380" cy="390" rx="280" ry="70" fill="url(#rx-haze)"/></g>';
  if (w?.rain) {
    const n = w.rain > 1 ? 60 : 32;
    glass += `<g class="rx-rain">${Array.from({ length: n }, (_, i) => { const x = (i * 137) % 540 - 10, y = (i * 61) % 540; return `<line style="--d:-${((i * 0.37) % 1.4).toFixed(2)}s" x1="${x}" y1="${y}" x2="${x - 5}" y2="${y + 16}"/>`; }).join("")}</g>`;
    glass += `<g class="rx-drops">${Array.from({ length: w.rain > 1 ? 22 : 14 }, (_, i) => { const x = (i * 97 + 30) % 500 + 10, y = (i * 71 + 40) % 460, r = 2 + (i % 4); return `<g style="--d:-${((i * 1.3) % 9).toFixed(1)}s"><circle cx="${x}" cy="${y}" r="${r}"/><path d="M${x} ${y + r}q1 ${8 + r * 2} -1 ${14 + r * 3}"/></g>`; }).join("")}</g>`;
  }
  if (w?.snow) {
    glass += `<g class="rx-snow">${Array.from({ length: 36 }, (_, i) => `<circle style="--d:-${((i * 0.53) % 7).toFixed(2)}s" cx="${(i * 131) % 520}" cy="${(i * 53) % 300}" r="${i % 3 ? 1.5 : 2.3}"/>`).join("")}</g>`;
    glass += '<rect width="520" height="560" fill="url(#rx-frost)"/>';
  }
  if (w?.lightning) glass += '<rect class="rx-flash" width="520" height="560" fill="#dfe9ff"/>';
  return { phase, sky: g, glass };
}

function renderReactor(m) {
  const { t, locale, live, config } = m;
  const heat = reactorHeat(m);
  const pct = Math.round(heat * 100);
  const hub = inverterHub(m);
  const cx = 260, cy = 250;
  const P = (r, a) => [cx + r * Math.cos((a - 90) * Math.PI / 180), cy + r * Math.sin((a - 90) * Math.PI / 180)];
  const arc = (r, a0, a1) => {
    const [x0, y0] = P(r, a0), [x1, y1] = P(r, a1);
    return `M${x0.toFixed(1)} ${y0.toFixed(1)}A${r} ${r} 0 0 ${a1 > a0 ? 1 : 0} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  };
  const soc = isNum(live.soc) ? clamp(live.soc, 0, 100) : 0;
  const batteryFlow = live.dischargeActive ? live.discharge : live.charge;
  const gridValue = live.importActive ? live.gridImport : live.exportActive ? live.gridExport : Math.abs(live.grid);
  const sky = reactorWeather(m);
  const w = m.weather;
  // A few watts of grid import do not outrank the panels or the battery.
  const gridAssist = live.importActive && live.gridImport > Math.max(100, 0.25 * live.load);
  const mode = heat >= 0.8 && config.showSolar ? ["pv", t.reactorOverdrive]
    : gridAssist ? ["grid", t.reactorGrid]
      : config.showSolar && live.solarActive ? ["pv", t.reactorNominal]
        : live.dischargeActive ? ["battery", t.reactorReserve]
          : live.importActive ? ["grid", t.reactorGrid]
            : ["idle", t.reactorStandby];
  const scan = w
    ? [t.weatherNames?.[w.condition] || w.condition, isNum(w.temperature) ? `${formatNumber(w.temperature, locale, 0)}${w.unit}` : "", config.showSolar ? fill(t.reactorPvShare, { pct }) : ""].filter(Boolean).map(escapeHtml).join(" · ")
    : liveSentence(m) || escapeHtml(config.showSolar ? fill(t.reactorPvShare, { pct }) : t.reactorStandby);
  const ticks = Array.from({ length: 72 }, (_, i) => `<line x1="${cx}" y1="${cy - 136}" x2="${cx}" y2="${cy - 136 + (i % 6 ? 4 : 10)}" transform="rotate(${i * 5} ${cx} ${cy})" opacity="${i % 6 ? 0.35 : 0.8}"/>`).join("");
  const pos = (x, y) => `left:${((x / 520) * 100).toFixed(2)}%;top:${((y / 560) * 100).toFixed(2)}%`;
  const node = (cls, x, y, label, value, note, attr) => `
    <button class="rx-node ${cls}" style="${pos(x, y)}" ${attr}>
      <i></i><small>${escapeHtml(label)}</small><b>${escapeHtml(value)}</b>${note ? `<em>${escapeHtml(note)}</em>` : ""}
    </button>`;
  // Animations continue across re-renders: each starts at the phase it
  // would have reached by now (as in Foundation), so nothing jumps back.
  const spin = [60, 40, 24, 15][Math.min(3, Math.floor(heat * 4))];
  const phases = { spin, seg: 3.2, over: 1.2, holes: 2.4, arc6: 6, arc9: 9, core: 2.6, halo: 3.4, rays: 40, star: 4, sun: 6, fog: 60, rain: 1.4, drip: 9, snow: 7, flash: 9, mode: 2 };
  const phaseVars = Object.entries(phases).map(([k, sec]) => `--p-${k}:${loopPhase(sec)}`).join(";");
  return `
    <div class="rx-stage ${heat >= 0.8 && config.showSolar ? "over" : ""} ${sky.phase} ${isNum(m.intro) ? "boot" : ""}" style="--spin:${spin}s;${phaseVars};--bt:${isNum(m.intro) ? m.intro.toFixed(2) : 0}s">
      <header class="rx-header">
        <div><small>${escapeHtml(t.reactorTitle)}</small><h1>${escapeHtml(m.name)}</h1></div>
        <div class="rx-right"><small>${escapeHtml(clockText(m))} · ${escapeHtml(m.t[m.status.state])}</small>
          ${w ? `<button class="rx-wx" ${entityAttr(w.entityId)}>${escapeHtml(REACTOR_WEATHER_ICON[w.condition] || "")} ${isNum(w.temperature) ? escapeHtml(`${formatNumber(w.temperature, locale, 0)}${w.unit}`) : ""}</button>` : ""}</div>
      </header>
      <div class="rx-visor">
        <svg viewBox="0 0 520 560" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="rx-cu" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6b2f0e"/><stop offset=".35" stop-color="#c9773d"/><stop offset=".55" stop-color="#e8a36a"/><stop offset="1" stop-color="#6b2f0e"/></linearGradient>
            <radialGradient id="rx-seg" cx="260" cy="250" r="101" gradientUnits="userSpaceOnUse"><stop offset=".3" stop-color="#fff"/><stop offset=".62" stop-color="#bfefff"/><stop offset="1" stop-color="#4cc2ff"/></radialGradient>
            <radialGradient id="rx-core"><stop offset="0" stop-color="#fff"/><stop offset=".6" stop-color="#cdf6ff"/><stop offset="1" stop-color="#3fbfff"/></radialGradient>
            <radialGradient id="rx-halo"><stop offset="0" stop-color="#9fe8ff" stop-opacity="${(0.25 + heat * 0.45).toFixed(2)}"/><stop offset="1" stop-color="#3fbfff" stop-opacity="0"/></radialGradient>
            <radialGradient id="rx-flare"><stop offset="0" stop-color="#fff3d0" stop-opacity=".9"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient>
            <radialGradient id="rx-frost" cx="50%" cy="50%" r="70%"><stop offset=".65" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#e8f4ff" stop-opacity=".35"/></radialGradient>
            <radialGradient id="rx-haze"><stop offset="0" stop-color="#c8d6e2" stop-opacity=".28"/><stop offset="1" stop-color="#c8d6e2" stop-opacity="0"/></radialGradient>
            <pattern id="rx-hex" width="40" height="70" patternUnits="userSpaceOnUse"><path d="M20 0l10 6v12l-10 6l-10-6v-12zM0 35l10 6v12l-10 6l-10-6v-12zM40 35l10 6v12l-10 6l-10-6v-12z" fill="none" stroke="#4fd8ff" stroke-opacity=".06"/></pattern>
            <filter id="rx-glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="${(1.5 + heat * 3.5).toFixed(1)}" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            <filter id="rx-tex"><feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="2" result="n"/><feColorMatrix in="n" values="0 0 0 0 .35  0 0 0 0 .38  0 0 0 0 .42  0 0 0 .55 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
          </defs>
          ${sky.sky}
          <rect width="520" height="560" fill="url(#rx-hex)"/>
          <path class="rx-frame" pathLength="1" d="M8 26Q260 -12 512 26L514 470C420 580 100 580 6 470Z"/>
          <g class="rx-boot-ticks"><g class="rx-ticks">${ticks}</g></g>
          ${/* The gauges stop above the battery and grid flow lines. */ ""}
          ${config.showBattery ? `<path class="rx-track" d="${arc(156, 330, 240)}"/>${soc >= 1 ? `<path class="rx-gauge battery" pathLength="1" d="${arc(156, 240, 240 + 0.9 * soc)}"/>` : ""}` : ""}
          ${config.showSolar ? `<path class="rx-track" d="${arc(156, 30, 120)}"/>${pct >= 1 ? `<path class="rx-gauge pv" pathLength="1" d="${arc(156, 120, 120 - 0.9 * pct)}"/>` : ""}` : ""}
          ${config.showBattery ? `<text class="rx-gtext battery" x="${(P(156, 333)[0] - 6).toFixed(0)}" y="${P(156, 333)[1].toFixed(0)}" text-anchor="end">SOC ${escapeHtml(formatPercent(live.soc, locale))}</text>` : ""}
          ${config.showSolar ? `<text class="rx-gtext pv" x="${(P(156, 27)[0] + 6).toFixed(0)}" y="${P(156, 27)[1].toFixed(0)}">PV ${pct}%</text>` : ""}
          <g fill="none" stroke-linecap="round">
            ${config.showSolar ? flowPath("M260 92 L260 112", live.solarActive, false, "pv") : ""}
            ${config.showBattery ? flowPath("M118 410 Q124 362 172 338", live.chargeActive || live.dischargeActive, live.chargeActive, "battery") : ""}
            ${flowPath("M402 410 Q396 362 348 338", live.importActive || live.exportActive, live.exportActive, "grid")}
            ${flowPath("M260 418 L260 462", live.loadActive, false, "load")}
          </g>
          <g class="rx-reactor">${reactorCore(heat, live)}</g>
          ${isNum(m.intro) ? `<g class="rx-bootseg">${Array.from({ length: 10 }, (_, i) => { const a = i * 36; const P2 = (rr, aa) => P(rr, aa).map((v) => v.toFixed(1)).join(" "); return `<path style="--i:${i}" d="M${P2(101, a + 7)}A101 101 0 0 1 ${P2(101, a + 29)}L${P2(63, a + 29)}A63 63 0 0 0 ${P2(63, a + 7)}Z"/>`; }).join("")}</g>` : ""}
          ${sky.glass}
        </svg>
        ${config.showSolar ? node("pv", 260, 60, t.sun, formatPower(live.solar, locale), "", entityAttr(m.ids.live.solar)) : ""}
        ${config.showBattery ? node("battery", 104, 440, batteryLabel(m), formatPower(batteryFlow, locale), [batteryStatus(m), batteryWhenShort(m)].filter(Boolean).join(" "), entityAttr(batteryEntityId(m))) : ""}
        ${node("grid", 416, 440, t.grid, formatPower(gridValue, locale), gridStatus(m), entityAttr(gridEntityId(m)))}
        ${node("load", 260, 488, t.home, formatPower(live.load, locale), "", entityAttr(m.ids.live.load))}
        <button class="rx-inv" style="${pos(260, 396)}" data-action="inverter" title="${escapeHtml(t.inverterDetails)}">
          <b>${escapeHtml(formatPower(hub.power, locale))}</b><small>${escapeHtml(t.inverter)}${isNum(hub.share) ? ` · ${escapeHtml(formatPercent(hub.share, locale))}` : ""}</small>
        </button>
      </div>
      <div class="rx-scan">
        <div><small>${escapeHtml(w ? t.reactorScan : t.reactorTelemetry)}</small><p>${scan}</p></div>
        <span class="rx-mode ${mode[0]}">${escapeHtml(mode[1])}</span>
      </div>
    </div>
    <div class="sfc-sections">${standardSections(m)}</div>`;
}

const THEME_RENDER = {
  diorama: renderDiorama,
  aurora: renderAurora,
  paper: renderPaper,
  lcars: renderLcars,
  atlantis: renderAtlantis,
  expanse: renderExpanse,
  foundation: renderFoundation,
  galaxy: renderGalaxy,
  gate: renderGate,
  reactor: renderReactor,
};
