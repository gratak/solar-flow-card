
const BASE_CSS = `
  :host { display: block; }
  /* background: glass – translucent card that lets the dashboard background
     show through, blurred so the readings stay legible. */
  ha-card.sfc.glass { background: var(--sfc-glass, rgba(6, 12, 20, .38)); backdrop-filter: blur(6px) saturate(1.25); -webkit-backdrop-filter: blur(6px) saturate(1.25); }
  ha-card.sfc {
    display: block;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    container-type: inline-size;
    font-family: var(--sfc-font);
    color: var(--sfc-text);
    background: var(--sfc-bg);
    border: 1px solid var(--sfc-frame, var(--sfc-border));
    border-radius: var(--sfc-radius, 24px);
    box-shadow: var(--sfc-shadow, none);
  }
  .sfc button { font: inherit; color: inherit; }
  .sfc [data-entity], .sfc [data-action] { cursor: pointer; }
  .sfc .sfc-click { cursor: pointer; }
  .sfc-sections { display: grid; gap: 12px; padding: 0 16px 16px; position: relative; }
  .sfc-section {
    padding: 14px;
    border-radius: var(--sfc-section-radius, 16px);
    background: var(--sfc-surface);
    border: 1px solid var(--sfc-border);
  }
  .sfc-head { display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 12px; }
  .sfc-head > div { display: flex; align-items: center; gap: 8px; min-width: 0; }
  .sfc-head h3 { margin: 0; font-size: 16px; font-family: var(--sfc-heading-font, inherit); font-weight: var(--sfc-heading-weight, 700); }
  .sfc-kicker {
    display: inline-grid; place-items: center; min-width: 34px; height: 24px; padding: 0 8px; box-sizing: border-box;
    border-radius: 999px; background: var(--sfc-accent-soft); color: var(--sfc-accent);
    font-size: 10px; font-weight: 800; letter-spacing: .05em;
  }
  .sfc-kicker svg { width: 14px; height: 14px; fill: none; stroke: currentColor; stroke-width: 2; }
  .sfc-hint { color: var(--sfc-muted); font-size: 11px; text-align: right; }
  .sfc-link { border: 0; background: none; color: var(--sfc-accent); font-weight: 700; font-size: 12px; cursor: pointer; padding: 0; }
  .sfc-badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 9px; border-radius: 999px; font-size: 11px; font-weight: 700;
    background: var(--sfc-badge-bg, rgba(0,0,0,.08)); color: var(--sfc-badge-text, inherit); vertical-align: middle; }
  .sfc-badge i { width: 7px; height: 7px; border-radius: 50%; background: #22c58b; }
  .sfc-badge.delayed i { background: #f0a020; }
  .sfc-badge.offline i { background: #e5484d; }

  /* Tabs */
  .sfc-tabs { display: grid; grid-auto-flow: column; grid-auto-columns: minmax(0, 1fr); gap: 4px; padding: 4px; margin-bottom: 12px;
    border-radius: var(--sfc-tabs-radius, 12px); background: var(--sfc-tab-bg); }
  .sfc-tab { border: 0; background: transparent; color: var(--sfc-muted); padding: 7px 2px; border-radius: var(--sfc-tab-radius, 9px);
    font-size: 11px; font-weight: 700; cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sfc-tab.on { background: var(--sfc-tab-on-bg); color: var(--sfc-tab-on); box-shadow: var(--sfc-tab-shadow, none); cursor: default; }

  /* Energy tiles */
  .sfc-tiles { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
  @container (min-width: 620px) { .sfc-tiles { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
  .sfc-tile { display: flex; align-items: center; gap: 10px; min-width: 0; padding: 10px 12px; text-align: left;
    border-radius: var(--sfc-tile-radius, 13px); border: 1px solid var(--sfc-border); background: var(--sfc-tile-bg); color: var(--sfc-c); }
  .sfc-tile:disabled { opacity: .55; cursor: default; }
  /* collapsible: true – a section's title folds it; folded, one line. */
  .sfc-foldable { cursor: pointer; }
  .sfc-head.sfc-foldable h3::after, small.sfc-foldable::after, .sfc-fold-head i::before {
    content: ""; display: inline-block; width: .42em; height: .42em; margin-left: .5em; vertical-align: .18em;
    border-right: 2px solid currentColor; border-bottom: 2px solid currentColor; transform: rotate(-135deg); opacity: .6; }
  .sfc-fold-head { width: 100%; display: flex; align-items: center; gap: 10px; padding: 0; border: 0; background: none; cursor: pointer; text-align: left; }
  .sfc-fold-head span { flex: 1; min-width: 0; font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-family: var(--sfc-heading-font, inherit); }
  .sfc-fold-head b { white-space: nowrap; font-family: var(--sfc-num-font, inherit); }
  .sfc-fold-head b small { color: var(--sfc-muted); font-weight: 500; font-size: .8em; font-family: var(--sfc-font); }
  .sfc-fold-head i::before { transform: rotate(45deg); vertical-align: .3em; }
  .sfc-section.sfc-folded { padding-top: 12px; padding-bottom: 12px; }
  .sfc-tile.computed:disabled { opacity: 1; }
  .sfc-tile.solar, .sfc-summary-item.selfuse, .sfc-summary-item.yield { --sfc-c: var(--sfc-pv); }
  .sfc-tile.load { --sfc-c: var(--sfc-load); }
  .sfc-tile.gridImport, .sfc-tile.gridExport, .sfc-summary-item.autarky { --sfc-c: var(--sfc-grid); }
  .sfc-tile.charge, .sfc-tile.discharge, .sfc-summary-item.money, .sfc-summary-item.co2 { --sfc-c: var(--sfc-battery); }
  .sfc-tile-icon { flex: 0 0 34px; width: 34px; height: 34px; display: grid; place-items: center;
    border-radius: var(--sfc-icon-radius, 10px); background: color-mix(in srgb, var(--sfc-c) 16%, transparent); }
  .sfc-tile-icon svg, .sfc-forecast-icon svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
  .sfc-tile-copy { min-width: 0; display: flex; flex-direction: column; gap: 2px; }
  .sfc-tile small, .sfc-summary-item small { color: var(--sfc-muted); font-size: 11px; line-height: 1.2; overflow: hidden;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
  .sfc-tile strong { color: var(--sfc-text); font-size: 15px; font-family: var(--sfc-num-font, inherit); white-space: nowrap; }
  .sfc-summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(128px, 1fr)); gap: 8px; margin-top: 10px; }
  .sfc-summary-item { min-width: 0; padding: 8px 10px; border-radius: var(--sfc-tile-radius, 11px); border: 1px solid var(--sfc-border);
    background: color-mix(in srgb, var(--sfc-tile-bg) 85%, var(--sfc-c, var(--sfc-accent)) 15%); }
  .sfc-summary-item small { font-size: 10px; }
  .sfc-summary-item strong { display: block; margin-top: 2px; font-size: 14px; font-family: var(--sfc-num-font, inherit); white-space: nowrap; }

  /* Battery forecast */
  .sfc-forecast { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 8px 12px; }
  .sfc-forecast-icon { width: 40px; height: 40px; display: grid; place-items: center; border-radius: 12px; color: var(--sfc-battery);
    background: color-mix(in srgb, var(--sfc-battery) 16%, transparent); }
  .sfc-forecast-copy { min-width: 0; }
  .sfc-forecast-copy small { display: block; color: var(--sfc-muted); font-size: 11px; }
  .sfc-forecast-copy strong { display: block; font-size: 14px; margin-top: 1px; }
  .sfc-forecast-copy em { display: block; color: var(--sfc-muted); font-size: 11px; font-style: normal; }
  .sfc-forecast-stored { font-size: 14px; white-space: nowrap; font-family: var(--sfc-num-font, inherit); }
  .sfc-forecast-bar { grid-column: 1 / -1; position: relative; height: 7px; border-radius: 999px; background: var(--sfc-track); }
  .sfc-forecast-bar i { position: absolute; inset: 0 auto 0 0; border-radius: inherit; background: var(--sfc-battery); }
  .sfc-forecast-bar b { position: absolute; top: -3px; bottom: -3px; width: 2px; border-radius: 1px; background: var(--sfc-load); }
  .sfc-vstore { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 8px 12px; --sfc-vs: var(--sfc-muted); }
  .sfc-vstore.surplus { --sfc-vs: var(--sfc-good, #3fb950); }
  .sfc-vstore.deficit { --sfc-vs: var(--sfc-bad, #f0524a); }
  .sfc-vstore .sfc-forecast-icon { color: var(--sfc-vs); }
  .sfc-vstore-value { color: var(--sfc-vs); }
  .sfc-vstore .sfc-forecast-bar i { background: var(--sfc-vs); opacity: .75; }
  .sfc-vstore-reset { grid-column: 1 / -1; margin-top: -4px; color: var(--sfc-muted); font-size: 11px; text-align: right; }

  /* Inverter details */
  .sfc-group + .sfc-group { margin-top: 12px; }
  .sfc-group h4, .sfc-serial { margin: 0 0 7px; color: var(--sfc-muted); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; }
  .sfc-strings { display: grid; gap: 7px; }
  .sfc-string, .sfc-reading { min-width: 0; border: 1px solid var(--sfc-border); border-radius: var(--sfc-tile-radius, 11px); background: var(--sfc-tile-bg); text-align: left; }
  .sfc-string { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 2px 10px; padding: 9px 12px; border-left: 3px solid var(--sfc-pv); }
  .sfc-string span { font-size: 12px; font-weight: 700; }
  .sfc-string b { grid-row: span 2; align-self: center; font-size: 15px; font-family: var(--sfc-num-font, inherit); }
  .sfc-string small { color: var(--sfc-muted); font-size: 11px; }
  .sfc-readings { display: grid; grid-template-columns: repeat(auto-fill, minmax(118px, 1fr)); gap: 7px; }
  .sfc-reading { padding: 8px 10px; }
  .sfc-reading small { display: block; color: var(--sfc-muted); font-size: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sfc-reading b { display: block; margin-top: 2px; font-size: 13px; font-family: var(--sfc-num-font, inherit); }
  .sfc-empty-note { margin: 0; color: var(--sfc-muted); font-size: 12px; }

  /* Panels */
  .sfc-panel-string + .sfc-panel-string { margin-top: 8px; }
  .sfc-string-label { display: block; margin-bottom: 5px; color: var(--sfc-muted); font-size: 10px; letter-spacing: .06em; text-transform: uppercase; }
  .sfc-panel-grid { display: grid; grid-template-columns: repeat(var(--cols, 8), minmax(0, 1fr)); gap: 6px; }
  @container (max-width: 420px) { .sfc-panel-grid { grid-template-columns: repeat(min(var(--cols, 8), 4), minmax(0, 1fr)); } }
  .sfc-panel { min-width: 0; padding: 8px 4px; display: grid; justify-items: center; gap: 1px; border-radius: var(--sfc-tile-radius, 10px);
    border: 1px solid color-mix(in srgb, var(--sfc-pv) 30%, var(--sfc-border));
    background: linear-gradient(0deg, color-mix(in srgb, var(--sfc-pv) 22%, transparent) var(--share), transparent var(--share)), var(--sfc-tile-bg); }
  .sfc-panel.weak { border-color: var(--sfc-load); box-shadow: inset 0 0 0 1px var(--sfc-load); }
  .sfc-panel small { color: var(--sfc-muted); font-size: 10px; font-weight: 700; }
  .sfc-panel strong { font-size: 13px; font-family: var(--sfc-num-font, inherit); }
  .sfc-panel span { color: var(--sfc-muted); font-size: 10px; }
  .sfc-panels-note { margin: 10px 0 0; color: var(--sfc-muted); font-size: 11px; }
  .sfc-panels-note.warn { color: var(--sfc-load); }
  .sfc-panel.estimate { border-style: dashed; }
  .sfc-panels-note.estimate { font-size: 10px; font-style: italic; line-height: 1.35; }

  /* Chart */
  .sfc-chart { margin-bottom: 12px; }
  .sfc-chart.loading .sfc-plot { opacity: .55; }
  .sfc-legend { display: flex; flex-wrap: wrap; gap: 5px 12px; margin-bottom: 8px; }
  .sfc-legend button { display: inline-flex; align-items: center; gap: 5px; padding: 2px 4px; margin: -2px -4px; border: 0; border-radius: 6px;
    background: none; color: var(--sfc-muted); font-size: 11px; font-weight: 650; cursor: pointer; transition: opacity .15s; }
  .sfc-legend button:hover { background: color-mix(in srgb, var(--sfc-muted) 12%, transparent); }
  .sfc-legend button.off { opacity: .45; text-decoration: line-through; }
  .sfc-legend button.off i { background: transparent; box-shadow: inset 0 0 0 1.5px currentColor; }
  .sfc-legend i, .sfc-tip i { display: inline-block; width: 9px; height: 9px; border-radius: 3px; background: currentColor; }
  .pv > i { color: var(--sfc-pv); }
  .sfc-legend button.soc i { height: 2px; } .load > i { color: var(--sfc-load); } .battery > i { color: var(--sfc-battery); }
  .grid > i { color: var(--sfc-grid); } .export > i { color: color-mix(in srgb, var(--sfc-grid) 55%, var(--sfc-muted)); }
  .soc > i { color: color-mix(in srgb, var(--sfc-battery) 55%, var(--sfc-muted)); height: 2px; }
  .sfc-plot { position: relative; height: 180px; margin-left: 46px; touch-action: pan-y; cursor: crosshair; }
  @container (min-width: 620px) { .sfc-plot { height: 220px; } }
  .sfc-plot svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
  .sfc-gridline { stroke: var(--sfc-border); stroke-width: 1; vector-effect: non-scaling-stroke; }
  .sfc-gridline.zero { stroke: color-mix(in srgb, var(--sfc-muted) 60%, transparent); }
  .sfc-line { fill: none; stroke-width: 2; vector-effect: non-scaling-stroke; stroke-linejoin: round; }
  .sfc-line.pv { stroke: var(--sfc-pv); } .sfc-line.load { stroke: var(--sfc-load); }
  .sfc-line.battery { stroke: var(--sfc-battery); stroke-width: 1.5; } .sfc-line.grid { stroke: var(--sfc-grid); stroke-width: 1.5; }
  .sfc-line.soc { stroke: color-mix(in srgb, var(--sfc-battery) 55%, var(--sfc-muted)); stroke-dasharray: 4 4; stroke-width: 1.5; }
  .sfc-area.pv { fill: color-mix(in srgb, var(--sfc-pv) 22%, transparent); }
  .sfc-area.battery { fill: color-mix(in srgb, var(--sfc-battery) 20%, transparent); }
  .sfc-bar.pv { fill: var(--sfc-pv); } .sfc-bar.load { fill: var(--sfc-load); } .sfc-bar.grid { fill: var(--sfc-grid); }
  .sfc-ylabel { position: absolute; right: calc(100% + 6px); transform: translateY(-50%); color: var(--sfc-muted); font-size: 10px; white-space: nowrap; }
  .sfc-xaxis { position: relative; height: 18px; margin: 4px 0 0 46px; }
  .sfc-xaxis span { position: absolute; top: 2px; transform: translateX(-50%); color: var(--sfc-muted); font-size: 10px; white-space: nowrap; }
  .sfc-cursor { position: absolute; top: 0; bottom: 0; width: 1px; background: color-mix(in srgb, var(--sfc-text) 45%, transparent); pointer-events: none; }
  .sfc-tip { position: absolute; top: 4px; z-index: 5; min-width: 150px; margin-left: 10px; padding: 8px 10px; display: grid; gap: 4px;
    border: 1px solid var(--sfc-border); border-radius: 12px; background: var(--sfc-tip-bg, var(--sfc-surface)); color: var(--sfc-text);
    box-shadow: 0 10px 24px rgba(0, 0, 0, .25); font-size: 11px; pointer-events: none; }
  .sfc-tip[hidden], .sfc-cursor[hidden] { display: none; }
  .sfc-tip.flip { transform: translateX(calc(-100% - 20px)); }
  .sfc-tip span { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 6px; color: var(--sfc-muted); }
  .sfc-tip b { color: var(--sfc-text); }
  .sfc-chart-hint { margin: 2px 0 0; color: var(--sfc-muted); font-size: 10px; }
  .sfc-chart-empty { display: grid; place-items: center; height: 110px; border: 1px dashed var(--sfc-border); border-radius: 12px; color: var(--sfc-muted); font-size: 12px; }

  .sfc-wide-rest { display: grid; gap: inherit; }
  /* Wide layout (wide: true), from about 880 px of card width */
  @container (min-width: 880px) {
    .sfc-wide { display: grid; grid-template-columns: minmax(380px, 38%) minmax(0, 1fr); grid-template-rows: auto 1fr; align-items: start; }
    /* Two columns down the whole card: the main view on the left, the energy
       section on the right; the other sections go to whichever column is
       shorter (see balanceWide), so neither ends with a big gap. */
    .sfc-wide > .sfc-sections, .lc-main.wide > .sfc-sections { display: contents; }
    .sfc-wide-main { grid-row: 1 / span 2; }
    .sfc-wide > .sfc-sections > .sfc-energy { margin: 16px 16px 14px 4px; }
    .sfc-wide-rest { grid-column: 2; align-content: start; gap: 14px; padding: 0 16px 16px 4px; }
    .gt-layout.wide > .sfc-sections { display: block; columns: 320px; column-gap: 14px; }
    .gt-layout.wide > .sfc-sections > * { break-inside: avoid; margin-bottom: 14px; }
    :is(.sfc-wide, .lc-main.wide, .gt-layout.wide) .sfc-readings { grid-template-columns: repeat(auto-fill, minmax(96px, 1fr)); }
    :is(.sfc-wide, .lc-main.wide, .gt-layout.wide) .sfc-strings { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); }
    .sfc-wide-main > :last-child { margin-bottom: 16px; }
    .sfc-wide-fill:not(:empty) { display: grid; gap: 14px; padding: 0 4px 0 16px; }
    .lc-main.wide { display: grid; grid-template-columns: minmax(340px, 40%) minmax(0, 1fr); column-gap: 18px; align-items: start; }
    .lc-main.wide > .sfc-sections { padding-top: 0; }
  }

  /* Today at a glance, comparison */
  .sfc-insight-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(118px, 1fr)); gap: 8px; }
  .sfc-insight { min-width: 0; padding: 9px 11px; border: 1px solid var(--sfc-border); border-radius: var(--sfc-tile-radius, 11px); background: var(--sfc-tile-bg); --sfc-c: var(--sfc-accent); }
  .sfc-insight.pv { --sfc-c: var(--sfc-pv); } .sfc-insight.load { --sfc-c: var(--sfc-load); } .sfc-insight.battery { --sfc-c: var(--sfc-battery); } .sfc-insight.grid { --sfc-c: var(--sfc-grid); }
  .sfc-insight small { display: block; color: var(--sfc-muted); font-size: 11px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sfc-insight b { display: block; margin-top: 2px; font-size: 16px; font-family: var(--sfc-num-font, inherit); color: var(--sfc-c); white-space: nowrap; }
  .sfc-insight span { display: block; color: var(--sfc-muted); font-size: 10px; }
  .sfc-compare-table { width: 100%; border-collapse: collapse; font-size: 13px; font-family: var(--sfc-num-font, inherit); }
  .sfc-compare-table th, .sfc-compare-table td { padding: 6px 4px; text-align: right; border-bottom: 1px solid var(--sfc-border); white-space: nowrap; }
  .sfc-compare-table thead th { color: var(--sfc-muted); font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; }
  .sfc-compare-table tbody th { text-align: left; font-weight: 600; font-family: var(--sfc-font); }
  .sfc-compare-table tbody th i { display: inline-block; width: 8px; height: 8px; margin-right: 6px; border-radius: 50%; background: var(--sfc-c); }
  .sfc-compare-table tr.solar { --sfc-c: var(--sfc-pv); } .sfc-compare-table tr.load { --sfc-c: var(--sfc-load); }
  .sfc-compare-table tr.gridImport, .sfc-compare-table tr.gridExport { --sfc-c: var(--sfc-grid); }
  .sfc-compare-table td.good { color: #2bb673; font-size: 11px; } .sfc-compare-table td.bad { color: #e5534b; font-size: 11px; }
  .sfc-compare-table tr:last-child > * { border-bottom: 0; }
  .sfc-compare-table thead th { white-space: normal; vertical-align: bottom; }
  .sfc-compare-scroll { overflow-x: auto; }

  /* Installation */
  .sfc-phases { display: grid; grid-template-columns: repeat(var(--n, 3), minmax(0, 1fr)); gap: 8px; }
  .sfc-phase, .sfc-meter { position: relative; min-width: 0; display: grid; gap: 2px; padding: 9px 11px; text-align: left;
    border: 1px solid var(--sfc-border); border-radius: var(--sfc-tile-radius, 11px); background: var(--sfc-tile-bg); }
  .sfc-phase small, .sfc-meter small { color: var(--sfc-muted); font-size: 11px; font-weight: 700; line-height: 1.2; overflow: hidden;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
  .sfc-meter { align-content: start; }
  .sfc-phase strong { font-size: 16px; font-family: var(--sfc-num-font, inherit); white-space: nowrap; }
  .sfc-phase span, .sfc-meter span { color: var(--sfc-muted); font-size: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sfc-phase i, .sfc-meter i { display: block; height: 4px; margin: 3px 0 1px; border-radius: 999px;
    background: linear-gradient(90deg, var(--sfc-c, var(--sfc-load)) var(--p), var(--sfc-track) var(--p)); }
  .sfc-bank { grid-template-columns: repeat(var(--n), minmax(0, 1fr)); }
  /* Grid per phase: green while exporting, red while importing. */
  .sfc-phase.export { --sfc-c: var(--sfc-good, #3fb950); }
  .sfc-phase.import { --sfc-c: var(--sfc-bad, #f0524a); }
  /* The grid's status in the themes' flow views. */
  ha-card.grid-export :is(.aur-node, .atl-label, .exp-box, .fnd-node, .gal-readout, .rx-node).grid > :is(em, small:last-child),
  ha-card.grid-export :is(.gt-row.grid em, .dio-pill.grid small) { color: var(--sfc-good, #3fb950); }
  ha-card.grid-import :is(.aur-node, .atl-label, .exp-box, .fnd-node, .gal-readout, .rx-node).grid > :is(em, small:last-child),
  ha-card.grid-import :is(.gt-row.grid em, .dio-pill.grid small) { color: var(--sfc-bad, #f0524a); }
  .sfc-bank + .sfc-phases { margin-top: 8px; }
  .sfc-bat { --sfc-c: var(--sfc-battery); }
  .sfc-bat strong { color: var(--sfc-battery); }
  .sfc-meters { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; margin-top: 8px; }
  .sfc-meter.inverter, .sfc-meter.generator { grid-column: 1 / -1; }
  .sfc-meter b { font-size: 14px; font-family: var(--sfc-num-font, inherit); white-space: nowrap; }
  .sfc-meter.inverter { --sfc-c: var(--sfc-accent); } .sfc-meter.battery b { color: var(--sfc-battery); }
  .sfc-meter.warn { border-color: var(--sfc-load); box-shadow: inset 0 0 0 1px var(--sfc-load); }
  .sfc-meter.warn b { color: var(--sfc-load); }
  .sfc-meter.generator b { color: var(--sfc-pv); }
  .sfc-system .sfc-panels-note { margin-top: 8px; }

  /* Animated flows */
  .sfc-flow-base { fill: none; stroke: var(--sfc-flow-base); stroke-width: var(--sfc-flow-w, 4); stroke-linecap: round; }
  .sfc-flow { fill: none; stroke-width: var(--sfc-flow-w, 4); stroke-linecap: round; stroke-dasharray: var(--sfc-dash, 1 9);
    animation: sfc-dash var(--sfc-dash-time, 18s) linear infinite; }
  .sfc-flow.rev { animation-direction: reverse; }
  .sfc-flow.pv { stroke: var(--sfc-pv); } .sfc-flow.load { stroke: var(--sfc-load); }
  .sfc-flow.battery { stroke: var(--sfc-battery); } .sfc-flow.grid { stroke: var(--sfc-grid); }
  /* A fixed distance (no var() inside keyframes, which Chromium does not
     interpolate). 180 is a whole number of dash periods for every theme's
     pattern (10, 12, 18); --sfc-dash-time sets the speed. */
  @keyframes sfc-dash { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -180; } }
  .no-anim .sfc-flow, .no-anim .atl-pulse, .no-anim .aur-ring, .no-anim .lc-track i,
    .no-anim .exp-spin, .no-anim .fnd-orbit, .no-anim .fnd-sphere, .no-anim .gal-warp, .no-anim .gal-target, .no-anim .gal-cross,
    .no-anim .dio-cloud, .no-anim .dio-star, .no-anim .dio-glow, .no-anim .dio-rain line, .no-anim .dio-snow circle, .no-anim .dio-fog rect, .no-anim .dio-flash, .no-anim .gt-ripples circle, .no-anim .gt-glyphs, .no-anim .gt-status, .no-anim .gt-chevron-light,
    .no-anim .rx-ticks, .no-anim .rx-seg, .no-anim .rx-holes rect, .no-anim .rx-arcs, .no-anim .rx-core, .no-anim .rx-halo, .no-anim .rx-rays, .no-anim .rx-star, .no-anim .rx-sun, .no-anim .rx-fog > *, .no-anim .rx-rain line, .no-anim .rx-drops g, .no-anim .rx-snow circle, .no-anim .rx-flash, .no-anim .rx-mode,
    .no-anim .boot :is(.rx-frame, .rx-reactor, .rx-boot-ticks, .rx-gauge, .rx-node, .rx-inv, .rx-gtext), .no-anim .boot .rx-scan p, .no-anim .rx-bootseg path { animation: none !important; }
    .no-anim .rx-bootseg { display: none; }
  /* Reduced motion: flows keep moving, slower; decorative effects stop. */
  @media (prefers-reduced-motion: reduce) {
    .sfc-flow { animation-duration: calc(var(--sfc-dash-time, 18s) * 3); }
    .atl-pulse, .aur-ring, .lc-track i, .lc-status, .exp-spin, .fnd-orbit, .fnd-sphere, .gal-warp, .gal-target, .gal-cross,
    .dio-cloud, .dio-star, .dio-glow, .dio-rain line, .dio-snow circle, .dio-fog rect, .dio-flash, .gt-ripples circle, .gt-glyphs, .gt-status, .gt-chevron-light,
    .rx-ticks, .rx-seg, .rx-holes rect, .rx-arcs, .rx-core, .rx-halo, .rx-rays, .rx-star, .rx-sun, .rx-fog > *, .rx-rain line, .rx-drops g, .rx-snow circle, .rx-flash, .rx-mode, .boot :is(.rx-frame, .rx-reactor, .rx-boot-ticks, .rx-gauge, .rx-node, .rx-inv, .rx-gtext), .boot .rx-scan p, .rx-bootseg path { animation: none !important; }
    .rx-bootseg { display: none; }
  }

  .sfc-empty { padding: 28px; text-align: center; }
  .sfc-empty h2 { margin: 0 0 6px; font-size: 18px; }
  .sfc-empty p { margin: 0; color: var(--sfc-muted); }
`;

