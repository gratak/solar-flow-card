/*!
 * Home Energy Hub for Home Assistant (formerly Solar Flow Card)
 * https://github.com/gratak/solar-flow-card
 * Copyright (C) 2026 gratak
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by the Free
 * Software Foundation, either version 3 of the License, or (at your option)
 * any later version. It is distributed WITHOUT ANY WARRANTY; see the GNU
 * General Public License for details: LICENSE in the repository, or
 * <https://www.gnu.org/licenses/>.
 *
 * Versions up to 1.8.0-beta.9 were released under the MIT License and stay
 * available under it. The translations (translations/*.json) remain MIT.
 *
 * The data layer started from the Energy Flow card of hass-deyecloud
 * (https://github.com/heavenknows1978/hass-deyecloud), which is under the
 * MIT License:
 *
 *   Copyright (c) 2024 Trần Công Tuấn Anh
 *
 *   Permission is hereby granted, free of charge, to any person obtaining a
 *   copy of this software and associated documentation files (the
 *   "Software"), to deal in the Software without restriction, including
 *   without limitation the rights to use, copy, modify, merge, publish,
 *   distribute, sublicense, and/or sell copies of the Software, and to
 *   permit persons to whom the Software is furnished to do so, subject to
 *   the following conditions: The above copyright notice and this
 *   permission notice shall be included in all copies or substantial
 *   portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT
 *   WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 *   THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *   NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 *   LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 *   OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 *   WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * Built from src/*.js by scripts/build.mjs. Edit the sources, not this file.
 */