const THEME_CSS = {
  // ---------------------------------------------------------------- Diorama
  diorama: `
    .sfc {
      --sfc-glass: rgba(255, 255, 255, .55);
      --sfc-font: "Nunito", ui-rounded, "SF Pro Rounded", "Segoe UI", Roboto, "Helvetica Neue", system-ui, sans-serif;
      --sfc-bg: #ffffff; --sfc-surface: #f5f8fb; --sfc-border: #e3eaf1; --sfc-text: #24364a; --sfc-muted: #6a7d92;
      --sfc-pv: #f5a400; --sfc-load: #f26b5b; --sfc-battery: #1fbf86; --sfc-grid: #5b8def; --sfc-good: #1f9d55; --sfc-bad: #d64545;
      --sfc-accent: #3b82f6; --sfc-accent-soft: #e3eefe; --sfc-tile-bg: #ffffff; --sfc-track: #e7eef4;
      --sfc-tab-bg: #eaf0f6; --sfc-tab-on-bg: #ffffff; --sfc-tab-on: #24364a; --sfc-tab-shadow: 0 2px 8px rgba(30,60,90,.12);
      --sfc-flow-base: rgba(255,255,255,.0); --sfc-flow-w: 4;
      --sfc-radius: 28px; --sfc-shadow: 0 18px 50px rgba(30,70,110,.18); --sfc-frame: transparent;
    }
    .dio-scene { position: relative; aspect-ratio: 520 / 360; background: linear-gradient(180deg, var(--sky-a) 0%, var(--sky-b) 70%); }
    .dio-scene svg { position: absolute; inset: 0; width: 100%; height: 100%; }
    .dio-title { position: absolute; left: 4%; top: 4.5%; color: #fff; text-shadow: 0 1px 8px rgba(20,60,100,.35); }
    .dio-title h1 { margin: 0 0 4px; font-size: clamp(18px, 4.6cqw, 26px); font-weight: 800; }
    .dio-title .sfc-badge { --sfc-badge-bg: rgba(255,255,255,.28); --sfc-badge-text: #fff; text-shadow: none; backdrop-filter: blur(6px); }
    .dio-clock { position: absolute; right: 3.5%; top: 5%; padding: 5px 10px; border-radius: 999px; background: rgba(255,255,255,.3);
      color: #fff; font-weight: 800; font-size: 12px; backdrop-filter: blur(6px); }
    .dio-temp { margin-left: 4px; padding: 0 0 0 6px; border: 0; border-left: 1px solid rgba(255,255,255,.5); background: none; color: inherit; font: inherit; }
    .dio-cloud { animation: dio-drift var(--t) linear infinite; animation-delay: var(--d); }
    @keyframes dio-drift { from { transform: translateX(-90px); } to { transform: translateX(610px); } }
    .dio-star { animation: dio-twinkle 4s ease-in-out infinite; animation-delay: var(--d); }
    @keyframes dio-twinkle { 50% { opacity: .15; } }
    .dio-glow { transform-box: fill-box; transform-origin: center; animation: dio-glow 6s ease-in-out infinite; }
    @keyframes dio-glow { 50% { transform: scale(1.18); opacity: .12; } }
    .dio-rain line { animation: dio-fall 1.2s linear infinite; animation-delay: var(--d); }
    .dio-rain.heavy line { animation-duration: .7s; }
    @keyframes dio-fall { from { transform: translate(0, -40px); opacity: 0; } 15% { opacity: 1; } to { transform: translate(-14px, 60px); opacity: 0; } }
    .dio-snow circle { animation: dio-snow 6s linear infinite; animation-delay: var(--d); }
    @keyframes dio-snow { from { transform: translate(0, -30px); opacity: 0; } 15% { opacity: .9; } to { transform: translate(14px, 90px); opacity: 0; } }
    .dio-fog rect { animation: dio-fog 20s ease-in-out infinite alternate; animation-delay: var(--d); }
    @keyframes dio-fog { to { transform: translateX(120px); } }
    .dio-flash { opacity: 0; pointer-events: none; animation: dio-flash 9s linear infinite; }
    @keyframes dio-flash { 0%, 92%, 95%, 100% { opacity: 0; } 93%, 96% { opacity: .55; } }
    .dio-pill { position: absolute; display: flex; align-items: center; gap: 6px; padding: 6px 11px 6px 9px; border: 0; border-radius: 999px;
      background: rgba(255,255,255,.93); box-shadow: 0 6px 16px rgba(30,60,90,.18); color: #24364a; font-size: clamp(10px, 2.4cqw, 13px);
      font-weight: 800; white-space: nowrap; transition: transform .2s; }
    .dio-pill:hover { transform: translateY(-2px); }
    .dio-pill i { width: 10px; height: 10px; border-radius: 50%; }
    .dio-pill i.pv { background: var(--sfc-pv); } .dio-pill i.battery { background: var(--sfc-battery); }
    .dio-pill i.grid { background: var(--sfc-grid); } .dio-pill i.load { background: var(--sfc-load); }
    .dio-pill small { font-weight: 700; color: #6a7d92; }
    .dio-bottom { padding: 16px; }
    .dio-chips { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
    .dio-chip { min-width: 0; padding: 12px; border: 0; border-radius: 18px; text-align: left; background: #f3f7fb; }
    .dio-chip.sun { background: #fff6dc; } .dio-chip.grid { background: #e6eefc; } .dio-chip.bat { background: #e3f7ee; } .dio-chip.home { background: #fde9e4; }
    .dio-chip small { display: block; font-size: 11px; font-weight: 700; color: #6a7d92; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .dio-chip b { display: block; margin-top: 2px; font-size: clamp(15px, 3.8cqw, 20px); font-weight: 800; }
    .dio-share { margin-top: 14px; }
    .dio-share header { display: flex; justify-content: space-between; font-size: 12px; font-weight: 800; }
    .dio-share header span { color: #6a7d92; font-weight: 700; }
    .dio-track { height: 14px; margin-top: 7px; display: flex; overflow: hidden; border-radius: 999px; background: #eef2f6; }
    .dio-track .pv { background: #ffc23d; } .dio-track .battery { background: #2bc48f; } .dio-track .grid { background: #7aa4f2; } .dio-track .vstore { background: #3cc5d6; }
    .dio-legend { display: flex; flex-wrap: wrap; gap: 2px 12px; margin-top: 6px; font-size: 11px; font-weight: 700; color: #6a7d92; }
    .dio-legend span::before { content: ""; display: inline-block; width: 8px; height: 8px; margin-right: 5px; border-radius: 50%; background: currentColor; }
    .dio-legend .pv::before { background: #ffc23d; } .dio-legend .battery::before { background: #2bc48f; } .dio-legend .vstore::before { background: #3cc5d6; } .dio-legend .grid::before { background: #7aa4f2; }
    .sfc-section { border: 0; border-radius: 20px; }
    .sfc-flow { --sfc-dash: 1 9; }
  `,
  // ----------------------------------------------------------------- Aurora
  aurora: `
    .sfc {
      --sfc-font: "Space Grotesk", "Segoe UI", Roboto, "Helvetica Neue", system-ui, sans-serif; --sfc-num-font: "JetBrains Mono", ui-monospace, "SF Mono", Menlo, Consolas, "Roboto Mono", monospace;
      --sfc-bg: radial-gradient(60% 40% at 15% 0%, rgba(0,255,200,.18), transparent 70%), radial-gradient(50% 40% at 100% 30%, rgba(140,80,255,.22), transparent 70%), radial-gradient(70% 50% at 50% 110%, rgba(255,60,160,.16), transparent 70%), #0a0d1a;
      --sfc-surface: rgba(255,255,255,.035); --sfc-border: rgba(255,255,255,.08); --sfc-text: #e9f1ff; --sfc-muted: #8390b8;
      --sfc-pv: #ffd23f; --sfc-load: #ff4fa3; --sfc-battery: #4dffd2; --sfc-grid: #a28bff;
      --sfc-accent: #4dffd2; --sfc-accent-soft: rgba(77,255,210,.12); --sfc-tile-bg: rgba(255,255,255,.03); --sfc-track: rgba(255,255,255,.08);
      --sfc-tab-bg: rgba(255,255,255,.04); --sfc-tab-on-bg: #4dffd2; --sfc-tab-on: #0a0d1a; --sfc-tab-shadow: 0 0 14px rgba(77,255,210,.55);
      --sfc-tip-bg: #121731; --sfc-badge-bg: rgba(255,255,255,.06);
      --sfc-flow-base: rgba(255,255,255,.07); --sfc-flow-w: 3; --sfc-dash: 2 16; --sfc-dash-time: 10s;
      --sfc-radius: 28px; --sfc-shadow: 0 30px 80px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.06);
      background: var(--sfc-bg);
    }
    .aur-grain { position: absolute; inset: 0; pointer-events: none; background-image: radial-gradient(rgba(255,255,255,.05) 1px, transparent 1px); background-size: 4px 4px; }
    .aur-header { position: relative; display: flex; justify-content: space-between; align-items: flex-start; padding: 20px 20px 0; }
    .aur-header h1 { margin: 0; font-size: 22px; letter-spacing: -.02em; }
    .aur-sub { margin-top: 2px; color: var(--sfc-muted); font-size: 12px; }
    .aur-live { display: flex; align-items: center; gap: 6px; font-family: var(--sfc-num-font); font-size: 11px; color: #4dffd2; text-transform: uppercase; }
    .aur-live i { width: 7px; height: 7px; border-radius: 50%; background: currentColor; box-shadow: 0 0 10px currentColor; }
    .aur-live.delayed { color: #ffb648; } .aur-live.offline { color: #ff5d73; }
    .aur-stage { position: relative; aspect-ratio: 476 / 330; margin: 4px 22px 8px; }
    .aur-stage > svg { position: absolute; inset: 0; width: 100%; height: 100%; }
    .aur-flow-label { font-family: var(--sfc-num-font); font-size: 11px; }
    .aur-flow-label.pv { fill: var(--sfc-pv); } .aur-flow-label.battery { fill: var(--sfc-battery); } .aur-flow-label.grid { fill: var(--sfc-grid); }
    .aur-node { position: absolute; width: 24%; transform: translate(-50%, -50%); padding: 0; border: 0; background: none; text-align: center; }
    .aur-node.pv { --c1: #ffd23f; --c2: #ff8a00; } .aur-node.battery { --c1: #4dffd2; --c2: #00a3ff; }
    .aur-node.grid { --c1: #a28bff; --c2: #c94dff; } .aur-node.home { --c1: #ff4fa3; --c2: #ff7a59; }
    .aur-ring { position: relative; width: 80%; aspect-ratio: 1; margin: 0 auto; border-radius: 50%; display: grid; place-items: center;
      background: rgba(10,13,26,.78); box-shadow: 0 0 30px color-mix(in srgb, var(--c1) 45%, transparent), inset 0 0 25px color-mix(in srgb, var(--c1) 22%, transparent);
      animation: aur-breathe 4s ease-in-out infinite; }
    .aur-ring::before { content: ""; position: absolute; inset: 0; border-radius: 50%; padding: 2px;
      background: conic-gradient(from 200deg, var(--c1), var(--c2), var(--c1));
      -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude; }
    .aur-ring > span { position: relative; display: grid; justify-items: center; }
    .aur-ring b { font-family: var(--sfc-num-font); font-size: clamp(12px, 3.4cqw, 18px); }
    .aur-ring small { font-size: clamp(7px, 1.8cqw, 9px); color: #9aa6cc; letter-spacing: .14em; text-transform: uppercase; }
    .aur-node em { display: block; margin-top: 6px; font-style: normal; font-size: clamp(9px, 2cqw, 11px); color: #9aa6cc; letter-spacing: .1em; text-transform: uppercase; white-space: nowrap; }
    .aur-soc { position: absolute; inset: -9%; width: 118%; height: 118%; }
    .aur-soc circle { fill: none; stroke: rgba(77,255,210,.12); stroke-width: 3; }
    .aur-soc circle.on { stroke: #4dffd2; stroke-linecap: round; }
    .aur-hub { position: absolute; width: 8%; aspect-ratio: 1; transform: translate(-50%, -50%); display: grid; place-items: center; padding: 0;
      border-radius: 50%; border: 1px solid rgba(77,255,210,.45); background: #0a0d1a; color: #4dffd2; box-shadow: 0 0 16px rgba(77,255,210,.35); }
    .aur-hub svg { width: 60%; fill: none; stroke: currentColor; stroke-width: 1.8; }
    @keyframes aur-breathe { 50% { box-shadow: 0 0 42px color-mix(in srgb, var(--c1) 60%, transparent), inset 0 0 30px color-mix(in srgb, var(--c1) 28%, transparent); } }
    .sfc-section { backdrop-filter: blur(6px); }
    .sfc-head h3 { letter-spacing: -.01em; }
    .sfc-kicker { font-family: var(--sfc-num-font); }
    .sfc-tab { font-family: var(--sfc-num-font); text-transform: uppercase; }
    .sfc-flow { filter: drop-shadow(0 0 4px currentColor); }
  `,
  // ------------------------------------------------------------------ Paper
  paper: `
    .sfc {
      --sfc-glass: rgba(255, 255, 255, .55);
      --sfc-font: "Inter", "Segoe UI", Roboto, "Helvetica Neue", system-ui, sans-serif; --sfc-heading-font: "Fraunces", "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif; --sfc-num-font: "Fraunces", "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif;
      --sfc-heading-weight: 600;
      --sfc-bg: #f6f1e7; --sfc-surface: transparent; --sfc-border: #ddd3c2; --sfc-text: #2a2722; --sfc-muted: #8a8173;
      --sfc-pv: #c9862b; --sfc-load: #a8473a; --sfc-battery: #6f8f6a; --sfc-grid: #56677a; --sfc-good: #4f7d3a; --sfc-bad: #b0412e;
      --sfc-accent: #b06a1f; --sfc-accent-soft: transparent; --sfc-tile-bg: transparent; --sfc-track: #e6ddcd;
      --sfc-tab-bg: transparent; --sfc-tab-on-bg: transparent; --sfc-tab-on: #2a2722; --sfc-tip-bg: #fbf8f1;
      --sfc-radius: 6px; --sfc-section-radius: 0; --sfc-tile-radius: 0; --sfc-shadow: 0 20px 40px rgba(60,45,20,.15); --sfc-frame: #e6ddcd;
      --sfc-badge-bg: #ece4d4;
      padding: 24px 22px 6px;
    }
    .pap-eyebrow { display: flex; justify-content: space-between; gap: 10px; align-items: center; font-size: 10px; letter-spacing: .16em; text-transform: uppercase; color: var(--sfc-muted); }
    .pap-eyebrow .sfc-badge { letter-spacing: .04em; margin-left: 6px; }
    .pap-headline { margin: 8px 0 4px; font-family: var(--sfc-heading-font); font-weight: 600; font-size: clamp(26px, 7cqw, 38px); letter-spacing: -.02em; line-height: 1.05; }
    .pap-lede { margin: 0 0 16px; font-family: var(--sfc-heading-font); font-size: 15px; line-height: 1.45; color: #5b5448; }
    .pap-lede em { font-style: italic; color: var(--sfc-accent); }
    .sfc hr { border: 0; border-top: 1px solid var(--sfc-border); margin: 0; }
    .pap-sankey { position: relative; margin: 16px 0 8px; aspect-ratio: 468 / 200; }
    .pap-sankey svg { position: absolute; inset: 0; width: 100%; height: 100%; }
    .pap-ribbon { opacity: .5; } .pap-ribbon.pv { fill: var(--sfc-pv); } .pap-ribbon.battery { fill: var(--sfc-battery); } .pap-ribbon.grid { fill: var(--sfc-grid); }
    .pap-node.pv { fill: var(--sfc-pv); } .pap-node.battery { fill: var(--sfc-battery); } .pap-node.grid { fill: var(--sfc-grid); }
    .pap-node.sink.load { fill: var(--sfc-text); }
    .pap-ribbon.other, .pap-node.other, .pap-node.loss { fill: #b9b0a2; }
    .pap-label.loss, .pap-label.other { color: var(--sfc-muted); }
    .pap-label.loss b, .pap-label.other b { color: var(--sfc-muted); font-size: 14px; }
    .pap-cols { display: flex; justify-content: space-between; margin-top: 14px; font-size: 9px; letter-spacing: .16em; text-transform: uppercase; color: var(--sfc-muted); }
    .pap-cols + .pap-sankey { margin-top: 6px; }
    .pap-label { position: absolute; padding: 0; border: 0; background: none; font-size: 11px; color: #5b5448; text-align: left; line-height: 1.2; }
    .pap-label.left { left: 4%; } .pap-label.right { right: 4%; text-align: right; }
    .pap-label b { display: block; font-family: var(--sfc-heading-font); font-size: clamp(15px, 4cqw, 20px); font-weight: 600; color: var(--sfc-text); }
    .pap-quiet { padding: 30px 0; text-align: center; font-family: var(--sfc-heading-font); font-style: italic; color: var(--sfc-muted); }
    .pap-inverter { display: block; margin: 22px 0 14px auto; font-family: var(--sfc-heading-font); font-style: italic; font-weight: 400; color: var(--sfc-accent); }
    .sfc-sections { padding: 0 0 16px; gap: 18px; }
    .sfc-section { padding: 14px 0 0; border: 0; border-top: 1px solid var(--sfc-border); }
    .sfc-head h3 { font-size: 18px; }
    .sfc-kicker { background: none; padding: 0; min-width: 0; color: var(--sfc-accent); font-size: 11px; }
    .sfc-tabs { padding: 0; gap: 14px; grid-auto-columns: max-content; }
    .sfc-tab { padding: 2px 0; border-radius: 0; font-weight: 500; font-size: 12px; }
    .sfc-tab.on { border-bottom: 1.5px solid var(--sfc-text); }
    .sfc-tiles { gap: 0; border-top: 1px solid var(--sfc-border); }
    .sfc-tile { border: 0; border-bottom: 1px solid var(--sfc-border); padding: 10px 4px; }
    .sfc-tile-icon { display: none; }
    .sfc-tile small, .sfc-summary-item small { text-transform: uppercase; letter-spacing: .08em; font-size: 9px; }
    .sfc-tile strong { font-size: 20px; font-weight: 600; }
    .sfc-summary-item { background: none; border: 0; border-left: 1px solid var(--sfc-border); }
    .sfc-summary-item strong { font-size: 18px; font-weight: 600; }
    .sfc-forecast { padding-top: 14px; }
    .sfc-forecast-icon { display: none; }
    .sfc-forecast-copy strong { font-family: var(--sfc-heading-font); font-size: 18px; font-weight: 600; }
    .pap-flow { stroke: rgba(42, 39, 34, .45); stroke-width: 2.5; --sfc-dash: 1 9; vector-effect: non-scaling-stroke; }
    .sfc-panel { border-radius: 0; }
  `,
  // ------------------------------------------------------------------ LCARS
  lcars: `
    .sfc {
      --sfc-font: "Antonio", "Bahnschrift SemiCondensed", "Arial Narrow", "Roboto Condensed", sans-serif-condensed, sans-serif; --sfc-num-font: "Antonio", "Bahnschrift SemiCondensed", "Arial Narrow", "Roboto Condensed", sans-serif-condensed, sans-serif;
      --orange: #ff9c00; --peach: #ffcc99; --lav: #cc99cc; --blue: #9999ff; --red: #cc6666; --gold: #ffcc66; --sky: #99ccff;
      --sfc-bg: #000; --sfc-surface: #000; --sfc-border: #222; --sfc-text: #ffcc99; --sfc-muted: #9999ff;
      --sfc-pv: #ff9c00; --sfc-load: #cc6666; --sfc-battery: #99ccff; --sfc-grid: #cc99cc;
      --sfc-accent: #ff9c00; --sfc-accent-soft: #ff9c00; --sfc-tile-bg: #000; --sfc-track: #222; --sfc-tip-bg: #000;
      --sfc-tab-bg: transparent; --sfc-tab-on-bg: #ff9c00; --sfc-tab-on: #000;
      --sfc-radius: 12px; --sfc-section-radius: 0; --sfc-tile-radius: 0; --sfc-frame: #000;
      --sfc-badge-bg: #222;
      text-transform: uppercase; padding: 12px;
    }
    .sfc button { text-transform: uppercase; }
    .lc-soc.no-battery { grid-template-columns: 1fr; }
    .lc-frame { display: grid; grid-template-columns: 22% 1fr; grid-template-rows: auto 1fr auto; column-gap: 6px; }
    .lc-elbow { position: relative; background: var(--orange); }
    .lc-elbow.top { grid-column: 1; grid-row: 1; height: 64px; border-radius: 44px 0 0 0; }
    .lc-elbow.top span { position: absolute; right: 8px; bottom: 6px; color: #000; font-size: 11px; }
    .lc-elbow.top::after { content: ""; position: absolute; right: -32px; bottom: 0; width: 32px; height: 22px; background: var(--orange); }
    .lc-elbow.top::before { content: ""; position: absolute; right: -32px; bottom: 0; width: 32px; height: 22px; background: #000; border-radius: 22px 0 0 0; z-index: 1; }
    .lc-elbow.bottom { grid-column: 1; grid-row: 3; height: 46px; border-radius: 0 0 0 40px; background: var(--peach); margin-top: 6px; }
    .lc-elbow.bottom::after { content: ""; position: absolute; right: -32px; top: 0; width: 32px; height: 18px; background: var(--peach); }
    .lc-elbow.bottom::before { content: ""; position: absolute; right: -32px; top: 0; width: 32px; height: 18px; background: #000; border-radius: 0 0 0 18px; z-index: 1; }
    .lc-topbar { grid-column: 2; grid-row: 1; display: flex; align-items: flex-end; gap: 6px; padding-left: 30px; }
    .lc-topbar h1 { align-self: flex-start; margin: 0 8px 0 0; color: var(--orange); font-size: clamp(20px, 5.4cqw, 32px); line-height: 1; font-weight: 700;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; flex: 1 1 auto; }
    .lc-topbar i { height: 22px; flex: 0 0 auto; }
    .lc-topbar .b1 { width: 22%; background: var(--orange); } .lc-topbar .b2 { width: 12%; background: var(--lav); }
    .lc-topbar .b3 { width: 18px; background: var(--red); border-radius: 0 11px 11px 0; }
    .lc-side { grid-column: 1; grid-row: 2; display: flex; flex-direction: column; gap: 6px; margin-top: 6px; }
    .lc-side button { border: 0; padding: 6px 8px 4px; text-align: right; color: #000; font-size: clamp(11px, 2.8cqw, 15px); font-weight: 600; letter-spacing: .04em; text-transform: uppercase; }
    .lc-side button small { display: block; font-size: 10px; opacity: .65; }
    .lc-side .c1 { background: var(--lav); } .lc-side .c2 { background: var(--peach); } .lc-side .c3 { background: var(--blue); }
    .lc-side .c4 { background: var(--gold); } .lc-side .c5 { background: var(--red); }
    .lc-side .lc-fill { flex: 1; min-height: 20px; background: var(--lav); }
    .lc-main { grid-column: 2; grid-row: 2; padding: 8px 0 0 12px; min-width: 0; }
    .lc-row { display: grid; grid-template-columns: 22% 1fr 26%; align-items: center; gap: 8px; width: 100%; margin: 4px 0; padding: 0; border: 0; background: none; text-transform: uppercase; }
    .lc-label { font-size: clamp(11px, 2.8cqw, 16px); color: var(--sky); letter-spacing: .05em; text-align: left; }
    .lc-value { font-size: clamp(13px, 3.6cqw, 22px); color: var(--gold); text-align: right; white-space: nowrap; }
    .lc-track { display: flex; gap: 3px; height: 16px; }
    .lc-track i { flex: 1; background: #222; }
    .lc-row.pv .lc-track i.on { background: var(--orange); } .lc-row.battery .lc-track i.on { background: var(--sky); }
    .lc-row.grid .lc-track i.on { background: var(--lav); } .lc-row.home .lc-track i.on { background: var(--red); }
    /* A light wave runs over the lit segments in the direction of flow. */
    .lc-track i.on { animation: lc-chase 1.6s linear infinite; animation-delay: calc(var(--i) * .12s - 3.2s); }
    .lc-row.rev .lc-track i.on { animation-delay: calc((var(--n) - var(--i)) * .12s - 3.2s); }
    @keyframes lc-chase { 0%, 30%, 100% { filter: none; } 12% { filter: brightness(1.7) saturate(.8); } }
    .lc-soc { display: flex; gap: 12px; margin-top: 12px; }
    .lc-cells { display: flex; flex-direction: column-reverse; gap: 3px; width: 44px; flex: 0 0 44px; }
    .lc-cells i { height: 8px; border-radius: 4px; background: #222; }
    .lc-cells i.on { background: var(--sky); }
    .lc-readout { flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 6px 12px; }
    .lc-readout span { display: block; color: var(--blue); font-size: 11px; letter-spacing: .1em; }
    .lc-readout b { display: block; color: var(--orange); font-size: clamp(16px, 4cqw, 22px); font-weight: 600; line-height: 1.05; }
    .lc-status { display: inline-block; margin: 12px 0 4px; padding: 3px 14px; border-radius: 14px; background: var(--gold); color: #000; font-size: 15px; font-weight: 700; letter-spacing: .08em; }
    .lc-status.warn { background: var(--orange); animation: lc-blink 1.6s steps(2) infinite; }
    .lc-status.alert { background: #ff3355; color: #fff; animation: lc-blink .8s steps(2) infinite; }
    @keyframes lc-blink { 50% { opacity: .45; } }
    .lc-botbar { grid-column: 2; grid-row: 3; display: flex; align-items: flex-start; gap: 6px; margin-top: 6px; padding-left: 30px; }
    .lc-botbar span { height: 18px; padding: 0 10px; background: var(--lav); color: #000; font-size: 12px; line-height: 18px; }
    .lc-botbar i { flex: 1; height: 18px; background: var(--peach); }
    .sfc-sections { padding: 12px 0 0; gap: 10px; }
    .sfc-section { padding: 0; border: 0; }
    .sfc-head { margin-bottom: 8px; }
    .sfc-head h3 { color: var(--orange); font-size: 20px; font-weight: 600; letter-spacing: .04em; }
    .sfc-kicker { border-radius: 12px; color: #000; background: var(--peach); font-size: 12px; }
    .sfc-kicker svg { stroke: #000; }
    .sfc-hint, .sfc-link { color: var(--blue); }
    .sfc-tabs { padding: 0; gap: 4px; }
    .sfc-tab { border-radius: 12px; background: #333; color: var(--peach); font-size: 13px; font-weight: 700; letter-spacing: .06em; }
    .sfc-tab.on { background: var(--orange); color: #000; }
    .sfc-tile { border: 0; border-left: 6px solid var(--sfc-c); padding: 6px 10px; }
    .sfc-tile-icon { display: none; }
    .sfc-tile small, .sfc-summary-item small { color: var(--blue); letter-spacing: .08em; font-size: 11px; }
    .sfc-tile strong { color: var(--gold); font-size: 18px; font-weight: 600; }
    .sfc-summary-item { border: 0; border-radius: 12px; background: #1a1a1a; }
    .sfc-summary-item strong { color: var(--orange); font-size: 16px; }
    .sfc-forecast { padding: 8px 0; }
    .sfc-forecast-icon { display: none; }
    .sfc-forecast-copy small { color: var(--blue); }
    .sfc-forecast-copy strong { color: var(--orange); font-size: 18px; font-weight: 600; }
    .sfc-forecast-bar { height: 10px; border-radius: 5px; }
    .sfc-panel { border: 0; border-radius: 0; background: linear-gradient(0deg, var(--orange) var(--share), #222 var(--share)); color: #000; }
    .sfc-panel small, .sfc-panel span { color: #000; opacity: .7; }
    .sfc-panel.weak { background: linear-gradient(0deg, #ff3355 var(--share), #222 var(--share)); box-shadow: none; }
    .sfc-string, .sfc-reading { border: 0; border-left: 6px solid var(--lav); }
    .sfc-ylabel, .sfc-xaxis span, .sfc-legend button { color: var(--blue); }
  `,
  // --------------------------------------------------------------- Atlantis
  atlantis: `
    .sfc {
      --sfc-font: "Exo 2", "Segoe UI", Roboto, "Helvetica Neue", system-ui, sans-serif;
      --sfc-bg: radial-gradient(70% 55% at 50% 28%, rgba(0,200,255,.16), transparent 70%), radial-gradient(40% 30% at 85% 90%, rgba(0,255,210,.08), transparent 70%), linear-gradient(180deg, #04202c, #021018);
      --sfc-surface: rgba(0,140,190,.07); --sfc-border: rgba(110,230,255,.22); --sfc-text: #dffbff; --sfc-muted: #5fc6d8;
      --sfc-pv: #ffd36b; --sfc-load: #7affd8; --sfc-battery: #3fe0ff; --sfc-grid: #8fb4ff;
      --sfc-accent: #3fe0ff; --sfc-accent-soft: rgba(63,224,255,.12); --sfc-tile-bg: rgba(0,140,190,.06); --sfc-track: rgba(63,224,255,.12);
      --sfc-tab-bg: rgba(0,140,190,.08); --sfc-tab-on-bg: rgba(63,224,255,.2); --sfc-tab-on: #e8fdff; --sfc-tab-shadow: inset 0 0 0 1px #3fe0ff, 0 0 12px rgba(63,224,255,.35);
      --sfc-tip-bg: #062635; --sfc-badge-bg: rgba(63,224,255,.1);
      --sfc-flow-base: rgba(63,224,255,.12); --sfc-flow-w: 2; --sfc-dash: 2 10; --sfc-dash-time: 15s;
      --sfc-radius: 22px; --sfc-section-radius: 4px 16px 4px 16px; --sfc-tile-radius: 3px 12px 3px 12px;
      --sfc-shadow: 0 0 40px rgba(0,180,255,.18), inset 0 0 60px rgba(0,160,220,.12);
      background: var(--sfc-bg);
    }
    .atl-scan { position: absolute; inset: 0; pointer-events: none; background: repeating-linear-gradient(0deg, rgba(120,230,255,.035) 0 1px, transparent 1px 4px); }
    .atl-header { position: relative; display: flex; justify-content: space-between; padding: 20px 20px 0; }
    .atl-header h1 { margin: 0; font-weight: 300; font-size: clamp(16px, 4.4cqw, 22px); letter-spacing: .32em; text-transform: uppercase; text-shadow: 0 0 12px rgba(0,220,255,.6); }
    .atl-sub { margin-top: 4px; font-size: 10px; letter-spacing: .26em; color: var(--sfc-muted); text-transform: uppercase; }
    .atl-glyphs { font-size: 13px; letter-spacing: .4em; color: #3fb6cc; }
    .atl-glyphs.delayed { color: #ffb648; } .atl-glyphs.offline { color: #ff6b81; }
    .atl-core { position: relative; aspect-ratio: 480 / 330; margin: 26px 12px 18px; }
    .atl-core svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
    .atl-ticks line { stroke: #5fe3ff; opacity: .35; }
    .atl-thin { stroke: #5fe3ff; opacity: .25; }
    .atl-track { stroke: #0b3a4a; stroke-width: 5; }
    .atl-arc { stroke: #3fe0ff; stroke-width: 5; stroke-linecap: round; }
    .atl-crystal { stroke: #9ff6ff; stroke-width: 1.5; fill: rgba(60,220,255,.1); }
    .atl-pulse { transform-origin: center; animation: atl-pulse 3.2s ease-in-out infinite; }
    .atl-pulse.charging { animation-duration: 1.4s; }
    .atl-pulse.discharging { animation-duration: 2.2s; animation-direction: reverse; }
    @keyframes atl-pulse { 50% { opacity: .45; transform: scale(1.08); } }
    .atl-center { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); display: grid; justify-items: center; gap: 1px;
      padding: 0; border: 0; background: none; text-transform: uppercase; }
    .atl-center b { font-weight: 200; font-size: clamp(18px, 5.2cqw, 28px); white-space: nowrap; text-transform: none; color: #e8fdff; text-shadow: 0 0 12px rgba(0,220,255,.7); line-height: 1; }
    .atl-center small { font-size: clamp(8px, 1.9cqw, 10px); letter-spacing: .24em; color: var(--sfc-muted); }
    .atl-center .atl-when { color: #9ff6ff; letter-spacing: .1em; }
    .atl-center { max-width: 24%; text-align: center; }
    .atl-center small { letter-spacing: .14em; }
    .atl-label { position: absolute; transform: translate(-50%, -50%); display: grid; justify-items: center; padding: 0; border: 0; background: none; text-transform: uppercase; white-space: nowrap; }
    .atl-label small { font-size: 9px; letter-spacing: .28em; color: var(--sfc-muted); }
    .atl-label b { font-weight: 500; font-size: clamp(14px, 3.8cqw, 20px); color: #e8fdff; text-shadow: 0 0 10px rgba(0,220,255,.7); text-transform: none; }
    .atl-label.pv b { color: #ffe9a8; } .atl-label.load b { color: #b6fff0; }
    .sfc-flow { stroke-width: 2.4; }
    .sfc-head h3 { font-weight: 300; letter-spacing: .26em; text-transform: uppercase; font-size: 13px; }
    .sfc-kicker { border-radius: 2px 10px 2px 10px; }
    .sfc-tab { letter-spacing: .03em; text-transform: uppercase; font-weight: 500; font-size: 10px; }
    .sfc-tile small, .sfc-summary-item small, .sfc-forecast-copy small { letter-spacing: .06em; text-transform: uppercase; font-size: 9px; }
    .sfc-tile strong, .sfc-summary-item strong { font-weight: 300; font-size: 18px; }
    .sfc-section { position: relative; }
    .sfc-section::before { content: ""; position: absolute; left: -1px; top: 12px; width: 3px; height: 16px; background: #3fe0ff; box-shadow: 0 0 8px #3fe0ff; }
    .sfc-panel-grid { gap: 4px; }
    .sfc-panel-string + .sfc-panel-string .sfc-panel-grid { padding-left: 26px; }
    .sfc-panel { aspect-ratio: 1 / 1.12; padding: 0; align-content: center; border: 0; border-radius: 0;
      clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);
      background: linear-gradient(180deg, rgba(0, 220, 255, calc(.2 + var(--share-n) * .5)), rgba(0, 120, 200, .3)); }
    .sfc-panel.weak { background: linear-gradient(180deg, rgba(255,170,60,.7), rgba(200,90,30,.45)); box-shadow: none; }
    .sfc-panel small { font-size: 9px; }
    .sfc-panel span { display: none; }
  `,
  expanse: `
    .sfc {
      --sfc-font: "Rajdhani", "Bahnschrift SemiCondensed", "Arial Narrow", "Roboto Condensed", sans-serif-condensed, sans-serif; --sfc-num-font: "Share Tech Mono", ui-monospace, "SF Mono", Menlo, Consolas, "Roboto Mono", monospace;
      --sfc-bg: radial-gradient(80% 60% at 50% 30%, rgba(80,170,200,.10), transparent 70%), linear-gradient(180deg, #0d1218, #070a0e);
      --sfc-surface: rgba(140,190,210,.04); --sfc-border: rgba(170,210,225,.18); --sfc-text: #e4edf1; --sfc-muted: #7f99a6;
      --sfc-pv: #ffb347; --sfc-load: #e8eef2; --sfc-battery: #57d6c4; --sfc-grid: #ff6a3d;
      --sfc-accent: #ff8a2a; --sfc-accent-soft: rgba(255,138,42,.14); --sfc-tile-bg: rgba(140,190,210,.035); --sfc-track: rgba(170,210,225,.12);
      --sfc-tab-bg: rgba(140,190,210,.05); --sfc-tab-on-bg: #ff8a2a; --sfc-tab-on: #0b0f14;
      --sfc-tip-bg: #10171e; --sfc-badge-bg: rgba(255,138,42,.12);
      --sfc-flow-base: rgba(170,210,225,.10); --sfc-flow-w: 1.6; --sfc-dash: 3 9; --sfc-dash-time: 12s;
      --sfc-radius: 6px; --sfc-section-radius: 2px; --sfc-tile-radius: 2px; --sfc-tabs-radius: 2px; --sfc-tab-radius: 1px; --sfc-icon-radius: 2px;
      --sfc-heading-weight: 600;
      background: var(--sfc-bg);
    }
    .exp-grid { position: absolute; inset: 0; pointer-events: none; opacity: .5;
      background: linear-gradient(rgba(170,210,225,.05) 1px, transparent 1px) 0 0 / 24px 24px, linear-gradient(90deg, rgba(170,210,225,.05) 1px, transparent 1px) 0 0 / 24px 24px; }
    .exp-header { position: relative; display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 12px; padding: 16px 18px 0; }
    .exp-tag { padding: 4px 8px; background: #ff8a2a; color: #0b0f14; font: 700 11px/1 var(--sfc-num-font); letter-spacing: .08em; }
    .exp-title { min-width: 0; }
    .exp-title h1 { margin: 0; font-size: clamp(17px, 4.6cqw, 23px); font-weight: 700; letter-spacing: .06em; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .exp-title span { display: block; color: var(--sfc-muted); font: 11px var(--sfc-num-font); letter-spacing: .12em; text-transform: uppercase; }
    .exp-clock { display: grid; justify-items: end; font-family: var(--sfc-num-font); }
    .exp-clock small { color: #57d6c4; font-size: 10px; letter-spacing: .1em; text-transform: uppercase; }
    .exp-clock.delayed small { color: #ffb347; } .exp-clock.offline small { color: #ff6a3d; }
    .exp-clock b { font-size: 18px; font-weight: 400; }
    .exp-stage { position: relative; aspect-ratio: 480 / 330; margin: 8px 10px 0; }
    .exp-stage svg { position: absolute; inset: 0; width: 100%; height: 100%; }
    .exp-orbits ellipse, .exp-orbits line { stroke: rgba(170,210,225,.13); stroke-width: 1; stroke-dasharray: 2 5; }
    .exp-ring { stroke: #ff8a2a; stroke-width: 1.5; }
    .exp-spin { stroke: rgba(228,237,241,.7); stroke-width: 3; stroke-dasharray: 4 6; transform-box: fill-box; transform-origin: center; animation: exp-spin 14s linear infinite; }
    .exp-cross { stroke: #ff8a2a; stroke-width: 1.5; }
    @keyframes exp-spin { to { transform: rotate(360deg); } }
    .exp-core { position: absolute; width: 16%; aspect-ratio: 1; transform: translate(-50%, -50%); border: 0; border-radius: 50%; background: none; }
    .exp-box { position: absolute; transform: translate(-50%, -50%); width: 34%; display: grid; justify-items: start; gap: 0; padding: 7px 10px;
      border: 0; background: rgba(13,18,24,.82); text-align: left; --c: var(--sfc-text);
      box-shadow: inset 2px 0 0 var(--c); }
    .exp-box::before, .exp-box::after { content: ""; position: absolute; width: 9px; height: 9px; border: 1px solid var(--c); }
    .exp-box::before { right: 0; top: 0; border-left: 0; border-bottom: 0; }
    .exp-box::after { right: 0; bottom: 0; border-left: 0; border-top: 0; }
    .exp-box.pv { --c: var(--sfc-pv); } .exp-box.battery { --c: var(--sfc-battery); } .exp-box.grid { --c: var(--sfc-grid); } .exp-box.load { --c: var(--sfc-load); }
    .exp-code { color: var(--c); font: 10px var(--sfc-num-font); letter-spacing: .14em; }
    .exp-box small { color: var(--sfc-muted); font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; }
    .exp-box b { font: 400 clamp(17px, 4.6cqw, 23px)/1.1 var(--sfc-num-font); color: var(--sfc-text); white-space: nowrap; }
    .exp-box em { color: var(--c); font-size: 11px; font-style: normal; font-weight: 600; text-transform: uppercase; letter-spacing: .06em; }
    .exp-soc { position: relative; display: grid; gap: 6px; width: calc(100% - 36px); margin: 4px 18px 16px; padding: 0; border: 0; background: none; text-align: left; }
    .exp-soc-head { display: flex; align-items: baseline; gap: 10px; }
    .exp-soc-head small { color: var(--sfc-muted); font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .1em; }
    .exp-soc-head b { font: 400 20px var(--sfc-num-font); color: #57d6c4; }
    .exp-soc-head em { margin-left: auto; color: var(--sfc-muted); font: 12px var(--sfc-num-font); font-style: normal; }
    .exp-soc-bar { display: grid; grid-template-columns: repeat(25, 1fr); gap: 3px; }
    .exp-soc-bar i { height: 12px; background: rgba(170,210,225,.10); transform: skewX(-20deg); }
    .exp-soc-bar i.on { background: #57d6c4; box-shadow: 0 0 6px rgba(87,214,196,.5); }
    .exp-soc-bar i.reserve { background: rgba(255,106,61,.25); } .exp-soc-bar i.reserve.on { background: #ff6a3d; box-shadow: 0 0 6px rgba(255,106,61,.5); }
    .sfc-head h3 { font-size: 14px; letter-spacing: .1em; text-transform: uppercase; }
    .sfc-section { border-left: 2px solid #ff8a2a; }
    .sfc-tab { font-family: var(--sfc-num-font); font-size: 11px; }
    .sfc-tile small, .sfc-summary-item small { text-transform: uppercase; letter-spacing: .05em; font-weight: 600; }
  `,
  foundation: `
    .sfc {
      --sfc-font: "Cormorant Garamond", Garamond, "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif; --sfc-heading-font: "Cinzel", "Trajan Pro", "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif; --sfc-num-font: "Cinzel", "Trajan Pro", "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif;
      --sfc-bg: radial-gradient(60% 45% at 50% 32%, rgba(232,196,122,.13), transparent 70%), radial-gradient(120% 80% at 50% 120%, #1a1408, transparent 60%), #07070a;
      --sfc-surface: rgba(232,196,122,.035); --sfc-border: rgba(232,196,122,.2); --sfc-text: #f1e6cf; --sfc-muted: #a8946c;
      --sfc-pv: #f3cf7a; --sfc-load: #f1e6cf; --sfc-battery: #c99a4a; --sfc-grid: #8fa6c8;
      --sfc-accent: #e8c47a; --sfc-accent-soft: rgba(232,196,122,.12); --sfc-tile-bg: rgba(232,196,122,.03); --sfc-track: rgba(232,196,122,.12);
      --sfc-tab-bg: transparent; --sfc-tab-on-bg: rgba(232,196,122,.14); --sfc-tab-on: #f8edd4; --sfc-tab-shadow: inset 0 -1px 0 #e8c47a;
      --sfc-tip-bg: #121009; --sfc-badge-bg: rgba(232,196,122,.1);
      --sfc-flow-base: rgba(232,196,122,.1); --sfc-flow-w: 1.4; --sfc-dash: 1 5; --sfc-dash-time: 20s;
      --sfc-radius: 2px; --sfc-section-radius: 0; --sfc-tile-radius: 0; --sfc-tabs-radius: 0; --sfc-tab-radius: 0; --sfc-icon-radius: 50%;
      --sfc-heading-weight: 400; --sfc-frame: rgba(232,196,122,.35);
      background: var(--sfc-bg);
    }
    .fnd-dust { position: absolute; inset: 0; pointer-events: none; opacity: .55;
      background-image: radial-gradient(1px 1px at 12% 18%, #e8c47a, transparent), radial-gradient(1px 1px at 82% 12%, #f1e6cf, transparent),
        radial-gradient(1px 1px at 68% 44%, #e8c47a, transparent), radial-gradient(1px 1px at 24% 62%, #f1e6cf, transparent),
        radial-gradient(1px 1px at 90% 70%, #e8c47a, transparent), radial-gradient(1px 1px at 6% 86%, #e8c47a, transparent); }
    .fnd-header { position: relative; display: grid; justify-items: center; gap: 2px; padding: 22px 20px 0; text-align: center; }
    .fnd-header small { color: #e8c47a; font: 400 11px var(--sfc-heading-font); letter-spacing: .5em; text-transform: uppercase; }
    .fnd-header h1 { margin: 0; font: 400 clamp(20px, 5.6cqw, 28px) var(--sfc-heading-font); letter-spacing: .14em; text-transform: uppercase; }
    .fnd-header span { color: var(--sfc-muted); font-size: 14px; font-style: italic; }
    .fnd-stage { position: relative; aspect-ratio: 480 / 340; margin: 6px 12px 0; }
    .fnd-stage svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
    .fnd-orbit ellipse { stroke: rgba(232,196,122,.35); stroke-width: .8; }
    .fnd-orbit circle { fill: #f3cf7a; }
    .fnd-stars circle { fill: rgba(241,230,207,.55); }
    .fnd-sphere { animation: fnd-breathe 12s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
    @keyframes fnd-breathe { 50% { opacity: .85; transform: scale(.97); } }
    .fnd-ring { stroke: rgba(243,207,122,.6); stroke-width: .8; stroke-dasharray: 1 3; }
    .fnd-center { position: absolute; transform: translate(-50%, -50%); display: grid; justify-items: center; padding: 0; border: 0; background: none; }
    .fnd-center b { font: 400 clamp(15px, 4.2cqw, 21px)/1 var(--sfc-heading-font); white-space: nowrap; color: #1a1206; text-shadow: 0 0 10px rgba(255,244,214,.9); }
    .fnd-center small { color: #3b2a0e; font: 600 10px var(--sfc-heading-font); letter-spacing: .2em; text-transform: uppercase; }
    .fnd-node { position: absolute; transform: translate(-50%, -50%); display: grid; justify-items: center; padding: 2px 6px; border: 0; background: none; white-space: nowrap; }
    .fnd-node small { color: var(--sfc-muted); font: 400 10px var(--sfc-heading-font); letter-spacing: .24em; text-transform: uppercase; }
    .fnd-node b { font: 400 clamp(15px, 4cqw, 20px) var(--sfc-heading-font); color: var(--sfc-text); }
    .fnd-node em { color: var(--sfc-muted); font-size: 13px; }
    .fnd-node.pv b { color: #f3cf7a; } .fnd-node.grid b { color: #b9c9e0; }
    .fnd-forecast { position: relative; margin: 6px 28px 18px; padding-top: 12px; border-top: 1px solid rgba(232,196,122,.25); text-align: center; font-size: 18px; font-style: italic; line-height: 1.35; }
    .fnd-forecast small { display: block; margin-bottom: 2px; color: #e8c47a; font: 400 10px var(--sfc-heading-font); font-style: normal; letter-spacing: .4em; text-transform: uppercase; }
    .fnd-forecast em { color: #f3cf7a; font-style: normal; font-family: var(--sfc-heading-font); font-size: 16px; }
    .sfc-head h3 { font-size: 13px; letter-spacing: .2em; text-transform: uppercase; }
    .sfc-section { border-width: 1px 0 0; background: none; padding: 14px 4px; }
    .sfc-tab { font-family: var(--sfc-heading-font); font-size: 11px; letter-spacing: .08em; }
    .sfc-tile small, .sfc-summary-item small { font-size: 13px; }
  `,
  galaxy: `
    .sfc {
      --sfc-font: "Share Tech Mono", ui-monospace, "SF Mono", Menlo, Consolas, "Roboto Mono", monospace; --sfc-heading-font: "Orbitron", "Bahnschrift", "Eurostile", "Segoe UI", Roboto, sans-serif; --sfc-num-font: "Share Tech Mono", ui-monospace, "SF Mono", Menlo, Consolas, "Roboto Mono", monospace;
      --sfc-bg: #020203; --sfc-surface: rgba(255,200,40,.03); --sfc-border: rgba(255,190,40,.22); --sfc-text: #ffe8a8; --sfc-muted: #b08a3a;
      --sfc-pv: #ffe81f; --sfc-load: #ff9d2e; --sfc-battery: #4fe3ff; --sfc-grid: #ff4b3a;
      --sfc-accent: #ffe81f; --sfc-accent-soft: rgba(255,232,31,.12); --sfc-tile-bg: rgba(255,200,40,.025); --sfc-track: rgba(255,190,40,.12);
      --sfc-tab-bg: rgba(255,200,40,.04); --sfc-tab-on-bg: #ffe81f; --sfc-tab-on: #020203;
      --sfc-tip-bg: #0b0904; --sfc-badge-bg: rgba(255,232,31,.1);
      --sfc-flow-base: rgba(255,190,40,.12); --sfc-flow-w: 1.6; --sfc-dash: 6 12; --sfc-dash-time: 14s;
      --sfc-radius: 4px; --sfc-section-radius: 2px; --sfc-tile-radius: 2px; --sfc-tabs-radius: 2px; --sfc-tab-radius: 1px; --sfc-icon-radius: 2px;
      --sfc-heading-weight: 700;
      background: var(--sfc-bg);
    }
    .gal-stars { position: absolute; inset: 0; pointer-events: none;
      background-image: radial-gradient(1px 1px at 8% 12%, #fff, transparent), radial-gradient(1px 1px at 22% 40%, #cfd8ff, transparent),
        radial-gradient(1.5px 1.5px at 37% 8%, #fff, transparent), radial-gradient(1px 1px at 55% 30%, #fff, transparent),
        radial-gradient(1px 1px at 71% 14%, #fff, transparent), radial-gradient(1.5px 1.5px at 88% 34%, #fff, transparent),
        radial-gradient(1px 1px at 93% 6%, #cfd8ff, transparent), radial-gradient(1px 1px at 14% 70%, #fff, transparent),
        radial-gradient(1px 1px at 46% 88%, #fff, transparent), radial-gradient(1.5px 1.5px at 80% 78%, #fff, transparent); }
    .gal-header { position: relative; display: grid; justify-items: center; padding: 18px 18px 0; text-align: center; }
    .gal-header small { color: #4fe3ff; font-size: 11px; letter-spacing: .3em; text-transform: uppercase; }
    .gal-header h1 { margin: 2px 0 0; color: #ffe81f; font: 700 clamp(18px, 5cqw, 26px) var(--sfc-heading-font); letter-spacing: .12em; text-transform: uppercase; }
    .gal-crawl { width: 100%; height: 66px; margin-top: 6px; overflow: hidden; perspective: 220px; perspective-origin: 50% 0%;
      mask-image: linear-gradient(180deg, transparent, #000 30%, #000); -webkit-mask-image: linear-gradient(180deg, transparent, #000 30%, #000); }
    .gal-crawl p { margin: 0 auto; max-width: 92%; transform: rotateX(28deg); transform-origin: 50% 100%;
      color: #ffe81f; font: 500 clamp(13px, 3.4cqw, 16px)/1.3 "Oswald", "Bahnschrift SemiCondensed", "Arial Narrow", "Roboto Condensed", sans-serif-condensed, sans-serif; text-align: justify; text-align-last: center; }
    .gal-crawl em { font-style: normal; color: #fff6b0; }
    .gal-scope { position: relative; aspect-ratio: 480 / 300; margin: 4px 10px 12px; border: 1px solid rgba(255,190,40,.25); background: radial-gradient(closest-side, rgba(255,120,0,.06), transparent); }
    .gal-scope svg { position: absolute; inset: 0; width: 100%; height: 100%; }
    .gal-trench rect { stroke: rgba(255,170,30,.55); stroke-width: 1; vector-effect: non-scaling-stroke; }
    .gal-warp { transform-box: view-box; transform-origin: 240px 150px; opacity: 0; animation: gal-warp 12s linear infinite; animation-delay: calc(var(--d) * -3s); }
    @keyframes gal-warp { from { transform: scale(1); opacity: .45; } to { transform: scale(4.6); opacity: 0; } }
    .gal-target { stroke: #ffe81f !important; stroke-width: 2 !important; }
    .gal-target.low, .gal-cross.low { stroke: #ff4b3a !important; animation: gal-blink 3s ease-in-out infinite; }
    .gal-cross { stroke: #ff4b3a; stroke-width: 1.5; }
    @keyframes gal-blink { 50% { opacity: .45; } }
    .gal-center { position: absolute; transform: translate(-50%, -50%); padding: 0; border: 0; background: none; }
    .gal-center b { color: #ffe81f; font: 700 clamp(13px, 3.6cqw, 18px) var(--sfc-heading-font); white-space: nowrap; text-shadow: 0 0 8px rgba(255,232,31,.6); }
    .gal-center { display: grid; justify-items: center; }
    .gal-center small { color: #ffe81f; font-size: 9px; letter-spacing: .12em; text-transform: uppercase; white-space: nowrap; }
    .gal-readout.low small, .gal-readout.low b { color: #ff4b3a; }
    .gal-readout { position: absolute; transform: translate(-50%, -50%); display: grid; justify-items: center; gap: 0; padding: 3px 6px; border: 0;
      background: rgba(2,2,3,.75); white-space: nowrap; --c: var(--sfc-text); }
    .gal-readout.pv { --c: var(--sfc-pv); } .gal-readout.battery { --c: var(--sfc-battery); } .gal-readout.grid { --c: var(--sfc-grid); } .gal-readout.load { --c: var(--sfc-load); }
    .gal-readout small { color: var(--c); font-size: 10px; letter-spacing: .16em; text-transform: uppercase; }
    .gal-readout b { color: var(--sfc-text); font-size: clamp(14px, 3.8cqw, 19px); font-weight: 400; }
    .gal-readout em { color: var(--sfc-muted); font-size: 10px; font-style: normal; text-transform: uppercase; }
    .gal-hud { position: absolute; left: 0; right: 0; bottom: 4px; display: flex; justify-content: space-between; padding: 0 8px; color: var(--sfc-muted); font-size: 11px; letter-spacing: .1em; text-transform: uppercase; }
    .gal-hud .live { color: #4fe3ff; } .gal-hud .delayed { color: #ffb347; } .gal-hud .offline { color: #ff4b3a; }
    .sfc-head h3 { font-family: var(--sfc-heading-font); font-size: 12px; letter-spacing: .14em; text-transform: uppercase; color: #ffe81f; }
    .sfc-tab { font-size: 11px; }
    .sfc-tile small, .sfc-summary-item small { text-transform: uppercase; letter-spacing: .04em; font-size: 10px; }
  `,
  gate: `
    .sfc {
      --sfc-font: "Rajdhani", "Bahnschrift SemiCondensed", "Arial Narrow", "Roboto Condensed", sans-serif-condensed, sans-serif; --sfc-num-font: "Share Tech Mono", ui-monospace, "SF Mono", Menlo, Consolas, "Roboto Mono", monospace; --sfc-heading-weight: 700;
      --gt-cyan: #6fd3ff; --gt-amber: #ff8f1f; --gt-line: #173149;
      --sfc-bg: radial-gradient(60% 50% at 50% 30%, #0b1a2a 0%, #04070b 70%);
      --sfc-surface: linear-gradient(180deg, rgba(13,28,44,.9), rgba(6,13,21,.9)); --sfc-border: #173149; --sfc-text: #cfe8ff; --sfc-muted: #5f87a6;
      --sfc-pv: #ffc23d; --sfc-load: #ff8f6b; --sfc-battery: #48e0c8; --sfc-grid: #8fa8ff;
      --sfc-accent: #6fd3ff; --sfc-accent-soft: rgba(111,211,255,.12); --sfc-tile-bg: rgba(4,10,16,.7); --sfc-track: #0e2233;
      --sfc-tab-bg: transparent; --sfc-tab-on-bg: #6fd3ff; --sfc-tab-on: #04070b; --sfc-tip-bg: #08111b; --sfc-badge-bg: rgba(111,211,255,.1);
      --sfc-flow-base: rgba(111,211,255,.12); --sfc-flow-w: 2; --sfc-dash: 3 9; --sfc-dash-time: 14s;
      --sfc-radius: 14px; --sfc-section-radius: 0; --sfc-tile-radius: 0; --sfc-tabs-radius: 0; --sfc-tab-radius: 0; --sfc-icon-radius: 0;
      --sfc-frame: #1d3550;
      background: var(--sfc-bg);
    }
    ha-card.sfc::before { content: ""; position: absolute; inset: 0; pointer-events: none; background: repeating-linear-gradient(0deg, rgba(111,211,255,.03) 0 1px, transparent 1px 3px); }
    .gt-top { position: relative; display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-bottom: 1px solid var(--gt-line); background: linear-gradient(90deg, #0a1726, #06101a); }
    .gt-tag { padding: 3px 7px; background: var(--gt-amber); color: #04070b; font: 12px var(--sfc-num-font); letter-spacing: .1em; }
    .gt-title { min-width: 0; }
    .gt-title h1 { margin: 0; font-size: clamp(15px, 3.6cqw, 22px); letter-spacing: .14em; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .gt-title span { display: block; font: 11px var(--sfc-num-font); color: var(--sfc-muted); letter-spacing: .12em; text-transform: uppercase; }
    .gt-right { margin-left: auto; display: grid; justify-items: end; gap: 2px; font: 12px var(--sfc-num-font); color: var(--sfc-muted); white-space: nowrap; }
    .gt-live { color: #48e08b; text-transform: uppercase; } .gt-live::before { content: "● "; }
    .gt-live.delayed { color: var(--gt-amber); } .gt-live.offline { color: #ff4433; }
    .gt-layout { position: relative; display: grid; gap: 14px; padding: 14px 16px 0; }
    .gt-layout > .sfc-sections { padding: 0 0 16px; }
    .gt-energy > .sfc-section { margin: 0; }
    /* The corner readouts sit on the corners of the gate's square. */
    .gt-gate { position: relative; display: grid; place-items: center; width: 100%; max-width: 560px; justify-self: center; }
    .gt-full { display: none; }
    .gt-compact { max-width: 620px; }
    .gt-compact .gt-center b { font-size: clamp(26px, 7cqw, 46px); }
    .gt-compact .gt-center small, .gt-compact .gt-center span, .gt-compact .gt-center em { font-size: clamp(9px, 2.1cqw, 12px); }
    .gt-label { position: absolute; transform: translateX(-50%); display: grid; justify-items: center; padding: 0; border: 0; background: none; white-space: nowrap;
      font: 10px var(--sfc-num-font); letter-spacing: .12em; color: var(--sfc-muted); text-transform: uppercase; }
    .gt-label b { font: clamp(13px, 3.4cqw, 19px) var(--sfc-num-font); }
    .gt-label.pv b { color: var(--sfc-pv); } .gt-label.grid b { color: var(--sfc-grid); } .gt-label.battery b { color: var(--sfc-battery); } .gt-label.load b { color: var(--sfc-load); }
    /* Corner pictures: solar cells, a zero point module, a dial home device, the mountain base. */
    .gt-icon { opacity: .75; transition: opacity .4s; } .gt-icon.on { opacity: 1; }
    .gt-icon-cells path { fill: #13304a; stroke: var(--sfc-pv); stroke-width: 1.2; }
    .gt-icon.pv.on .gt-icon-cells path { fill: color-mix(in srgb, var(--sfc-pv) 28%, #13304a); filter: drop-shadow(0 0 3px var(--sfc-pv)); }
    .gt-icon-stand { stroke: #5d6b78; stroke-width: 3; fill: none; }
    .gt-zpm-glass { fill: rgba(255,170,80,.08); stroke: #ffb35c; stroke-width: 1.6; }
    .gt-zpm-band { fill: #b48a3c; } .gt-zpm-edge { stroke: rgba(255,230,190,.5); stroke-width: 1; }
    .gt-icon.battery.on .gt-zpm-core { filter: drop-shadow(0 0 6px #ff9a3c); }
    .gt-dhd-foot { fill: #1c252e; }
    .gt-dhd-stand { fill: #2a3540; stroke: #4c5d6c; stroke-width: 1.2; }
    .gt-dhd-rim { fill: #222c35; stroke: #5d6b78; stroke-width: 1.2; }
    .gt-dhd-top { fill: #3b4652; stroke: #6c7a88; stroke-width: 1; }
    .gt-dhd-keys rect { fill: #6e5530; stroke: #2a2014; stroke-width: .5; }
    .gt-icon.grid.on .gt-dhd-keys.outer rect { fill: #e39a45; } .gt-icon.grid.on .gt-dhd-keys.inner rect { fill: #c9853a; }
    .gt-dhd-dome { fill: #6e1a12; stroke: #3a0d08; stroke-width: 1; }
    .gt-icon.grid.on .gt-dhd-dome { fill: #ff3b2a; filter: drop-shadow(0 0 7px #ff4433); }
    .gt-dhd-shine { fill: rgba(255,255,255,.35); }
    .gt-sgc-mountain { fill: #22303c; stroke: #4c5d6c; stroke-width: 1.5; }
    .gt-sgc-door { fill: #3b4652; stroke: #6c7a88; stroke-width: 1.5; } .gt-sgc-door-line { stroke: #6c7a88; }
    .gt-sgc-lights { stroke: #3a4a58; stroke-width: 2.5; } .gt-icon.load.on .gt-sgc-lights { stroke: var(--sfc-load); filter: drop-shadow(0 0 3px var(--sfc-load)); }
    .gt-svg { width: 100%; }
    .gt-eh { opacity: .12; transition: opacity .6s; }
    .gt-horizon.open .gt-eh { opacity: 1; }
    .gt-ripples circle { fill: none; stroke: #bff0ff; stroke-width: 1.5; opacity: 0; transform-box: fill-box; transform-origin: center; }
    .gt-horizon.open .gt-ripples circle { animation: gt-ripple 6s ease-in-out infinite; animation-delay: var(--d); }
    @keyframes gt-ripple { 0%, 100% { opacity: .1; transform: scale(.96); } 50% { opacity: .35; transform: scale(1.04); } }
    .gt-ring-base { fill: none; stroke: #2c3e4f; stroke-width: 56; }
    .gt-ring-edge { fill: none; stroke: #405668; stroke-width: 4; }
    .gt-ring-track { fill: none; stroke: #1d2b38; stroke-width: 22; }
    .gt-glyphs path { fill: #7896ad; fill-rule: evenodd; } .gt-glyphs path.origin { fill: #b9ecff; }
    .gt-seam { stroke: #15212c; stroke-width: 2; }
    .gt-glyphs { transform-box: view-box; transform-origin: 0 0; }
    .gt-glyphs.cw { animation: gt-spin 180s linear infinite; animation-delay: var(--d); }
    .gt-glyphs.ccw { animation: gt-spin 180s linear infinite reverse; animation-delay: var(--d); }
    @keyframes gt-spin { to { transform: rotate(360deg); } }
    /* Chevrons: a metal arrowhead housing, a clamp that drops into place
       when the chevron locks, and the triangular light. */
    .gt-chevron-body { fill: #3e4955; stroke: #6b7987; stroke-width: 1.5; }
    .gt-chevron-rib { fill: none; stroke: #8996a3; stroke-width: 1; opacity: .6; }
    .gt-chevron-recess { fill: #1a2027; }
    .gt-chevron-clamp { fill: #4a5562; stroke: #6b7987; stroke-width: 1.2; transition: transform .6s; transform-box: fill-box; }
    .gt-chevron.on .gt-chevron-clamp, .gt-chevron.port.on .gt-chevron-clamp { transform: translateY(4px); fill: #5b6672; }
    .gt-chevron-light { fill: #3a2410; }
    .gt-chevron.on .gt-chevron-light { fill: var(--gt-amber); filter: drop-shadow(0 0 6px var(--gt-amber)); }
    .gt-chevron.unused { opacity: .45; }
    /* Connection chevrons: the flow's colour, a slow pulse while power flows. */
    .gt-chevron.port .gt-chevron-light { fill: color-mix(in srgb, var(--c) 30%, #1a1208); }
    .gt-chevron.port.on .gt-chevron-light { fill: var(--c); animation: gt-port 3.2s ease-in-out infinite; }
    .gt-chevron.port.pv { --c: var(--sfc-pv); } .gt-chevron.port.grid { --c: var(--sfc-grid); }
    .gt-chevron.port.load { --c: var(--sfc-load); } .gt-chevron.port.battery { --c: var(--sfc-battery); }
    @keyframes gt-port { 0%, 100% { filter: drop-shadow(0 0 2px var(--c)); opacity: .8; } 50% { filter: drop-shadow(0 0 9px var(--c)); opacity: 1; } }
    .gt-lines .sfc-flow-base { stroke-width: 2; } .gt-lines .sfc-flow { stroke-width: 2.4; }
    .gt-center { position: absolute; display: grid; justify-items: center; gap: 2px; padding: 0; border: 0; background: none; text-align: center; }
    .gt-center small { font: clamp(10px, 2.4cqw, 13px) var(--sfc-num-font); letter-spacing: .3em; color: #bfe9ff; text-transform: uppercase; }
    .gt-center b { font: 600 clamp(34px, 10cqw, 64px)/1 var(--sfc-font); color: #fff; text-shadow: 0 0 18px rgba(111,211,255,.9); }
    .gt-center span { font: clamp(11px, 2.6cqw, 15px) var(--sfc-num-font); color: #d9f3ff; }
    .gt-center em { font: clamp(11px, 2.6cqw, 15px) var(--sfc-num-font); font-style: normal; color: var(--gt-amber); }
    .gt-node { position: absolute; font: 11px var(--sfc-num-font); letter-spacing: .12em; color: var(--sfc-muted); text-transform: uppercase; }
    .gt-node[style*="right"] { text-align: right; }
    .gt-node b { display: block; font: clamp(15px, 3.6cqw, 22px) var(--sfc-num-font); }
    .gt-node.pv b { color: var(--sfc-pv); } .gt-node.grid b { color: var(--sfc-grid); } .gt-node.battery b { color: var(--sfc-battery); } .gt-node.load b { color: var(--sfc-load); }
    .gt-panel { position: relative; padding: 12px; border: 1px solid var(--gt-line); background: var(--sfc-surface); }
    .gt-panel::after, .sfc-section::after { content: ""; position: absolute; top: -1px; left: -1px; width: 16px; height: 16px; border-top: 2px solid var(--gt-cyan); border-left: 2px solid var(--gt-cyan); pointer-events: none; }
    .sfc-section { position: relative; }
    .gt-ph { display: flex; justify-content: space-between; gap: 8px; margin-bottom: 9px; font: 11px var(--sfc-num-font); color: var(--sfc-muted); letter-spacing: .14em; text-transform: uppercase; }
    .gt-ph b { color: var(--gt-cyan); font-weight: 400; }
    .gt-row { width: 100%; display: grid; grid-template-columns: 26px minmax(0, 1fr) auto; gap: 10px; align-items: center; margin-bottom: 6px; padding: 6px 8px;
      border: 1px solid var(--gt-line); background: rgba(4,10,16,.7); text-align: left; --c: var(--gt-cyan); }
    .gt-row.pv { --c: var(--sfc-pv); } .gt-row.battery { --c: var(--sfc-battery); } .gt-row.grid { --c: var(--sfc-grid); } .gt-row.load { --c: var(--sfc-load); }
    .gt-ch { width: 22px; height: 18px; clip-path: polygon(0 0, 100% 0, 50% 100%); background: #2a1a0a; }
    .gt-ch.on { background: var(--gt-amber); box-shadow: 0 0 10px var(--gt-amber); }
    .gt-row small { display: block; font: 10px var(--sfc-num-font); color: var(--sfc-muted); letter-spacing: .12em; text-transform: uppercase; }
    .gt-row strong { display: block; font-size: 15px; letter-spacing: .06em; text-transform: uppercase; }
    .gt-bar { display: block; height: 3px; margin-top: 4px; background: #0e2233; } .gt-bar i { display: block; height: 100%; background: var(--c); }
    .gt-v { font: clamp(15px, 3.4cqw, 19px) var(--sfc-num-font); text-align: right; white-space: nowrap; }
    .gt-v em { display: block; font-size: 10px; font-style: normal; color: var(--sfc-muted); }
    .gt-status { margin: 4px 0 10px; padding: 7px; text-align: center; font: 12px var(--sfc-num-font); letter-spacing: .16em; text-transform: uppercase; border: 1px solid #24506f; color: var(--gt-cyan); }
    .gt-status.on { background: var(--gt-amber); border-color: var(--gt-amber); color: #04070b; }
    .gt-status.alert { background: #ff4433; border-color: #ff4433; color: #fff; animation: gt-alert 3s ease-in-out infinite; }
    @keyframes gt-alert { 50% { opacity: .7; } }
    .gt-kvs { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
    .gt-kv { padding: 6px 8px; border: 1px solid var(--gt-line); background: rgba(4,10,16,.7); min-width: 0; }
    .gt-kv small { display: block; font: 10px var(--sfc-num-font); color: var(--sfc-muted); letter-spacing: .1em; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .gt-kv b { font: 400 17px var(--sfc-num-font); }
    .sfc-head h3 { font-size: 13px; letter-spacing: .16em; text-transform: uppercase; }
    .sfc-tab { font-family: var(--sfc-num-font); font-size: 12px; border: 1px solid var(--gt-line); }
    .sfc-tile small, .sfc-summary-item small { font-family: var(--sfc-num-font); text-transform: uppercase; letter-spacing: .06em; font-size: 10px; }
    .sfc-tile strong, .sfc-summary-item strong { font-weight: 400; }
    .sfc-panel { border-radius: 0; }
    @container (min-width: 1000px) {
      .gt-layout.wide { grid-template-columns: minmax(340px, 34%) minmax(0, 1fr); grid-template-areas: "dial gate" "energy energy" "sections sections"; align-items: start; padding-top: 16px; }
      .gt-layout.wide .gt-dial { grid-area: dial; }
      .gt-layout.wide .gt-gate { grid-area: gate; width: 100%; max-width: 760px; justify-self: center; }
      .gt-layout.wide .gt-full { display: grid; }
      .gt-layout.wide .gt-compact { display: none; }
      .gt-layout.wide .gt-energy { grid-area: energy; }
      .gt-layout.wide > .sfc-sections { grid-area: sections; }
    }
    @container (min-width: 1400px) {
      .gt-layout.wide { grid-template-columns: minmax(340px, 25%) minmax(0, 1fr) minmax(440px, 36%); grid-template-areas: "dial gate energy" "sections sections sections"; }
    }
  `,
  reactor: `
    .sfc {
      --sfc-font: "Rajdhani", "Bahnschrift SemiCondensed", "Arial Narrow", "Roboto Condensed", sans-serif-condensed, sans-serif; --sfc-heading-font: "Orbitron", "Bahnschrift", "Eurostile", "Segoe UI", Roboto, sans-serif; --sfc-num-font: "Rajdhani", "Bahnschrift SemiCondensed", "Arial Narrow", "Roboto Condensed", sans-serif-condensed, sans-serif;
      --sfc-bg: radial-gradient(60% 30% at 50% 12%, rgba(79,216,255,.10), transparent 70%), linear-gradient(180deg, #050b14, #02060b);
      --sfc-surface: linear-gradient(180deg, rgba(20,70,100,.22), rgba(6,20,32,.5)); --sfc-border: rgba(79,216,255,.24);
      --sfc-text: #e9fbff; --sfc-muted: #6fb6d6;
      --sfc-pv: #ffc857; --sfc-load: #ff5a4e; --sfc-battery: #5cffb0; --sfc-grid: #7aa8ff;
      --sfc-accent: #4fd8ff; --sfc-accent-soft: rgba(79,216,255,.1); --sfc-tile-bg: rgba(79,216,255,.05); --sfc-track: rgba(79,216,255,.12);
      --sfc-tab-bg: rgba(79,216,255,.04); --sfc-tab-on-bg: rgba(79,216,255,.16); --sfc-tab-on: #fff; --sfc-tab-shadow: inset 0 -2px 0 #4fd8ff, 0 0 14px rgba(79,216,255,.3);
      --sfc-tip-bg: #061826; --sfc-badge-bg: rgba(79,216,255,.12);
      --sfc-flow-base: rgba(79,216,255,.12); --sfc-flow-w: 3; --sfc-dash: 3 9; --sfc-dash-time: 9s;
      --sfc-radius: 18px; --sfc-section-radius: 0; --sfc-tile-radius: 0; --sfc-tabs-radius: 0; --sfc-tab-radius: 0; --sfc-icon-radius: 2px;
      --sfc-heading-weight: 700; --sfc-frame: rgba(79,216,255,.35);
      --sfc-shadow: 0 0 40px rgba(79,216,255,.15), inset 0 0 80px rgba(0,0,0,.6);
      background: var(--sfc-bg);
    }
    .sfc::after { content: ""; position: absolute; inset: 0; pointer-events: none; z-index: 2;
      background: repeating-linear-gradient(0deg, rgba(120,220,255,.025) 0 1px, transparent 1px 3px); }
    .sfc .sfc-flow { filter: drop-shadow(0 0 3px currentColor); }
    .rx-stage { position: relative; padding: 16px 16px 12px; }
    .rx-header { position: relative; z-index: 1; display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }
    .rx-header small { display: block; color: #4fd8ff; font-size: 10px; letter-spacing: .3em; text-transform: uppercase; }
    .rx-header h1 { margin: 2px 0 0; font: 700 clamp(16px, 4.2cqw, 22px) var(--sfc-heading-font); letter-spacing: .08em; text-transform: uppercase; color: #e9fbff; }
    .rx-right { text-align: right; }
    .rx-wx { margin-top: 3px; padding: 0; border: 0; background: none; color: #ffd27a; font: 600 13px var(--sfc-font); cursor: pointer; }
    .night .rx-wx { color: #9cc8ff; }
    /* The readouts scale with the visor (cqw of the visor), so they keep their
       place inside the frame at every card width. */
    .rx-visor { position: relative; aspect-ratio: 520 / 560; margin: -10px -16px 0; container-type: inline-size; }
    .rx-visor > svg { position: absolute; inset: 0; width: 100%; height: 100%; }
    .rx-frame { fill: rgba(79,216,255,.025); stroke: rgba(79,216,255,.35); stroke-width: 1.2; }
    .rx-ticks { stroke: #4fd8ff; stroke-width: 1; transform-box: view-box; transform-origin: 260px 250px; animation: rx-spin var(--spin, 60s) linear infinite; animation-delay: var(--p-spin, 0s); }
    .rx-track { fill: none; stroke: #123447; stroke-width: 7; }
    .rx-gauge { fill: none; stroke-width: 7; stroke-linecap: round; filter: drop-shadow(0 0 4px currentColor); }
    .rx-gauge.battery { stroke: var(--sfc-battery); color: var(--sfc-battery); } .rx-gauge.pv { stroke: var(--sfc-pv); color: var(--sfc-pv); }
    .rx-gtext { font: 700 11px var(--sfc-font); letter-spacing: .18em; }
    .rx-gtext.battery { fill: var(--sfc-battery); } .rx-gtext.pv { fill: var(--sfc-pv); }
    .rx-seg { fill: #16303d; }
    .rx-seg.on { fill: url(#rx-seg); filter: url(#rx-glow); animation: rx-seg 3.2s ease-in-out infinite; animation-delay: calc(var(--p-seg, 0s) + var(--i) * -.32s); }
    .over .rx-seg.on { animation-duration: 1.2s; animation-delay: calc(var(--p-over, 0s) + var(--i) * .12s); }
    @keyframes rx-seg { 50% { opacity: .72; } }
    .rx-holes rect { fill: #bdf2ff; animation: rx-seg 2.4s ease-in-out infinite; animation-delay: var(--p-holes, 0s); }
    .rx-arcs path { fill: url(#rx-seg); filter: url(#rx-glow); }
    .rx-arcs { transform-box: view-box; transform-origin: 260px 250px; }
    .rx-arcs.charging { animation: rx-spin 6s linear infinite; animation-delay: var(--p-arc6, 0s); }
    .rx-arcs.discharging { animation: rx-spin 9s linear infinite reverse; animation-delay: var(--p-arc9, 0s); }
    .rx-core { animation: rx-core 2.6s ease-in-out infinite; animation-delay: var(--p-core, 0s); }
    @keyframes rx-core { 50% { opacity: .82; } }
    .rx-mesh { fill: none; stroke: #e9fdff; stroke-width: .7; opacity: .8; }
    .rx-halo { animation: rx-core 3.4s ease-in-out infinite; animation-delay: var(--p-halo, 0s); }
    .rx-rays { stroke: #c9f8ff; transform-box: view-box; transform-origin: 260px 250px; animation: rx-spin 40s linear infinite; animation-delay: var(--p-rays, 0s); }
    @keyframes rx-spin { to { transform: rotate(360deg); } }
    .rx-star { fill: #fff; animation: rx-twinkle 4s ease-in-out infinite; animation-delay: calc(var(--p-star, 0s) + var(--d)); }
    @keyframes rx-twinkle { 50% { opacity: .3; } }
    .rx-sun { animation: rx-core 6s ease-in-out infinite; animation-delay: var(--p-sun, 0s); }
    .rx-fog > * { animation: rx-fog 30s ease-in-out infinite alternate; animation-delay: var(--p-fog, 0s); }
    @keyframes rx-fog { to { transform: translateX(160px); } }
    .rx-rain line { stroke: #9cc8ff; stroke-opacity: .3; stroke-width: 1.1; animation: rx-fall 1.4s linear infinite; animation-delay: calc(var(--p-rain, 0s) + var(--d)); }
    @keyframes rx-fall { from { transform: translate(0, -60px); } to { transform: translate(-20px, 120px); } }
    .rx-drops g { animation: rx-drip 9s ease-in infinite; animation-delay: calc(var(--p-drip, 0s) + var(--d)); }
    .rx-drops circle { fill: rgba(207,232,255,.08); stroke: rgba(207,232,255,.4); stroke-width: .7; }
    .rx-drops path { fill: none; stroke: rgba(207,232,255,.2); }
    @keyframes rx-drip { 0% { transform: translateY(0); opacity: 0; } 10% { opacity: 1; } 70% { transform: translateY(26px); opacity: 1; } 100% { transform: translateY(60px); opacity: 0; } }
    .rx-snow circle { fill: #fff; opacity: .8; animation: rx-snow 7s linear infinite; animation-delay: calc(var(--p-snow, 0s) + var(--d)); }
    @keyframes rx-snow { from { transform: translate(0, -40px); } to { transform: translate(14px, 300px); } }
    .rx-flash { opacity: 0; animation: rx-flash 9s linear infinite; animation-delay: var(--p-flash, 0s); }
    @keyframes rx-flash { 0%, 92%, 96%, 100% { opacity: 0; } 93% { opacity: .35; } 95% { opacity: .12; } }
    /* Start-up, only the first time the card is shown: the visor frame draws
       in, the reactor powers up segment by segment, then the readouts appear. */
    .rx-reactor, .rx-boot-ticks { transform-box: view-box; transform-origin: 260px 250px; }
    .boot .rx-frame { stroke-dasharray: 1; animation: rx-draw 1s ease-out calc(0s - var(--bt)) both; }
    .boot .rx-reactor { animation: rx-power .8s cubic-bezier(.2,.8,.2,1) calc(.15s - var(--bt)) both; }
    .boot .rx-boot-ticks { animation: rx-ticks-in 1.1s ease-out calc(.3s - var(--bt)) both; }
    .boot .rx-gauge { stroke-dasharray: 1; animation: rx-draw .9s ease-out calc(1.1s - var(--bt)) both; }
    .rx-bootseg path { fill: #fff; opacity: 0; filter: url(#rx-glow); animation: rx-flashseg .5s ease-out both; animation-delay: calc(.7s + var(--i) * .07s - var(--bt)); }
    .boot :is(.rx-node, .rx-inv, .rx-gtext) { animation: rx-in .5s ease-out calc(1.3s - var(--bt)) both; }
    .boot .rx-scan p { animation: rx-type 1s steps(30) calc(1.5s - var(--bt)) both; }
    @keyframes rx-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
    @keyframes rx-power { from { transform: scale(.6); opacity: 0; } 60% { opacity: 1; } to { transform: scale(1); opacity: 1; } }
    @keyframes rx-ticks-in { from { transform: rotate(-120deg); opacity: 0; } to { transform: rotate(0); opacity: 1; } }
    @keyframes rx-flashseg { 0% { opacity: 0; } 30% { opacity: .9; } 100% { opacity: 0; } }
    @keyframes rx-in { from { opacity: 0; } to { opacity: 1; } }
    @keyframes rx-type { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0 0 0); } }
    .rx-node, .rx-inv { position: absolute; transform: translate(-50%, -50%); display: grid; justify-items: center; padding: 1.15cqw 2.3cqw 1cqw; border: 0; background: none; color: inherit; cursor: pointer; white-space: nowrap; }
    .rx-node::before, .rx-node::after { content: ""; position: absolute; inset: 0; pointer-events: none; border: 1.6px solid var(--c);
      clip-path: polygon(0 0, 12px 0, 12px 1.6px, 1.6px 1.6px, 1.6px 10px, 0 10px, 0 calc(100% - 10px), 1.6px calc(100% - 10px), 1.6px calc(100% - 1.6px), 12px calc(100% - 1.6px), 12px 100%, 0 100%,
        0 0, 100% 0, 100% 10px, calc(100% - 1.6px) 10px, calc(100% - 1.6px) 1.6px, calc(100% - 12px) 1.6px, calc(100% - 12px) 0,
        100% 100%, calc(100% - 12px) 100%, calc(100% - 12px) calc(100% - 1.6px), calc(100% - 1.6px) calc(100% - 1.6px), calc(100% - 1.6px) calc(100% - 10px), 100% calc(100% - 10px)); }
    .rx-node::after { display: none; }
    .rx-node.pv { --c: var(--sfc-pv); } .rx-node.battery { --c: var(--sfc-battery); } .rx-node.grid { --c: var(--sfc-grid); } .rx-node.load { --c: var(--sfc-load); }
    .rx-node small { color: var(--c); font-size: max(7px, 1.9cqw); letter-spacing: .24em; text-transform: uppercase; }
    .rx-node b { font: 700 max(13px, 4.6cqw)/1.05 var(--sfc-num-font); color: #e9fbff; text-shadow: 0 0 10px rgba(79,216,255,.35); }
    .rx-node em { color: var(--c); opacity: .8; font-size: max(7.5px, 2cqw); font-style: normal; }
    .rx-inv b { font: 700 max(12px, 4cqw)/1 var(--sfc-num-font); color: #e9fbff; }
    .rx-inv small { color: #4fd8ff; font-size: max(7px, 1.75cqw); letter-spacing: .22em; text-transform: uppercase; }
    .rx-scan { position: relative; z-index: 1; display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-top: 4px; padding: 8px 12px;
      border: 1px solid rgba(79,216,255,.22); background: rgba(4,16,26,.7);
      clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px)); }
    .rx-scan small { color: #4fd8ff; font-size: 9.5px; letter-spacing: .26em; text-transform: uppercase; }
    .rx-scan p { margin: 1px 0 0; font-size: 13px; color: #cfe8f5; }
    .rx-scan em { font-style: normal; color: #fff; }
    .rx-mode { flex: none; font: 700 11px var(--sfc-heading-font); letter-spacing: .14em; text-transform: uppercase; color: #4fd8ff; }
    .rx-mode.pv { color: var(--sfc-pv); text-shadow: 0 0 10px rgba(255,200,87,.6); } .rx-mode.battery { color: var(--sfc-battery); }
    .rx-mode.grid { color: #ffab4a; animation: rx-twinkle 2s ease-in-out infinite; animation-delay: var(--p-mode, 0s); } .rx-mode.idle { color: var(--sfc-muted); }
    .sfc-sections { position: relative; z-index: 1; }
    .sfc-section { position: relative; border: 0; box-shadow: inset 0 0 0 1px rgba(79,216,255,.16);
      clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px));
      background: linear-gradient(#4fd8ff, #4fd8ff) left top / 22px 2px no-repeat, linear-gradient(#4fd8ff, #4fd8ff) left top / 2px 22px no-repeat,
        linear-gradient(#4fd8ff, #4fd8ff) right bottom / 22px 2px no-repeat, linear-gradient(#4fd8ff, #4fd8ff) right bottom / 2px 22px no-repeat,
        linear-gradient(225deg, transparent 10px, rgba(79,216,255,.55) 10px 11.5px, transparent 11.5px) right top / 18px 18px no-repeat,
        var(--sfc-surface); }
    .sfc-head h3 { font-size: 12px; letter-spacing: .24em; text-transform: uppercase; color: #4fd8ff; text-shadow: 0 0 10px rgba(79,216,255,.5); }
    .sfc-kicker { border-radius: 0; background: transparent; box-shadow: inset 0 0 0 1px #4fd8ff; }
    :is(.sfc-tile, .sfc-insight, .sfc-reading, .sfc-string, .sfc-meter, .sfc-phase, .sfc-summary-item) { clip-path: polygon(0 0, calc(100% - 9px) 0, 100% 9px, 100% 100%, 0 100%); }
    .sfc-tab { font-family: var(--sfc-heading-font); font-size: 10px; letter-spacing: .04em; text-transform: uppercase; }
    @container (min-width: 640px) { .sfc-tab { font-size: 11px; letter-spacing: .1em; } }
    .sfc-compare-table thead th { color: #4fd8ff; letter-spacing: .12em; }
    .sfc-panel { clip-path: polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 0 100%); }
  `,
};