(() => {
const CARD_VERSION = "2.0.2";
// The card's type is custom:home-energy-hub since 2.0.0. The old name stays
// registered so dashboards with custom:solar-flow-card keep working.
const CARD_TAG = "home-energy-hub";
const EDITOR_TAG = "home-energy-hub-editor";
const LEGACY_CARD_TAG = "solar-flow-card";
const LEGACY_EDITOR_TAG = "solar-flow-card-editor";
const CARD_TYPE = `custom:${CARD_TAG}`;
const LEGACY_CARD_TYPE = `custom:${LEGACY_CARD_TAG}`;
const THEMES = ["diorama", "aurora", "paper", "lcars", "atlantis", "expanse", "foundation", "galaxy", "gate", "reactor"];
const PERIODS = ["today", "3d", "7d", "month", "all"];
// A flow below this many watts counts as idle.
const ACTIVE_W = 5;

// Generated from translations/*.json.
const TRANSLATIONS = {
  "en": {
    "languageName": "English",
    "locale": "en-GB",
    "currency": "€",
    "hourShort": "h",
    "minShort": "min",
    "dayShort": "d",
    "defaultTitle": "Home energy",
    "live": "Live",
    "delayed": "Delayed",
    "offline": "Offline",
    "solar": "Solar",
    "battery": "Battery",
    "grid": "Grid",
    "home": "Home",
    "inverter": "Inverter",
    "generating": "Generating",
    "idle": "Idle",
    "charging": "Charging",
    "discharging": "Discharging",
    "importing": "Importing",
    "exporting": "Exporting",
    "balanced": "Balanced",
    "fromRoof": "from the roof",
    "inHome": "in the home",
    "periodToday": "Today",
    "period3d": "Last 3 days",
    "period7d": "Last 7 days",
    "periodMonth": "This month",
    "periodAll": "All time",
    "periodMonthShort": "Month",
    "periodAllShort": "All",
    "since": "since {date}",
    "energy": "Energy",
    "pvProduction": "PV production",
    "consumption": "Consumption",
    "gridImport": "Grid import",
    "gridExport": "Grid export",
    "batteryCharge": "Battery charge",
    "batteryDischarge": "Battery discharge",
    "autarky": "Self-sufficiency",
    "selfUse": "Self-consumption",
    "savings": "Savings",
    "co2": "CO₂ avoided",
    "specificYield": "Yield per kWp",
    "legendPv": "PV",
    "legendLoad": "Home",
    "legendBattery": "Battery",
    "legendGrid": "Grid",
    "legendSoc": "SOC",
    "legendForecast": "Forecast",
    "chartLoading": "Loading history…",
    "chartEmpty": "No history for this period yet",
    "chartError": "History is not available",
    "chartPowerHint": "Battery: up = discharging · Grid: up = import",
    "batteryForecast": "Battery forecast",
    "fullIn": "Full in {d}",
    "fullAt": "about {time}",
    "lastsFor": "Lasts {d}",
    "lastsUntil": "until about {time} (to {soc}%)",
    "holding": "Holding steady",
    "slowCharge": "Charging slowly",
    "slowDischarge": "Discharging slowly",
    "slowDetail": "more than 2 days at this rate",
    "storedOf": "{kwh} of {cap}",
    "inverterDetails": "Inverter details",
    "pvStrings": "PV strings",
    "stringN": "String {n}",
    "temperatures": "Temperatures",
    "batteryDetails": "Battery",
    "gridDetails": "Grid",
    "noDetails": "The inverter reports no matching measurements.",
    "close": "Close",
    "panelsTitle": "Panels",
    "panelsHint": "Production today",
    "panelAvg": "Average {kwh} per panel",
    "panelWeak": "Weakest: {name} at {pct}% of the median",
    "panelsEven": "All panels within 15% of the median",
    "stringModules": "String {n} · {count} modules",
    "panelsEstimateHint": "≈ {energy} per panel today",
    "panelEach": "≈ {power} per panel",
    "panelsEstimateNote": "Estimate: these panels have no optimizers and do not report their own data, so the values per panel are the string's power divided by its panels and today's energy split evenly over all panels.",
    "paperHeadline": "{power} to the home",
    "paperMix": "Right now: {parts}.",
    "paperOnly": "Right now everything comes from {source}.",
    "paperSun": "the sun",
    "paperBattery": "the battery",
    "paperGrid": "the grid",
    "sankeyFrom": "From",
    "sankeyTo": "To",
    "losses": "Losses",
    "otherSource": "Other",
    "paperLasts": "At this rate the battery lasts until {time}.",
    "paperFull": "The battery will be full around {time}.",
    "paperExport": "{power} goes out to the grid.",
    "paperDay": "The day so far",
    "lcarsTitle": "Power · {name}",
    "lcarsPvIn": "PV in",
    "lcarsBatIn": "Bat in",
    "lcarsBatOut": "Bat out",
    "lcarsGridIn": "Grid in",
    "lcarsGridOut": "Grid out",
    "lcarsHome": "Home",
    "lcarsPanels": "Panels",
    "stored": "Stored",
    "autonomy": "Autonomy until",
    "stateOfCharge": "Charge",
    "autarkyToday": "Self-sufficiency today",
    "statusNominal": "Status: nominal",
    "statusWarn": "Status: caution",
    "statusAlert": "Status: alert",
    "coreTitle": "Power core",
    "sector": "Sector",
    "supplying": "Supplying",
    "absorbing": "Absorbing",
    "sun": "Sun",
    "chipRoof": "Today from the roof",
    "chipLasts": "Lasts until",
    "chipFull": "Full at",
    "chipStored": "Stored",
    "chipHome": "Used today",
    "whereFrom": "Where today's power came from",
    "noData": "No energy sensors found",
    "noDataHelp": "Set up Home Assistant's Energy dashboard, install the DeyeCloud integration, or pick your sensors in the card's editor.",
    "editorTheme": "Theme",
    "expanseTitle": "Power distribution",
    "foundationTitle": "Prime Radiant",
    "foundationForecast": "Forecast",
    "foundationSteady": "The battery holds steady; the plan stays on course.",
    "galaxyTitle": "Power systems",
    "galaxyQuiet": "All is quiet in this sector of the galaxy.",
    "systemTitle": "Installation",
    "phaseSpread": "Phase spread {power}",
    "phaseGrid": "grid {power}",
    "inverterLoad": "Inverter load",
    "inverterOf": "{power} of {rated}",
    "batteryTemperature": "Battery temperature",
    "batteryVoltage": "Battery voltage",
    "batteryCurrent": "Battery current",
    "batteryCold": "The battery is cold: charging may be limited.",
    "batteryHot": "The battery is hot: charging may be limited.",
    "generatorRunning": "Generator running",
    "gateTitle": "Energy command",
    "gateSub": "Dialing computer · station",
    "gateDial": "Dialing sequence",
    "gateLocked": "{n} / {total} locked",
    "gateChevron": "Chevron {n}",
    "gateOfCapacity": "{pct}% of {size}",
    "gateInbound": "Wormhole active · battery inbound",
    "gateOutbound": "Wormhole active · battery outbound",
    "gateExport": "Off-world transfer · grid export",
    "gateImport": "Incoming wormhole · grid import",
    "gateIdle": "Gate idle · all chevrons standing by",
    "gateReserve": "Chevron 7 will not lock · battery at reserve",
    "gateReserveLabel": "Reserve",
    "insightsTitle": "Today at a glance",
    "peakSolar": "Solar peak",
    "peakLoad": "Consumption peak",
    "atTime": "at {time}",
    "socRange": "Battery today",
    "batteryCycles": "Battery cycles",
    "offGrid": "No grid import",
    "compareTitle": "Comparison",
    "colYesterday": "Yesterday",
    "colAvg7": "7-day avg",
    "colMonth": "This month",
    "themeNames": {
      "diorama": "Diorama",
      "aurora": "Aurora",
      "paper": "Paper",
      "lcars": "LCARS",
      "atlantis": "Atlantis",
      "expanse": "Expanse",
      "foundation": "Foundation",
      "galaxy": "Far galaxy",
      "gate": "Gate Command",
      "reactor": "Reactor"
    },
    "editorTitle": "Title",
    "editorLanguage": "Language",
    "languageAuto": "Home Assistant language",
    "editorStation": "DeyeCloud station",
    "auto": "Automatic",
    "editorBatteryCapacity": "Battery capacity (kWh)",
    "editorBatteryMinSoc": "Battery reserve (%)",
    "editorPvCapacity": "PV size (kWp)",
    "editorPvPanels": "Number of panels",
    "editorPanelsPerString": "Panels per string",
    "editorStringPanels": "PV{n} · now {volts}",
    "editorStringsHint": "Panels on each string. Without optimizers the card estimates each panel from its string's power; leave unused strings empty.",
    "editorInverterRating": "Inverter rated power (kW)",
    "editorPriceImport": "Import price per kWh",
    "editorPriceExport": "Export price per kWh",
    "editorCurrency": "Currency",
    "editorCo2": "Grid CO₂ (kg per kWh)",
    "editorShowEnergy": "Show energy",
    "editorShowChart": "Show chart",
    "editorShowForecast": "Show battery forecast",
    "editorShowSystem": "Installation (phases, inverter load, battery)",
    "editorShowPanels": "Show panels (optimizers)",
    "editorShowWeather": "Weather in the Diorama and Reactor themes",
    "editorWide": "Wide layout (on a wide dashboard)",
    "editorInsights": "Today at a glance and comparison",
    "editorSolar": "The installation has PV panels",
    "editorBattery": "The installation has a battery",
    "editorShowSelfSufficiency": "Show self-sufficiency",
    "editorShowSelfUse": "Show self-consumption",
    "editorShowSavings": "Show savings",
    "editorShowCo2": "Show CO₂ avoided",
    "editorShowYield": "Show yield per kWp",
    "editorAnimation": "Animations",
    "editorFonts": "Load theme fonts (Google Fonts)",
    "editorHint": "DeyeCloud sensors are found automatically. Other inverters: set the entities in YAML (see README).",
    "reactorTitle": "Reactor · power systems",
    "reactorScan": "Atmospheric scan",
    "reactorTelemetry": "Telemetry",
    "reactorOverdrive": "Overdrive",
    "reactorNominal": "Nominal output",
    "reactorReserve": "Reserve power",
    "reactorGrid": "Grid assist",
    "reactorStandby": "Standby",
    "reactorPvShare": "{pct}% solar power",
    "weatherNames": {
      "sunny": "Sunny",
      "clear-night": "Clear night",
      "partlycloudy": "Partly cloudy",
      "cloudy": "Cloudy",
      "fog": "Fog",
      "rainy": "Rain",
      "pouring": "Heavy rain",
      "snowy": "Snow",
      "snowy-rainy": "Sleet",
      "hail": "Hail",
      "lightning": "Thunderstorm",
      "lightning-rainy": "Thunderstorm, rain",
      "windy": "Windy",
      "windy-variant": "Windy, cloudy",
      "exceptional": "Exceptional"
    },
    "editorPanelsAverage": "Panel average and weakest panel per string",
    "editorGlass": "Glass background (the dashboard background shows through the card)",
    "vsTitle": "Virtual storage · hourly balance",
    "vsSurplus": "Surplus this hour",
    "vsDeficit": "Deficit this hour",
    "vsResetsIn": "resets in {m} min",
    "vsDay": "Today: {h} h with a surplus · {kwh} balanced",
    "autarkyHourly": "Self-suff. with hourly balance",
    "vsNone": "No surplus this hour",
    "otherDetails": "Other readings",
    "computedHint": "Calculated from the other sensors",
    "vsShort": "Virtual storage",
    "editorCollapsible": "Collapsible sections (tap a section's title)",
    "panelEachToday": "≈ {power} and {kwh} today per panel",
    "pvForecastTitle": "PV forecast",
    "pvLeft": "≈ {kwh} to go",
    "pvForecastNote": "forecast {kwh}",
    "pvProducedOf": "{done} of {total} produced so far",
    "pvRange": "range {low}–{high}",
    "customTitle": "My sensors",
    "chartFallback": "Hourly averages from the energy statistics. No power history for: {sensors} (excluded from the recorder?)",
    "chartNoHistory": "No history for: {sensors}. Excluded from the recorder?",
    "editorRenamed": "This card is now called Home Energy Hub. Its type changes from custom:solar-flow-card to custom:home-energy-hub with your next change here; the old type keeps working too.",
    "editorGroups": {
      "look": "Appearance",
      "sensors": "Sensors",
      "sections": "Sections",
      "install": "Installation",
      "summary": "Summary and prices",
      "vstore": "Virtual storage",
      "forecast": "PV forecast",
      "more": "More"
    },
    "editorSensorsHint": "DeyeCloud and the sensors of Home Assistant's Energy dashboard are found automatically: leave those fields empty. Otherwise pick your sensors; the configuration guide in the README explains each one.",
    "editorEnergyAuto": "Empty fields use the sensors from Home Assistant's Energy dashboard (Settings → Dashboards → Energy).",
    "editorEnergyCopy": "Write them into this card, to change them here",
    "editorEntityGroups": {
      "live": "Live power",
      "energy": "Energy",
      "system": "Installation readings",
      "strings": "PV strings"
    },
    "editorEntities": {
      "solar_power": "Solar power",
      "load_power": "Home consumption (optional)",
      "grid_power": "Grid power (+ import, − export)",
      "grid_import_power": "Grid import power",
      "grid_export_power": "Grid export power",
      "battery_power": "Battery power (+ discharging)",
      "battery_charge_power": "Battery charging power",
      "battery_discharge_power": "Battery discharging power",
      "battery_soc": "Battery level",
      "solar_energy": "Solar energy",
      "load_energy": "Home energy (optional)",
      "grid_import_energy": "Energy from the grid",
      "grid_export_energy": "Energy to the grid",
      "battery_charge_energy": "Energy charged",
      "battery_discharge_energy": "Energy discharged",
      "inverter_power": "Inverter output power",
      "inverter_rated_power": "Inverter rated power",
      "battery_temperature": "Battery temperature",
      "battery_voltage": "Battery voltage",
      "battery_current": "Battery current",
      "generator_power": "Generator power"
    },
    "editorPhaseLoad": "Home {n}",
    "editorPhaseGrid": "Grid {n}",
    "editorPhaseVoltage": "Voltage {n}",
    "editorStringPower": "PV{n} power",
    "editorStringVoltage": "PV{n} voltage",
    "editorStringCurrent": "PV{n} current",
    "editorEnergySensors": "Energy sensors",
    "editorEnergyDaily": "Reset every day",
    "editorEnergyTotal": "Lifetime counters (never reset)",
    "editorInvertGrid": "My grid sensor is + while exporting",
    "editorInvertBattery": "My battery sensor is + while charging",
    "editorSectionsHint": "Tick what the card shows; the arrows change the order.",
    "editorSectionNames": {
      "flow": "Main view (animation)",
      "today": "Today's tiles",
      "sources": "Where today's power came from",
      "inverter": "Inverter details",
      "forecast": "Battery forecast",
      "pv_forecast": "PV forecast",
      "virtual_storage": "Virtual storage",
      "system": "Installation",
      "energy": "Energy and chart",
      "insights": "Today at a glance",
      "comparison": "Comparison",
      "panels": "Panels",
      "prices": "Energy prices"
    },
    "editorFolded": "folded",
    "editorUp": "Move up",
    "editorDown": "Move down",
    "editorReset": "Restore the default sections",
    "editorVsEnable": "Show virtual storage (hourly net balancing)",
    "editorVsEntity": "Ready net balance sensor (optional)",
    "editorVsNegative": "A deficit",
    "editorVsShow": "shows in red",
    "editorVsZero": "shows as 0 kWh",
    "editorVsOwn": "Count the balanced energy as your own (self-sufficiency)",
    "editorVsHint": "Without a ready sensor the card calculates the balance from the grid energy sensors.",
    "editorPvfToday": "Forecast for today",
    "editorPvfRemaining": "Remaining today (optional)",
    "editorPvfDays": "Next days (tomorrow first)",
    "editorPvfHourly": "Hourly forecast in the 24H chart",
    "editorPvfRange": "10–90% range on the day bars (Solcast)",
    "editorDayN": "Day {n}",
    "editorDetails": "Inverter details: extra sensors",
    "editorWeather": "Weather",
    "editorPeriod": "Starting period",
    "editorFontUrl": "Own font stylesheet (URL)",
    "editorNow": "now: {value}",
    "editorAuto": "found automatically: {entity} · {value}",
    "editorNotFound": "This entity does not exist in Home Assistant.",
    "editorWrongUnit": "Unit {unit}: this field expects {expected}.",
    "editorUnavailable": "unavailable right now",
    "editorNoStats": "No state_class total or total_increasing: 3D, 7D, month and all will stay empty for it.",
    "editorLooksTotal": "{value} looks like a lifetime counter, not today's energy: choose \"Lifetime counters\" under Energy sensors.",
    "editorPairConflict": "Use either this one sensor or the import/export pair, not both.",
    "editorBatteryPairConflict": "Use either this one sensor or the charging/discharging pair, not both.",
    "editorLooksWatts": "{value} looks like W: this field is in kW (e.g. {suggest}).",
    "editorLooksWh": "{value} looks like Wh: this field is in kWh (e.g. {suggest}).",
    "editorLive": "Now with these settings: solar {solar} · grid {grid} · battery {battery}",
    "editorGridSignCheck": "Importing more than the panels produce is unusual: check the grid sign (\"My grid sensor is + while exporting\").",
    "editorFontsHint": "The fonts come from Google's servers, which see your IP address. A self-hosted stylesheet (More → own fonts) avoids that.",
    "editorHistoryBox": "History for the charts (advanced)",
    "editorHistoryHint": "Only when a live sensor is kept out of the recorder: its recorded copy, used for the 24H and 3D charts.",
    "editorHistoryLabel": "{label} – history",
    "editorBatteries": "Several batteries",
    "editorBatteriesHint": "Two or more batteries are shown as one: power summed, level weighted by capacity. Each one is listed in the Installation section.",
    "editorPanels": "Panel sensors (optimizers)",
    "editorPanelsHint": "One entry per panel with its energy today; without these the card uses DeyeCloud optimizers or the estimate from the strings.",
    "editorAdd": "Add",
    "editorRemove": "Remove",
    "editorConfirmRemove": "Remove this item and its settings?",
    "editorCustom": "Custom sections",
    "editorCustomHint": "Sections of your own with any sensors, e.g. each phase's power and voltage. Each one can be placed, folded or hidden under Sections like the others. A name, a max (for a bar) or a unit per sensor can be set in YAML.",
    "editorCustomTitle": "Title",
    "editorCustomSensor": "Sensor {n}",
    "editorCustomAdd": "Add a section",
    "editorConfirmNoSections": "Nothing ticked: the card will be empty. Continue?",
    "editorItemName": "Name",
    "editorBatSoc": "Level (%)",
    "editorBatPower": "Power (+ discharging)",
    "editorBatCapacity": "Capacity (kWh)",
    "editorBatVoltage": "Voltage (optional)",
    "editorBatTemp": "Temperature (optional)",
    "editorBatInvert": "This one is + while charging",
    "editorPanelEnergy": "Energy today",
    "editorPanelPower": "Power (optional)",
    "editorDetailsHint": "Any sensors shown as tiles in the Inverter details, e.g. temperature or status.",
    "editorSensor": "Sensor",
    "editorDetailName": "Name (optional)",
    "editorFoundN": "{n} found automatically",
    "editorRatedFound": "Found automatically: inverter rated power {power}. Leave the field empty to use it.",
    "detailVoltage": "Voltage {n}",
    "detailLoadVoltage": "Load voltage {n}",
    "detailFrequency": "Frequency",
    "detailTempAc": "Inverter, AC side",
    "detailTempDc": "Inverter, DC side",
    "detailTempBattery": "Battery",
    "detailBatPower": "Battery power",
    "editorPriceSensors": "Prices from sensors (optional)",
    "editorPriceSensorsHint": "For prices that change, e.g. the hourly RCE price or a dynamic tariff: the savings are then worked out hour by hour, each hour at its own price. A sensor here replaces the fixed price above.",
    "editorPriceImportSensor": "Import price sensor",
    "editorPriceExportSensor": "Export price sensor",
    "editorPriceUnit": "Unit {unit}: expected a price per kWh or MWh (e.g. PLN/kWh).",
    "editorPriceNoStats": "No state_class: Home Assistant keeps no hourly history of this price, so the current price is used for every hour.",
    "pricesTitle": "Energy prices",
    "priceNow": "now {price}",
    "pricesAhead": "Coming up – cheapest: {cheap} ({cheapPrice}) · dearest: {dear} ({dearPrice})",
    "tomorrow": "tomorrow",
    "exportValue": "Value of energy sold",
    "editorNoImportPrice": "Savings need an import price: until you set one, the card shows the value of the energy sold.",
    "editorSettlement": "Settlement with your utility",
    "editorSettlementFixed": "Fixed prices",
    "editorSettlementBilling": "Net-billing (energy sold at the RCE price)",
    "editorSettlementMetering": "Net-metering (each kWh sent back worth 0.8 / 0.7 kWh)",
    "editorSettlementHintFixed": "The prices below, or price sensors.",
    "editorSettlementHintBilling": "The energy sent to the grid is sold at the hourly RCE price, and its value goes to your deposit multiplied by 1.23: enter only the import price. The card finds an RCE price sensor itself, or pick one below.",
    "editorSettlementHintMetering": "Each kWh sent to the grid is worth {ratio} of a kWh bought: enter only the import price.",
    "editorMeteringRatio": "Credit per kWh sent back",
    "editorMeteringAuto": "automatic ({ratio}; 0.7 above 10 kWp)",
    "editorRcePrice": "RCE price sensor",
    "editorRceMissing": "No RCE price sensor found: pick one (e.g. from the PSE integration or your EMS), otherwise the energy sold has no price.",
    "editorImportPriceHint": "Import price: what each kWh costs, energy plus the distribution charges billed per kWh, without monthly fixed fees.",
    "editorRceFound": "RCE price sensor found: {entity} · {value}.",
    "editorUseBilling": "I'm on net-billing: value the energy sold at the RCE price",
    "editorBillingFactor": "Deposit factor (1.23)",
    "invToday": "{kwh} today",
    "editorInverters": "Several inverters",
    "editorInvertersHint": "Their solar power and energy are added up for the whole card (no helper sensors needed); each one is listed in the Installation section.",
    "editorInvSolarPower": "Solar power",
    "editorInvSolarEnergy": "Solar energy",
    "editorInvPower": "Output power (optional)",
    "editorInvRated": "Rated power (kW, optional)"
  },
  "de": {
    "languageName": "Deutsch",
    "locale": "de-DE",
    "currency": "€",
    "hourShort": "h",
    "minShort": "min",
    "dayShort": "d",
    "defaultTitle": "Hausenergie",
    "live": "Live",
    "delayed": "Verzögert",
    "offline": "Offline",
    "solar": "Solar",
    "battery": "Batterie",
    "grid": "Netz",
    "home": "Haus",
    "inverter": "Wechselrichter",
    "generating": "Erzeugt",
    "idle": "Inaktiv",
    "charging": "Lädt",
    "discharging": "Entlädt",
    "importing": "Bezug",
    "exporting": "Einspeisung",
    "balanced": "Ausgeglichen",
    "fromRoof": "vom Dach",
    "inHome": "im Haus",
    "periodToday": "Heute",
    "period3d": "Letzte 3 Tage",
    "period7d": "Letzte 7 Tage",
    "periodMonth": "Dieser Monat",
    "periodAll": "Gesamt",
    "periodMonthShort": "Monat",
    "periodAllShort": "Gesamt",
    "since": "seit {date}",
    "energy": "Energie",
    "pvProduction": "PV-Erzeugung",
    "consumption": "Verbrauch",
    "gridImport": "Netzbezug",
    "gridExport": "Netzeinspeisung",
    "batteryCharge": "Batterieladung",
    "batteryDischarge": "Batterieentladung",
    "autarky": "Autarkie",
    "selfUse": "Eigenverbrauch",
    "savings": "Ersparnis",
    "co2": "CO₂ vermieden",
    "specificYield": "Ertrag pro kWp",
    "legendPv": "PV",
    "legendLoad": "Haus",
    "legendBattery": "Batterie",
    "legendGrid": "Netz",
    "legendSoc": "SOC",
    "legendForecast": "Prognose",
    "chartLoading": "Verlauf wird geladen …",
    "chartEmpty": "Für diesen Zeitraum liegt noch kein Verlauf vor",
    "chartError": "Verlauf nicht verfügbar",
    "chartPowerHint": "Batterie: oben = Entladung · Netz: oben = Bezug",
    "batteryForecast": "Batterieprognose",
    "fullIn": "Voll in {d}",
    "fullAt": "ca. {time}",
    "lastsFor": "Reicht für {d}",
    "lastsUntil": "bis ca. {time} (bis {soc} %)",
    "holding": "Hält den Stand",
    "slowCharge": "Lädt langsam",
    "slowDischarge": "Entlädt langsam",
    "slowDetail": "mehr als 2 Tage bei dieser Rate",
    "storedOf": "{kwh} von {cap}",
    "inverterDetails": "Wechselrichter-Details",
    "pvStrings": "PV-Strings",
    "stringN": "String {n}",
    "temperatures": "Temperaturen",
    "batteryDetails": "Batterie",
    "gridDetails": "Netz",
    "noDetails": "Der Wechselrichter meldet keine passenden Messwerte.",
    "close": "Schließen",
    "panelsTitle": "Module",
    "panelsHint": "Erzeugung heute",
    "panelAvg": "Durchschnitt {kwh} pro Modul",
    "panelWeak": "Schwächstes: {name} mit {pct} % des Medians",
    "panelsEven": "Alle Module liegen innerhalb von 15 % des Medians",
    "stringModules": "String {n} · {count} Module",
    "panelsEstimateHint": "≈ {energy} pro Modul heute",
    "panelEach": "≈ {power} pro Modul",
    "panelsEstimateNote": "Schätzung: Diese Module haben keine Optimierer und melden keine eigenen Daten. Die Werte pro Modul ergeben sich aus der Leistung des Strings geteilt durch seine Module, die heutige Energie wird gleichmäßig auf alle Module verteilt.",
    "paperHeadline": "{power} ins Haus",
    "paperMix": "Gerade jetzt: {parts}.",
    "paperOnly": "Gerade jetzt kommt alles aus {source}.",
    "paperSun": "der Sonne",
    "paperBattery": "der Batterie",
    "paperGrid": "dem Netz",
    "sankeyFrom": "Von",
    "sankeyTo": "Nach",
    "losses": "Verluste",
    "otherSource": "Sonstige",
    "paperLasts": "Bei dieser Rate reicht die Batterie bis {time}.",
    "paperFull": "Die Batterie ist gegen {time} voll.",
    "paperExport": "{power} gehen ins Netz.",
    "paperDay": "Der bisherige Tag",
    "lcarsTitle": "Energie · {name}",
    "lcarsPvIn": "PV ein",
    "lcarsBatIn": "Bat. ein",
    "lcarsBatOut": "Bat. aus",
    "lcarsGridIn": "Netz ein",
    "lcarsGridOut": "Netz aus",
    "lcarsHome": "Haus",
    "lcarsPanels": "Module",
    "stored": "Gespeichert",
    "autonomy": "Autonomie bis",
    "stateOfCharge": "Ladung",
    "autarkyToday": "Autarkie heute",
    "statusNominal": "Status: nominal",
    "statusWarn": "Status: Vorsicht",
    "statusAlert": "Status: Alarm",
    "coreTitle": "Leistungskern",
    "sector": "Sektor",
    "supplying": "Liefert",
    "absorbing": "Nimmt auf",
    "sun": "Sonne",
    "chipRoof": "Heute vom Dach",
    "chipLasts": "Reicht bis",
    "chipFull": "Voll um",
    "chipStored": "Gespeichert",
    "chipHome": "Heute verbraucht",
    "whereFrom": "Woher der Strom heute kam",
    "noData": "Keine Energiesensoren gefunden",
    "noDataHelp": "Richte das Energie-Dashboard von Home Assistant ein, installiere die DeyeCloud-Integration oder wähle deine Sensoren im Editor der Karte.",
    "editorTheme": "Design",
    "expanseTitle": "Energieverteilung",
    "foundationTitle": "Prime Radiant",
    "foundationForecast": "Prognose",
    "foundationSteady": "Die Batterie hält den Stand; der Plan bleibt auf Kurs.",
    "galaxyTitle": "Energiesysteme",
    "galaxyQuiet": "In diesem Sektor der Galaxis ist alles ruhig.",
    "systemTitle": "Anlage",
    "phaseSpread": "Phasenspreizung {power}",
    "phaseGrid": "Netz {power}",
    "inverterLoad": "Wechselrichter-Last",
    "inverterOf": "{power} von {rated}",
    "batteryTemperature": "Batterietemperatur",
    "batteryVoltage": "Batteriespannung",
    "batteryCurrent": "Batteriestrom",
    "batteryCold": "Die Batterie ist kalt: Das Laden kann eingeschränkt sein.",
    "batteryHot": "Die Batterie ist heiß: Das Laden kann eingeschränkt sein.",
    "generatorRunning": "Generator läuft",
    "gateTitle": "Energiekommando",
    "gateSub": "Wählcomputer · Station",
    "gateDial": "Wählsequenz",
    "gateLocked": "{n} / {total} eingerastet",
    "gateChevron": "Chevron {n}",
    "gateOfCapacity": "{pct} % von {size}",
    "gateInbound": "Datenverbindung aktiv · Batterie eingehend",
    "gateOutbound": "Datenverbindung aktiv · Batterie ausgehend",
    "gateExport": "Transfer nach außen · Netzeinspeisung",
    "gateImport": "Eingehendes Datenverbindung · Netzbezug",
    "gateIdle": "Gate im Leerlauf · Alle Systeme startbereit (wartend auf Einspeisung)",
    "gateReserve": "Chevron 7 rastet nicht ein · Batterie auf Reserve",
    "gateReserveLabel": "Reserve",
    "insightsTitle": "Heute auf einen Blick",
    "peakSolar": "Solarspitze",
    "peakLoad": "Verbrauchsspitze",
    "atTime": "um {time}",
    "socRange": "Batterie heute",
    "batteryCycles": "Batteriezyklen",
    "offGrid": "Kein Netzbezug",
    "compareTitle": "Vergleich",
    "colYesterday": "Gestern",
    "colAvg7": "7-Tage-Ø",
    "colMonth": "Dieser Monat",
    "themeNames": {
      "diorama": "Diorama",
      "aurora": "Aurora",
      "paper": "Papier",
      "lcars": "LCARS",
      "atlantis": "Atlantis",
      "expanse": "Expanse",
      "foundation": "Foundation",
      "galaxy": "Ferne Galaxis",
      "gate": "Gate-Kommando",
      "reactor": "Reaktor"
    },
    "editorTitle": "Titel",
    "editorLanguage": "Sprache",
    "languageAuto": "Home-Assistant-Sprache",
    "editorStation": "DeyeCloud-Station",
    "auto": "Automatisch",
    "editorBatteryCapacity": "Batteriekapazität (kWh)",
    "editorBatteryMinSoc": "Batteriereserve (%)",
    "editorPvCapacity": "PV-Größe (kWp)",
    "editorPvPanels": "Anzahl der Module",
    "editorPanelsPerString": "Module pro String",
    "editorStringPanels": "PV{n} · jetzt {volts}",
    "editorStringsHint": "Module je String. Ohne Optimierer schätzt die Karte jedes Modul aus der Leistung seines Strings; ungenutzte Strings leer lassen.",
    "editorInverterRating": "Wechselrichter-Nennleistung (kW)",
    "editorPriceImport": "Bezugspreis pro kWh",
    "editorPriceExport": "Einspeisepreis pro kWh",
    "editorCurrency": "Währung",
    "editorCo2": "Netz-CO₂ (kg pro kWh)",
    "editorShowEnergy": "Energie anzeigen",
    "editorShowChart": "Diagramm anzeigen",
    "editorShowForecast": "Batterieprognose anzeigen",
    "editorShowSystem": "Anlage (Phasen, Wechselrichter-Last, Batterie)",
    "editorShowPanels": "Module anzeigen (Optimierer)",
    "editorShowWeather": "Wetter in den Designs Diorama und Reaktor",
    "editorWide": "Breites Layout (auf einem breiten Dashboard)",
    "editorInsights": "Heute auf einen Blick und Vergleich",
    "editorSolar": "Die Anlage hat PV-Module",
    "editorBattery": "Die Anlage hat eine Batterie",
    "editorShowSelfSufficiency": "Autarkie anzeigen",
    "autarkyHourly": "Autarkie mit Stundenbilanz",
    "computedHint": "Aus den anderen Sensoren berechnet",
    "editorAnimation": "Animationen",
    "editorCollapsible": "Einklappbare Abschnitte (Titel antippen)",
    "editorFonts": "Theme-Schriften laden (Google Fonts)",
    "editorGlass": "Glas-Hintergrund (der Dashboard-Hintergrund scheint durch)",
    "editorHint": "DeyeCloud-Sensoren werden automatisch gefunden. Andere Wechselrichter: Entitäten in YAML festlegen (siehe README).",
    "editorPanelsAverage": "Moduldurchschnitt und schwächstes Modul pro String",
    "editorShowCo2": "Vermiedenes CO₂ anzeigen",
    "editorShowSavings": "Ersparnis anzeigen",
    "editorShowSelfUse": "Eigenverbrauch anzeigen",
    "editorShowYield": "Ertrag pro kWp anzeigen",
    "otherDetails": "Weitere Messwerte",
    "panelEachToday": "≈ {power} und heute {kwh} pro Modul",
    "pvForecastNote": "Prognose {kwh}",
    "pvForecastTitle": "PV-Prognose",
    "pvLeft": "noch ≈ {kwh}",
    "pvProducedOf": "{done} von {total} bisher erzeugt",
    "pvRange": "Spanne {low}–{high}",
    "customTitle": "Meine Sensoren",
    "reactorGrid": "Netzunterstützung",
    "reactorNominal": "Nennleistung",
    "reactorOverdrive": "Overdrive",
    "reactorPvShare": "{pct} % Solarleistung",
    "reactorReserve": "Reserveenergie",
    "reactorScan": "Atmosphärenscan",
    "reactorStandby": "Standby",
    "reactorTelemetry": "Telemetrie",
    "reactorTitle": "Reaktor · Energiesysteme",
    "vsDay": "Heute: {h} h mit Überschuss · {kwh} verrechnet",
    "vsDeficit": "Defizit in dieser Stunde",
    "vsNone": "Kein Überschuss in dieser Stunde",
    "vsResetsIn": "wird in {m} min zurückgesetzt",
    "vsShort": "Virtueller Speicher",
    "vsSurplus": "Überschuss in dieser Stunde",
    "vsTitle": "Virtueller Speicher · Stundenbilanz",
    "weatherNames": {
      "sunny": "Sonnig",
      "clear-night": "Klare Nacht",
      "partlycloudy": "Teilweise bewölkt",
      "cloudy": "Bewölkt",
      "fog": "Nebel",
      "rainy": "Regen",
      "pouring": "Starkregen",
      "snowy": "Schnee",
      "snowy-rainy": "Schneeregen",
      "hail": "Hagel",
      "lightning": "Gewitter",
      "lightning-rainy": "Gewitter, Regen",
      "windy": "Windig",
      "windy-variant": "Windig, bewölkt",
      "exceptional": "Außergewöhnlich"
    },
    "chartFallback": "Stundenmittel aus der Energiestatistik. Kein Leistungsverlauf für: {sensors} (vom Recorder ausgeschlossen?)",
    "chartNoHistory": "Kein Verlauf für: {sensors}. Vom Recorder ausgeschlossen?",
    "editorRenamed": "Diese Karte heißt jetzt Home Energy Hub. Mit deiner nächsten Änderung hier wird ihr Typ von custom:solar-flow-card zu custom:home-energy-hub; der alte Typ funktioniert weiterhin.",
    "editorGroups": {
      "look": "Darstellung",
      "sensors": "Sensoren",
      "sections": "Abschnitte",
      "install": "Anlage",
      "summary": "Übersicht und Preise",
      "vstore": "Virtueller Speicher",
      "forecast": "PV-Prognose",
      "more": "Mehr"
    },
    "editorSensorsHint": "DeyeCloud und die Sensoren des Energie-Dashboards von Home Assistant werden automatisch gefunden: diese Felder leer lassen. Sonst wähle deine Sensoren; die Konfigurationsanleitung im README erklärt jeden.",
    "editorEnergyAuto": "Leere Felder nutzen die Sensoren des Energie-Dashboards von Home Assistant (Einstellungen → Dashboards → Energie).",
    "editorEnergyCopy": "In diese Karte schreiben, um sie hier zu ändern",
    "editorEntityGroups": {
      "live": "Aktuelle Leistung",
      "energy": "Energie",
      "system": "Anlagenwerte",
      "strings": "PV-Strings"
    },
    "editorEntities": {
      "solar_power": "PV-Leistung",
      "load_power": "Hausverbrauch (optional)",
      "grid_power": "Netzleistung (+ Bezug, − Einspeisung)",
      "grid_import_power": "Netzbezugsleistung",
      "grid_export_power": "Einspeiseleistung",
      "battery_power": "Batterieleistung (+ Entladen)",
      "battery_charge_power": "Ladeleistung Batterie",
      "battery_discharge_power": "Entladeleistung Batterie",
      "battery_soc": "Batteriestand",
      "solar_energy": "PV-Energie",
      "load_energy": "Hausenergie (optional)",
      "grid_import_energy": "Energie aus dem Netz",
      "grid_export_energy": "Energie ins Netz",
      "battery_charge_energy": "Geladene Energie",
      "battery_discharge_energy": "Entladene Energie",
      "inverter_power": "Ausgangsleistung Wechselrichter",
      "inverter_rated_power": "Nennleistung Wechselrichter",
      "battery_temperature": "Batterietemperatur",
      "battery_voltage": "Batteriespannung",
      "battery_current": "Batteriestrom",
      "generator_power": "Generatorleistung"
    },
    "editorPhaseLoad": "Haus {n}",
    "editorPhaseGrid": "Netz {n}",
    "editorPhaseVoltage": "Spannung {n}",
    "editorStringPower": "PV{n} Leistung",
    "editorStringVoltage": "PV{n} Spannung",
    "editorStringCurrent": "PV{n} Strom",
    "editorEnergySensors": "Energiesensoren",
    "editorEnergyDaily": "Täglich zurückgesetzt",
    "editorEnergyTotal": "Gesamtzähler (nie zurückgesetzt)",
    "editorInvertGrid": "Mein Netzsensor ist + bei Einspeisung",
    "editorInvertBattery": "Mein Batteriesensor ist + beim Laden",
    "editorSectionsHint": "Anhaken, was die Karte zeigt; die Pfeile ändern die Reihenfolge.",
    "editorSectionNames": {
      "flow": "Hauptansicht (Animation)",
      "today": "Kacheln von heute",
      "sources": "Woher der Strom heute kam",
      "inverter": "Wechselrichterdetails",
      "forecast": "Batterieprognose",
      "pv_forecast": "PV-Prognose",
      "virtual_storage": "Virtueller Speicher",
      "system": "Anlage",
      "energy": "Energie und Diagramm",
      "insights": "Heute auf einen Blick",
      "comparison": "Vergleich",
      "panels": "Module",
      "prices": "Energiepreise"
    },
    "editorFolded": "eingeklappt",
    "editorUp": "Nach oben",
    "editorDown": "Nach unten",
    "editorReset": "Standardabschnitte wiederherstellen",
    "editorVsEnable": "Virtuellen Speicher anzeigen (Stundenbilanz)",
    "editorVsEntity": "Fertiger Bilanzsensor (optional)",
    "editorVsNegative": "Ein Defizit",
    "editorVsShow": "rot anzeigen",
    "editorVsZero": "als 0 kWh anzeigen",
    "editorVsOwn": "Verrechnete Energie als eigene zählen (Autarkie)",
    "editorVsHint": "Ohne fertigen Sensor berechnet die Karte die Bilanz aus den Netz-Energiesensoren.",
    "editorPvfToday": "Prognose für heute",
    "editorPvfRemaining": "Rest von heute (optional)",
    "editorPvfDays": "Nächste Tage (ab morgen)",
    "editorPvfHourly": "Stundenprognose im 24H-Diagramm",
    "editorPvfRange": "Spanne 10–90 % auf den Tagesbalken (Solcast)",
    "editorDayN": "Tag {n}",
    "editorDetails": "Wechselrichterdetails: weitere Sensoren",
    "editorWeather": "Wetter",
    "editorPeriod": "Startzeitraum",
    "editorFontUrl": "Eigenes Schrift-Stylesheet (URL)",
    "editorNow": "jetzt: {value}",
    "editorAuto": "automatisch gefunden: {entity} · {value}",
    "editorNotFound": "Diese Entität gibt es in Home Assistant nicht.",
    "editorWrongUnit": "Einheit {unit}: dieses Feld erwartet {expected}.",
    "editorUnavailable": "gerade nicht verfügbar",
    "editorNoStats": "Keine state_class total oder total_increasing: 3D, 7D, Monat und Gesamt bleiben dafür leer.",
    "editorLooksTotal": "{value} sieht nach einem Gesamtzähler aus, nicht nach der Energie von heute: unter Energiesensoren \"Gesamtzähler\" wählen.",
    "editorPairConflict": "Entweder diesen einen Sensor oder das Paar Bezug/Einspeisung verwenden, nicht beides.",
    "editorBatteryPairConflict": "Entweder diesen einen Sensor oder das Paar Laden/Entladen verwenden, nicht beides.",
    "editorLooksWatts": "{value} sieht nach W aus: dieses Feld ist in kW (z. B. {suggest}).",
    "editorLooksWh": "{value} sieht nach Wh aus: dieses Feld ist in kWh (z. B. {suggest}).",
    "editorLive": "Jetzt mit diesen Einstellungen: PV {solar} · Netz {grid} · Batterie {battery}",
    "editorGridSignCheck": "Mehr Netzbezug als die Module erzeugen ist ungewöhnlich: das Vorzeichen des Netzes prüfen (\"Mein Netzsensor ist + bei Einspeisung\").",
    "editorFontsHint": "Die Schriften kommen von Googles Servern, die deine IP-Adresse sehen. Ein eigenes Stylesheet (Mehr → eigene Schriften) vermeidet das.",
    "editorHistoryBox": "Verlauf für die Diagramme (erweitert)",
    "editorHistoryHint": "Nur wenn ein Live-Sensor vom Recorder ausgeschlossen ist: seine aufgezeichnete Kopie für die 24H- und 3D-Diagramme.",
    "editorHistoryLabel": "{label} – Verlauf",
    "editorBatteries": "Mehrere Batterien",
    "editorBatteriesHint": "Zwei oder mehr Batterien werden als eine gezeigt: Leistung summiert, Ladestand nach Kapazität gewichtet. Jede steht einzeln im Abschnitt Anlage.",
    "editorPanels": "Modulsensoren (Optimierer)",
    "editorPanelsHint": "Ein Eintrag pro Modul mit seiner Energie von heute; ohne sie nutzt die Karte DeyeCloud-Optimierer oder die Schätzung aus den Strings.",
    "editorAdd": "Hinzufügen",
    "editorRemove": "Entfernen",
    "editorConfirmRemove": "Diesen Eintrag mit seinen Einstellungen entfernen?",
    "editorCustom": "Eigene Abschnitte",
    "editorCustomHint": "Abschnitte mit beliebigen Sensoren, z. B. Leistung und Spannung jeder Phase. Jeder lässt sich unter Abschnitte wie die anderen anordnen, einklappen oder ausblenden. Name, max (für einen Balken) oder Einheit je Sensor lassen sich in YAML setzen.",
    "editorCustomTitle": "Titel",
    "editorCustomSensor": "Sensor {n}",
    "editorCustomAdd": "Abschnitt hinzufügen",
    "editorConfirmNoSections": "Nichts angehakt: die Karte wird leer. Fortfahren?",
    "editorItemName": "Name",
    "editorBatSoc": "Ladestand (%)",
    "editorBatPower": "Leistung (+ Entladen)",
    "editorBatCapacity": "Kapazität (kWh)",
    "editorBatVoltage": "Spannung (optional)",
    "editorBatTemp": "Temperatur (optional)",
    "editorBatInvert": "Diese ist + beim Laden",
    "editorPanelEnergy": "Energie heute",
    "editorPanelPower": "Leistung (optional)",
    "editorDetailsHint": "Beliebige Sensoren als Kacheln in den Wechselrichterdetails, z. B. Temperatur oder Status.",
    "editorSensor": "Sensor",
    "editorDetailName": "Name (optional)",
    "editorFoundN": "{n} automatisch gefunden",
    "editorRatedFound": "Automatisch gefunden: Nennleistung des Wechselrichters {power}. Feld leer lassen, um sie zu verwenden.",
    "detailVoltage": "Spannung {n}",
    "detailLoadVoltage": "Spannung Verbraucher {n}",
    "detailFrequency": "Frequenz",
    "detailTempAc": "Wechselrichter, AC-Seite",
    "detailTempDc": "Wechselrichter, DC-Seite",
    "detailTempBattery": "Batterie",
    "detailBatPower": "Batterieleistung",
    "editorPriceSensors": "Preise aus Sensoren (optional)",
    "editorPriceSensorsHint": "Für wechselnde Preise, z. B. einen Stundenpreis oder einen dynamischen Tarif: die Ersparnis wird dann Stunde für Stunde berechnet, jede Stunde zu ihrem eigenen Preis. Ein Sensor hier ersetzt den festen Preis oben.",
    "editorPriceImportSensor": "Sensor Bezugspreis",
    "editorPriceExportSensor": "Sensor Einspeisepreis",
    "editorPriceUnit": "Einheit {unit}: erwartet wird ein Preis pro kWh oder MWh (z. B. EUR/kWh).",
    "editorPriceNoStats": "Keine state_class: Home Assistant speichert keinen Stundenverlauf dieses Preises, daher wird für jede Stunde der aktuelle Preis verwendet.",
    "pricesTitle": "Energiepreise",
    "priceNow": "jetzt {price}",
    "pricesAhead": "Nächste Stunden – am günstigsten: {cheap} ({cheapPrice}) · am teuersten: {dear} ({dearPrice})",
    "tomorrow": "morgen",
    "exportValue": "Wert der eingespeisten Energie",
    "editorNoImportPrice": "Die Ersparnis braucht einen Bezugspreis: bis er gesetzt ist, zeigt die Karte den Wert der eingespeisten Energie.",
    "editorSettlement": "Abrechnung mit dem Energieversorger",
    "editorSettlementFixed": "Feste Preise",
    "editorSettlementBilling": "Net-Billing (Verkauf zum RCE-Stundenpreis)",
    "editorSettlementMetering": "Net-Metering (jede eingespeiste kWh zählt 0,8 / 0,7 kWh)",
    "editorSettlementHintFixed": "Die Preise unten oder Preissensoren.",
    "editorSettlementHintBilling": "Eingespeiste Energie wird zum RCE-Stundenpreis verkauft, ihr Wert geht mal 1,23 ins Depot: nur den Bezugspreis eingeben. Die Karte findet einen RCE-Preissensor selbst, oder unten einen wählen.",
    "editorSettlementHintMetering": "Jede eingespeiste kWh ist {ratio} einer bezogenen kWh wert: nur den Bezugspreis eingeben.",
    "editorMeteringRatio": "Gutschrift je eingespeister kWh",
    "editorMeteringAuto": "automatisch ({ratio}; 0,7 über 10 kWp)",
    "editorRcePrice": "RCE-Preissensor",
    "editorRceMissing": "Kein RCE-Preissensor gefunden: einen wählen, sonst bleibt die eingespeiste Energie ohne Preis.",
    "editorImportPriceHint": "Bezugspreis: was jede kWh kostet, Energie plus die Netzentgelte je kWh, ohne monatliche Grundgebühren.",
    "editorRceFound": "RCE-Preissensor gefunden: {entity} · {value}.",
    "editorUseBilling": "Ich rechne per Net-Billing ab: Einspeisung zum RCE-Preis bewerten",
    "editorBillingFactor": "Depotfaktor (1,23)",
    "invToday": "heute {kwh}",
    "editorInverters": "Mehrere Wechselrichter",
    "editorInvertersHint": "Ihre PV-Leistung und -Energie werden für die ganze Karte addiert (keine Hilfssensoren nötig); jeder steht einzeln im Abschnitt Anlage.",
    "editorInvSolarPower": "PV-Leistung",
    "editorInvSolarEnergy": "PV-Energie",
    "editorInvPower": "Ausgangsleistung (optional)",
    "editorInvRated": "Nennleistung (kW, optional)"
  },
  "fr": {
    "languageName": "Français",
    "locale": "fr-FR",
    "currency": "€",
    "hourShort": "h",
    "minShort": "min",
    "dayShort": "j",
    "defaultTitle": "Énergie domestique",
    "live": "En direct",
    "delayed": "Différé",
    "offline": "Hors ligne",
    "solar": "Solaire",
    "battery": "Batterie",
    "grid": "Réseau",
    "home": "Maison",
    "inverter": "Onduleur",
    "generating": "Production",
    "idle": "Inactif",
    "charging": "En charge",
    "discharging": "En décharge",
    "importing": "Importation",
    "exporting": "Exportation",
    "balanced": "Équilibré",
    "fromRoof": "depuis le toit",
    "inHome": "dans la maison",
    "periodToday": "Aujourd'hui",
    "period3d": "3 derniers jours",
    "period7d": "7 derniers jours",
    "periodMonth": "Ce mois-ci",
    "periodAll": "Depuis toujours",
    "periodMonthShort": "Mois",
    "periodAllShort": "Total",
    "since": "depuis {date}",
    "energy": "Énergie",
    "pvProduction": "Production PV",
    "consumption": "Consommation",
    "gridImport": "Import réseau",
    "gridExport": "Export réseau",
    "batteryCharge": "Charge batterie",
    "batteryDischarge": "Décharge batterie",
    "autarky": "Autosuffisance",
    "selfUse": "Autoconsommation",
    "savings": "Économies",
    "co2": "CO₂ évité",
    "specificYield": "Rendement par kWc",
    "legendPv": "PV",
    "legendLoad": "Maison",
    "legendBattery": "Batterie",
    "legendGrid": "Réseau",
    "legendSoc": "SOC",
    "legendForecast": "Prévision",
    "chartLoading": "Chargement de l'historique…",
    "chartEmpty": "Aucun historique pour cette période",
    "chartError": "L'historique n'est pas disponible",
    "chartPowerHint": "Batterie : vers le haut = décharge · Réseau : vers le haut = import",
    "batteryForecast": "Prévision batterie",
    "fullIn": "Pleine dans {d}",
    "fullAt": "vers {time}",
    "lastsFor": "Tient {d}",
    "lastsUntil": "jusque vers {time} (à {soc}%)",
    "holding": "Stable",
    "slowCharge": "Charge lente",
    "slowDischarge": "Décharge lente",
    "slowDetail": "plus de 2 jours à ce rythme",
    "storedOf": "{kwh} sur {cap}",
    "inverterDetails": "Détails de l'onduleur",
    "pvStrings": "Chaînes PV",
    "stringN": "Chaîne {n}",
    "temperatures": "Températures",
    "batteryDetails": "Batterie",
    "gridDetails": "Réseau",
    "noDetails": "L'onduleur ne communique aucune mesure correspondante.",
    "close": "Fermer",
    "panelsTitle": "Panneaux",
    "panelsHint": "Production du jour",
    "panelAvg": "Moyenne de {kwh} par panneau",
    "panelWeak": "Le plus faible : {name} à {pct}% de la médiane",
    "panelsEven": "Tous les panneaux à moins de 15% de la médiane",
    "stringModules": "Chaîne {n} · {count} modules",
    "panelsEstimateHint": "≈ {energy} par panneau aujourd'hui",
    "panelEach": "≈ {power} par panneau",
    "panelsEstimateNote": "Estimation : ces panneaux n'ont pas d'optimiseurs et ne communiquent pas leurs propres données ; les valeurs par panneau correspondent à la puissance de la chaîne divisée par ses panneaux et à l'énergie du jour répartie équitablement sur tous les panneaux.",
    "paperHeadline": "{power} vers la maison",
    "paperMix": "En ce moment : {parts}.",
    "paperOnly": "En ce moment, tout provient de {source}.",
    "paperSun": "du soleil",
    "paperBattery": "de la batterie",
    "paperGrid": "du réseau",
    "sankeyFrom": "De",
    "sankeyTo": "Vers",
    "losses": "Pertes",
    "otherSource": "Autre",
    "paperLasts": "À ce rythme, la batterie tient jusqu'à {time}.",
    "paperFull": "La batterie sera pleine vers {time}.",
    "paperExport": "{power} part vers le réseau.",
    "paperDay": "La journée jusqu'ici",
    "lcarsTitle": "Puissance · {name}",
    "lcarsPvIn": "Entrée PV",
    "lcarsBatIn": "Entrée batterie",
    "lcarsBatOut": "Sortie batterie",
    "lcarsGridIn": "Entrée réseau",
    "lcarsGridOut": "Sortie réseau",
    "lcarsHome": "Maison",
    "lcarsPanels": "Panneaux",
    "stored": "Stocké",
    "autonomy": "Autonomie jusqu'à",
    "stateOfCharge": "Charge",
    "autarkyToday": "Autosuffisance du jour",
    "statusNominal": "État : nominal",
    "statusWarn": "État : attention",
    "statusAlert": "État : alerte",
    "coreTitle": "Cœur de puissance",
    "sector": "Secteur",
    "supplying": "Fourniture",
    "absorbing": "Absorption",
    "sun": "Soleil",
    "chipRoof": "Depuis le toit aujourd'hui",
    "chipLasts": "Tient jusqu'à",
    "chipFull": "Pleine à",
    "chipStored": "Stocké",
    "chipHome": "Utilisé aujourd'hui",
    "whereFrom": "D'où venait l'énergie du jour",
    "noData": "Aucun capteur d'énergie trouvé",
    "noDataHelp": "Configurez le tableau de bord Énergie de Home Assistant, installez l'intégration DeyeCloud ou choisissez vos capteurs dans l'éditeur de la carte.",
    "editorTheme": "Thème",
    "expanseTitle": "Répartition de la puissance",
    "foundationTitle": "Premier Radiant",
    "foundationForecast": "Prévision",
    "foundationSteady": "La batterie reste stable ; le plan suit son cours.",
    "galaxyTitle": "Systèmes énergétiques",
    "galaxyQuiet": "Tout est calme dans ce secteur de la galaxie.",
    "systemTitle": "Installation",
    "phaseSpread": "Écart entre phases {power}",
    "phaseGrid": "réseau {power}",
    "inverterLoad": "Charge de l'onduleur",
    "inverterOf": "{power} sur {rated}",
    "batteryTemperature": "Température de la batterie",
    "batteryVoltage": "Tension de la batterie",
    "batteryCurrent": "Courant de la batterie",
    "batteryCold": "La batterie est froide : la charge peut être limitée.",
    "batteryHot": "La batterie est chaude : la charge peut être limitée.",
    "generatorRunning": "Groupe électrogène en marche",
    "gateTitle": "Commandement énergie",
    "gateSub": "Ordinateur de connexion · station",
    "gateDial": "Séquence de connexion",
    "gateLocked": "{n} / {total} verrouillés",
    "gateChevron": "Chevron {n}",
    "gateOfCapacity": "{pct}% de {size}",
    "gateInbound": "Vortex actif · batterie en entrée",
    "gateOutbound": "Vortex actif · batterie en sortie",
    "gateExport": "Transfert extraterrestre · export réseau",
    "gateImport": "Vortex entrant · import réseau",
    "gateIdle": "Porte inactive · tous les chevrons en veille",
    "gateReserve": "Le chevron 7 ne se verrouillera pas · batterie en réserve",
    "gateReserveLabel": "Réserve",
    "insightsTitle": "Aperçu du jour",
    "peakSolar": "Pic solaire",
    "peakLoad": "Pic de consommation",
    "atTime": "à {time}",
    "socRange": "Batterie du jour",
    "batteryCycles": "Cycles de batterie",
    "offGrid": "Aucun import réseau",
    "compareTitle": "Comparaison",
    "colYesterday": "Hier",
    "colAvg7": "Moy. 7 jours",
    "colMonth": "Ce mois-ci",
    "themeNames": {
      "diorama": "Diorama",
      "aurora": "Aurora",
      "paper": "Papier",
      "lcars": "LCARS",
      "atlantis": "Atlantis",
      "expanse": "Expanse",
      "foundation": "Fondation",
      "galaxy": "Galaxie lointaine",
      "gate": "Commandement de la Porte",
      "reactor": "Réacteur"
    },
    "editorTitle": "Titre",
    "editorLanguage": "Langue",
    "languageAuto": "Langue de Home Assistant",
    "editorStation": "Station DeyeCloud",
    "auto": "Automatique",
    "editorBatteryCapacity": "Capacité de la batterie (kWh)",
    "editorBatteryMinSoc": "Réserve de batterie (%)",
    "editorPvCapacity": "Puissance PV (kWc)",
    "editorPvPanels": "Nombre de panneaux",
    "editorPanelsPerString": "Panneaux par chaîne",
    "editorStringPanels": "PV{n} · actuellement {volts}",
    "editorStringsHint": "Panneaux sur chaque chaîne. Sans optimiseurs, la carte estime chaque panneau à partir de la puissance de sa chaîne ; laissez les chaînes inutilisées vides.",
    "editorInverterRating": "Puissance nominale de l'onduleur (kW)",
    "editorPriceImport": "Prix d'achat par kWh",
    "editorPriceExport": "Prix de vente par kWh",
    "editorCurrency": "Devise",
    "editorCo2": "CO₂ réseau (kg par kWh)",
    "editorShowEnergy": "Afficher l'énergie",
    "editorShowChart": "Afficher le graphique",
    "editorShowForecast": "Afficher la prévision de batterie",
    "editorShowSystem": "Installation (phases, charge onduleur, batterie)",
    "editorShowPanels": "Afficher les panneaux (optimiseurs)",
    "editorShowWeather": "Météo dans les thèmes Diorama et Réacteur",
    "editorWide": "Mise en page large (pour un tableau de bord large)",
    "editorInsights": "Aperçu du jour et comparaison",
    "editorSolar": "L'installation dispose de panneaux PV",
    "editorBattery": "L'installation dispose d'une batterie",
    "editorShowSelfSufficiency": "Afficher l'autosuffisance",
    "editorShowSelfUse": "Afficher l'autoconsommation",
    "editorShowSavings": "Afficher les économies",
    "editorShowCo2": "Afficher le CO₂ évité",
    "editorShowYield": "Afficher le rendement par kWc",
    "editorAnimation": "Animations",
    "editorFonts": "Charger les polices du thème (Google Fonts)",
    "editorHint": "Les capteurs DeyeCloud sont détectés automatiquement. Autres onduleurs : définissez les entités en YAML (voir le README).",
    "reactorTitle": "Réacteur · systèmes énergétiques",
    "reactorScan": "Scan atmosphérique",
    "reactorTelemetry": "Télémétrie",
    "reactorOverdrive": "Surpuissance",
    "reactorNominal": "Sortie nominale",
    "reactorReserve": "Puissance de réserve",
    "reactorGrid": "Assistance réseau",
    "reactorStandby": "Veille",
    "reactorPvShare": "{pct}% d'énergie solaire",
    "weatherNames": {
      "sunny": "Ensoleillé",
      "clear-night": "Nuit claire",
      "partlycloudy": "Partiellement nuageux",
      "cloudy": "Nuageux",
      "fog": "Brouillard",
      "rainy": "Pluie",
      "pouring": "Forte pluie",
      "snowy": "Neige",
      "snowy-rainy": "Neige fondue",
      "hail": "Grêle",
      "lightning": "Orage",
      "lightning-rainy": "Orage, pluie",
      "windy": "Venteux",
      "windy-variant": "Venteux, nuageux",
      "exceptional": "Exceptionnel"
    },
    "editorPanelsAverage": "Moyenne des panneaux et panneau le plus faible par chaîne",
    "editorGlass": "Fond transparent (l'arrière-plan du tableau de bord apparaît à travers la carte)",
    "vsTitle": "Stockage virtuel · bilan horaire",
    "vsSurplus": "Surplus cette heure",
    "vsDeficit": "Déficit cette heure",
    "vsResetsIn": "réinitialisation dans {m} min",
    "vsDay": "Aujourd'hui : {h} h avec surplus · {kwh} équilibrés",
    "autarkyHourly": "Autosuff. avec bilan horaire",
    "vsNone": "Aucun surplus cette heure",
    "otherDetails": "Autres mesures",
    "computedHint": "Calculé à partir des autres capteurs",
    "vsShort": "Stockage virtuel",
    "editorCollapsible": "Sections repliables (toucher le titre d'une section)",
    "panelEachToday": "≈ {power} et {kwh} aujourd'hui par panneau",
    "pvForecastTitle": "Prévision PV",
    "pvLeft": "≈ {kwh} restants",
    "pvForecastNote": "prévision {kwh}",
    "pvProducedOf": "{done} sur {total} produits jusqu'ici",
    "pvRange": "plage {low}–{high}",
    "customTitle": "Mes capteurs",
    "chartFallback": "Moyennes horaires des statistiques d'énergie. Aucun historique de puissance pour : {sensors} (exclu de l'enregistreur ?)",
    "chartNoHistory": "Aucun historique pour : {sensors}. Exclu de l'enregistreur ?",
    "editorRenamed": "Cette carte s'appelle désormais Home Energy Hub. Son type passe de custom:solar-flow-card à custom:home-energy-hub lors de votre prochaine modification ici ; l'ancien type continue aussi de fonctionner.",
    "editorGroups": {
      "look": "Apparence",
      "sensors": "Capteurs",
      "sections": "Sections",
      "install": "Installation",
      "summary": "Résumé et prix",
      "vstore": "Stockage virtuel",
      "forecast": "Prévision PV",
      "more": "Plus"
    },
    "editorSensorsHint": "DeyeCloud et les capteurs du tableau de bord Énergie de Home Assistant sont détectés automatiquement : laissez ces champs vides. Sinon, choisissez vos capteurs ; le guide de configuration du README explique chacun d'eux.",
    "editorEnergyAuto": "Les champs vides utilisent les capteurs du tableau de bord Énergie de Home Assistant (Paramètres → Tableaux de bord → Énergie).",
    "editorEnergyCopy": "Les écrire dans cette carte, pour les modifier ici",
    "editorEntityGroups": {
      "live": "Puissance en direct",
      "energy": "Énergie",
      "system": "Mesures de l'installation",
      "strings": "Chaînes PV"
    },
    "editorEntities": {
      "solar_power": "Puissance solaire",
      "load_power": "Consommation de la maison (optionnel)",
      "grid_power": "Puissance réseau (+ import, − export)",
      "grid_import_power": "Puissance d'import réseau",
      "grid_export_power": "Puissance d'export réseau",
      "battery_power": "Puissance de la batterie (+ décharge)",
      "battery_charge_power": "Puissance de charge de la batterie",
      "battery_discharge_power": "Puissance de décharge de la batterie",
      "battery_soc": "Niveau de la batterie",
      "solar_energy": "Énergie solaire",
      "load_energy": "Énergie de la maison (optionnel)",
      "grid_import_energy": "Énergie du réseau",
      "grid_export_energy": "Énergie vers le réseau",
      "battery_charge_energy": "Énergie chargée",
      "battery_discharge_energy": "Énergie déchargée",
      "inverter_power": "Puissance de sortie de l'onduleur",
      "inverter_rated_power": "Puissance nominale de l'onduleur",
      "battery_temperature": "Température de la batterie",
      "battery_voltage": "Tension de la batterie",
      "battery_current": "Courant de la batterie",
      "generator_power": "Puissance du groupe électrogène"
    },
    "editorPhaseLoad": "Maison {n}",
    "editorPhaseGrid": "Réseau {n}",
    "editorPhaseVoltage": "Tension {n}",
    "editorStringPower": "Puissance PV{n}",
    "editorStringVoltage": "Tension PV{n}",
    "editorStringCurrent": "Courant PV{n}",
    "editorEnergySensors": "Capteurs d'énergie",
    "editorEnergyDaily": "Remis à zéro chaque jour",
    "editorEnergyTotal": "Compteurs cumulés (jamais remis à zéro)",
    "editorInvertGrid": "Mon capteur réseau est + à l'export",
    "editorInvertBattery": "Mon capteur batterie est + en charge",
    "editorSectionsHint": "Cochez ce que la carte affiche ; les flèches changent l'ordre.",
    "editorSectionNames": {
      "flow": "Vue principale (animation)",
      "today": "Tuiles du jour",
      "sources": "D'où venait l'énergie du jour",
      "inverter": "Détails de l'onduleur",
      "forecast": "Prévision batterie",
      "pv_forecast": "Prévision PV",
      "virtual_storage": "Stockage virtuel",
      "system": "Installation",
      "energy": "Énergie et graphique",
      "insights": "Aperçu du jour",
      "comparison": "Comparaison",
      "panels": "Panneaux",
      "prices": "Prix de l'énergie"
    },
    "editorFolded": "repliée",
    "editorUp": "Monter",
    "editorDown": "Descendre",
    "editorReset": "Restaurer les sections par défaut",
    "editorVsEnable": "Afficher le stockage virtuel (bilan net horaire)",
    "editorVsEntity": "Capteur de bilan net prêt à l'emploi (optionnel)",
    "editorVsNegative": "Un déficit",
    "editorVsShow": "s'affiche en rouge",
    "editorVsZero": "s'affiche à 0 kWh",
    "editorVsOwn": "Compter l'énergie équilibrée comme autoconsommée (autosuffisance)",
    "editorVsHint": "Sans capteur prêt à l'emploi, la carte calcule le bilan à partir des capteurs d'énergie du réseau.",
    "editorPvfToday": "Prévision du jour",
    "editorPvfRemaining": "Restant aujourd'hui (optionnel)",
    "editorPvfDays": "Jours suivants (demain en premier)",
    "editorPvfHourly": "Prévision horaire dans le graphique 24H",
    "editorPvfRange": "Plage 10–90% sur les barres journalières (Solcast)",
    "editorDayN": "Jour {n}",
    "editorDetails": "Détails de l'onduleur : capteurs supplémentaires",
    "editorWeather": "Météo",
    "editorPeriod": "Période de départ",
    "editorFontUrl": "Feuille de style de polices personnalisée (URL)",
    "editorNow": "maintenant : {value}",
    "editorAuto": "détecté automatiquement : {entity} · {value}",
    "editorNotFound": "Cette entité n'existe pas dans Home Assistant.",
    "editorWrongUnit": "Unité {unit} : ce champ attend {expected}.",
    "editorUnavailable": "indisponible pour le moment",
    "editorNoStats": "Pas de state_class total ou total_increasing : 3D, 7D, mois et total resteront vides pour ce capteur.",
    "editorLooksTotal": "{value} ressemble à un compteur cumulé, pas à l'énergie du jour : choisissez « Compteurs cumulés » sous Capteurs d'énergie.",
    "editorPairConflict": "Utilisez soit ce capteur unique, soit la paire import/export, pas les deux.",
    "editorBatteryPairConflict": "Utilisez soit ce capteur unique, soit la paire charge/décharge, pas les deux.",
    "editorLooksWatts": "{value} ressemble à des W : ce champ est en kW (par ex. {suggest}).",
    "editorLooksWh": "{value} ressemble à des Wh : ce champ est en kWh (par ex. {suggest}).",
    "editorLive": "Maintenant avec ces réglages : solaire {solar} · réseau {grid} · batterie {battery}",
    "editorGridSignCheck": "Importer plus que ce que produisent les panneaux est inhabituel : vérifiez le signe du réseau (« Mon capteur réseau est + à l'export »).",
    "editorFontsHint": "Les polices viennent des serveurs de Google, qui voient votre adresse IP. Une feuille de style auto-hébergée (Plus → polices personnalisées) évite cela.",
    "editorHistoryBox": "Historique pour les graphiques (avancé)",
    "editorHistoryHint": "Uniquement quand un capteur en direct est exclu de l'enregistreur : sa copie enregistrée, utilisée pour les graphiques 24H et 3J.",
    "editorHistoryLabel": "{label} – historique",
    "editorBatteries": "Plusieurs batteries",
    "editorBatteriesHint": "Deux batteries ou plus sont affichées comme une seule : puissance additionnée, niveau pondéré par la capacité. Chacune est listée dans la section Installation.",
    "editorPanels": "Capteurs de panneaux (optimiseurs)",
    "editorPanelsHint": "Une entrée par panneau avec son énergie du jour ; sans cela, la carte utilise les optimiseurs DeyeCloud ou l'estimation à partir des chaînes.",
    "editorAdd": "Ajouter",
    "editorRemove": "Supprimer",
    "editorConfirmRemove": "Supprimer cet élément et ses réglages ?",
    "editorCustom": "Sections personnalisées",
    "editorCustomHint": "Vos propres sections avec les capteurs de votre choix, par ex. la puissance et la tension de chaque phase. Chacune peut être placée, repliée ou masquée dans Sections comme les autres. Un nom, un max (pour une barre) ou une unité par capteur peuvent être définis en YAML.",
    "editorCustomTitle": "Titre",
    "editorCustomSensor": "Capteur {n}",
    "editorCustomAdd": "Ajouter une section",
    "editorConfirmNoSections": "Aucune case n'est cochée : la carte sera vide. Continuer ?",
    "editorItemName": "Nom",
    "editorBatSoc": "Niveau (%)",
    "editorBatPower": "Puissance (+ décharge)",
    "editorBatCapacity": "Capacité (kWh)",
    "editorBatVoltage": "Tension (optionnel)",
    "editorBatTemp": "Température (optionnel)",
    "editorBatInvert": "Celle-ci est + en charge",
    "editorPanelEnergy": "Énergie du jour",
    "editorPanelPower": "Puissance (optionnel)",
    "editorDetailsHint": "Tout capteur affiché en tuile dans Détails de l'onduleur, par ex. température ou état.",
    "editorSensor": "Capteur",
    "editorDetailName": "Nom (optionnel)",
    "editorFoundN": "{n} trouvé(s) automatiquement",
    "editorRatedFound": "Détecté automatiquement : puissance nominale de l'onduleur {power}. Laissez le champ vide pour l'utiliser.",
    "detailVoltage": "Tension {n}",
    "detailLoadVoltage": "Tension de charge {n}",
    "detailFrequency": "Fréquence",
    "detailTempAc": "Onduleur, côté AC",
    "detailTempDc": "Onduleur, côté DC",
    "detailTempBattery": "Batterie",
    "detailBatPower": "Puissance de la batterie",
    "editorPriceSensors": "Prix depuis des capteurs (optionnel)",
    "editorPriceSensorsHint": "Pour des prix variables, par ex. le prix RCE horaire ou un tarif dynamique : les économies sont alors calculées heure par heure, chacune à son propre prix. Un capteur ici remplace le prix fixe ci-dessus.",
    "editorPriceImportSensor": "Capteur de prix d'achat",
    "editorPriceExportSensor": "Capteur de prix de vente",
    "editorPriceUnit": "Unité {unit} : un prix par kWh ou MWh est attendu (par ex. EUR/kWh).",
    "editorPriceNoStats": "Pas de state_class : Home Assistant ne conserve pas d'historique horaire de ce prix, le prix actuel est donc utilisé pour chaque heure.",
    "pricesTitle": "Prix de l'énergie",
    "priceNow": "maintenant {price}",
    "pricesAhead": "À venir – le moins cher : {cheap} ({cheapPrice}) · le plus cher : {dear} ({dearPrice})",
    "tomorrow": "demain",
    "exportValue": "Valeur de l'énergie vendue",
    "editorNoImportPrice": "Les économies nécessitent un prix d'achat : en attendant que vous en définissiez un, la carte affiche la valeur de l'énergie vendue.",
    "editorSettlement": "Règlement avec votre fournisseur",
    "editorSettlementFixed": "Prix fixes",
    "editorSettlementBilling": "Vente au réseau (énergie vendue au prix RCE)",
    "editorSettlementMetering": "Compensation nette (chaque kWh renvoyé vaut 0,8 / 0,7 kWh)",
    "editorSettlementHintFixed": "Les prix ci-dessous, ou des capteurs de prix.",
    "editorSettlementHintBilling": "L'énergie envoyée au réseau est vendue au prix RCE horaire, et sa valeur est créditée sur votre dépôt multipliée par 1,23 : indiquez uniquement le prix d'achat. La carte trouve elle-même un capteur de prix RCE, ou vous en choisissez un ci-dessous.",
    "editorSettlementHintMetering": "Chaque kWh envoyé au réseau vaut {ratio} d'un kWh acheté : indiquez uniquement le prix d'achat.",
    "editorMeteringRatio": "Crédit par kWh renvoyé",
    "editorMeteringAuto": "automatique ({ratio} ; 0,7 au-delà de 10 kWc)",
    "editorRcePrice": "Capteur de prix RCE",
    "editorRceMissing": "Aucun capteur de prix RCE trouvé : choisissez-en un (par ex. de l'intégration PSE ou votre EMS), sinon l'énergie vendue n'a pas de prix.",
    "editorImportPriceHint": "Prix d'achat : ce que coûte chaque kWh, énergie plus charges de distribution facturées par kWh, hors abonnements fixes mensuels.",
    "editorRceFound": "Capteur de prix RCE trouvé : {entity} · {value}.",
    "editorUseBilling": "Je suis en vente au réseau : valoriser l'énergie vendue au prix RCE",
    "editorBillingFactor": "Facteur de dépôt (1,23)",
    "invToday": "{kwh} aujourd'hui",
    "editorInverters": "Plusieurs onduleurs",
    "editorInvertersHint": "Leur puissance et énergie solaires sont additionnées pour toute la carte (pas de capteur auxiliaire nécessaire) ; chacun est listé dans la section Installation.",
    "editorInvSolarPower": "Puissance solaire",
    "editorInvSolarEnergy": "Énergie solaire",
    "editorInvPower": "Puissance de sortie (optionnel)",
    "editorInvRated": "Puissance nominale (kW, optionnel)"
  },
  "nl": {
    "languageName": "Nederlands",
    "locale": "nl-NL",
    "currency": "€",
    "hourShort": "u",
    "minShort": "min",
    "dayShort": "d",
    "defaultTitle": "Thuisenergie",
    "live": "Live",
    "delayed": "Vertraagd",
    "offline": "Offline",
    "solar": "Zon",
    "battery": "Batterij",
    "grid": "Net",
    "home": "Woning",
    "inverter": "Omvormer",
    "generating": "Producerend",
    "idle": "In rust",
    "charging": "Laden",
    "discharging": "Ontladen",
    "importing": "Importeren",
    "exporting": "Exporteren",
    "balanced": "In balans",
    "fromRoof": "van het dak",
    "inHome": "in de woning",
    "periodToday": "Vandaag",
    "period3d": "Afgelopen 3 dagen",
    "period7d": "Afgelopen 7 dagen",
    "periodMonth": "Deze maand",
    "periodAll": "Alles",
    "periodMonthShort": "Maand",
    "periodAllShort": "Alles",
    "since": "sinds {date}",
    "energy": "Energie",
    "pvProduction": "PV-productie",
    "consumption": "Verbruik",
    "gridImport": "Net Import",
    "gridExport": "Net Export",
    "batteryCharge": "Batterij laden",
    "batteryDischarge": "Batterij ontladen",
    "autarky": "Zelfvoorzieningsgraad",
    "selfUse": "Eigen verbruik",
    "savings": "Besparing",
    "co2": "CO₂ bespaard",
    "specificYield": "Opbrengst per kWp",
    "legendPv": "PV",
    "legendLoad": "Woning",
    "legendBattery": "Batterij",
    "legendGrid": "Net",
    "legendSoc": "SOC",
    "legendForecast": "Verwachting",
    "chartLoading": "Geschiedenis laden…",
    "chartEmpty": "Nog geen geschiedenis voor deze periode",
    "chartError": "Geschiedenis is niet beschikbaar",
    "chartPowerHint": "Batterij: omhoog = ontladen · Net: omhoog = import",
    "batteryForecast": "Batterijvoorspelling",
    "fullIn": "Vol over {d}",
    "fullAt": "ongeveer {time}",
    "lastsFor": "Gaat {d} mee",
    "lastsUntil": "tot ongeveer {time} (tot {soc}%)",
    "holding": "Blijft stabiel",
    "slowCharge": "Laadt langzaam op",
    "slowDischarge": "Ontlaadt langzaam",
    "slowDetail": "meer dan 2 dagen in dit tempo",
    "storedOf": "{kwh} van {cap}",
    "inverterDetails": "Omvormer details",
    "pvStrings": "PV-strings",
    "stringN": "String {n}",
    "temperatures": "Temperaturen",
    "batteryDetails": "Batterij",
    "gridDetails": "Net",
    "noDetails": "De omvormer rapporteert geen overeenkomende metingen.",
    "close": "Sluiten",
    "panelsTitle": "Panelen",
    "panelsHint": "Productie vandaag",
    "panelAvg": "Gemiddeld {kwh} per paneel",
    "panelWeak": "Zwakste: {name} op {pct}% van de mediaan",
    "panelsEven": "Alle panelen binnen 15% van de mediaan",
    "stringModules": "String {n} · {count} modules",
    "panelsEstimateHint": "≈ {energy} per paneel vandaag",
    "panelEach": "≈ {power} per paneel",
    "panelsEstimateNote": "Schatting: deze panelen hebben geen optimizers en melden geen eigen gegevens, dus de waarden per paneel zijn het vermogen van de string gedeeld door de panelen en de energie van vandaag gelijk verdeeld over alle panelen.",
    "paperHeadline": "{power} naar de woning",
    "paperMix": "Momenteel: {parts}.",
    "paperOnly": "Momenteel komt alles van {source}.",
    "paperSun": "de zon",
    "paperBattery": "de batterij",
    "paperGrid": "het net",
    "sankeyFrom": "Van",
    "sankeyTo": "Naar",
    "losses": "Verliezen",
    "otherSource": "Overig",
    "paperLasts": "In dit tempo gaat de batterij mee tot {time}.",
    "paperFull": "De batterij is rond {time} vol.",
    "paperExport": "{power} gaat naar het net.",
    "paperDay": "De dag tot nu toe",
    "lcarsTitle": "Vermogen · {name}",
    "lcarsPvIn": "PV in",
    "lcarsBatIn": "Bat in",
    "lcarsBatOut": "Bat uit",
    "lcarsGridIn": "Net in",
    "lcarsGridOut": "Net uit",
    "lcarsHome": "Woning",
    "lcarsPanels": "Panelen",
    "stored": "Opgeslagen",
    "autonomy": "Autonomie tot",
    "stateOfCharge": "Lading",
    "autarkyToday": "Zelfvoorziening vandaag",
    "statusNominal": "Status: nominaal",
    "statusWarn": "Status: let op",
    "statusAlert": "Status: waarschuwing",
    "coreTitle": "Vermogenskern",
    "sector": "Sector",
    "supplying": "Levert",
    "absorbing": "Absorbeert",
    "sun": "Zon",
    "chipRoof": "Vandaag van het dak",
    "chipLasts": "Gaat mee tot",
    "chipFull": "Vol om",
    "chipStored": "Opgeslagen",
    "chipHome": "Vandaag gebruikt",
    "whereFrom": "Waar de energie van vandaag vandaan kwam",
    "noData": "Geen energiesensoren gevonden",
    "noDataHelp": "Stel het Energie-dashboard van Home Assistant in, installeer de DeyeCloud-integratie of kies je sensoren in de editor van de kaart.",
    "editorTheme": "Thema",
    "expanseTitle": "Stroomverdeling",
    "foundationTitle": "Prime Radiant",
    "foundationForecast": "Voorspelling",
    "foundationSteady": "De batterij blijft stabiel; het plan blijft op koers.",
    "galaxyTitle": "Stroomsystemen",
    "galaxyQuiet": "Alles is rustig in deze sector van het sterrenstelsel.",
    "systemTitle": "Installatie",
    "phaseSpread": "Faseverschil {power}",
    "phaseGrid": "net {power}",
    "inverterLoad": "Omvormerbelasting",
    "inverterOf": "{power} van {rated}",
    "batteryTemperature": "Batterijtemperatuur",
    "batteryVoltage": "Batterijspanning",
    "batteryCurrent": "Batterijstroom",
    "batteryCold": "De batterij is koud: opladen kan beperkt zijn.",
    "batteryHot": "De batterij is heet: opladen kan beperkt zijn.",
    "generatorRunning": "Generator draait",
    "gateTitle": "Energiecommando",
    "gateSub": "Kiescomputer · station",
    "gateDial": "Kiesreeks",
    "gateLocked": "{n} / {total} vergrendeld",
    "gateChevron": "Chevron {n}",
    "gateOfCapacity": "{pct}% van {size}",
    "gateInbound": "Wormgat actief · batterij laadt",
    "gateOutbound": "Wormgat actief · batterij levert",
    "gateExport": "Transfer buiten de wereld · teruglevering",
    "gateImport": "Inkomend wormgat · afname van het net",
    "gateIdle": "Poort in rust · chevrons stand-by",
    "gateReserve": "Chevron 7 vergrendelt niet · batterij op reserve",
    "gateReserveLabel": "Reserve",
    "insightsTitle": "Vandaag in het kort",
    "peakSolar": "Piek zon",
    "peakLoad": "Piek verbruik",
    "atTime": "om {time}",
    "socRange": "Batterij vandaag",
    "batteryCycles": "Batterijcycli",
    "offGrid": "Zonder netafname",
    "compareTitle": "Vergelijking",
    "colYesterday": "Gisteren",
    "colAvg7": "Gem. 7 dagen",
    "colMonth": "Deze maand",
    "themeNames": {
      "diorama": "Diorama",
      "aurora": "Aurora",
      "paper": "Papier",
      "lcars": "LCARS",
      "atlantis": "Atlantis",
      "expanse": "Expanse",
      "foundation": "Foundation",
      "galaxy": "Ver sterrenstelsel",
      "gate": "Poortcommando",
      "reactor": "Reactor"
    },
    "editorTitle": "Titel",
    "editorLanguage": "Taal",
    "languageAuto": "Home Assistant-taal",
    "editorStation": "DeyeCloud-station",
    "auto": "Automatisch",
    "editorBatteryCapacity": "Batterijcapaciteit (kWh)",
    "editorBatteryMinSoc": "Batterijreserve (%)",
    "editorPvCapacity": "PV-grootte (kWp)",
    "editorPvPanels": "Aantal panelen",
    "editorPanelsPerString": "Panelen per string",
    "editorStringPanels": "PV{n} · nu {volts}",
    "editorStringsHint": "Panelen per string. Zonder optimizers schat de kaart elk paneel uit het vermogen van zijn string; laat ongebruikte strings leeg.",
    "editorInverterRating": "Nominaal vermogen omvormer (kW)",
    "editorPriceImport": "Inkoopprijs per kWh",
    "editorPriceExport": "Verkoopprijs per kWh",
    "editorCurrency": "Valuta",
    "editorCo2": "Net-CO₂ (kg per kWh)",
    "editorShowEnergy": "Toon energie",
    "editorShowChart": "Toon grafiek",
    "editorShowForecast": "Toon batterijvoorspelling",
    "editorShowSystem": "Installatie (fasen, omvormerbelasting, batterij)",
    "editorShowPanels": "Toon panelen (optimizers)",
    "editorShowWeather": "Weer in de thema's Diorama en Reactor",
    "editorWide": "Brede indeling (op een breed dashboard)",
    "editorInsights": "Vandaag in het kort en vergelijking",
    "editorSolar": "De installatie heeft zonnepanelen",
    "editorBattery": "De installatie heeft een batterij",
    "editorShowSelfSufficiency": "Toon zelfvoorziening",
    "editorShowSelfUse": "Toon eigen verbruik",
    "editorShowSavings": "Toon besparingen",
    "editorShowCo2": "Toon bespaarde CO₂",
    "editorShowYield": "Toon opbrengst per kWp",
    "editorAnimation": "Animaties",
    "editorFonts": "Laad themalettertypen (Google Fonts)",
    "editorHint": "DeyeCloud-sensoren worden automatisch gevonden. Andere omvormers: stel de entiteiten in in YAML (zie README).",
    "reactorTitle": "Reactor · energiesystemen",
    "reactorScan": "Atmosfeerscan",
    "reactorTelemetry": "Telemetrie",
    "reactorOverdrive": "Overdrive",
    "reactorNominal": "Nominaal vermogen",
    "reactorReserve": "Reservestroom",
    "reactorGrid": "Netondersteuning",
    "reactorStandby": "Stand-by",
    "reactorPvShare": "{pct}% zonnevermogen",
    "weatherNames": {
      "sunny": "Zonnig",
      "clear-night": "Heldere nacht",
      "partlycloudy": "Half bewolkt",
      "cloudy": "Bewolkt",
      "fog": "Mist",
      "rainy": "Regen",
      "pouring": "Stortregen",
      "snowy": "Sneeuw",
      "snowy-rainy": "Natte sneeuw",
      "hail": "Hagel",
      "lightning": "Onweer",
      "lightning-rainy": "Onweer met regen",
      "windy": "Winderig",
      "windy-variant": "Winderig, bewolkt",
      "exceptional": "Uitzonderlijk"
    },
    "editorPanelsAverage": "Gemiddelde en zwakste paneel per string",
    "editorGlass": "Glazen achtergrond (de dashboardachtergrond schijnt door de kaart)",
    "vsTitle": "Virtuele opslag · uurbalans",
    "vsSurplus": "Overschot dit uur",
    "vsDeficit": "Tekort dit uur",
    "vsResetsIn": "reset over {m} min",
    "vsDay": "Vandaag: {h} u met overschot · {kwh} verrekend",
    "autarkyHourly": "Zelfvoorz. met uurbalans",
    "vsNone": "Geen overschot dit uur",
    "otherDetails": "Overige metingen",
    "computedHint": "Berekend uit de andere sensoren",
    "vsShort": "Virtuele opslag",
    "editorCollapsible": "Inklapbare secties (tik op de titel)",
    "panelEachToday": "≈ {power} en {kwh} vandaag per paneel",
    "pvForecastTitle": "PV-prognose",
    "pvLeft": "nog ≈ {kwh}",
    "pvForecastNote": "prognose {kwh}",
    "pvProducedOf": "{done} van {total} opgewekt",
    "pvRange": "bereik {low}–{high}",
    "customTitle": "Mijn sensoren",
    "chartFallback": "Uurgemiddelden uit de energiestatistieken. Geen vermogenshistorie voor: {sensors} (uitgesloten van de recorder?)",
    "chartNoHistory": "Geen historie voor: {sensors}. Uitgesloten van de recorder?",
    "editorRenamed": "Deze kaart heet nu Home Energy Hub. Bij je volgende wijziging hier verandert het type van custom:solar-flow-card naar custom:home-energy-hub; het oude type blijft ook werken.",
    "editorGroups": {
      "look": "Weergave",
      "sensors": "Sensoren",
      "sections": "Secties",
      "install": "Installatie",
      "summary": "Overzicht en prijzen",
      "vstore": "Virtuele opslag",
      "forecast": "PV-prognose",
      "more": "Meer"
    },
    "editorSensorsHint": "DeyeCloud en de sensoren van het Energie-dashboard van Home Assistant worden automatisch gevonden: laat die velden leeg. Kies anders je sensoren; de configuratiegids in de README legt ze uit.",
    "editorEnergyAuto": "Lege velden gebruiken de sensoren van het Energie-dashboard van Home Assistant (Instellingen → Dashboards → Energie).",
    "editorEnergyCopy": "Zet ze in deze kaart, om ze hier te wijzigen",
    "editorEntityGroups": {
      "live": "Actueel vermogen",
      "energy": "Energie",
      "system": "Installatiemetingen",
      "strings": "PV-strings"
    },
    "editorEntities": {
      "solar_power": "Zonnevermogen",
      "load_power": "Verbruik huis (optioneel)",
      "grid_power": "Netvermogen (+ afname, − teruglevering)",
      "grid_import_power": "Vermogen netafname",
      "grid_export_power": "Vermogen teruglevering",
      "battery_power": "Batterijvermogen (+ ontladen)",
      "battery_charge_power": "Laadvermogen batterij",
      "battery_discharge_power": "Ontlaadvermogen batterij",
      "battery_soc": "Batterijniveau",
      "solar_energy": "Zonne-energie",
      "load_energy": "Energie huis (optioneel)",
      "grid_import_energy": "Energie van het net",
      "grid_export_energy": "Energie naar het net",
      "battery_charge_energy": "Geladen energie",
      "battery_discharge_energy": "Ontladen energie",
      "inverter_power": "Uitgangsvermogen omvormer",
      "inverter_rated_power": "Nominaal vermogen omvormer",
      "battery_temperature": "Batterijtemperatuur",
      "battery_voltage": "Batterijspanning",
      "battery_current": "Batterijstroom",
      "generator_power": "Generatorvermogen"
    },
    "editorPhaseLoad": "Huis {n}",
    "editorPhaseGrid": "Net {n}",
    "editorPhaseVoltage": "Spanning {n}",
    "editorStringPower": "PV{n} vermogen",
    "editorStringVoltage": "PV{n} spanning",
    "editorStringCurrent": "PV{n} stroom",
    "editorEnergySensors": "Energiesensoren",
    "editorEnergyDaily": "Elke dag op nul",
    "editorEnergyTotal": "Totaaltellers (nooit op nul)",
    "editorInvertGrid": "Mijn netsensor is + bij teruglevering",
    "editorInvertBattery": "Mijn batterijsensor is + bij laden",
    "editorSectionsHint": "Vink aan wat de kaart toont; de pijlen veranderen de volgorde.",
    "editorSectionNames": {
      "flow": "Hoofdweergave (animatie)",
      "today": "Tegels van vandaag",
      "sources": "Waar de stroom vandaag vandaan kwam",
      "inverter": "Omvormerdetails",
      "forecast": "Batterijprognose",
      "pv_forecast": "PV-prognose",
      "virtual_storage": "Virtuele opslag",
      "system": "Installatie",
      "energy": "Energie en grafiek",
      "insights": "Vandaag in het kort",
      "comparison": "Vergelijking",
      "panels": "Panelen",
      "prices": "Energieprijzen"
    },
    "editorFolded": "ingeklapt",
    "editorUp": "Omhoog",
    "editorDown": "Omlaag",
    "editorReset": "Standaardsecties herstellen",
    "editorVsEnable": "Virtuele opslag tonen (uurbalans)",
    "editorVsEntity": "Kant-en-klare balanssensor (optioneel)",
    "editorVsNegative": "Een tekort",
    "editorVsShow": "in rood tonen",
    "editorVsZero": "als 0 kWh tonen",
    "editorVsOwn": "Verrekende energie als eigen energie tellen (zelfvoorziening)",
    "editorVsHint": "Zonder kant-en-klare sensor berekent de kaart de balans uit de energiesensoren van het net.",
    "editorPvfToday": "Prognose voor vandaag",
    "editorPvfRemaining": "Rest van vandaag (optioneel)",
    "editorPvfDays": "Volgende dagen (vanaf morgen)",
    "editorPvfHourly": "Uurverwachting in de 24H-grafiek",
    "editorPvfRange": "Bereik 10–90% op de dagbalken (Solcast)",
    "editorDayN": "Dag {n}",
    "editorDetails": "Omvormerdetails: extra sensoren",
    "editorWeather": "Weer",
    "editorPeriod": "Startperiode",
    "editorFontUrl": "Eigen lettertype-stylesheet (URL)",
    "editorNow": "nu: {value}",
    "editorAuto": "automatisch gevonden: {entity} · {value}",
    "editorNotFound": "Deze entiteit bestaat niet in Home Assistant.",
    "editorWrongUnit": "Eenheid {unit}: dit veld verwacht {expected}.",
    "editorUnavailable": "nu niet beschikbaar",
    "editorNoStats": "Geen state_class total of total_increasing: 3D, 7D, maand en alles blijven hiervoor leeg.",
    "editorLooksTotal": "{value} lijkt een totaalteller, niet de energie van vandaag: kies \"Totaaltellers\" bij Energiesensoren.",
    "editorPairConflict": "Gebruik deze ene sensor of het paar afname/teruglevering, niet allebei.",
    "editorBatteryPairConflict": "Gebruik deze ene sensor of het paar laden/ontladen, niet allebei.",
    "editorLooksWatts": "{value} lijkt W: dit veld is in kW (bijv. {suggest}).",
    "editorLooksWh": "{value} lijkt Wh: dit veld is in kWh (bijv. {suggest}).",
    "editorLive": "Nu met deze instellingen: zon {solar} · net {grid} · batterij {battery}",
    "editorGridSignCheck": "Meer afname dan de panelen opwekken is ongebruikelijk: controleer het teken van het net (\"Mijn netsensor is + bij teruglevering\").",
    "editorFontsHint": "De lettertypen komen van de servers van Google, die je IP-adres zien. Een eigen stylesheet (Meer → eigen lettertypen) voorkomt dat.",
    "editorHistoryBox": "Historie voor de grafieken (geavanceerd)",
    "editorHistoryHint": "Alleen als een live-sensor buiten de recorder blijft: zijn opgeslagen kopie voor de 24H- en 3D-grafieken.",
    "editorHistoryLabel": "{label} – historie",
    "editorBatteries": "Meerdere batterijen",
    "editorBatteriesHint": "Twee of meer batterijen worden als één getoond: vermogen opgeteld, niveau gewogen naar capaciteit. Elke batterij staat apart bij Installatie.",
    "editorPanels": "Paneelsensoren (optimizers)",
    "editorPanelsHint": "Eén regel per paneel met de energie van vandaag; zonder deze gebruikt de kaart DeyeCloud-optimizers of de schatting uit de strings.",
    "editorAdd": "Toevoegen",
    "editorRemove": "Verwijderen",
    "editorConfirmRemove": "Dit item met zijn instellingen verwijderen?",
    "editorCustom": "Eigen secties",
    "editorCustomHint": "Secties met sensoren naar keuze, bijv. vermogen en spanning per fase. Elke sectie kan onder Secties net als de andere worden geplaatst, ingeklapt of verborgen. Een naam, een max (voor een balk) of een eenheid per sensor kan in YAML.",
    "editorCustomTitle": "Titel",
    "editorCustomSensor": "Sensor {n}",
    "editorCustomAdd": "Sectie toevoegen",
    "editorConfirmNoSections": "Niets aangevinkt: de kaart wordt leeg. Doorgaan?",
    "editorItemName": "Naam",
    "editorBatSoc": "Niveau (%)",
    "editorBatPower": "Vermogen (+ ontladen)",
    "editorBatCapacity": "Capaciteit (kWh)",
    "editorBatVoltage": "Spanning (optioneel)",
    "editorBatTemp": "Temperatuur (optioneel)",
    "editorBatInvert": "Deze is + bij laden",
    "editorPanelEnergy": "Energie vandaag",
    "editorPanelPower": "Vermogen (optioneel)",
    "editorDetailsHint": "Willekeurige sensoren als tegels in de omvormerdetails, bijv. temperatuur of status.",
    "editorSensor": "Sensor",
    "editorDetailName": "Naam (optioneel)",
    "editorFoundN": "{n} automatisch gevonden",
    "editorRatedFound": "Automatisch gevonden: nominaal vermogen van de omvormer {power}. Laat het veld leeg om dat te gebruiken.",
    "detailVoltage": "Spanning {n}",
    "detailLoadVoltage": "Spanning verbruikers {n}",
    "detailFrequency": "Frequentie",
    "detailTempAc": "Omvormer, AC-zijde",
    "detailTempDc": "Omvormer, DC-zijde",
    "detailTempBattery": "Batterij",
    "detailBatPower": "Batterijvermogen",
    "editorPriceSensors": "Prijzen uit sensoren (optioneel)",
    "editorPriceSensorsHint": "Voor prijzen die veranderen, bijv. een uurprijs of een dynamisch tarief: de besparing wordt dan per uur berekend, elk uur tegen zijn eigen prijs. Een sensor hier vervangt de vaste prijs hierboven.",
    "editorPriceImportSensor": "Sensor afnameprijs",
    "editorPriceExportSensor": "Sensor terugleverprijs",
    "editorPriceUnit": "Eenheid {unit}: verwacht een prijs per kWh of MWh (bijv. EUR/kWh).",
    "editorPriceNoStats": "Geen state_class: Home Assistant bewaart geen uurhistorie van deze prijs, dus voor elk uur wordt de huidige prijs gebruikt.",
    "pricesTitle": "Energieprijzen",
    "priceNow": "nu {price}",
    "pricesAhead": "Komende uren – goedkoopst: {cheap} ({cheapPrice}) · duurst: {dear} ({dearPrice})",
    "tomorrow": "morgen",
    "exportValue": "Waarde teruggeleverde energie",
    "editorNoImportPrice": "Besparing vraagt een afnameprijs: zolang die ontbreekt, toont de kaart de waarde van de teruggeleverde energie.",
    "editorSettlement": "Verrekening met je energieleverancier",
    "editorSettlementFixed": "Vaste prijzen",
    "editorSettlementBilling": "Net-billing (teruglevering tegen de uurprijs)",
    "editorSettlementMetering": "Salderen (elke teruggeleverde kWh telt voor 0,8 / 0,7 kWh)",
    "editorSettlementHintFixed": "De prijzen hieronder, of prijssensoren.",
    "editorSettlementHintBilling": "Teruggeleverde energie wordt verkocht tegen de uurprijs (RCE) en de waarde gaat maal 1,23 naar je deposito: vul alleen de afnameprijs in. De kaart zoekt zelf een RCE-prijssensor, of kies er hieronder een.",
    "editorSettlementHintMetering": "Elke teruggeleverde kWh is {ratio} van een afgenomen kWh waard: vul alleen de afnameprijs in.",
    "editorMeteringRatio": "Verrekening per teruggeleverde kWh",
    "editorMeteringAuto": "automatisch ({ratio}; 0,7 boven 10 kWp)",
    "editorRcePrice": "RCE-prijssensor",
    "editorRceMissing": "Geen RCE-prijssensor gevonden: kies er een, anders heeft de teruggeleverde energie geen prijs.",
    "editorImportPriceHint": "Afnameprijs: wat elke kWh kost, energie plus de netkosten per kWh, zonder vaste maandkosten.",
    "editorRceFound": "RCE-prijssensor gevonden: {entity} · {value}.",
    "editorUseBilling": "Ik heb net-billing: teruglevering waarderen tegen de RCE-prijs",
    "editorBillingFactor": "Depositofactor (1,23)",
    "invToday": "vandaag {kwh}",
    "editorInverters": "Meerdere omvormers",
    "editorInvertersHint": "Hun zonnevermogen en -energie worden voor de hele kaart opgeteld (geen hulpsensoren nodig); elke omvormer staat apart bij Installatie.",
    "editorInvSolarPower": "Zonnevermogen",
    "editorInvSolarEnergy": "Zonne-energie",
    "editorInvPower": "Uitgangsvermogen (optioneel)",
    "editorInvRated": "Nominaal vermogen (kW, optioneel)"
  },
  "pl": {
    "languageName": "Polski",
    "locale": "pl-PL",
    "currency": "zł",
    "hourShort": "h",
    "minShort": "min",
    "dayShort": "dni",
    "defaultTitle": "Energia w domu",
    "live": "Na żywo",
    "delayed": "Opóźnione",
    "offline": "Brak danych",
    "solar": "Panele PV",
    "battery": "Magazyn",
    "grid": "Sieć",
    "home": "Dom",
    "inverter": "Falownik",
    "generating": "Produkcja",
    "idle": "Bezczynny",
    "charging": "Ładowanie",
    "discharging": "Rozładowanie",
    "importing": "Pobór",
    "exporting": "Oddawanie",
    "balanced": "Zbalansowana",
    "fromRoof": "z dachu",
    "inHome": "w domu",
    "periodToday": "Dziś",
    "period3d": "Ostatnie 3 dni",
    "period7d": "Ostatnie 7 dni",
    "periodMonth": "Ten miesiąc",
    "periodAll": "Cały okres",
    "periodMonthShort": "Mies.",
    "periodAllShort": "Całość",
    "since": "od {date}",
    "energy": "Energia",
    "pvProduction": "Produkcja PV",
    "consumption": "Zużycie",
    "gridImport": "Pobór z sieci",
    "gridExport": "Oddanie do sieci",
    "batteryCharge": "Ładowanie magazynu",
    "batteryDischarge": "Rozładowanie magazynu",
    "autarky": "Samowystarczalność",
    "selfUse": "Autokonsumpcja",
    "savings": "Oszczędność",
    "co2": "Uniknięte CO₂",
    "specificYield": "Uzysk na kWp",
    "legendPv": "PV",
    "legendLoad": "Dom",
    "legendBattery": "Magazyn",
    "legendGrid": "Sieć",
    "legendSoc": "SOC",
    "legendForecast": "Prognoza",
    "chartLoading": "Wczytywanie historii…",
    "chartEmpty": "Brak historii dla tego okresu",
    "chartError": "Historia jest niedostępna",
    "chartPowerHint": "Magazyn: w górę = rozładowanie · Sieć: w górę = pobór",
    "batteryForecast": "Prognoza magazynu",
    "fullIn": "Pełny za {d}",
    "fullAt": "ok. {time}",
    "lastsFor": "Wystarczy na {d}",
    "lastsUntil": "do ok. {time} (do {soc}%)",
    "holding": "Bez zmian",
    "slowCharge": "Ładuje się powoli",
    "slowDischarge": "Rozładowuje się powoli",
    "slowDetail": "przy tym tempie ponad 2 doby",
    "storedOf": "{kwh} z {cap}",
    "inverterDetails": "Szczegóły falownika",
    "pvStrings": "Stringi PV",
    "stringN": "String {n}",
    "temperatures": "Temperatury",
    "batteryDetails": "Magazyn",
    "gridDetails": "Sieć",
    "noDetails": "Falownik nie raportuje pasujących pomiarów.",
    "close": "Zamknij",
    "panelsTitle": "Panele",
    "panelsHint": "Produkcja dziś",
    "panelAvg": "Średnio {kwh} na panel",
    "panelWeak": "Najsłabszy: {name}, {pct}% mediany",
    "panelsEven": "Wszystkie panele w granicach 15% mediany",
    "stringModules": "String {n} · {count} modułów",
    "panelsEstimateHint": "≈ {energy} na panel dziś",
    "panelEach": "≈ {power} na panel",
    "panelsEstimateNote": "Szacunek: panele nie mają optymalizatorów i nie przesyłają własnych danych, więc wartości na panel to moc stringu podzielona przez liczbę jego paneli i dzisiejsza energia podzielona po równo na wszystkie panele.",
    "paperHeadline": "{power} do domu",
    "paperMix": "Teraz prąd daje {parts}.",
    "paperOnly": "Teraz cały prąd daje {source}.",
    "paperSun": "słońce",
    "paperBattery": "magazyn",
    "paperGrid": "sieć",
    "sankeyFrom": "Skąd",
    "sankeyTo": "Dokąd",
    "losses": "Straty",
    "otherSource": "Inne",
    "paperLasts": "Przy tym tempie magazyn wystarczy do {time}.",
    "paperFull": "Magazyn naładuje się ok. {time}.",
    "paperExport": "Do sieci płynie {power}.",
    "paperDay": "Przebieg dnia",
    "lcarsTitle": "Zasilanie · {name}",
    "lcarsPvIn": "PV wej",
    "lcarsBatIn": "Mag wej",
    "lcarsBatOut": "Mag wyj",
    "lcarsGridIn": "Sieć wej",
    "lcarsGridOut": "Sieć wyj",
    "lcarsHome": "Dom pob",
    "lcarsPanels": "Panele",
    "stored": "Zapas",
    "autonomy": "Autonomia do",
    "stateOfCharge": "Stan magazynu",
    "autarkyToday": "Samowystarcz. dziś",
    "statusNominal": "Status: nominalny",
    "statusWarn": "Status: uwaga",
    "statusAlert": "Status: alarm",
    "coreTitle": "Rdzeń zasilania",
    "sector": "Sektor",
    "supplying": "Oddaje",
    "absorbing": "Pobiera",
    "sun": "Słońce",
    "chipRoof": "Dziś z dachu",
    "chipLasts": "Wystarczy do",
    "chipFull": "Pełny o",
    "chipStored": "W magazynie",
    "chipHome": "Zużycie dziś",
    "whereFrom": "Skąd dziś prąd w domu",
    "noData": "Nie znaleziono czujników energii",
    "noDataHelp": "Skonfiguruj panel Energia w Home Assistant, zainstaluj integrację DeyeCloud albo wskaż czujniki w edytorze karty.",
    "editorTheme": "Motyw",
    "expanseTitle": "Rozdział mocy",
    "foundationTitle": "Pierwszy Radiant",
    "foundationForecast": "Prognoza",
    "foundationSteady": "Magazyn trwa w równowadze; plan przebiega zgodnie z przewidywaniami.",
    "galaxyTitle": "Systemy zasilania",
    "galaxyQuiet": "W tym sektorze galaktyki panuje spokój.",
    "systemTitle": "Instalacja",
    "phaseSpread": "Różnica faz {power}",
    "phaseGrid": "sieć {power}",
    "inverterLoad": "Obciążenie falownika",
    "inverterOf": "{power} z {rated}",
    "batteryTemperature": "Temperatura baterii",
    "batteryVoltage": "Napięcie baterii",
    "batteryCurrent": "Prąd baterii",
    "batteryCold": "Bateria jest zimna: ładowanie może być ograniczone.",
    "batteryHot": "Bateria jest gorąca: ładowanie może być ograniczone.",
    "generatorRunning": "Agregat pracuje",
    "gateTitle": "Centrum energii",
    "gateSub": "Komputer wybierania · stacja",
    "gateDial": "Sekwencja wybierania",
    "gateLocked": "{n} / {total} zablokowane",
    "gateChevron": "Szewron {n}",
    "gateOfCapacity": "{pct}% z {size}",
    "gateInbound": "Tunel aktywny · magazyn przyjmuje",
    "gateOutbound": "Tunel aktywny · magazyn oddaje",
    "gateExport": "Transfer poza świat · oddanie do sieci",
    "gateImport": "Tunel przychodzący · pobór z sieci",
    "gateIdle": "Wrota w spoczynku · szewrony w gotowości",
    "gateReserve": "Szewron 7 nie zablokuje się · magazyn na rezerwie",
    "gateReserveLabel": "Rezerwa",
    "insightsTitle": "Dziś w skrócie",
    "peakSolar": "Szczyt PV",
    "peakLoad": "Szczyt zużycia",
    "atTime": "o {time}",
    "socRange": "Magazyn dziś",
    "batteryCycles": "Cykle magazynu",
    "offGrid": "Bez poboru z sieci",
    "compareTitle": "Porównanie",
    "colYesterday": "Wczoraj",
    "colAvg7": "Śr. 7 dni",
    "colMonth": "Ten miesiąc",
    "themeNames": {
      "diorama": "Diorama",
      "aurora": "Aurora",
      "paper": "Papier",
      "lcars": "LCARS",
      "atlantis": "Atlantis",
      "expanse": "Expanse",
      "foundation": "Fundacja",
      "galaxy": "Odległa galaktyka",
      "gate": "Centrum Wrót",
      "reactor": "Reaktor"
    },
    "editorTitle": "Tytuł",
    "editorLanguage": "Język",
    "languageAuto": "Język Home Assistant",
    "editorStation": "Instalacja DeyeCloud",
    "auto": "Automatycznie",
    "editorBatteryCapacity": "Pojemność magazynu (kWh)",
    "editorBatteryMinSoc": "Rezerwa magazynu (%)",
    "editorPvCapacity": "Moc instalacji PV (kWp)",
    "editorPvPanels": "Liczba paneli",
    "editorPanelsPerString": "Paneli na string",
    "editorStringPanels": "PV{n} · teraz {volts}",
    "editorStringsHint": "Liczba paneli na każdym stringu. Bez optymalizatorów karta szacuje każdy panel z mocy jego stringu; nieużywane stringi zostaw puste.",
    "editorInverterRating": "Moc znamionowa falownika (kW)",
    "editorPriceImport": "Cena zakupu za kWh",
    "editorPriceExport": "Cena sprzedaży za kWh",
    "editorCurrency": "Waluta",
    "editorCo2": "CO₂ sieci (kg na kWh)",
    "editorShowEnergy": "Pokaż energię",
    "editorShowChart": "Pokaż wykres",
    "editorShowForecast": "Pokaż prognozę magazynu",
    "editorShowSystem": "Instalacja (fazy, obciążenie falownika, bateria)",
    "editorShowPanels": "Pokaż panele (optymalizatory)",
    "editorShowWeather": "Pogoda w motywach Diorama i Reaktor",
    "editorWide": "Szeroki układ (na szerokim dashboardzie)",
    "editorInsights": "Dziś w skrócie i porównanie",
    "editorSolar": "Instalacja ma panele PV",
    "editorBattery": "Instalacja ma magazyn energii",
    "editorShowSelfSufficiency": "Pokaż samowystarczalność",
    "editorShowSelfUse": "Pokaż autokonsumpcję",
    "editorShowSavings": "Pokaż oszczędność",
    "editorShowCo2": "Pokaż uniknięte CO₂",
    "editorShowYield": "Pokaż uzysk na kWp",
    "editorAnimation": "Animacje",
    "editorFonts": "Wczytuj czcionki motywu (Google Fonts)",
    "editorHint": "Czujniki DeyeCloud są wykrywane automatycznie. Inne falowniki: wskaż encje w YAML (patrz README).",
    "reactorTitle": "Reaktor · system zasilania",
    "reactorScan": "Skan atmosfery",
    "reactorTelemetry": "Telemetria",
    "reactorOverdrive": "Overdrive",
    "reactorNominal": "Moc nominalna",
    "reactorReserve": "Tryb rezerwowy",
    "reactorGrid": "Wsparcie z sieci",
    "reactorStandby": "Czuwanie",
    "reactorPvShare": "{pct}% mocy PV",
    "weatherNames": {
      "sunny": "Słonecznie",
      "clear-night": "Bezchmurna noc",
      "partlycloudy": "Częściowe zachmurzenie",
      "cloudy": "Pochmurno",
      "fog": "Mgła",
      "rainy": "Deszcz",
      "pouring": "Ulewa",
      "snowy": "Śnieg",
      "snowy-rainy": "Deszcz ze śniegiem",
      "hail": "Grad",
      "lightning": "Burza",
      "lightning-rainy": "Burza z deszczem",
      "windy": "Wietrznie",
      "windy-variant": "Wietrznie, pochmurno",
      "exceptional": "Wyjątkowe warunki"
    },
    "editorPanelsAverage": "Średnia i najsłabszy panel osobno dla każdego stringu",
    "editorGlass": "Szklane tło (tło dashboardu prześwituje przez kartę)",
    "vsTitle": "Wirtualny magazyn · bilans godzinowy",
    "vsSurplus": "Nadwyżka w tej godzinie",
    "vsDeficit": "Niedobór w tej godzinie",
    "vsResetsIn": "zeruje się za {m} min",
    "vsDay": "Dziś: {h} h z nadwyżką · zbilansowano {kwh}",
    "autarkyHourly": "Samowystarcz. z bilansem godz.",
    "vsNone": "Brak nadwyżki w tej godzinie",
    "otherDetails": "Inne odczyty",
    "computedHint": "Wyliczone z pozostałych czujników",
    "vsShort": "Wirtualny magazyn",
    "editorCollapsible": "Zwijane sekcje (dotknij tytułu sekcji)",
    "panelEachToday": "≈ {power} i {kwh} dziś na panel",
    "pvForecastTitle": "Prognoza PV",
    "pvLeft": "jeszcze ≈ {kwh}",
    "pvForecastNote": "prognoza {kwh}",
    "pvProducedOf": "wyprodukowano {done} z {total}",
    "pvRange": "zakres {low}–{high}",
    "customTitle": "Moje czujniki",
    "chartFallback": "Średnie godzinowe ze statystyk energii. Brak historii mocy dla: {sensors} (wyłączone z recordera?)",
    "chartNoHistory": "Brak historii dla: {sensors}. Czy nie są wyłączone z recordera?",
    "editorRenamed": "Ta karta nazywa się teraz Home Energy Hub. Przy następnej zmianie tutaj jej typ zmieni się z custom:solar-flow-card na custom:home-energy-hub; stary typ też dalej działa.",
    "editorGroups": {
      "look": "Wygląd",
      "sensors": "Czujniki",
      "sections": "Sekcje",
      "install": "Instalacja",
      "summary": "Podsumowanie i ceny",
      "vstore": "Wirtualny magazyn",
      "forecast": "Prognoza PV",
      "more": "Więcej"
    },
    "editorSensorsHint": "DeyeCloud i czujniki z panelu Energia Home Assistant są wykrywane automatycznie: zostaw te pola puste. W innym przypadku wskaż swoje czujniki; każdy opisuje przewodnik konfiguracji w README.",
    "editorEnergyAuto": "Puste pola korzystają z czujników z panelu Energia Home Assistant (Ustawienia → Dashboardy → Energia).",
    "editorEnergyCopy": "Wpisz je do tej karty, żeby zmienić je tutaj",
    "editorEntityGroups": {
      "live": "Moc na żywo",
      "energy": "Energia",
      "system": "Odczyty instalacji",
      "strings": "Stringi PV"
    },
    "editorEntities": {
      "solar_power": "Moc PV",
      "load_power": "Zużycie domu (opcjonalnie)",
      "grid_power": "Moc sieci (+ pobór, − oddanie)",
      "grid_import_power": "Moc poboru z sieci",
      "grid_export_power": "Moc oddawania do sieci",
      "battery_power": "Moc magazynu (+ rozładowanie)",
      "battery_charge_power": "Moc ładowania magazynu",
      "battery_discharge_power": "Moc rozładowania magazynu",
      "battery_soc": "Poziom naładowania magazynu",
      "solar_energy": "Energia z PV",
      "load_energy": "Energia zużyta w domu (opcjonalnie)",
      "grid_import_energy": "Energia pobrana z sieci",
      "grid_export_energy": "Energia oddana do sieci",
      "battery_charge_energy": "Energia naładowana",
      "battery_discharge_energy": "Energia rozładowana",
      "inverter_power": "Moc wyjściowa falownika",
      "inverter_rated_power": "Moc znamionowa falownika",
      "battery_temperature": "Temperatura magazynu",
      "battery_voltage": "Napięcie magazynu",
      "battery_current": "Prąd magazynu",
      "generator_power": "Moc generatora"
    },
    "editorPhaseLoad": "Dom {n}",
    "editorPhaseGrid": "Sieć {n}",
    "editorPhaseVoltage": "Napięcie {n}",
    "editorStringPower": "Moc PV{n}",
    "editorStringVoltage": "Napięcie PV{n}",
    "editorStringCurrent": "Prąd PV{n}",
    "editorEnergySensors": "Czujniki energii",
    "editorEnergyDaily": "Zerują się codziennie",
    "editorEnergyTotal": "Liczniki całkowite (nie zerują się)",
    "editorInvertGrid": "Mój czujnik sieci ma + przy oddawaniu",
    "editorInvertBattery": "Mój czujnik magazynu ma + przy ładowaniu",
    "editorSectionsHint": "Zaznacz, co karta pokazuje; strzałki zmieniają kolejność.",
    "editorSectionNames": {
      "flow": "Widok główny (animacja)",
      "today": "Kafelki dnia",
      "sources": "Skąd dziś prąd w domu",
      "inverter": "Szczegóły falownika",
      "forecast": "Prognoza magazynu",
      "pv_forecast": "Prognoza PV",
      "virtual_storage": "Wirtualny magazyn",
      "system": "Instalacja",
      "energy": "Energia i wykres",
      "insights": "Dziś w skrócie",
      "comparison": "Porównanie",
      "panels": "Panele",
      "prices": "Ceny energii"
    },
    "editorFolded": "zwinięta",
    "editorUp": "W górę",
    "editorDown": "W dół",
    "editorReset": "Przywróć domyślne sekcje",
    "editorVsEnable": "Pokaż wirtualny magazyn (bilans godzinowy)",
    "editorVsEntity": "Gotowy czujnik bilansu (opcjonalnie)",
    "editorVsNegative": "Niedobór",
    "editorVsShow": "pokazuj na czerwono",
    "editorVsZero": "pokazuj jako 0 kWh",
    "editorVsOwn": "Wliczaj zbilansowaną energię jako własną (samowystarczalność)",
    "editorVsHint": "Bez gotowego czujnika karta liczy bilans z czujników energii sieci.",
    "editorPvfToday": "Prognoza na dziś",
    "editorPvfRemaining": "Pozostało dziś (opcjonalnie)",
    "editorPvfDays": "Kolejne dni (od jutra)",
    "editorPvfHourly": "Prognoza godzinowa na wykresie 24H",
    "editorPvfRange": "Zakres 10–90% na słupkach dni (Solcast)",
    "editorDayN": "Dzień {n}",
    "editorDetails": "Szczegóły falownika: dodatkowe czujniki",
    "editorWeather": "Pogoda",
    "editorPeriod": "Okres na start",
    "editorFontUrl": "Własny arkusz czcionek (URL)",
    "editorNow": "teraz: {value}",
    "editorAuto": "wykryty automatycznie: {entity} · {value}",
    "editorNotFound": "Takiej encji nie ma w Home Assistant.",
    "editorWrongUnit": "Jednostka {unit}: to pole oczekuje {expected}.",
    "editorUnavailable": "teraz niedostępny",
    "editorNoStats": "Brak state_class total lub total_increasing: 3D, 7D, miesiąc i całość będą dla niego puste.",
    "editorLooksTotal": "{value} wygląda na licznik całkowity, a nie dzisiejszą energię: wybierz „Liczniki całkowite” w polu Czujniki energii.",
    "editorPairConflict": "Użyj albo tego jednego czujnika, albo pary pobór/oddanie – nie obu naraz.",
    "editorBatteryPairConflict": "Użyj albo tego jednego czujnika, albo pary ładowanie/rozładowanie – nie obu naraz.",
    "editorLooksWatts": "{value} wygląda na W: to pole jest w kW (np. {suggest}).",
    "editorLooksWh": "{value} wygląda na Wh: to pole jest w kWh (np. {suggest}).",
    "editorLive": "Teraz przy tych ustawieniach: PV {solar} · sieć {grid} · magazyn {battery}",
    "editorGridSignCheck": "Pobór większy niż produkcja paneli to rzadkość: sprawdź znak sieci („Mój czujnik sieci ma + przy oddawaniu”).",
    "editorFontsHint": "Czcionki pochodzą z serwerów Google, które widzą Twój adres IP. Własny arkusz (Więcej → własne czcionki) tego unika.",
    "editorHistoryBox": "Historia do wykresów (zaawansowane)",
    "editorHistoryHint": "Tylko gdy czujnik na żywo jest wyłączony z recordera: jego zapisywana kopia do wykresów 24H i 3D.",
    "editorHistoryLabel": "{label} – historia",
    "editorBatteries": "Kilka magazynów",
    "editorBatteriesHint": "Dwa lub więcej magazynów karta pokazuje jako jeden: moc sumowana, poziom ważony pojemnością. Każdy jest osobno w sekcji Instalacja.",
    "editorPanels": "Czujniki paneli (optymalizatory)",
    "editorPanelsHint": "Jeden wpis na panel z jego dzisiejszą energią; bez nich karta korzysta z optymalizatorów DeyeCloud albo szacunku ze stringów.",
    "editorAdd": "Dodaj",
    "editorRemove": "Usuń",
    "editorConfirmRemove": "Usunąć ten element razem z ustawieniami?",
    "editorCustom": "Własne sekcje",
    "editorCustomHint": "Sekcje z dowolnymi czujnikami, np. moc i napięcie każdej fazy. Każdą można ustawić, zwinąć lub ukryć w Sekcjach, tak jak pozostałe. Nazwę, max (dla paska) lub jednostkę czujnika można ustawić w YAML.",
    "editorCustomTitle": "Tytuł",
    "editorCustomSensor": "Czujnik {n}",
    "editorCustomAdd": "Dodaj sekcję",
    "editorConfirmNoSections": "Nic nie jest zaznaczone: karta będzie pusta. Kontynuować?",
    "editorItemName": "Nazwa",
    "editorBatSoc": "Poziom (%)",
    "editorBatPower": "Moc (+ rozładowanie)",
    "editorBatCapacity": "Pojemność (kWh)",
    "editorBatVoltage": "Napięcie (opcjonalnie)",
    "editorBatTemp": "Temperatura (opcjonalnie)",
    "editorBatInvert": "Ten ma + przy ładowaniu",
    "editorPanelEnergy": "Energia dziś",
    "editorPanelPower": "Moc (opcjonalnie)",
    "editorDetailsHint": "Dowolne czujniki pokazywane jako kafelki w Szczegółach falownika, np. temperatura lub status.",
    "editorSensor": "Czujnik",
    "editorDetailName": "Nazwa (opcjonalnie)",
    "editorFoundN": "wykryto automatycznie: {n}",
    "editorRatedFound": "Wykryto automatycznie moc znamionową falownika: {power}. Zostaw pole puste, żeby jej użyć.",
    "detailVoltage": "Napięcie {n}",
    "detailLoadVoltage": "Napięcie odbiorów {n}",
    "detailFrequency": "Częstotliwość",
    "detailTempAc": "Falownik, strona AC",
    "detailTempDc": "Falownik, strona DC",
    "detailTempBattery": "Magazyn",
    "detailBatPower": "Moc magazynu",
    "editorPriceSensors": "Ceny z czujników (opcjonalnie)",
    "editorPriceSensorsHint": "Dla cen, które się zmieniają, np. godzinowej ceny RCE albo taryfy dynamicznej: oszczędność liczy się wtedy godzina po godzinie, każda godzina po swojej cenie. Czujnik zastępuje stałą cenę powyżej.",
    "editorPriceImportSensor": "Czujnik ceny zakupu",
    "editorPriceExportSensor": "Czujnik ceny sprzedaży",
    "editorPriceUnit": "Jednostka {unit}: oczekiwana cena za kWh lub MWh (np. PLN/kWh).",
    "editorPriceNoStats": "Brak state_class: Home Assistant nie zapisuje godzinowej historii tej ceny, więc dla każdej godziny użyta będzie cena bieżąca.",
    "pricesTitle": "Ceny energii",
    "priceNow": "teraz {price}",
    "pricesAhead": "Kolejne godziny – najtaniej: {cheap} ({cheapPrice}) · najdrożej: {dear} ({dearPrice})",
    "tomorrow": "jutro",
    "exportValue": "Wartość oddanej energii",
    "editorNoImportPrice": "Oszczędność wymaga ceny zakupu: dopóki jej nie podasz, karta pokazuje wartość oddanej energii.",
    "editorSettlement": "Rozliczenie z zakładem energetycznym",
    "editorSettlementFixed": "Stałe ceny",
    "editorSettlementBilling": "Net-billing (sprzedaż po cenie RCE)",
    "editorSettlementMetering": "Net-metering (opusty 0,8 / 0,7)",
    "editorSettlementHintFixed": "Ceny wpisane poniżej albo czujniki cen.",
    "editorSettlementHintBilling": "Oddana energia jest sprzedawana po godzinowej cenie RCE, a jej wartość trafia do depozytu pomnożona przez 1,23: wpisz tylko cenę zakupu. Czujnik ceny RCE karta znajdzie sama, możesz też wybrać go poniżej.",
    "editorSettlementHintMetering": "Każda oddana kWh jest warta {ratio} kWh pobranej: wpisz tylko cenę zakupu.",
    "editorMeteringRatio": "Opust za oddaną kWh",
    "editorMeteringAuto": "automatycznie ({ratio}; 0,7 powyżej 10 kWp)",
    "editorRcePrice": "Czujnik ceny RCE",
    "editorRceMissing": "Nie znaleziono czujnika ceny RCE: wybierz go (np. z integracji PSE albo z EMS), inaczej oddana energia nie zostanie wyceniona.",
    "editorImportPriceHint": "Cena zakupu: koszt każdej kWh, czyli energia i opłaty dystrybucyjne naliczane za kWh, bez stałych opłat miesięcznych.",
    "editorRceFound": "Znaleziono czujnik ceny RCE: {entity} · {value}.",
    "editorUseBilling": "Rozliczam się w net-billingu: wyceniaj oddaną energię po cenie RCE",
    "editorBillingFactor": "Mnożnik depozytu (1,23)",
    "invToday": "dziś {kwh}",
    "editorInverters": "Kilka falowników",
    "editorInvertersHint": "Ich moc i energia z PV są sumowane dla całej karty (bez helperów); każdy jest osobno w sekcji Instalacja.",
    "editorInvSolarPower": "Moc PV",
    "editorInvSolarEnergy": "Energia z PV",
    "editorInvPower": "Moc wyjściowa (opcjonalnie)",
    "editorInvRated": "Moc znamionowa (kW, opcjonalnie)"
  },
  "pt": {
    "languageName": "Português",
    "locale": "pt-PT",
    "currency": "€",
    "hourShort": "h",
    "minShort": "min",
    "dayShort": "d",
    "defaultTitle": "Energia doméstica",
    "live": "Em direto",
    "delayed": "Com atraso",
    "offline": "Offline",
    "solar": "Solar",
    "battery": "Bateria",
    "grid": "Rede",
    "home": "Casa",
    "inverter": "Inversor",
    "generating": "A gerar",
    "idle": "Inativo",
    "charging": "A carregar",
    "discharging": "A descarregar",
    "importing": "A importar",
    "exporting": "A exportar",
    "balanced": "Equilibrado",
    "fromRoof": "do telhado",
    "inHome": "em casa",
    "periodToday": "Hoje",
    "period3d": "Últimos 3 dias",
    "period7d": "Últimos 7 dias",
    "periodMonth": "Este mês",
    "periodAll": "Desde sempre",
    "periodMonthShort": "Mês",
    "periodAllShort": "Tudo",
    "since": "desde {date}",
    "energy": "Energia",
    "pvProduction": "Produção FV",
    "consumption": "Consumo",
    "gridImport": "Importação da rede",
    "gridExport": "Exportação para a rede",
    "batteryCharge": "Carga da bateria",
    "batteryDischarge": "Descarga da bateria",
    "autarky": "Autossuficiência",
    "selfUse": "Autoconsumo",
    "savings": "Poupança",
    "co2": "CO₂ evitado",
    "specificYield": "Rendimento por kWp",
    "legendPv": "FV",
    "legendLoad": "Casa",
    "legendBattery": "Bateria",
    "legendGrid": "Rede",
    "legendSoc": "SOC",
    "legendForecast": "Previsão",
    "chartLoading": "A carregar histórico…",
    "chartEmpty": "Sem histórico para este período",
    "chartError": "Histórico não disponível",
    "chartPowerHint": "Bateria: sobe = a descarregar · Rede: sobe = importação",
    "batteryForecast": "Previsão da bateria",
    "fullIn": "Cheia em {d}",
    "fullAt": "cerca das {time}",
    "lastsFor": "Dura {d}",
    "lastsUntil": "até cerca das {time} (a {soc}%)",
    "holding": "Estável",
    "slowCharge": "A carregar lentamente",
    "slowDischarge": "A descarregar lentamente",
    "slowDetail": "mais de 2 dias a esta taxa",
    "storedOf": "{kwh} de {cap}",
    "inverterDetails": "Detalhes do inversor",
    "pvStrings": "Strings FV",
    "stringN": "String {n}",
    "temperatures": "Temperaturas",
    "batteryDetails": "Bateria",
    "gridDetails": "Rede",
    "noDetails": "O inversor não reporta medições correspondentes.",
    "close": "Fechar",
    "panelsTitle": "Painéis",
    "panelsHint": "Produção hoje",
    "panelAvg": "Média de {kwh} por painel",
    "panelWeak": "Mais fraco: {name} a {pct}% da mediana",
    "panelsEven": "Todos os painéis dentro de 15% da mediana",
    "stringModules": "String {n} · {count} módulos",
    "panelsEstimateHint": "≈ {energy} por painel hoje",
    "panelEach": "≈ {power} por painel",
    "panelsEstimateNote": "Estimativa: estes painéis não têm otimizadores e não reportam dados próprios, pelo que os valores por painel correspondem à potência da string dividida pelos seus painéis e a energia de hoje repartida igualmente por todos os painéis.",
    "paperHeadline": "{power} para a casa",
    "paperMix": "Neste momento: {parts}.",
    "paperOnly": "Neste momento tudo vem de {source}.",
    "paperSun": "o sol",
    "paperBattery": "a bateria",
    "paperGrid": "a rede",
    "sankeyFrom": "De",
    "sankeyTo": "Para",
    "losses": "Perdas",
    "otherSource": "Outro",
    "paperLasts": "A esta taxa a bateria dura até às {time}.",
    "paperFull": "A bateria estará cheia por volta das {time}.",
    "paperExport": "{power} vai para a rede.",
    "paperDay": "O dia até agora",
    "lcarsTitle": "Potência · {name}",
    "lcarsPvIn": "FV entra",
    "lcarsBatIn": "Bat entra",
    "lcarsBatOut": "Bat sai",
    "lcarsGridIn": "Rede entra",
    "lcarsGridOut": "Rede sai",
    "lcarsHome": "Casa",
    "lcarsPanels": "Painéis",
    "stored": "Armazenado",
    "autonomy": "Autonomia até",
    "stateOfCharge": "Carga",
    "autarkyToday": "Autossuficiência hoje",
    "statusNominal": "Estado: nominal",
    "statusWarn": "Estado: atenção",
    "statusAlert": "Estado: alerta",
    "coreTitle": "Núcleo de potência",
    "sector": "Setor",
    "supplying": "A fornecer",
    "absorbing": "A absorver",
    "sun": "Sol",
    "chipRoof": "Hoje do telhado",
    "chipLasts": "Dura até",
    "chipFull": "Cheia às",
    "chipStored": "Armazenado",
    "chipHome": "Usado hoje",
    "whereFrom": "De onde veio a energia de hoje",
    "noData": "Nenhum sensor de energia encontrado",
    "noDataHelp": "Configure o painel Energia do Home Assistant, instale a integração DeyeCloud ou escolha os seus sensores no editor do cartão.",
    "editorTheme": "Tema",
    "expanseTitle": "Distribuição de potência",
    "foundationTitle": "Prime Radiant",
    "foundationForecast": "Previsão",
    "foundationSteady": "A bateria está estável; o plano mantém-se no rumo.",
    "galaxyTitle": "Sistemas de energia",
    "galaxyQuiet": "Tudo está calmo neste setor da galáxia.",
    "systemTitle": "Instalação",
    "phaseSpread": "Desequilíbrio de fases {power}",
    "phaseGrid": "rede {power}",
    "inverterLoad": "Carga do inversor",
    "inverterOf": "{power} de {rated}",
    "batteryTemperature": "Temperatura da bateria",
    "batteryVoltage": "Tensão da bateria",
    "batteryCurrent": "Corrente da bateria",
    "batteryCold": "A bateria está fria: o carregamento pode estar limitado.",
    "batteryHot": "A bateria está quente: o carregamento pode estar limitado.",
    "generatorRunning": "Gerador a funcionar",
    "gateTitle": "Comando de energia",
    "gateSub": "A marcar computador · estação",
    "gateDial": "Sequência de marcação",
    "gateLocked": "{n} / {total} bloqueado",
    "gateChevron": "Chevron {n}",
    "gateOfCapacity": "{pct}% de {size}",
    "gateInbound": "Buraco de minhoca ativo · bateria a entrar",
    "gateOutbound": "Buraco de minhoca ativo · bateria a sair",
    "gateExport": "Transferência exterior · exportação de rede",
    "gateImport": "Buraco de minhoca de entrada · importação de rede",
    "gateIdle": "Porta inativa · todos os chevrons em espera",
    "gateReserve": "O chevron 7 não bloqueia · bateria na reserva",
    "gateReserveLabel": "Reserva",
    "insightsTitle": "Hoje de relance",
    "peakSolar": "Pico solar",
    "peakLoad": "Pico de consumo",
    "atTime": "às {time}",
    "socRange": "Bateria hoje",
    "batteryCycles": "Ciclos da bateria",
    "offGrid": "Sem importação de rede",
    "compareTitle": "Comparação",
    "colYesterday": "Ontem",
    "colAvg7": "Média 7 dias",
    "colMonth": "Este mês",
    "themeNames": {
      "diorama": "Diorama",
      "aurora": "Aurora",
      "paper": "Papel",
      "lcars": "LCARS",
      "atlantis": "Atlântida",
      "expanse": "Expanse",
      "foundation": "Fundação",
      "galaxy": "Galáxia longínqua",
      "gate": "Gate Command",
      "reactor": "Reator"
    },
    "editorTitle": "Título",
    "editorLanguage": "Idioma",
    "languageAuto": "Idioma do Home Assistant",
    "editorStation": "Estação DeyeCloud",
    "auto": "Automático",
    "editorBatteryCapacity": "Capacidade da bateria (kWh)",
    "editorBatteryMinSoc": "Reserva da bateria (%)",
    "editorPvCapacity": "Tamanho do sistema FV (kWp)",
    "editorPvPanels": "Número de painéis",
    "editorPanelsPerString": "Painéis por string",
    "editorStringPanels": "FV{n} · agora {volts}",
    "editorStringsHint": "Painéis em cada string. Sem otimizadores o cartão estima cada painel a partir da potência da string; deixe strings não utilizadas em branco.",
    "editorInverterRating": "Potência nominal do inversor (kW)",
    "editorPriceImport": "Preço de importação por kWh",
    "editorPriceExport": "Preço de exportação por kWh",
    "editorCurrency": "Moeda",
    "editorCo2": "CO₂ da rede (kg por kWh)",
    "editorShowEnergy": "Mostrar energia",
    "editorShowChart": "Mostrar gráfico",
    "editorShowForecast": "Mostrar previsão da bateria",
    "editorShowSystem": "Instalação (fases, carga do inversor, bateria)",
    "editorShowPanels": "Mostrar painéis (otimizadores)",
    "editorShowWeather": "Tempo nos temas Diorama e Reator",
    "editorWide": "Layout largo (num painel largo)",
    "editorInsights": "Hoje de relance e comparação",
    "editorSolar": "A instalação tem painéis FV",
    "editorBattery": "A instalação tem bateria",
    "editorShowSelfSufficiency": "Mostrar autossuficiência",
    "editorShowSelfUse": "Mostrar autoconsumo",
    "editorShowSavings": "Mostrar poupança",
    "editorShowCo2": "Mostrar CO₂ evitado",
    "editorShowYield": "Mostrar rendimento por kWp",
    "editorAnimation": "Animações",
    "editorFonts": "Carregar tipos de letra do tema (Google Fonts)",
    "editorHint": "Os sensores DeyeCloud são encontrados automaticamente. Outros inversores: configure as entidades em YAML (ver README).",
    "reactorTitle": "Reator · sistemas de energia",
    "reactorScan": "Varrimento atmosférico",
    "reactorTelemetry": "Telemetria",
    "reactorOverdrive": "Overdrive",
    "reactorNominal": "Saída nominal",
    "reactorReserve": "Energia de reserva",
    "reactorGrid": "Apoio da rede",
    "reactorStandby": "Standby",
    "reactorPvShare": "{pct}% energia solar",
    "weatherNames": {
      "sunny": "Sol",
      "clear-night": "Noite limpa",
      "partlycloudy": "Parcialmente nublado",
      "cloudy": "Nublado",
      "fog": "Nevoeiro",
      "rainy": "Chuva",
      "pouring": "Chuva intensa",
      "snowy": "Neve",
      "snowy-rainy": "Aguaceiros de neve",
      "hail": "Granizo",
      "lightning": "Trovoada",
      "lightning-rainy": "Trovoada com chuva",
      "windy": "Vento",
      "windy-variant": "Vento com nuvens",
      "exceptional": "Excecional"
    },
    "editorPanelsAverage": "Média e painel mais fraco por string",
    "editorGlass": "Fundo transparente (o fundo do painel aparece por baixo do cartão)",
    "vsTitle": "Armazenamento virtual · balanço horário",
    "vsSurplus": "Excedente nesta hora",
    "vsDeficit": "Défice nesta hora",
    "vsResetsIn": "reinicia em {m} min",
    "vsDay": "Hoje: {h} h com excedente · {kwh} equilibrados",
    "autarkyHourly": "Autossuf. com balanço horário",
    "vsNone": "Sem excedente nesta hora",
    "otherDetails": "Outras leituras",
    "computedHint": "Calculado a partir dos outros sensores",
    "vsShort": "Armazenamento virtual",
    "editorCollapsible": "Secções recolhíveis (toque no título de uma secção)",
    "panelEachToday": "≈ {power} e {kwh} hoje por painel",
    "pvForecastTitle": "Previsão FV",
    "pvLeft": "≈ {kwh} restantes",
    "pvForecastNote": "previsão {kwh}",
    "pvProducedOf": "{done} de {total} produzidos até agora",
    "pvRange": "intervalo {low}–{high}",
    "customTitle": "Os meus sensores",
    "chartFallback": "Médias horárias das estatísticas de energia. Sem histórico de potência para: {sensors} (excluído do gravador?)",
    "chartNoHistory": "Sem histórico para: {sensors}. Excluído do gravador?",
    "editorRenamed": "Este cartão agora chama-se Home Energy Hub. O seu tipo muda de custom:solar-flow-card para custom:home-energy-hub com a próxima alteração aqui; o tipo antigo continua a funcionar.",
    "editorGroups": {
      "look": "Aparência",
      "sensors": "Sensores",
      "sections": "Secções",
      "install": "Instalação",
      "summary": "Resumo e preços",
      "vstore": "Armazenamento virtual",
      "forecast": "Previsão FV",
      "more": "Mais"
    },
    "editorSensorsHint": "O DeyeCloud e os sensores do painel Energia do Home Assistant são encontrados automaticamente: deixe esses campos em branco. Caso contrário escolha os seus sensores; o guia de configuração no README explica cada um.",
    "editorEnergyAuto": "Os campos em branco usam os sensores do painel Energia do Home Assistant (Definições → Painéis → Energia).",
    "editorEnergyCopy": "Escrevê-los neste cartão, para os alterar aqui",
    "editorEntityGroups": {
      "live": "Potência em direto",
      "energy": "Energia",
      "system": "Leituras da instalação",
      "strings": "Strings FV"
    },
    "editorEntities": {
      "solar_power": "Potência solar",
      "load_power": "Consumo doméstico (opcional)",
      "grid_power": "Potência da rede (+ importação, − exportação)",
      "grid_import_power": "Potência de importação da rede",
      "grid_export_power": "Potência de exportação da rede",
      "battery_power": "Potência da bateria (+ a descarregar)",
      "battery_charge_power": "Potência de carga da bateria",
      "battery_discharge_power": "Potência de descarga da bateria",
      "battery_soc": "Nível da bateria",
      "solar_energy": "Energia solar",
      "load_energy": "Energia doméstica (opcional)",
      "grid_import_energy": "Energia da rede",
      "grid_export_energy": "Energia para a rede",
      "battery_charge_energy": "Energia carregada",
      "battery_discharge_energy": "Energia descarregada",
      "inverter_power": "Potência de saída do inversor",
      "inverter_rated_power": "Potência nominal do inversor",
      "battery_temperature": "Temperatura da bateria",
      "battery_voltage": "Tensão da bateria",
      "battery_current": "Corrente da bateria",
      "generator_power": "Potência do gerador"
    },
    "editorPhaseLoad": "Casa {n}",
    "editorPhaseGrid": "Rede {n}",
    "editorPhaseVoltage": "Tensão {n}",
    "editorStringPower": "Potência FV{n}",
    "editorStringVoltage": "Tensão FV{n}",
    "editorStringCurrent": "Corrente FV{n}",
    "editorEnergySensors": "Sensores de energia",
    "editorEnergyDaily": "Reinicia todos os dias",
    "editorEnergyTotal": "Contadores de vida útil (nunca reiniciam)",
    "editorInvertGrid": "O meu sensor de rede é + ao exportar",
    "editorInvertBattery": "O meu sensor de bateria é + ao carregar",
    "editorSectionsHint": "Selecione o que o cartão mostra; as setas alteram a ordem.",
    "editorSectionNames": {
      "flow": "Vista principal (animação)",
      "today": "Blocos de hoje",
      "sources": "De onde veio a energia de hoje",
      "inverter": "Detalhes do inversor",
      "forecast": "Previsão da bateria",
      "pv_forecast": "Previsão FV",
      "virtual_storage": "Armazenamento virtual",
      "system": "Instalação",
      "energy": "Energia e gráfico",
      "insights": "Hoje de relance",
      "comparison": "Comparação",
      "panels": "Painéis",
      "prices": "Preços de energia"
    },
    "editorFolded": "recolhido",
    "editorUp": "Mover para cima",
    "editorDown": "Mover para baixo",
    "editorReset": "Restaurar as secções predefinidas",
    "editorVsEnable": "Mostrar armazenamento virtual (balanço líquido horário)",
    "editorVsEntity": "Sensor de balanço líquido (opcional)",
    "editorVsNegative": "Um défice",
    "editorVsShow": "mostra a vermelho",
    "editorVsZero": "mostra como 0 kWh",
    "editorVsOwn": "Contar a energia equilibrada como própria (autossuficiência)",
    "editorVsHint": "Sem um sensor o cartão calcula o balanço a partir dos sensores de energia da rede.",
    "editorPvfToday": "Previsão para hoje",
    "editorPvfRemaining": "Restante hoje (opcional)",
    "editorPvfDays": "Próximos dias (amanhã primeiro)",
    "editorPvfHourly": "Previsão horária no gráfico de 24H",
    "editorPvfRange": "Intervalo 10–90% nas barras de dias (Solcast)",
    "editorDayN": "Dia {n}",
    "editorDetails": "Detalhes do inversor: sensores adicionais",
    "editorWeather": "Tempo",
    "editorPeriod": "Período inicial",
    "editorFontUrl": "Folha de estilo de tipo de letra própria (URL)",
    "editorNow": "agora: {value}",
    "editorAuto": "encontrado automaticamente: {entity} · {value}",
    "editorNotFound": "Esta entidade não existe no Home Assistant.",
    "editorWrongUnit": "Unidade {unit}: este campo espera {expected}.",
    "editorUnavailable": "indisponível agora",
    "editorNoStats": "Sem state_class total ou total_increasing: 3D, 7D, mês e tudo ficarão vazios.",
    "editorLooksTotal": "{value} parece um contador de vida útil, não a energia de hoje: escolha \"Contadores de vida útil\" em Sensores de energia.",
    "editorPairConflict": "Use este sensor ou o par importação/exportação, não ambos.",
    "editorBatteryPairConflict": "Use este sensor ou o par carga/descarga, não ambos.",
    "editorLooksWatts": "{value} parece W: este campo está em kW (p.ex. {suggest}).",
    "editorLooksWh": "{value} parece Wh: este campo está em kWh (p.ex. {suggest}).",
    "editorLive": "Agora com estas configurações: solar {solar} · rede {grid} · bateria {battery}",
    "editorGridSignCheck": "Importar mais do que os painéis produzem é invulgar: verifique o sinal da rede (\"O meu sensor de rede é + ao exportar\").",
    "editorFontsHint": "Os tipos de letra vêm dos servidores da Google, que veem o seu endereço IP. Uma folha de estilo auto-hospedada (Mais → tipos de letra próprios) evita isso.",
    "editorHistoryBox": "Histórico para os gráficos (avançado)",
    "editorHistoryHint": "Apenas quando um sensor em direto está fora do gravador: a sua cópia gravada, usada nos gráficos de 24H e 3D.",
    "editorHistoryLabel": "{label} – histórico",
    "editorBatteries": "Várias baterias",
    "editorBatteriesHint": "Duas ou mais baterias são mostradas como uma: potência somada, nível ponderado pela capacidade. Cada uma é listada na secção de Instalação.",
    "editorPanels": "Sensores de painéis (otimizadores)",
    "editorPanelsHint": "Uma entrada por painel com a sua energia hoje; sem estes o cartão usa os otimizadores DeyeCloud ou a estimativa das strings.",
    "editorAdd": "Adicionar",
    "editorRemove": "Remover",
    "editorConfirmRemove": "Remover este item e as suas configurações?",
    "editorCustom": "Secções personalizadas",
    "editorCustomHint": "Secções próprias com quaisquer sensores, p.ex. a potência e tensão de cada fase. Cada uma pode ser posicionada, recolhida ou ocultada em Secções como as outras. Um nome, um máximo (para uma barra) ou uma unidade por sensor podem ser definidos em YAML.",
    "editorCustomTitle": "Título",
    "editorCustomSensor": "Sensor {n}",
    "editorCustomAdd": "Adicionar uma secção",
    "editorConfirmNoSections": "Nada selecionado: o cartão ficará vazio. Continuar?",
    "editorItemName": "Nome",
    "editorBatSoc": "Nível (%)",
    "editorBatPower": "Potência (+ a descarregar)",
    "editorBatCapacity": "Capacidade (kWh)",
    "editorBatVoltage": "Tensão (opcional)",
    "editorBatTemp": "Temperatura (opcional)",
    "editorBatInvert": "Este é + ao carregar",
    "editorPanelEnergy": "Energia hoje",
    "editorPanelPower": "Potência (opcional)",
    "editorDetailsHint": "Quaisquer sensores mostrados como blocos nos Detalhes do inversor, p.ex. temperatura ou estado.",
    "editorSensor": "Sensor",
    "editorDetailName": "Nome (opcional)",
    "editorFoundN": "{n} encontrado(s) automaticamente",
    "editorRatedFound": "Encontrado automaticamente: potência nominal do inversor {power}. Deixe o campo em branco para o usar.",
    "detailVoltage": "Tensão {n}",
    "detailLoadVoltage": "Tensão de carga {n}",
    "detailFrequency": "Frequência",
    "detailTempAc": "Inversor, lado AC",
    "detailTempDc": "Inversor, lado DC",
    "detailTempBattery": "Bateria",
    "detailBatPower": "Potência da bateria",
    "editorPriceSensors": "Preços de sensores (opcional)",
    "editorPriceSensorsHint": "Para preços variáveis, p.ex. o preço RCE horário ou uma tarifa dinâmica: as poupanças são calculadas hora a hora, cada hora ao seu próprio preço. Um sensor aqui substitui o preço fixo acima.",
    "editorPriceImportSensor": "Sensor de preço de importação",
    "editorPriceExportSensor": "Sensor de preço de exportação",
    "editorPriceUnit": "Unidade {unit}: esperava um preço por kWh ou MWh (p.ex. EUR/kWh).",
    "editorPriceNoStats": "Sem state_class: o Home Assistant não guarda histórico horário deste preço, pelo que o preço atual é usado para cada hora.",
    "pricesTitle": "Preços de energia",
    "priceNow": "agora {price}",
    "pricesAhead": "A seguir – mais barato: {cheap} ({cheapPrice}) · mais caro: {dear} ({dearPrice})",
    "tomorrow": "amanhã",
    "exportValue": "Valor da energia vendida",
    "editorNoImportPrice": "As poupanças precisam de um preço de importação: até definir um, o cartão mostra o valor da energia vendida.",
    "editorSettlement": "Liquidação com o seu distribuidor",
    "editorSettlementFixed": "Preços fixos",
    "editorSettlementBilling": "Net-billing (energia vendida ao preço RCE)",
    "editorSettlementMetering": "Net-metering (cada kWh enviado de volta vale 0,8 / 0,7 kWh)",
    "editorSettlementHintFixed": "Os preços abaixo, ou sensores de preços.",
    "editorSettlementHintBilling": "A energia enviada para a rede é vendida ao preço horário RCE, e o seu valor vai para o seu depósito multiplicado por 1,23: introduza apenas o preço de importação. O cartão encontra um sensor de preço RCE automaticamente, ou escolha um abaixo.",
    "editorSettlementHintMetering": "Cada kWh enviado para a rede vale {ratio} de um kWh comprado: introduza apenas o preço de importação.",
    "editorMeteringRatio": "Crédito por kWh enviado de volta",
    "editorMeteringAuto": "automático ({ratio}; 0,7 acima de 10 kWp)",
    "editorRcePrice": "Sensor de preço RCE",
    "editorRceMissing": "Nenhum sensor de preço RCE encontrado: escolha um (p.ex. da integração PSE ou do seu EMS), caso contrário a energia vendida não tem preço.",
    "editorImportPriceHint": "Preço de importação: o custo de cada kWh, energia mais os encargos de distribuição faturados por kWh, sem taxas fixas mensais.",
    "editorRceFound": "Sensor de preço RCE encontrado: {entity} · {value}.",
    "editorUseBilling": "Estou em net-billing: valorizar a energia vendida ao preço RCE",
    "editorBillingFactor": "Fator de depósito (1,23)",
    "invToday": "{kwh} hoje",
    "editorInverters": "Vários inversores",
    "editorInvertersHint": "A sua potência e energia solares são somadas para o cartão completo (sem necessidade de sensores auxiliares); cada um é listado na secção de Instalação.",
    "editorInvSolarPower": "Potência solar",
    "editorInvSolarEnergy": "Energia solar",
    "editorInvPower": "Potência de saída (opcional)",
    "editorInvRated": "Potência nominal (kW, opcional)"
  }
};


// TRANSLATIONS is generated by scripts/build.mjs from translations/*.json:
// one file per language, keyed by its language code. Keys missing in a
// language fall back to English.
const STRINGS = TRANSLATIONS;
const LANGUAGE_NAMES = Object.fromEntries(
  Object.entries(TRANSLATIONS).map(([code, strings]) => [code, strings.languageName || code])
);

// Full code first (e.g. "pt-br"), then the base language ("pt"), then English.
function languageOf(hass, config) {
  const wanted = String(config?.language || hass?.locale?.language || hass?.language || navigator.language || "en")
    .toLowerCase()
    .replace("_", "-");
  if (STRINGS[wanted]) return wanted;
  const base = wanted.split("-")[0];
  return STRINGS[base] ? base : "en";
}

function stringsFor(language) {
  return { ...STRINGS.en, ...STRINGS[language] };
}

function fill(template, values) {
  return String(template).replace(/\{(\w+)\}/g, (match, key) => (key in values ? values[key] : match));
}


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

// ---------------------------------------------------------------------------
// Home Assistant's Energy dashboard settings (energy/get_prefs): the sensors
// set up there are used wherever the card has none of its own, so the card
// works without configuration for any inverter. Power sensors (stat_rate)
// have the card's signs: grid + importing, battery + discharging.
// ---------------------------------------------------------------------------

async function loadEnergyPrefs(hass) {
  try {
    return (await hass.callWS({ type: "energy/get_prefs" })) || null;
  } catch (error) {
    // The Energy dashboard is not set up.
    return null;
  }
}

function energyAuto(prefs, hass) {
  if (!prefs || typeof prefs !== "object") return null;
  const states = hass?.states || {};
  const known = (id) => (typeof id === "string" && states[id] ? id : null);
  const sources = {};
  const add = (key, id) => {
    if (known(id) && !(sources[key] || []).includes(id)) (sources[key] ||= []).push(id);
  };
  const batteries = [];
  for (const source of Array.isArray(prefs.energy_sources) ? prefs.energy_sources : []) {
    if (!source || typeof source !== "object") continue;
    if (source.type === "grid") {
      add("grid_import_energy", source.stat_energy_from);
      add("grid_export_energy", source.stat_energy_to);
      add("grid_power", source.stat_rate);
      // The older format: lists of import and export meters.
      for (const flow of Array.isArray(source.flow_from) ? source.flow_from : []) add("grid_import_energy", flow?.stat_energy_from);
      for (const flow of Array.isArray(source.flow_to) ? source.flow_to : []) add("grid_export_energy", flow?.stat_energy_to);
      for (const power of Array.isArray(source.power) ? source.power : []) add("grid_power", power?.stat_rate);
    } else if (source.type === "solar") {
      add("solar_energy", source.stat_energy_from);
      add("solar_power", source.stat_rate);
    } else if (source.type === "home") {
      add("load_energy", source.stat_energy_to);
      add("load_power", source.stat_rate);
    } else if (source.type === "battery") {
      add("battery_discharge_energy", source.stat_energy_from);
      add("battery_charge_energy", source.stat_energy_to);
      add("battery_power", source.stat_rate);
      batteries.push({ name: source.name ? String(source.name) : null, soc: known(source.stat_soc), power: known(source.stat_rate), capacity: positiveNumber(source.capacity) });
    }
  }
  const devices = (Array.isArray(prefs.device_consumption) ? prefs.device_consumption : [])
    .filter((device) => device && typeof device === "object" && (known(device.stat_consumption) || known(device.stat_rate)))
    .map((device) => ({ energy: known(device.stat_consumption), power: known(device.stat_rate), name: device.name ? String(device.name) : null, parent: typeof device.included_in_stat === "string" ? device.included_in_stat : null }));
  return Object.keys(sources).length || devices.length ? { sources, batteries, devices } : null;
}

const POWER_GROUPS = {
  solar_power: ["solar_power"],
  load_power: ["load_power"],
  grid_power: ["grid_power", "grid_import_power", "grid_export_power"],
  battery_power: ["battery_power", "battery_charge_power", "battery_discharge_power"],
};

// The card's config with what the Energy dashboard adds: `_energy` (its
// sensors and devices) and, where the card would otherwise have nothing,
// the lifetime-counter mode, the battery capacity and several batteries.
// DeyeCloud's own discovery and anything set in the card come first.
function withEnergyAuto(config, auto, hass) {
  if (!auto) return config;
  const next = { ...config, _energy: { ...auto, live: false, energy: false } };
  if (deyeStations(hass).length) return next;
  const entities = config.entities || {};
  const ownEnergy = Object.keys(entities).some((key) => /_energy$/.test(key) && entities[key])
    || (Array.isArray(config.inverters) && config.inverters.some((item) => item?.solar_energy));
  next._energy.live = true;
  next._energy.energy = !ownEnergy && Object.keys(auto.sources).some((key) => /_energy$/.test(key));
  if (next._energy.energy && !config.energy_sensors) next.energy_sensors = "total";
  const ownBattery = POWER_GROUPS.battery_power.some((key) => entities[key]) || entities.battery_soc || Array.isArray(config.batteries);
  // An installation set up from the Energy dashboard alone: no battery or
  // no solar there, none in the card.
  const ownLive = Object.values(POWER_GROUPS).flat().some((key) => entities[key]) || Array.isArray(config.inverters);
  if (!ownLive && !ownEnergy && Object.keys(auto.sources).length) {
    const has = (prefix) => Object.keys(auto.sources).some((key) => key.startsWith(prefix));
    if (config.show_battery === undefined && !ownBattery && !has("battery_")) next.show_battery = false;
    if (config.show_solar === undefined && !has("solar_")) next.show_solar = false;
  }
  if (!ownBattery && auto.batteries.length) {
    const complete = auto.batteries.filter((battery) => battery.soc && battery.power);
    if (auto.batteries.length > 1 && complete.length === auto.batteries.length) {
      next.batteries = complete.map((battery, i) => ({ name: battery.name || `#${i + 1}`, soc: battery.soc, power: battery.power, ...(battery.capacity ? { capacity: battery.capacity } : {}) }));
    }
    const capacity = auto.batteries.every((battery) => battery.capacity) ? auto.batteries.reduce((sum, battery) => sum + battery.capacity, 0) : null;
    if (capacity && !positiveNumber(config.battery_capacity)) next.battery_capacity = capacity;
  }
  return next;
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
  // Nothing of the card's own: the Energy dashboard's sensors, several of a
  // kind added up.
  const auto = station === null ? config._energy : null;
  if (auto?.live) {
    const from = (key, unit, read) => {
      const parts = (auto.sources[key] || []).map(pick).filter(Boolean);
      return parts.length ? combinedEntry(parts, unit, read) : null;
    };
    const free = (group) => POWER_GROUPS[group].every((key) => !configured[key]);
    if (free("solar_power")) live.solar ||= from("solar_power", "W", wattsOf);
    if (free("load_power")) live.load ||= from("load_power", "W", wattsOf);
    if (free("grid_power")) live.grid ||= from("grid_power", "W", wattsOf);
    if (free("battery_power")) live.battery ||= from("battery_power", "W", wattsOf);
    if (!configured.battery_soc && auto.batteries.length === 1) live.soc ||= pick(auto.batteries[0].soc);
    if (auto.energy) {
      for (const [name, def] of Object.entries(ENERGY_METRICS)) energy[name] ||= from(def.key, "kWh", kwhOf);
    }
  }
  // Several inverters: their solar power and energy added up, unless the
  // sum is set under entities:.
  const inverters = inverterEntries(hass, config);
  const solarParts = inverters.map((item) => item.solar).filter(Boolean);
  const energyParts = inverters.map((item) => item.energy).filter(Boolean);
  if (solarParts.length && !configured.solar_power) live.solar = combinedEntry(solarParts, "W", wattsOf);
  if (energyParts.length && !configured.solar_energy) energy.solar = combinedEntry(energyParts, "kWh", kwhOf);
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

// Several inverters (`inverters:`, like `batteries:`): each with its solar
// power and energy, and optionally its output power and rating (kW).
function inverterEntries(hass, config) {
  if (!Array.isArray(config.inverters)) return [];
  const states = hass?.states || {};
  const pick = (id) => (typeof id === "string" && states[id] ? { entityId: id, stateObj: states[id] } : null);
  return config.inverters.filter((item) => item && typeof item === "object").map((item, i) => ({
    name: item.name ? String(item.name) : `#${i + 1}`,
    solar: pick(item.solar_power),
    energy: pick(item.solar_energy),
    power: pick(item.power),
    rated: positiveNumber(item.rated_power),
  })).filter((item) => item.solar || item.energy || item.power);
}

// One reading made of several sensors, added up: a stand-in sensor in W or
// kWh for the live values, the sensors themselves for history and
// statistics (entityIds, parts).
function combinedEntry(parts, unit, read) {
  if (parts.length === 1) return parts[0];
  const values = parts.map((part) => read(part.stateObj)).filter(isNum);
  const first = parts[0];
  const latest = parts.map((part) => part.stateObj.last_updated).filter(Boolean).sort().pop();
  return {
    entityId: first.entityId,
    entityIds: parts.map((part) => part.entityId),
    parts,
    stateObj: {
      entity_id: first.entityId,
      state: values.length ? String(values.reduce((a, b) => a + b, 0)) : "unavailable",
      attributes: { ...first.stateObj.attributes, unit_of_measurement: unit },
      last_updated: latest,
      last_changed: latest,
    },
  };
}

// The sensors behind a reading: one, or several summed (`inverters:`).
function entityIds(entry) {
  return entry ? entry.entityIds || [entry.entityId] : [];
}

// Statistics rows of several sensors added up period by period: change and
// state summed (a state only when every sensor has one).
function statRows(response, ids) {
  if (ids.length === 1) return response?.[ids[0]] || [];
  const byStart = new Map();
  for (const id of ids) {
    for (const row of response?.[id] || []) {
      const at = statStart(row.start);
      const sum = byStart.get(at) || { start: at, end: row.end, change: 0, state: 0, n: 0 };
      sum.change += Number(row.change) || 0;
      if (Number.isFinite(Number(row.state))) sum.state += Number(row.state);
      sum.n += 1;
      byStart.set(at, sum);
    }
  }
  return [...byStart.values()].sort((a, b) => a.start - b.start)
    .map((row) => ({ start: row.start, end: row.end, change: row.change, state: row.n === ids.length ? row.state : null }));
}

function energySources(energy) {
  return Object.fromEntries(ENERGY_ORDER.map((name) => [name, entityIds(energy[name])]).filter(([, ids]) => ids.length));
}

// Hourly statistics since midnight for lifetime energy counters. The hour
// before midnight is included only for its closing reading (`last` when no
// hour of today has been compiled yet).
async function loadTodayStats(hass, energy) {
  const sources = energySources(energy);
  const midnight = startOfDay(new Date()).getTime();
  const response = await hass.callWS({
    type: "recorder/statistics_during_period",
    start_time: new Date(midnight - 3600000).toISOString(),
    end_time: new Date().toISOString(),
    statistic_ids: [...new Set(Object.values(sources).flat())],
    period: "hour",
    types: ["change", "state"],
    units: { energy: "kWh" },
  });
  const sinceMidnight = (rows) => {
    let change = 0;
    let last = null;
    for (const row of rows) {
      if (statStart(row.start) >= midnight) change += Math.max(0, Number(row.change) || 0);
      const state = Number(row.state);
      if (Number.isFinite(state)) last = state;
    }
    return { change, last };
  };
  const out = {};
  for (const [name, ids] of Object.entries(sources)) {
    const rows = statRows(response, ids);
    if (rows.length) out[name] = sinceMidnight(rows);
  }
  // Each sensor of a summed reading on its own too (each inverter's today).
  Object.defineProperty(out, "bySensor", {
    value: Object.fromEntries(Object.values(sources).filter((ids) => ids.length > 1).flat()
      .filter((id) => response?.[id]?.length).map((id) => [id, sinceMidnight(response[id])])),
  });
  return out;
}

// Today's energy of one lifetime counter: from the hourly statistics, plus
// what it added since the last full hour.
function todayOfCounter(stats, entry) {
  const s = stats?.bySensor?.[entry.entityId];
  const now = kwhOf(entry.stateObj);
  return s ? s.change + (isNum(now) && isNum(s.last) ? Math.max(0, now - s.last) : 0) : null;
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

// Prices: a number, or a sensor (e.g. the hourly RCE price) whose unit may
// be per kWh, per MWh or per Wh.
function priceSetting(value) {
  if (typeof value === "string" && /^[a-z_]+\.[a-z0-9_]+$/.test(value.trim())) return { entity: value.trim() };
  const number = Number.parseFloat(value);
  return Number.isFinite(number) ? { value: number } : null;
}

function priceScale(stateObj) {
  const unit = stateUnit(stateObj).toLowerCase().replace(/\s/g, "");
  return unit.includes("mwh") ? 0.001 : /\/wh$/.test(unit) ? 1000 : 1;
}

function currentPrice(states, setting) {
  if (!setting) return null;
  if (!setting.entity) return setting.value;
  const stateObj = states?.[setting.entity];
  const value = stateNumber(stateObj);
  return value === null ? null : value * priceScale(stateObj);
}

// The mean price of each hour (or month) from the price sensors' long-term
// statistics: { import: Map(start ms -> price per kWh), export: … }.
async function loadPriceStats(hass, ids, start, period) {
  const response = await hass.callWS({
    type: "recorder/statistics_during_period",
    start_time: start.toISOString(),
    end_time: new Date().toISOString(),
    statistic_ids: [...new Set(Object.values(ids))],
    period,
    types: ["mean"],
  });
  const out = {};
  for (const [name, entityId] of Object.entries(ids)) {
    const scale = priceScale(hass.states?.[entityId]);
    out[name] = new Map((response?.[entityId] || []).filter((row) => Number.isFinite(Number(row.mean))).map((row) => [statStart(row.start), Number(row.mean) * scale]));
  }
  return out;
}

// Savings with prices that change by the hour: for every hour, its energy at
// its mean price. `rows` are energy per hour (or month), `rest` what the
// statistics do not cover yet (the current hour), valued at today's price.
function pricedSavings(rows, rest, price, net) {
  let saved = 0;
  const add = (values, at) => {
    const h = deriveLoadEnergy(values);
    const imported = h.gridImport || 0;
    const exported = h.gridExport || 0;
    const billedImport = net ? Math.max(0, imported - exported) : imported;
    const billedExport = net ? Math.max(0, exported - imported) : exported;
    saved += Math.max(0, (h.load || 0) - billedImport) * price("import", at) + billedExport * price("export", at);
  };
  for (const row of rows) add(row, row.at);
  if (rest) add(rest, null);
  return saved;
}

// How the energy sent to the grid is settled (`settlement`):
// - net_billing: sold at the hourly RCE price; without `price_export` the
//   card uses an RCE price sensor it finds (e.g. ProfitEMS, the PSE
//   integration);
// - net_metering: each kWh sent back is worth `metering_ratio` of a kWh
//   bought: 0.8, or 0.7 above 10 kWp;
// - unset: the fixed prices or price sensors as given.
function detectRcePrice(hass) {
  const candidates = Object.values(hass?.states || {}).filter((s) => s.entity_id.startsWith("sensor.")
    && /(^|[^a-z])rce([^a-z]|$)/i.test(`${s.entity_id} ${s.attributes?.friendly_name || ""}`)
    && /\/\s*[km]?wh$/i.test(stateUnit(s)) && stateNumber(s) !== null);
  // One with the hours listed (for the chart) first.
  const hourly = (s) => Object.values(s.attributes || {}).some((v) => Array.isArray(v) && v.length >= 12);
  return (candidates.find(hourly) || candidates[0])?.entity_id || null;
}

function meteringRatio(config) {
  const ratio = Number.parseFloat(config.metering_ratio);
  if (ratio > 0 && ratio <= 1) return ratio;
  return (positiveNumber(config.pv_capacity) || 0) > 10 ? 0.7 : 0.8;
}

function effectivePrices(hass, config) {
  const prices = { import: priceSetting(config.price_import), export: priceSetting(config.price_export), ratio: null, detected: null, factor: 1 };
  // Net-billing: the value of the energy sold is credited to the prosumer
  // deposit multiplied by 1.23 (billing_factor: 1 turns that off).
  if (config.settlement === "net_billing") {
    const factor = Number.parseFloat(config.billing_factor);
    prices.factor = factor > 0 ? factor : 1.23;
  }
  if (config.settlement === "net_billing" && !prices.export) {
    prices.detected = detectRcePrice(hass);
    if (prices.detected) prices.export = { entity: prices.detected };
  }
  if (config.settlement === "net_metering") {
    prices.ratio = meteringRatio(config);
    prices.export = null;
  }
  return prices;
}

// Hourly prices for the price chart, from the attributes of the price
// sensor (the export price's, else the import price's). Reads the common
// formats: lists of { start, price } items (ProfitEMS "prices", Nord Pool
// "raw_today", Tibber, PSE RCE…) and lists of plain numbers per day
// ("today", "tomorrow"). Quarter-hour prices are averaged per hour.
const PRICE_START_KEYS = ["start", "start_time", "starts_at", "startsAt", "period_start", "time", "datetime", "from"];
const PRICE_VALUE_KEYS = ["price", "value", "price_per_kwh", "total"];

function priceChartData(hass, config, now = new Date()) {
  const effective = effectivePrices(hass, config);
  const setting = [effective.export, effective.import].find((p) => p?.entity);
  const stateObj = setting && hass?.states?.[setting.entity];
  if (!stateObj) return null;
  const scale = priceScale(stateObj);
  const attrs = stateObj.attributes || {};
  const byHour = new Map();
  const put = (ms, value) => {
    if (!Number.isFinite(ms) || !isNum(value)) return;
    const hour = new Date(ms);
    hour.setMinutes(0, 0, 0);
    const slot = byHour.get(hour.getTime()) || { sum: 0, n: 0 };
    slot.sum += value * scale;
    slot.n += 1;
    byHour.set(hour.getTime(), slot);
  };
  for (const value of Object.values(attrs)) {
    if (!Array.isArray(value) || !value.length || typeof value[0] !== "object" || value[0] === null) continue;
    for (const item of value) {
      const startKey = PRICE_START_KEYS.find((k) => item?.[k] !== undefined);
      const valueKey = PRICE_VALUE_KEYS.find((k) => isNum(Number.parseFloat(item?.[k])));
      if (startKey && valueKey) put(Date.parse(item[startKey]), Number.parseFloat(item[valueKey]));
    }
  }
  if (!byHour.size) {
    for (const [key, offset] of [["today", 0], ["tomorrow", 1]]) {
      const list = attrs[key];
      if (!Array.isArray(list) || !list.length || !list.every((v) => v === null || isNum(Number.parseFloat(v)))) continue;
      const base = startOfDay(addDays(now, offset)).getTime();
      const step = (24 * 3600000) / list.length;
      list.forEach((v, i) => v !== null && put(base + i * step, Number.parseFloat(v)));
    }
  }
  const from = startOfDay(now).getTime();
  const to = startOfDay(addDays(now, 2)).getTime();
  const hours = [...byHour.entries()].filter(([at]) => at >= from && at < to).sort((a, b) => a[0] - b[0])
    .map(([at, slot]) => ({ at, price: slot.sum / slot.n }));
  if (hours.length < 2) return null;
  const hourNow = new Date(now);
  hourNow.setMinutes(0, 0, 0);
  const ahead = hours.filter((h) => h.at >= hourNow.getTime());
  const pick = (better) => ahead.reduce((best, h) => (!best || better(h.price, best.price) ? h : best), null);
  return {
    entityId: setting.entity,
    hours,
    nowAt: hourNow.getTime(),
    current: currentPrice(hass.states, setting),
    cheapest: pick((a, b) => a < b),
    priciest: pick((a, b) => a > b),
  };
}

// PV production forecast (#69) from forecast sensors such as Solcast or
// Forecast.Solar: `pv_forecast: { today, remaining, days: [...] }`, where
// `days` lists the sensors for tomorrow and the days after it.
// The hourly PV forecast as average watts per hour, keyed by the hour's
// start (ms). Solcast keeps it in the forecast sensors' attributes:
// detailedHourly, or detailedForecast by the half hour (pv_estimate in kW).
function forecastHoursFromStates(hass, config) {
  const f = config.pv_forecast;
  if (!f || typeof f !== "object" || Array.isArray(f) || f.hourly === false) return null;
  const hours = new Map();
  const counts = new Map();
  for (const id of [f.today, ...(Array.isArray(f.days) ? f.days.slice(0, 1) : [])]) {
    const a = typeof id === "string" ? hass?.states?.[id]?.attributes : null;
    const list = Array.isArray(a?.detailedHourly) ? a.detailedHourly : Array.isArray(a?.detailedForecast) ? a.detailedForecast : null;
    for (const item of list || []) {
      const at = Date.parse(item?.period_start);
      const kw = Number.parseFloat(item?.pv_estimate);
      if (!Number.isFinite(at) || !Number.isFinite(kw)) continue;
      const hour = new Date(at);
      hour.setMinutes(0, 0, 0);
      const key = hour.getTime();
      hours.set(key, (hours.get(key) || 0) + kw * 1000);
      counts.set(key, (counts.get(key) || 0) + 1);
    }
  }
  for (const [key, sum] of hours) hours.set(key, sum / counts.get(key));
  return hours.size ? hours : null;
}

// The same from Home Assistant's energy forecast (Forecast.Solar, Solcast or
// any integration chosen in the Energy dashboard): watt-hours per hour,
// summed over the forecast entries (e.g. Forecast.Solar's roof planes).
async function loadEnergyForecastHours(hass) {
  const response = await hass.callWS({ type: "energy/solar_forecast" });
  const hours = new Map();
  for (const entry of Object.values(response || {})) {
    for (const [at, wh] of Object.entries(entry?.wh_hours || {})) {
      const ms = Date.parse(at);
      const value = Number(wh);
      if (Number.isFinite(ms) && Number.isFinite(value)) hours.set(ms, (hours.get(ms) || 0) + value);
    }
  }
  return hours.size ? hours : null;
}

// The hourly forecast on the chart's buckets: each hour's average power at
// the middle of the hour, straight lines in between; nothing outside the
// forecast's hours.
function forecastSeries(hours, spec) {
  if (!hours?.size) return null;
  const HOUR = 3600000;
  const series = Array.from({ length: spec.count }, (_, i) => {
    const t = spec.start.getTime() + (i + 0.5) * spec.bucketMs;
    const base = new Date(t - HOUR / 2);
    base.setMinutes(0, 0, 0);
    const a = base.getTime();
    const before = hours.get(a);
    const after = hours.get(a + HOUR);
    if (!isNum(before) && !isNum(after)) return null;
    if (!isNum(before) || !isNum(after)) return isNum(before) ? (t - a - HOUR / 2 <= HOUR / 2 ? before : null) : (a + HOUR + HOUR / 2 - t <= HOUR / 2 ? after : null);
    const share = (t - (a + HOUR / 2)) / HOUR;
    return Math.max(0, before + (after - before) * share);
  });
  return series.some((v) => isNum(v) && v > 0) ? series : null;
}

function pvForecastData(hass, config, today, now = new Date()) {
  const f = config.pv_forecast;
  if (!f || typeof f !== "object" || Array.isArray(f)) return null;
  const states = hass?.states || {};
  const read = (id) => (typeof id === "string" ? kwhOf(states[id]) : null);
  const total = read(f.today);
  const remaining = read(f.remaining);
  const ids = Array.isArray(f.days) ? f.days : [];
  // Solcast: the pessimistic (10%) and optimistic (90%) estimate of a day.
  // `range: false` leaves it out.
  const range = (id) => {
    if (f.range === false) return {};
    const a = typeof id === "string" ? states[id]?.attributes : null;
    const low = Number.parseFloat(a?.estimate10);
    const high = Number.parseFloat(a?.estimate90);
    return Number.isFinite(low) && Number.isFinite(high) && high >= low ? { low, high } : {};
  };
  const days = [{ date: startOfDay(now), value: total, entityId: f.today, today: true, ...range(f.today) }, ...ids.map((id, i) => ({
    date: startOfDay(addDays(now, i + 1)),
    value: read(id),
    entityId: id,
    ...range(id),
  }))].filter((d) => isNum(d.value));
  if (!days.length && !isNum(remaining)) return null;
  return { total, remaining, produced: isNum(today.solar) ? today.solar : null, days, entityId: f.remaining || f.today };
}

// The short note at the solar reading: what is still expected today.
function pvForecastNote(m) {
  const f = m.pvForecast;
  if (!f) return "";
  if (isNum(f.remaining)) return fill(m.t.pvLeft, { kwh: formatEnergy(f.remaining, m.locale) });
  return isNum(f.total) ? fill(m.t.pvForecastNote, { kwh: formatEnergy(f.total, m.locale) }) : "";
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
  const sources = energySources(energy);
  const response = await hass.callWS({
    type: "recorder/statistics_during_period",
    start_time: spec.start.toISOString(),
    end_time: new Date().toISOString(),
    statistic_ids: [...new Set(Object.values(sources).flat())],
    period: spec.statPeriod,
    types: ["change"],
    units: { energy: "kWh" },
  });
  const byKey = new Map();
  for (const [name, ids] of Object.entries(sources)) {
    for (const row of statRows(response, ids)) {
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
function periodSummary(totals, config, t, locale, net = null, money = undefined) {
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
  // Prices from sensors: worked out hour by hour by the card (money), "…"
  // while the statistics load.
  if (money !== undefined) {
    // Without an import price there is nothing to save against: the value
    // of the energy sold instead.
    const label = money?.kind === "exportValue" ? t.exportValue : t.savings;
    const value = money?.value;
    if (show("show_savings")) items.push(["money", label, isNum(value) ? `${formatNumber(value, locale, 2)} ${config.currency ?? t.currency}`.trim() : "…"]);
    return items.concat(periodSummaryRest(totals, config, t, locale));
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
  return items.concat(periodSummaryRest(totals, config, t, locale));
}

// The summary items after the savings: avoided CO₂ and the specific yield.
function periodSummaryRest(totals, config, t, locale) {
  const { solar } = totals;
  const items = [];
  const show = (key) => config[key] !== false;
  const hasSolar = show("show_solar");
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

// Readings that only repeat another one:
// - a numbered battery reading at zero (no second battery);
// - a single numbered one equal to the total;
// - the load side's voltages while they follow the grid's: all of them are
//   shown only when the grid is down or a phase differs by more than 10 V
//   (the inverter runs off-grid), so the phases never show half and half.
function withoutEchoes(readings) {
  const near = (a, b, tolerance) => Math.abs(a - b) <= tolerance;
  const loads = readings.filter((r) => r.kind === "loadVoltage");
  const grids = readings.filter((r) => r.kind === "voltage");
  const offGrid = loads.some((l) => {
    const grid = grids.find((g) => g.phase === l.phase);
    return !grid || grid.value < 50 || !near(l.value, grid.value, 10);
  });
  return readings.filter((r, _, all) => {
    if (r.kind === "loadVoltage") return offGrid;
    if (!r.number) return true;
    const total = all.find((t) => t.kind === r.kind && !t.number);
    const numbered = all.filter((n) => n.kind === r.kind && n.number && Math.abs(n.value) > 0.05);
    if (Math.abs(r.value) <= 0.05 && (total || numbered.length)) return false;
    return !(total && numbered.length === 1 && near(r.value, total.value, Math.max(0.1, Math.abs(total.value) * 0.02)));
  });
}

function batteryReadingMeaning(key, unit) {
  const number = key.match(/(\d)$/)?.[1] || "";
  const kind = { V: "batVoltage", A: "batCurrent", W: "batPower", "°C": "tempBattery" }[unit] || "other";
  return { id: kind === "other" ? key : `${kind}${number}`, kind, number };
}

// What a grid-side inverter reading is: the voltage of a phase (L1–L3, also
// as R/S/T or A/B/C), the load side's voltage, the frequency, or other.
function gridReadingMeaning(key, unit) {
  if (unit === "Hz") return { id: "frequency", kind: "frequency", order: 9 };
  const tail = key.replace(/\s+/g, "");
  const match = tail.match(/L([123])$/i) || tail.match(/(?:RUA|SVB|TWC)$/i) || tail.match(/U([ABC])$/i) || tail.match(/phase([ABC123])/i);
  const phase = !match ? null : /RUA$/i.test(tail) ? 1 : /SVB$/i.test(tail) ? 2 : /TWC$/i.test(tail) ? 3 : "1A".includes(match[1]?.toUpperCase()) ? 1 : "2B".includes(match[1]?.toUpperCase()) ? 2 : 3;
  if (!phase) return { id: key, kind: "other", order: 8 };
  const load = /load/i.test(key);
  return { id: `${load ? "load" : "grid"}-${phase}`, kind: load ? "loadVoltage" : "voltage", phase, order: (load ? 3 : 0) + phase };
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
      // BatteryCurrent and BatteryTotalCurrent are the same reading on a
      // single battery; numbered ones (BatteryCurrent2) are not.
      const meaning = batteryReadingMeaning(key, unit);
      if (!device.battery.some((r) => r.id === meaning.id)) device.battery.push({ ...reading, ...meaning });
    } else if (unit === "°C" || /temp/i.test(key)) {
      device.temperatures.push({ ...reading, kind: /^ac/i.test(key) ? "tempAc" : /^dc/i.test(key) ? "tempDc" : /batt|bms/i.test(key) ? "tempBattery" : "other" });
    } else if (unit === "Hz" || (unit === "V" && /grid|ac|phase|l\d|ua|ub|uc/i.test(key))) {
      // One reading per meaning: Deye reports the phase voltages twice
      // (ACVoltageRUA and GridVoltageL1 are both L1).
      const meaning = gridReadingMeaning(key, unit);
      if (!device.grid.some((r) => r.id === meaning.id)) device.grid.push({ ...reading, ...meaning });
    }
    bySerial.set(serial, device);
  }
  for (const device of bySerial.values()) {
    device.grid = withoutEchoes(device.grid.sort((a, b) => a.order - b.order)).slice(0, 7);
    device.battery = withoutEchoes(device.battery);
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

// The installation sensors (SYSTEM_METRICS): from `entities:`, else the
// first DeyeCloud inverter's device sensors.
function systemEntities(hass, resolved, config) {
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
  return found;
}

function systemData(hass, resolved, config, baseline) {
  const found = systemEntities(hass, resolved, config);
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
  // Several inverters: each on its own, and their total as the inverter load.
  data.inverters = inverterEntries(hass, config).map((item) => {
    const power = item.power ? wattsOf(item.power.stateObj) : item.solar ? wattsOf(item.solar.stateObj) : null;
    const rating = item.rated ? item.rated * 1000 : null;
    return {
      name: item.name,
      power,
      solar: item.solar ? wattsOf(item.solar.stateObj) : null,
      // Lifetime counters (energy_sensors: total): today from the statistics.
      today: !item.energy ? null : config.energy_sensors === "total" ? todayOfCounter(baseline, item.energy) : kwhOf(item.energy.stateObj),
      rated: rating,
      share: rating && isNum(power) ? clamp((Math.abs(power) / rating) * 100, 0, 100) : null,
      entityId: (item.power || item.solar || item.energy).entityId,
    };
  });
  // Several inverters: the load of them all, unless inverter_power is set.
  if ((!data.inverter || (data.inverters.length > 1 && !config.entities?.inverter_power)) && data.inverters.some((item) => isNum(item.power))) {
    const power = data.inverters.reduce((sum, item) => sum + (isNum(item.power) ? item.power : 0), 0);
    const total = data.inverters.every((item) => item.rated) ? data.inverters.reduce((sum, item) => sum + item.rated, 0)
      : positiveNumber(config.inverter_power_rating) ? positiveNumber(config.inverter_power_rating) * 1000 : data.inverter?.rated ?? null;
    data.inverter = { power, rated: total, share: total ? clamp((Math.abs(power) / total) * 100, 0, 100) : null, entityId: data.inverters[0].entityId };
  }
  return data.phases || data.inverter || data.battery.length || data.generator || data.inverters.length ? data : null;
}

// `custom_sections:` sections of the user's own: a title and any sensors,
// shown as tiles. An entity is a string or {entity, name, max, unit,
// decimals}; `max` draws a bar. Ids custom_1, custom_2… for `sections:`.
function customSections(hass, config) {
  if (!Array.isArray(config.custom_sections)) return [];
  const states = hass?.states || {};
  return config.custom_sections.map((section, i) => {
    if (!section || typeof section !== "object") return null;
    const items = (Array.isArray(section.entities) ? section.entities : []).map((item) => {
      const def = typeof item === "string" ? { entity: item } : item && typeof item === "object" ? item : null;
      if (!def || typeof def.entity !== "string" || !def.entity) return null;
      const stateObj = states[def.entity];
      const raw = stateObj?.state;
      const available = raw !== undefined && raw !== "unavailable" && raw !== "unknown";
      const numeric = available && raw.trim() !== "" && Number.isFinite(Number(raw));
      const value = numeric ? Number(raw) : null;
      const max = Number.parseFloat(def.max);
      return {
        entityId: def.entity,
        name: def.name ? String(def.name) : stateObj?.attributes?.friendly_name || def.entity,
        stateObj,
        state: available ? raw : null,
        value,
        unit: def.unit !== undefined ? String(def.unit) : stateObj?.attributes?.unit_of_measurement || "",
        decimals: Number.isInteger(def.decimals) && def.decimals >= 0 && def.decimals <= 4 ? def.decimals : null,
        share: isNum(value) && max > 0 ? clamp((Math.abs(value) / max) * 100, 0, 100) : null,
      };
    }).filter(Boolean);
    return { id: `custom_${i + 1}`, title: section.title ? String(section.title) : null, items };
  }).filter((section) => section && section.items.length);
}

// A custom tile's value: power and energy as everywhere in the card, other
// numbers with their unit, text states as they are.
function customValue(item, locale) {
  if (item.state === null) return "—";
  if (!isNum(item.value)) return item.state;
  const unit = item.unit.trim();
  if (item.decimals === null && unit.toLowerCase() in POWER_SCALE) return formatPower(item.value * POWER_SCALE[unit.toLowerCase()], locale);
  if (item.decimals === null && unit.toLowerCase() in ENERGY_SCALE) return formatEnergy(item.value * ENERGY_SCALE[unit.toLowerCase()], locale);
  // As many decimals as the sensor reports (49.98 Hz, 231.8 V), at most 2.
  const reported = (/\.(\d+)/.exec(item.state.trim())?.[1].length) || 0;
  const digits = item.decimals ?? Math.min(2, reported);
  const number = formatNumber(item.value, locale, digits);
  return unit ? `${number}${unit === "%" ? "" : "\u00a0"}${unit}` : number;
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

// PV forecast: today and the next days as bars, today's with what is
// already produced.
function pvForecastHtml(m) {
  const f = m.pvForecast;
  if (!f || !m.config.showSolar) return "";
  const { t, locale } = m;
  const max = Math.max(0.1, ...f.days.map((d) => Math.max(d.value, isNum(d.high) ? d.high : 0)), isNum(f.produced) ? f.produced : 0);
  const pct = (v) => clamp((v / max) * 100, 0, 100).toFixed(1);
  const hint = pvForecastNote(m);
  return `
    <section class="sfc-section sfc-pvf">
      <div class="sfc-head">
        <div><span class="sfc-kicker">${MINI_ICONS.sun}</span><h3>${escapeHtml(t.pvForecastTitle)}</h3></div>
        ${hint ? `<span class="sfc-hint">${escapeHtml(hint)}</span>` : ""}
      </div>
      <div class="sfc-pvf-days">
        ${f.days.map((d) => {
          const done = d.today && isNum(f.produced) ? clamp((f.produced / max) * 100, 0, 100) : 0;
          const ranged = isNum(d.low) && isNum(d.high);
          const range = ranged ? fill(t.pvRange, { low: formatEnergy(d.low, locale), high: formatEnergy(d.high, locale) }) : "";
          const title = d.today && isNum(f.produced) ? fill(t.pvProducedOf, { done: formatEnergy(f.produced, locale), total: formatEnergy(d.value, locale) }) : formatEnergy(d.value, locale);
          return `
          <button class="sfc-pvf-day ${d.today ? "today" : ""}" ${d.entityId ? `data-entity="${escapeHtml(d.entityId)}"` : ""}
            title="${escapeHtml(range ? `${title} · ${range}` : title)}">
            <small>${escapeHtml(d.today ? t.periodToday : d.date.toLocaleDateString(locale, { weekday: "short", day: "numeric" }))}</small>
            <span class="sfc-pvf-bar"><i style="width:${pct(d.value)}%"></i>${done ? `<b style="width:${done.toFixed(1)}%"></b>` : ""}${ranged ? `<u style="left:${pct(d.low)}%;width:${(pct(d.high) - pct(d.low)).toFixed(1)}%"></u>` : ""}</span>
            <strong>${escapeHtml(formatEnergy(d.value, locale))}</strong>
          </button>`;
        }).join("")}
      </div>
      ${isNum(f.produced) && isNum(f.total) ? `<p class="sfc-panels-note">${escapeHtml(fill(t.pvProducedOf, { done: formatEnergy(f.produced, locale), total: formatEnergy(f.total, locale) }))}</p>` : ""}
    </section>`;
}

// Energy prices by the hour: today (and tomorrow once published) as bars
// from green (cheap) to red (dear), the hour now marked, the hours gone
// dimmed, negative prices below the line.
function pricesHtml(m) {
  const c = m.priceChart;
  if (!c) return "";
  const { t, locale } = m;
  const unit = `${m.config.currency ?? t.currency}/kWh`;
  const money = (v) => `${formatNumber(v, locale, 2)} ${unit}`;
  const values = c.hours.map((h) => h.price);
  const low = Math.min(...values);
  const high = Math.max(...values);
  const top = Math.max(high, 0);
  const bottom = Math.min(low, 0);
  const range = top - bottom || 1;
  const zero = (-bottom / range) * 100;
  const first = startOfDay(new Date(c.hours[0].at)).getTime();
  const days = new Set(c.hours.map((h) => startOfDay(new Date(h.at)).getTime()));
  const n = c.hours.length;
  const labels = c.hours.map((h, i) => {
    const hour = new Date(h.at).getHours();
    if (hour % 6) return "";
    const day = startOfDay(new Date(h.at)).getTime() !== first && hour === 0 ? t.tomorrow : formatClock(new Date(h.at), locale);
    return axisLabel(i / n, day, hour % 12 ? "minor" : "");
  }).join("");
  const at = (h) => formatClock(new Date(h.at), locale);
  return `
    <section class="sfc-section sfc-prices" data-entity="${escapeHtml(c.entityId)}">
      <div class="sfc-head">
        <div><span class="sfc-kicker">${escapeHtml(unit)}</span><h3>${escapeHtml(t.pricesTitle)}</h3></div>
        ${isNum(c.current) ? `<span class="sfc-hint">${escapeHtml(fill(t.priceNow, { price: money(c.current) }))}</span>` : ""}
      </div>
      <div class="sfc-prices-chart" style="--zero:${zero.toFixed(1)}%">
        ${c.hours.map((h, i) => {
          const share = high > low ? ((h.price - low) / (high - low)) * 100 : 50;
          const newDay = i > 0 && days.size > 1 && new Date(h.at).getHours() === 0;
          const cls = [h.at < c.nowAt && "past", h.at === c.nowAt && "now", h.price < 0 && "neg", newDay && "day"].filter(Boolean).join(" ");
          // Green (cheap) through yellow to red (dear).
          return `<i class="${cls}" style="--h:${((Math.abs(h.price) / range) * 100).toFixed(1)}%;--c:hsl(${(120 - share * 1.2).toFixed(0)} 68% 47%)" title="${escapeHtml(`${at(h)} · ${money(h.price)}`)}"><b></b></i>`;
        }).join("")}
      </div>
      <div class="sfc-prices-axis">${labels}</div>
      ${c.cheapest && c.priciest ? `<p class="sfc-panels-note">${escapeHtml(fill(t.pricesAhead, { cheap: at(c.cheapest), cheapPrice: money(c.cheapest.price), dear: at(c.priciest), dearPrice: money(c.priciest.price) }))}</p>` : ""}
    </section>`;
}

function readingLabel(key) {
  return key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/_/g, " ").replace(/\s+/g, " ").trim();
}

// Labels for inverter readings recognised by their meaning.
const DETAIL_LABELS = { tempAc: "detailTempAc", tempDc: "detailTempDc", tempBattery: "detailTempBattery", batVoltage: "batteryVoltage", batCurrent: "batteryCurrent", batPower: "detailBatPower" };

function inverterHtml(m) {
  if (!m.inverterOpen) return "";
  const { t, locale } = m;
  const devices = m.inverter || [];
  const reading = (r) => `
    <button class="sfc-reading" data-entity="${escapeHtml(r.entityId)}">
      <small>${escapeHtml(r.kind === "voltage" ? fill(t.detailVoltage, { n: `L${r.phase}` }) : r.kind === "loadVoltage" ? fill(t.detailLoadVoltage, { n: `L${r.phase}` })
        : r.kind === "frequency" ? t.detailFrequency
          : DETAIL_LABELS[r.kind] ? `${t[DETAIL_LABELS[r.kind]]}${r.number ? ` ${r.number}` : ""}` : readingLabel(r.key))}</small>
      <b>${escapeHtml(r.text ?? `${formatNumber(r.value, locale, Math.abs(r.value) < 100 ? 1 : 0)} ${r.unit}`.trim())}</b>
    </button>`;
  const group = (title, items) => items.length ? `
    <div class="sfc-group"><h4>${escapeHtml(title)}</h4><div class="sfc-readings">${items.map(reading).join("")}</div></div>` : "";
  const content = devices.length ? devices.map((device) => `
    ${devices.length > 1 && device.serial ? `<h4 class="sfc-serial">${escapeHtml(device.serial)}</h4>` : ""}
    ${device.strings.size ? `
      <div class="sfc-group">
        <h4>${escapeHtml(t.pvStrings)}</h4>
        <div class="sfc-strings ${stringsClass(shownStrings(device, m.config).length)}">
          ${shownStrings(device, m.config).map(([index, s]) => `
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

// The PV strings worth showing: as many as `panels_per_string` lists, else
// the ones in use while any string produces (inverters report unused inputs
// as 0 V / 0 A; at night all read zero and all are shown).
function shownStrings(device, config) {
  const strings = [...device.strings.entries()].sort((a, b) => a[0] - b[0]);
  if (Array.isArray(config.panels_per_string) && config.panels_per_string.length) return strings.slice(0, config.panels_per_string.length);
  const used = ([, s]) => (s.V?.value ?? 0) > 5 || (s.A?.value ?? 0) > 0.05 || (s.W?.value ?? 0) > ACTIVE_W;
  return strings.some(used) ? strings.filter(used) : strings;
}

// The number of string tiles, for the column counts that keep the rows even
// (no lone tile in the last row): s2, s3, s4, or s5 for five and more.
function stringsClass(count) {
  return `s${Math.min(Math.max(count, 1), 5)}`;
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
  // Without optimizers every panel of a string would show the same estimate:
  // one tile per string instead.
  if (data.estimate) {
    return `
    <section class="sfc-section sfc-panels" id="sfc-panels">
      <div class="sfc-head">
        <div><span class="sfc-kicker">${data.panels.length}×</span><h3>${escapeHtml(t.panelsTitle)}</h3></div>
        <span class="sfc-hint">${escapeHtml(fill(t.panelsEstimateHint, { energy: formatEnergy(data.average, locale) }))}</span>
      </div>
      <div class="sfc-strings sfc-panel-strings ${stringsClass(data.strings.length)}">
        ${data.strings.map((string, i) => {
          const each = data.stringPower[i];
          return `
          <button class="sfc-string" data-entity="${escapeHtml(string[0]?.entityId)}">
            <span>${escapeHtml(fill(t.stringModules, { n: i + 1, count: string.length }))}</span>
            <b>${escapeHtml(isNum(each) ? formatPower(each * string.length, locale) : "—")}</b>
            <small>${escapeHtml(fill(t.panelEachToday, { power: isNum(each) ? formatPower(each, locale) : "—", kwh: formatEnergy(data.average, locale) }))}</small>
          </button>`;
        }).join("")}
      </div>
      <p class="sfc-panels-note estimate">${escapeHtml(note)}</p>
    </section>`;
  }
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
  // Several inverters: each with its output, load bar, solar power and
  // energy today.
  const inverters = data.inverters?.length ? `
    <div class="sfc-phases sfc-bank" style="--n:${Math.min(data.inverters.length, 3)}">
      ${data.inverters.map((inv) => `
        <button class="sfc-phase sfc-inv" ${attr(inv.entityId)}>
          <small>${escapeHtml(inv.name)}</small>
          <strong>${escapeHtml(formatPower(inv.power, locale))}</strong>
          ${isNum(inv.share) ? `<i style="--p:${inv.share.toFixed(0)}%"></i>` : ""}
          <span>${escapeHtml([
            isNum(inv.share) && formatPercent(inv.share, locale),
            isNum(inv.solar) && inv.solar !== inv.power && `PV ${formatPower(inv.solar, locale)}`,
            isNum(inv.today) && fill(t.invToday, { kwh: formatEnergy(inv.today, locale) }),
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
      ${inverters}
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
  pv_forecast: pvForecastHtml,
  prices: pricesHtml,
  virtual_storage: virtualStorageHtml,
  system: systemHtml,
  energy: energySectionHtml,
  insights: insightsHtml,
  comparison: comparisonHtml,
  panels: panelsHtml,
};
const SECTION_IDS = ["flow", "today", "sources", ...Object.keys(SECTION_HTML)];
const SECTION_ORDER = ["inverter", "forecast", "pv_forecast", "prices", "virtual_storage", "system", "energy", "insights", "comparison", "panels"];
const SECTION_ORDER_WIDE = ["energy", "inverter", "forecast", "pv_forecast", "prices", "virtual_storage", "insights", "comparison", "system", "panels"];

// custom_1, custom_2… for the sections of `custom_sections:`.
function customIds(config) {
  return Array.isArray(config.custom_sections) ? config.custom_sections.map((_, i) => `custom_${i + 1}`) : [];
}

// The listed sections in order, or null without the option.
function sectionList(config) {
  if (!Array.isArray(config.sections)) return null;
  const known = [...SECTION_IDS, ...customIds(config)];
  return [...new Set(config.sections.map((id) => String(id).trim().toLowerCase()).filter((id) => known.includes(id)))];
}

function sectionShown(m, id) {
  return !m.sections || m.sections.includes(id);
}

// Without `sections:` the custom sections follow the theme's own ones.
function sectionOrder(m, defaults) {
  return m.sections ? m.sections.filter((id) => SECTION_HTML[id] || isCustomId(id)) : [...defaults, ...(m.custom || []).map((c) => c.id)];
}

function isCustomId(id) {
  return /^custom_\d+$/.test(id);
}

// What a collapsed section still shows: its title and one key value.
function foldSummary(m, id) {
  const { t, locale } = m;
  if (id === "energy") {
    const solar = m.config.showSolar && isNum(m.totals.solar);
    return [periodLabels(t)[m.period][1], solar ? t.pvProduction : t.consumption, formatEnergy(solar ? m.totals.solar : m.totals.load, locale)];
  }
  if (id === "forecast") return [t.batteryForecast, t.battery, formatPercent(m.forecast.soc, locale)];
  if (id === "pv_forecast") return [t.pvForecastTitle, "", pvForecastNote(m)];
  if (id === "prices") return [t.pricesTitle, "", isNum(m.priceChart?.current) ? fill(t.priceNow, { price: `${formatNumber(m.priceChart.current, locale, 2)} ${m.config.currency ?? t.currency}/kWh` }) : ""];
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
  const custom = m.custom?.find((c) => c.id === id);
  if (custom) return [custom.title || t.customTitle, custom.items[0].name, customValue(custom.items[0], locale)];
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
  if (isCustomId(id)) return foldable(m, id, customSectionHtml(m, id));
  return SECTION_HTML[id] ? foldable(m, id, SECTION_HTML[id](m)) : "";
}

// A custom section: its sensors as tiles, as many per row as fit evenly.
function customSectionHtml(m, id) {
  const c = m.custom?.find((section) => section.id === id);
  if (!c) return "";
  const { t, locale } = m;
  const count = c.items.length;
  const columns = count === 4 ? 2 : Math.min(count, 3);
  return `
    <section class="sfc-section sfc-custom">
      <div class="sfc-head"><div><h3>${escapeHtml(c.title || t.customTitle)}</h3></div></div>
      <div class="sfc-phases" style="--n:${columns}">
        ${c.items.map((item) => `
        <button class="sfc-phase" ${item.entityId ? `data-entity="${escapeHtml(item.entityId)}"` : ""} title="${escapeHtml(item.entityId)}">
          <small>${escapeHtml(item.name)}</small>
          <strong>${escapeHtml(customValue(item, locale))}</strong>
          ${isNum(item.share) ? `<i style="--p:${item.share.toFixed(0)}%"></i>` : ""}
        </button>`).join("")}
      </div>
    </section>`;
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
  if (chart.data?.kind === "power" && hasPowerSeries(chart.data)) {
    body = powerChartHtml(chart.data, m.t, m.locale, m.hiddenSeries);
    if (chart.data.fallback) body += `<p class="sfc-chart-note">${escapeHtml(fill(m.t.chartFallback, { sensors: sensorList(chart.missing || []) }))}</p>`;
  } else if (chart.data?.kind === "energy" && chart.data.buckets?.some((b) => b.solar || b.load)) {
    body = energyChartHtml(chart.data, m.t, m.locale, m.hiddenSeries);
  } else {
    const message = chart.loading ? m.t.chartLoading : chart.error ? m.t.chartError
      : chart.missing?.length ? fill(m.t.chartNoHistory, { sensors: sensorList(chart.missing) }) : m.t.chartEmpty;
    body = `<div class="sfc-chart-empty">${escapeHtml(message)}</div>`;
  }
  return `<div class="sfc-chart ${chart.loading ? "loading" : ""}">${body}</div>`;
}

// Legend entries are buttons: a click hides or shows that series.
// An axis label slides along its tick by as much of its width as it is far
// along the axis: the first starts at its tick, the last ends at it, so none
// runs past the chart however narrow the card.
function axisLabel(pos, text, cls = "") {
  const pct = (pos * 100).toFixed(2);
  return `<span class="${cls}" style="left:${pct}%;transform:translateX(-${pct}%)">${escapeHtml(text)}</span>`;
}

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
    forecast: show("forecast", source.forecast),
  };
  const W = 1000;
  const H = 300;
  const signed = [data.battery, data.grid].filter(Boolean).flat().filter((v) => v !== null);
  const positive = [data.solar, data.load, data.forecast].filter(Boolean).flat().filter((v) => v !== null);
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
    ["forecast", t.legendForecast, source.forecast],
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
      ${data.forecast ? `<path class="sfc-line forecast" d="${linePath(data.forecast, x, y)}" />` : ""}
    </svg>`;
  return chartFrame(
    legend,
    svg,
    ticks.map((v) => `<span class="sfc-ylabel" style="top:${((y(v) / H) * 100).toFixed(2)}%">${escapeHtml(formatPower(v, locale))}</span>`).join(""),
    xLabels.map(([pos, label]) => axisLabel(pos, label)).join(""),
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
      // Under the middle of its bars.
      return text ? `<span style="left:${(((i + 0.5) / buckets.length) * 100).toFixed(2)}%;transform:translateX(-50%)">${escapeHtml(text)}</span>` : "";
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
      ["forecast", t.legendForecast, data.forecast],
    ].filter(([kind, , series]) => series && !hidden.has(kind) && isNum(series[index]));
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
      .map((name) => [name, live[name]])
      .filter(([, entry]) => entry?.entityId)
  );
  const nowMs = Date.now();
  const response = await hass.callWS({
    type: "history/history_during_period",
    start_time: spec.start.toISOString(),
    end_time: new Date(nowMs).toISOString(),
    entity_ids: [...new Set(Object.values(sources).flatMap(entityIds))],
    minimal_response: true,
    no_attributes: true,
    significant_changes_only: false,
  });
  const series = {};
  const missing = new Set();
  for (const [name, entry] of Object.entries(sources)) {
    // Each sensor in W, whatever unit it reports (% stays as is); several
    // sensors behind one reading (inverters:) are added up.
    const parts = (entry.parts || [entry]).map((part) => {
      const scale = unitScale(part.stateObj, POWER_SCALE);
      const values = bucketHistory(historyPoints(response?.[part.entityId]).map(([t, v]) => [t, v * scale]), spec.start.getTime(), spec.count, spec.bucketMs, nowMs);
      // Power sensors without any recorded value in the period (e.g.
      // excluded from the recorder), named when the chart has to explain
      // itself.
      if (name !== "soc" && !values.some((v) => v !== null)) missing.add(part.entityId);
      return values;
    });
    series[name] = parts.length === 1 ? parts[0] : parts[0].map((_, i) => {
      const present = parts.map((p) => p[i]).filter((v) => v !== null);
      return present.length ? present.reduce((a, b) => a + b, 0) : null;
    });
  }
  return { series, missing: [...missing] };
}

// Hourly energy statistics since `start` (kWh per hour), for drawing the
// power chart when the power sensors have no history.
async function loadHourlyEnergy(hass, energy, start) {
  const sources = energySources(energy);
  const response = await hass.callWS({
    type: "recorder/statistics_during_period",
    start_time: start.toISOString(),
    end_time: new Date().toISOString(),
    statistic_ids: [...new Set(Object.values(sources).flat())],
    period: "hour",
    types: ["change"],
    units: { energy: "kWh" },
  });
  const out = {};
  for (const [name, ids] of Object.entries(sources)) {
    const hours = new Map();
    for (const row of statRows(response, ids)) hours.set(statStart(row.start), Math.max(0, Number(row.change) || 0));
    if (hours.size) out[name] = hours;
  }
  return out;
}

// The hourly energy as the average power of each hour, on the chart's
// buckets: kWh in one hour = average kW.
function hourlyPowerSeries(hourly, spec) {
  const series = {};
  for (const [name, hours] of Object.entries(hourly)) {
    series[name] = Array.from({ length: spec.count }, (_, i) => {
      const at = new Date(spec.start.getTime() + i * spec.bucketMs);
      at.setMinutes(0, 0, 0);
      const kwh = hours.get(at.getTime());
      return isNum(kwh) ? kwh * 1000 : null;
    });
  }
  return series;
}

function hasPowerSeries(data) {
  return ["solar", "load", "battery", "grid"].some((k) => data?.[k]?.some((v) => v !== null));
}

// "sensor.a, sensor.b and 2 more" for the chart's notes.
function sensorList(ids) {
  return ids.length > 3 ? `${ids.slice(0, 3).join(", ")} (+${ids.length - 3})` : ids.join(", ");
}


// Each theme renders the whole card body: its own main view plus the shared
// sections (styled by the theme's CSS).

function entityAttr(entityId) {
  return entityId ? `data-entity="${escapeHtml(entityId)}"` : "";
}

// A title built around the card's name ("Power · {name}"): the words around
// the name are marked, so a narrow card can show the name alone.
function titleWithExtras(template, name) {
  const [before, after = ""] = fill(template, { name: "\u0001" }).split("\u0001");
  const extra = (text) => (text ? `<span class="extra">${escapeHtml(text)}</span>` : "");
  return `${extra(before)}${escapeHtml(name)}${extra(after)}`;
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
  const showChips = sectionShown(m, "today");
  const showShare = Boolean(shares) && sectionShown(m, "sources");
  return `
    ${sectionShown(m, "flow") ? `<div class="dio-scene" style="--sky-a:${sky.sky[0]};--sky-b:${sky.sky[1]}">
      <svg viewBox="0 0 520 360" aria-hidden="true">${svg}</svg>
      <div class="dio-title"><h1>${escapeHtml(m.name)}</h1>${liveBadge(m)}</div>
      <div class="dio-clock">${escapeHtml(clockText(m))}${isNum(m.weather?.temperature) ? ` <button class="dio-temp" ${entityAttr(m.weather.entityId)}>${escapeHtml(`${formatNumber(m.weather.temperature, locale, 0)}${m.weather.unit}`)}</button>` : ""}</div>
      ${m.config.showSolar ? pill(288, 78, "pv", formatPower(live.solar, locale), t.fromRoof, m.ids.live.solar) : ""}
      ${m.config.showBattery ? pill(22, 208, "battery", formatPercent(live.soc, locale), batteryNote, batteryEntityId(m)) : ""}
      ${pill(378, 240, "grid", formatPower(gridValue, locale), `${live.exportActive ? "↑ " : live.importActive ? "↓ " : ""}${t.grid.toLowerCase()}`, gridEntityId(m))}
      ${pill(120, 296, "load", formatPower(live.load, locale), t.inHome, m.ids.live.load)}
    </div>` : ""}
    ${showChips || showShare ? `<div class="dio-bottom">
      ${showChips ? `<div class="dio-chips">
        ${m.config.showSolar
          ? `<button class="dio-chip sun" ${entityAttr(m.ids.energy.solar)}><small>${escapeHtml(t.chipRoof)}</small><b>${escapeHtml(formatEnergy(today.solar, locale))}</b>${pvForecastNote(m) ? `<em>${escapeHtml(pvForecastNote(m))}</em>` : ""}</button>`
          : `<button class="dio-chip grid" ${entityAttr(m.ids.energy.gridImport)}><small>${escapeHtml(t.gridImport)}</small><b>${escapeHtml(formatEnergy(today.gridImport, locale))}</b></button>`}
        ${m.config.showBattery
          ? `<button class="dio-chip bat" ${entityAttr(batteryEntityId(m))}><small>${escapeHtml(when.label)}</small><b>${escapeHtml(when.value)}</b></button>`
          : `<button class="dio-chip grid" ${entityAttr(m.ids.energy.gridExport)}><small>${escapeHtml(t.gridExport)}</small><b>${escapeHtml(formatEnergy(today.gridExport, locale))}</b></button>`}
        <button class="dio-chip home" ${entityAttr(m.ids.energy.load)}><small>${escapeHtml(t.chipHome)}</small><b>${escapeHtml(formatEnergy(today.load, locale))}</b></button>
      </div>` : ""}
      ${showShare ? `
        <div class="dio-share">
          <header>${escapeHtml(t.whereFrom)}<span>${escapeHtml(t.autarky.toLowerCase())} ${escapeHtml(formatPercent(ownShare, locale))}</span></header>
          <div class="dio-track">${[["pv", t.solar], ["battery", t.battery], ["vstore", t.vsShort], ["grid", t.grid]]
            .map(([cls, name], i) => `<div class="${cls}" style="width:${shares[i]}%" title="${escapeHtml(`${name} ${formatPercent(shares[i], locale)}`)}"></div>`).join("")}</div>
          ${m.virtualStorage ? `<div class="dio-legend">${[["pv", t.solar], ["battery", t.battery], ["vstore", t.vsShort], ["grid", t.grid]]
            .map(([cls, name], i) => (shares[i] >= 0.5 ? `<span class="${cls}">${escapeHtml(name)} ${escapeHtml(formatPercent(shares[i], locale))}</span>` : "")).join("")}</div>` : ""}
        </div>` : ""}
    </div>` : ""}
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
      ${m.config.showSolar ? ring("pv", 238, 58, t.legendPv, powerParts(live.solar, locale), "", pvForecastNote(m) || (live.solarActive ? "" : t.idle), m.ids.live.solar) : ""}
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
      <div class="lc-topbar"><h1>${titleWithExtras(t.lcarsTitle, m.name)}</h1><i class="b1"></i><i class="b2"></i><i class="b3"></i></div>
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
      ${m.config.showSolar ? label("left:50%;top:3%", "", formatPower(live.solar, locale), pvForecastNote(m) || t.sun, m.ids.live.solar, "pv") : ""}
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
      ${m.config.showSolar ? box("pv", 92, 72, "SOL-01", t.solar, formatPower(live.solar, locale), pvForecastNote(m) || (live.solarActive ? "" : t.idle), entityAttr(m.ids.live.solar)) : ""}
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
      ${m.config.showSolar ? node("pv", 240, 22, t.sun, formatPower(live.solar, locale), pvForecastNote(m), entityAttr(m.ids.live.solar)) : ""}
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
      ${m.config.showSolar ? readout("pv", 62, 118, t.solar, formatPower(live.solar, locale), pvForecastNote(m), entityAttr(m.ids.live.solar)) : ""}
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
    config.showSolar && ["pv", t.solar, live.solar, live.solarActive, pvForecastNote(m) || (pvCapacity ? fill(t.gateOfCapacity, { pct: formatNumber((live.solar / (pvCapacity * 1000)) * 100, locale, 0), size: `${formatNumber(pvCapacity, locale, 1)} kWp` }) : ""), m.ids.live.solar],
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
      <div class="gt-title"><h1>${escapeHtml(m.name)}<span class="extra"> · ${escapeHtml(t.gateTitle)}</span></h1><span>${escapeHtml(t.gateSub)} · ${escapeHtml(String(m.station || "—"))}</span></div>
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
      <div class="gt-energy">${sectionShown(m, "energy") ? sectionHtml(m, "energy") : ""}</div>
      <div class="sfc-sections">${standardSections(m, ["inverter", "pv_forecast", "prices", "virtual_storage", "insights", "comparison", "system", "panels"], ["energy"])}</div>
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
        ${config.showSolar ? node("pv", 260, 60, t.sun, formatPower(live.solar, locale), pvForecastNote(m), entityAttr(m.ids.live.solar)) : ""}
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
  /* One column never wider than the card: a section with a word that cannot
     shrink (a wide theme font, a long value) wraps instead of pushing the
     column, and with it the right margin, past the card's edge. */
  .sfc-sections { display: grid; grid-template-columns: minmax(0, 1fr); gap: 12px; padding: 0 16px 16px; position: relative; }
  .sfc-section { min-width: 0; }
  .sfc-section {
    padding: 14px;
    border-radius: var(--sfc-section-radius, 16px);
    background: var(--sfc-surface);
    border: 1px solid var(--sfc-border);
  }
  /* sections: without flow – the card shows only its sections, as one card:
     the sections lose their own box and are separated by a line. */
  ha-card.sfc.parts .sfc-sections { padding: var(--sfc-parts-pad, 16px); gap: 14px; }
  ha-card.sfc.parts .sfc-sections > .sfc-section, ha-card.sfc.parts .sfc-sections > .sfc-wide-rest > .sfc-section {
    padding: 0; border: 0; border-radius: 0; background: none; box-shadow: none; clip-path: none; backdrop-filter: none; }
  ha-card.sfc.parts .sfc-sections > .sfc-section + .sfc-section { padding-top: 14px; border-top: 1px solid var(--sfc-border); }
  .sfc-head { display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 12px; }
  .sfc-head > div { display: flex; align-items: center; gap: 8px; min-width: 0; }
  .sfc-head h3 { margin: 0; min-width: 0; overflow-wrap: anywhere; font-size: 16px; font-family: var(--sfc-heading-font, inherit); font-weight: var(--sfc-heading-weight, 700); }
  .sfc-kicker {
    display: inline-grid; place-items: center; min-width: 34px; height: 24px; padding: 0 8px; box-sizing: border-box;
    border-radius: 999px; background: var(--sfc-accent-soft); color: var(--sfc-accent);
    font-size: 10px; font-weight: 800; letter-spacing: .05em;
  }
  .sfc-kicker svg { width: 14px; height: 14px; fill: none; stroke: currentColor; stroke-width: 2; }
  .sfc-hint { min-width: 0; color: var(--sfc-muted); font-size: 11px; text-align: right; }
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
  .sfc-pvf-days { display: grid; gap: 6px; }
  .sfc-pvf-day { display: grid; grid-template-columns: 4.6em minmax(0, 1fr) auto; align-items: center; gap: 10px; padding: 2px 0; border: 0; background: none; text-align: left; }
  .sfc-pvf-day small { color: var(--sfc-muted); font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sfc-pvf-day.today small { color: var(--sfc-text); font-weight: 700; }
  .sfc-pvf-day strong { min-width: 4.8em; text-align: right; font-size: 13px; font-family: var(--sfc-num-font, inherit); }
  .sfc-pvf-bar { position: relative; height: 10px; border-radius: 999px; background: var(--sfc-track); overflow: hidden; }
  .sfc-pvf-bar i { position: absolute; inset: 0 auto 0 0; border-radius: inherit; background: color-mix(in srgb, var(--sfc-pv) 45%, transparent); }
  .sfc-pvf-bar b { position: absolute; inset: 0 auto 0 0; border-radius: inherit; background: var(--sfc-pv); }
  /* Solcast's 10–90% range: a bracket over the bar. */
  .sfc-pvf-bar u { position: absolute; top: 2px; bottom: 2px; box-sizing: border-box; min-width: 3px; border: 1.5px solid color-mix(in srgb, var(--sfc-text) 55%, transparent);
    border-width: 0 1.5px; background: color-mix(in srgb, var(--sfc-text) 10%, transparent); }
  .sfc-prices-chart { position: relative; display: flex; align-items: stretch; gap: 2px; height: 96px; margin-top: 2px; }
  .sfc-prices-chart::after { content: ""; position: absolute; left: 0; right: 0; bottom: var(--zero); border-top: 1px solid var(--sfc-border); pointer-events: none; }
  .sfc-prices-chart i { position: relative; flex: 1; min-width: 0; }
  .sfc-prices-chart i b { position: absolute; left: 0; right: 0; bottom: var(--zero); height: max(var(--h), 2px); border-radius: 3px 3px 0 0;
    background: var(--c); }
  .sfc-prices-chart i.neg b { bottom: auto; top: calc(100% - var(--zero)); border-radius: 0 0 3px 3px; background: var(--sfc-grid); }
  .sfc-prices-chart i.past b { opacity: .38; }
  .sfc-prices-chart i.now b { box-shadow: 0 0 0 2px var(--sfc-text); }
  .sfc-prices-chart i.day { margin-left: 5px; }
  .sfc-prices-chart i.day::before { content: ""; position: absolute; left: -4px; top: 0; bottom: 0; border-left: 1px dashed var(--sfc-border); }
  .sfc-prices-axis { position: relative; height: 15px; margin-top: 3px; color: var(--sfc-muted); font-size: 10px; }
  .sfc-prices-axis span { position: absolute; top: 0; white-space: nowrap; }
  /* Narrow: the labels every 12 hours only. */
  .sfc-prices { container-type: inline-size; }
  @container (max-width: 440px) { .sfc-prices-axis span.minor { display: none; } }
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
  @container (max-width: 380px) { .sfc-forecast-stored { white-space: normal; text-align: right; } }
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
  /* String tiles: columns from the space and the number of strings, so the
     rows stay even. Inverter tiles need about 170 px, estimate tiles 250 px. */
  .sfc-inverter, .sfc-panels { container-type: inline-size; }
  @container (min-width: 340px) { .sfc-inverter .sfc-strings:is(.s2, .s4, .s5) { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  @container (min-width: 520px) { .sfc-inverter .sfc-strings:is(.s3, .s5) { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
  @container (min-width: 700px) { .sfc-inverter .sfc-strings.s4 { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
  @container (min-width: 500px) { .sfc-panel-strings:is(.s2, .s4, .s5) { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  @container (min-width: 760px) { .sfc-panel-strings:is(.s3, .s5) { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
  @container (min-width: 1000px) { .sfc-panel-strings.s4 { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
  .sfc-string, .sfc-reading { min-width: 0; border: 1px solid var(--sfc-border); border-radius: var(--sfc-tile-radius, 11px); background: var(--sfc-tile-bg); text-align: left; }
  .sfc-string { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 2px 10px; padding: 9px 12px; border-left: 3px solid var(--sfc-pv); }
  .sfc-string span { font-size: 12px; font-weight: 700; }
  .sfc-string b { grid-row: span 2; align-self: center; font-size: 15px; font-family: var(--sfc-num-font, inherit); }
  .sfc-string small { color: var(--sfc-muted); font-size: 11px; }
  /* Each tile as wide as its name (up to a limit), the row filled. */
  .sfc-readings { display: flex; flex-wrap: wrap; gap: 7px; }
  .sfc-reading { flex: 1 1 auto; min-width: 96px; max-width: 260px; padding: 8px 10px; }
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
  /* The PV forecast: a dashed line in the PV colour. */
  .sfc-line.forecast { stroke: color-mix(in srgb, var(--sfc-pv) 75%, var(--sfc-text)); stroke-dasharray: 7 5; stroke-width: 1.6; opacity: .9; }
  .forecast > i { color: var(--sfc-pv); height: 0; border-radius: 0; border-top: 2px dashed currentColor; background: none; }
  .sfc-area.battery { fill: color-mix(in srgb, var(--sfc-battery) 20%, transparent); }
  .sfc-bar.pv { fill: var(--sfc-pv); } .sfc-bar.load { fill: var(--sfc-load); } .sfc-bar.grid { fill: var(--sfc-grid); }
  .sfc-ylabel { position: absolute; right: calc(100% + 6px); transform: translateY(-50%); color: var(--sfc-muted); font-size: 10px; white-space: nowrap; }
  .sfc-xaxis { position: relative; height: 18px; margin: 4px 0 0 46px; }
  .sfc-xaxis span { position: absolute; top: 2px; color: var(--sfc-muted); font-size: 10px; white-space: nowrap; }
  .sfc-cursor { position: absolute; top: 0; bottom: 0; width: 1px; background: color-mix(in srgb, var(--sfc-text) 45%, transparent); pointer-events: none; }
  .sfc-tip { position: absolute; top: 4px; z-index: 5; min-width: 150px; margin-left: 10px; padding: 8px 10px; display: grid; gap: 4px;
    border: 1px solid var(--sfc-border); border-radius: 12px; background: var(--sfc-tip-bg, var(--sfc-surface)); color: var(--sfc-text);
    box-shadow: 0 10px 24px rgba(0, 0, 0, .25); font-size: 11px; pointer-events: none; }
  .sfc-tip[hidden], .sfc-cursor[hidden] { display: none; }
  .sfc-tip.flip { transform: translateX(calc(-100% - 20px)); }
  .sfc-tip span { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 6px; color: var(--sfc-muted); }
  .sfc-tip b { color: var(--sfc-text); }
  .sfc-chart-hint { margin: 2px 0 0; color: var(--sfc-muted); font-size: 10px; }
  .sfc-chart-note { margin: 6px 0 0; padding: 6px 9px; border-radius: 8px; background: var(--sfc-accent-soft, transparent); border: 1px dashed var(--sfc-border); color: var(--sfc-muted); font-size: 11px; line-height: 1.35; }
  .sfc-chart-empty { padding: 0 14px; text-align: center; }
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
    .sfc-wide > .sfc-sections > :is(.sfc-energy, .sfc-folded) { margin: 16px 16px 14px 4px; }
    .sfc-wide-rest { grid-column: 2; align-content: start; gap: 14px; padding: 0 16px 16px 4px; }
    .gt-layout.wide > .sfc-sections { display: block; columns: 320px; column-gap: 14px; }
    .gt-layout.wide > .sfc-sections > * { break-inside: avoid; margin-bottom: 14px; }
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
  .sfc-compare-table thead th:not(:first-child) { min-width: 4.4em; }
  .sfc-compare-scroll { overflow-x: auto; }

  /* Installation */
  .sfc-phases { display: grid; grid-template-columns: repeat(var(--n, 3), minmax(0, 1fr)); gap: 8px; container-type: inline-size; }
  .sfc-phase, .sfc-meter { position: relative; min-width: 0; display: grid; gap: 2px; padding: 9px 11px; text-align: left;
    border: 1px solid var(--sfc-border); border-radius: var(--sfc-tile-radius, 11px); background: var(--sfc-tile-bg); }
  .sfc-phase small, .sfc-meter small { color: var(--sfc-muted); font-size: 11px; font-weight: 700; line-height: 1.2; overflow: hidden;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
  .sfc-meter { align-content: start; }
  .sfc-phase strong { font-size: 16px; font-family: var(--sfc-num-font, inherit); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sfc-phase { grid-template-columns: minmax(0, 1fr); }
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
  .sfc-phase.sfc-inv i { --sfc-c: var(--sfc-pv); }
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

// Narrow cards, after the themes' own rules: a value is never cut short and
// a label wraps instead of ending in "…".
const FIT_CSS = `
  .sfc-tile small, .sfc-summary-item small, .sfc-phase small, .sfc-meter small { overflow-wrap: anywhere; }
  .sfc-insight small { white-space: normal; overflow-wrap: anywhere; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
  .dio-chip small, .dio-chip em, .gt-kv small { white-space: normal; overflow-wrap: anywhere; text-overflow: clip; }
  /* The phase tiles follow the width of their row, not of the card. */
  @container (max-width: 290px) { .sfc-phase { padding: 8px 6px; } .sfc-phase strong { font-size: 13px; letter-spacing: 0; } }
  @container (max-width: 225px) { .sfc-phase { padding: 7px 4px; } .sfc-phase strong { font-size: 11px; letter-spacing: -.02em; } .sfc-phase small { font-size: 10px; } }
  /* The forecast days share their columns, so the widest day name fits. */
  @supports (grid-template-columns: subgrid) {
    .sfc-pvf-days { grid-template-columns: max-content minmax(0, 1fr) auto; column-gap: 10px; }
    .sfc-pvf-day { grid-column: 1 / -1; grid-template-columns: subgrid; }
    .sfc-pvf-day small { overflow: visible; }
  }
  @container (max-width: 440px) {
    /* Period tabs as wide as their words. */
    .sfc-tabs { display: flex; }
    .sfc-tab { flex: 1 1 auto; min-width: 0; padding-inline: 3px; letter-spacing: 0; }
    .theme-paper .sfc-tab { flex: 0 1 auto; }
    /* The comparison fits without scrolling sideways. */
    .sfc-compare-table { font-size: 12px; }
    .sfc-compare-table th, .sfc-compare-table td { padding: 6px 2px; }
    .sfc-compare-table thead th { font-size: 9px; letter-spacing: 0; }
    .sfc-compare-table thead th:not(:first-child) { min-width: 0; }
    .sfc-compare-table tbody th { white-space: normal; overflow-wrap: break-word; }
    /* A hint that does not fit beside its title goes under it. */
    .sfc-head { flex-wrap: wrap; row-gap: 4px; }
    .sfc-compare-table tbody th i { margin-right: 4px; }
    .sfc-compare-table td.good, .sfc-compare-table td.bad { font-size: 10px; }
    /* Titles: the name alone. */
    .lc-topbar h1 .extra, .gt-title h1 .extra { display: none; }
    .lc-topbar .b2 { display: none; }
    .lc-topbar h1 { font-size: clamp(15px, 5cqw, 32px); }
    .exp-title h1 { font-size: clamp(13px, 4.4cqw, 23px); letter-spacing: .03em; }
    /* A long name takes a second line. */
    .lc-topbar h1, .gt-title h1, .exp-title h1 { white-space: normal; overflow-wrap: anywhere; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
    .gt-title h1 { letter-spacing: .08em; }
    .sfc-tile small, .sfc-summary-item small { -webkit-line-clamp: 3; }
  }
  @container (max-width: 370px) {
    .sfc-tab { font-size: 10px; padding-inline: 2px; }
    .theme-lcars .sfc-tab { letter-spacing: 0; font-size: 11px; }
    .sfc-tile { gap: 7px; padding-inline: 8px; }
    .sfc-tile-icon { flex-basis: 28px; width: 28px; height: 28px; }
    .theme-aurora .sfc-tile strong { font-size: 13px; }
    .sfc-compare-table { font-size: 11px; }
    .theme-lcars .sfc-compare-table { font-size: 10px; }
    .theme-lcars .sfc-compare-table tbody th { font-size: 9px; letter-spacing: 0; }
    .theme-lcars .sfc-compare-table td.good, .theme-lcars .sfc-compare-table td.bad { font-size: 9px; }
    .theme-lcars .sfc-compare-table th, .theme-lcars .sfc-compare-table td { padding-inline: 1px; }
  }
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
    .dio-chip em { display: block; margin-top: 1px; font-size: 11px; font-style: normal; font-weight: 700; color: #b07a12; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
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
      padding: 24px 22px 6px; --sfc-parts-pad: 0 0 16px;
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
    .lc-frame { display: grid; grid-template-columns: 22% minmax(0, 1fr); grid-template-rows: auto 1fr auto; column-gap: 6px; }
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
    .rx-scan > div { min-width: 0; }
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

class SolarFlowCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = { ...DEFAULT_CONFIG };
    this._hass = null;
    this._period = null;
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

  _periodEnergy(resolved, period, today) {
    if (period === "today") return { totals: today, buckets: null, spec: null };
    const ids = ENERGY_ORDER.map((name) => resolved.energy[name]?.entityId).filter(Boolean);
    if (!ids.length || typeof this._hass.callWS !== "function") return { totals: {}, error: true };
    const spec = statsSpec(period);
    const entry = this._fetch(`stats|${period}|${sourcesKey(resolved.energy)}|${spec.start.toDateString()}`, spec.ttl, () =>
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
  _virtualStorage(resolved, config, period, now, totals) {
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
      if (period !== "today" && period !== "all") {
        const start = statsSpec(period).start;
        net = hourlyNet(hourly(start), start.getTime(), current);
      }
    }
    const store = virtualStorage(this._hass, resolved, vs, todayHours, current, now);
    // Today: the same counters as the rest of the card, less what was balanced.
    if (period === "today" && store.day && isNum(totals.gridImport)) {
      net = { gridImport: Math.max(0, totals.gridImport - store.day.balanced), gridExport: isNum(totals.gridExport) ? Math.max(0, totals.gridExport - store.day.balanced) : null };
    }
    return { store, net };
  }

  // Savings when a price comes from a sensor: hour by hour (month by month
  // for all time), each with its mean price. undefined with fixed prices
  // (the summary works them out from the totals), null while loading.
  _savings(resolved, period, energy, net) {
    const config = this._config;
    const prices = effectivePrices(this._hass, config);
    // Net-metering: a kWh sent back is worth `ratio` of a kWh bought.
    if (prices.ratio && prices.import) prices.export = prices.import.entity ? { entity: prices.import.entity, ratio: prices.ratio } : { value: prices.import.value * prices.ratio };
    // Only an export price: the value of the energy sold.
    const kind = prices.import ? "savings" : "exportValue";
    if (!prices.import && !prices.export) return undefined;
    if (!prices.import?.entity && !prices.export?.entity) {
      const totals = energy.totals || {};
      if (!prices.import) return isNum(totals.gridExport) ? { kind, value: totals.gridExport * prices.export.value * prices.factor } : undefined;
      // Fixed prices as given: the summary works them out from the totals.
      if (!config.settlement) return undefined;
      if (!isNum(totals.load) || !isNum(totals.gridImport)) return undefined;
      const billedImport = net ? net.gridImport : totals.gridImport;
      const billedExport = net ? net.gridExport : totals.gridExport || 0;
      return { kind, value: Math.max(0, totals.load - billedImport) * prices.import.value + billedExport * (prices.export?.value || 0) * prices.factor };
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
    if (period === "all") {
      if (!energy.buckets) return { kind, value: null };
      rows = energy.buckets.map((b) => ({ ...b, at: b.start.getTime() }));
      start = energy.spec.start;
      statPeriod = "month";
    } else {
      start = period === "today" ? startOfDay(new Date()) : statsSpec(period).start;
      const hourly = this._fetch(`hourly-energy|${sources}|${start.getTime()}`, 15 * 60000, () => loadHourlyEnergy(this._hass, resolved.energy, start));
      if (!hourly.data) return { kind, value: null };
      const hours = new Map();
      for (const [name, map] of Object.entries(hourly.data)) {
        for (const [at, kwh] of map) hours.set(at, { ...(hours.get(at) || { at }), [name]: kwh });
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
      if (!setting.entity) return setting.value;
      const mean = at === null ? undefined : stats.data[kind]?.get(at);
      return mean ?? now[kind] ?? 0;
    };
    // What the hourly statistics do not cover yet (the current hour).
    let rest = null;
    if (period !== "all") {
      const total = energy.totals || {};
      const sum = (name) => rows.reduce((acc, r) => acc + (r[name] || 0), 0);
      rest = Object.fromEntries(ENERGY_ORDER.filter((name) => isNum(total[name])).map((name) => [name, Math.max(0, total[name] - sum(name))]));
    }
    // Without an import price, only what was sold counts.
    const counted = kind === "exportValue" ? rows.map((r) => ({ ...r, load: 0, gridImport: 0 })) : rows;
    const left = kind === "exportValue" && rest ? { ...rest, load: 0, gridImport: 0 } : rest;
    return { kind, value: pricedSavings(counted, left, price, Boolean(virtualStorageConfig(config))) };
  }

  // Recorder history of the power sensors for today or the last 3 days,
  // shared by the chart and the day's highlights.
  _powerHistory(resolved, period) {
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
    const spec = powerSpec(period);
    const entry = this._fetch(`history|${period}|${sourcesKey(live)}|${spec.start.toDateString()}`, spec.ttl, () =>
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
    const compare = comparisonRows(today, week, month);
    if (!day && !compare) return { loading: Boolean(history?.entry.loading || week.loading) };
    return { day, compare, at: [history?.entry.at, week.buckets?.length, month.buckets?.length] };
  }

  _chartState(resolved, period, energy) {
    const chart = this._chartStateBase(resolved, period, energy);
    if (period !== "today" || chart?.data?.kind !== "power" || this._config.show_solar === false) return chart;
    // The hourly PV forecast as a line next to the production.
    const forecast = this._forecastHours();
    const series = forecastSeries(forecast.hours, chart.data.spec);
    if (!series) return forecast.loading ? { ...chart, at: [chart.at, "forecast"] } : chart;
    return { ...chart, at: [chart.at, forecast.at], data: { ...chart.data, forecast: series } };
  }

  // Solcast's hourly attributes, or else Home Assistant's energy forecast
  // (Forecast.Solar and the like), only with pv_forecast configured.
  _forecastHours() {
    const config = this._config;
    const fromStates = forecastHoursFromStates(this._hass, config);
    if (fromStates) return { hours: fromStates, at: [...fromStates].slice(0, 30).map(([, w]) => Math.round(w)).join(",") };
    const f = config.pv_forecast;
    if (!f || typeof f !== "object" || f.hourly === false || typeof this._hass.callWS !== "function") return {};
    const entry = this._fetch(`solar-forecast|${startOfDay(new Date()).getTime()}`, 30 * 60000, () => loadEnergyForecastHours(this._hass));
    return { hours: entry.data, at: entry.at, loading: entry.loading };
  }

  _chartStateBase(resolved, period, energy) {
    if (this._config.show_chart === false) return null;
    if (period === "today" || period === "3d") {
      const history = this._powerHistory(resolved, period);
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
        this._paint(BASE_CSS + THEME_CSS[theme] + FIT_CSS, `sfc theme-${theme}`, `<div class="sfc-empty"><h2>${escapeHtml(t.noData)}</h2><p>${escapeHtml(t.noDataHelp)}</p></div>`);
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
      const pvForecast = showSolar ? pvForecastData(this._hass, config, today) : null;
      const priceChart = priceChartData(this._hass, config);
      const custom = customSections(this._hass, config);
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
      const since = period === "all" && energy.buckets?.length
        ? energy.buckets[0].start.toLocaleDateString(locale, { month: "short", year: "numeric" })
        : null;
      const ids = {
        live: Object.fromEntries(Object.entries(resolved.live).map(([k, v]) => [k, v?.entityId || null])),
        energy: Object.fromEntries(Object.entries(resolved.energy).map(([k, v]) => [k, v?.entityId || null])),
      };
      if (bank && !ids.live.soc && !ids.live.battery) ids.live.soc = bank.items[0].entityId;
      const now = new Date();
      const vstore = this._virtualStorage(resolved, config, period, now, today);
      const money = this._savings(resolved, period, energy, vstore.net);
      this._introAt ??= Date.now();
      const introElapsed = (Date.now() - this._introAt) / 1000;
      const introAt = introElapsed < 2.6 ? introElapsed : null;
      const signature = JSON.stringify([
        language, config, period, [...this._hiddenSeries], live, status.state, today, energy.totals, Boolean(energy.loading),
        chart && [Boolean(chart.loading), Boolean(chart.error), chart.at], forecast.mode, Math.round(forecast.hours * 60 || 0),
        panels?.panels.map((p) => [p.today, p.power]), system, bank, insights && [insights.loading, insights.at, insights.day?.offGridMinutes], weather && [weather.condition, weather.temperature], inverterOpen,
        inverter?.map((d) => [[...d.strings.values()].map((s) => Object.values(s).map((r) => r.value)), d.temperatures.map((r) => r.value), d.battery.map((r) => r.value), d.grid.map((r) => r.value)]),
        vstore,
        [...this._collapsed],
        money && [money.kind, isNum(money.value) ? Math.round(money.value * 100) : null],
        pvForecast && [pvForecast.total, pvForecast.remaining, pvForecast.days.map((d) => d.value)],
        priceChart && [priceChart.nowAt, priceChart.current, priceChart.hours.length],
        custom.map((c) => c.items.map((item) => item.state)),
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
          collapsible: config.collapsible === true,
        },
        ids,
        live,
        status,
        today,
        period,
        totals: energy.totals || {},
        energyLoading: Boolean(energy.loading),
        summary: periodSummary(energy.totals || {}, config, t, locale, vstore.net, money),
        virtualStorage: vstore.store,
        since,
        chart,
        forecast,
        panels,
        pvForecast,
        priceChart,
        custom,
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
      model.systemStatus = systemStatus(status, forecast, panels, system);

      const painted = this._paint(
        BASE_CSS + THEME_CSS[theme] + FIT_CSS,
        ["sfc", `theme-${theme}`, config.animation === false && "no-anim", config.background === "glass" && "glass", !flowShown && theme !== "lcars" && theme !== "gate" && "parts", live.exportActive ? "grid-export" : live.importActive && "grid-import"].filter(Boolean).join(" "),
        wide ? wideLayout(theme, THEME_RENDER[theme](model)) : withoutFlow(theme, THEME_RENDER[theme](model), flowShown),
      );
      if (!painted) return;
      this._wire(model);
      if (wide) this._balanceWide();
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
        picker.selector = { entity: domain ? { domain } : {} };
        picker.label = label;
        picker.value = value || undefined;
        picker.required = false;
        picker.addEventListener("value-changed", (e) => changed(e.detail?.value));
        el.append(picker);
      } else {
        el.innerHTML = `<label><span>${escapeHtml(label)}</span><input type="text" list="sfc-${domain || "sensor"}" value="${escapeHtml(value)}" placeholder="${domain || "sensor"}.…" /></label>`;
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
          <div class="pickers">${items.map(([key, label]) => this._picker(`entities.${key}`, label, entities[key], "sensor", { auto: autoFor(key), extra: extra(key) })).join("")}</div>
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
        </details>` : ""}
      ${this._switches(t, "summary")}`;
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
        .field { display: grid; gap: 3px; min-width: 0; }
        .field .note, .body > .note { margin: 0; color: var(--secondary-text-color, #727272); font-size: 11px; overflow-wrap: anywhere; }
        .found { font-weight: 400; color: var(--success-color, #43a047); }
        .warn { margin: 0; padding: 4px 8px; border-radius: 6px; background: rgba(255, 152, 0, .12); color: var(--warning-color, #b26a00); font-size: 11.5px; line-height: 1.35; }
        .item { display: grid; gap: 8px; padding: 10px; border: 1px dashed var(--divider-color, rgba(127,127,127,.35)); border-radius: 10px; }
        .danger { color: var(--error-color, #db4437) !important; }
        .suggest { display: grid; gap: 4px; padding: 8px 10px; border-radius: 10px; background: rgba(67, 160, 71, .1); }
        .link { justify-self: start; padding: 0; border: 0; background: none; color: var(--primary-color, #03a9f4); font: inherit; font-size: 13px; cursor: pointer; }
      </style>
      <datalist id="sfc-sensor">${ids("sensor").map((id) => `<option value="${escapeHtml(id)}"></option>`).join("")}</datalist>
      <datalist id="sfc-weather">${ids("weather").map((id) => `<option value="${escapeHtml(id)}"></option>`).join("")}</datalist>
      <div class="editor">
        ${this._legacyType ? `<p class="beta">${escapeHtml(t.editorRenamed)}</p>` : ""}
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
})();
