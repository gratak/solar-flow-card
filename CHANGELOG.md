# Changelog

## 1.6.0

- **`sections:`** (#62, #66): choose which parts the card shows and in what order. Besides the sections below the main view, it covers the main view itself (`flow`) and, in Diorama, the "today" tiles (`today`) and "Where today's power came from" (`sources`). "Today at a glance" (`insights`) and the comparison (`comparison`) are now separate sections.
- **Collapsible sections** (`collapsible: true`, also in the editor, #63): tap a section's title to fold it into one line with its key value. For example, the energy section shows today's production and the installation the inverter load. The browser remembers what you folded, and `collapsed: [...]` sets what starts folded.
- Virtual storage (#43, #67):
  - **Savings** follow the hourly settlement. The import and export left after each hour's balancing are what you pay and get paid for.
  - Diorama's "Where today's power came from" bar has a **virtual storage** segment: the import balanced by export within the same hour. The grid segment shows only the rest. A legend shows each share.
  - `virtual_storage: { count_as_own: true }` counts the balanced energy as your own. It applies to self-sufficiency in the period summary, in that bar and in the themes' "self-sufficiency today". The separate "with hourly balancing" value is then not shown.

## 1.5.1

- The card keeps its height while it updates, so it is never shorter for a moment. A shorter card can make Safari on iPhone jump to the top of the dashboard while scrolling (#70). The card also skips updates that would show exactly the same thing.
- Editor: the "Today at a glance and comparison" switch shows whether the section is really shown. It is on by default in the wide layout, and the switch now reflects that (#64).
- A consumption calculated by the card (no consumption sensor) is no longer greyed out like a missing value. The tile shows as usual; it just has no sensor to open (#68).
- "Today at a glance": "Without the grid" is renamed "No grid import". It is the time today the home took no power from the grid (#65).

## 1.5.0

**Visual change:** the card no longer loads fonts from Google Fonts by default, so it connects to no outside server (thanks @frenck). Each theme now uses fonts already on your device, with fallbacks chosen per theme (rounded, condensed, monospace or serif). To get the themes' own fonts back, set `load_fonts: true` (also in the editor) or host them yourself with `font_url`. See [Fonts](README.md#fonts).

- **Virtual storage with hourly net balancing** (`virtual_storage`, #43): for tariffs that balance import and export within each hour. A new section shows this hour's balance (export minus import since the full hour) as a virtual battery, green for a surplus and red for a deficit (`negative: zero` clamps it at 0 kWh), with the time until it resets and today's hours with a surplus and the energy balanced. Calculated from the grid energy counters (daily or lifetime), or read from a ready sensor such as ha-balance-neto's net balance (`entity`). The period summary adds "self-sufficiency with hourly balancing" for 24H, 3D, 7D and month. Without the option nothing changes.
- Installation: with grid power per phase, the bars are green while a phase exports and red while it imports (#53).
- The grid's status shows the direction: in Diorama an arrow (↑ export, ↓ import) in green or red, in the other themes the status text in the same colours (#53).
- Inverter details for any inverter (#53): PV string power, voltage and current under `entities:` (`pv1_power` … `pv4_current`, power from voltage × current when missing), also used by `panels_per_string`, and `inverter_details:`, a list of any sensors shown as tiles. Without any inverter data the section and its link are hidden instead of showing an empty section.

## 1.4.4

- `energy_sensors: total`: today's energy now comes from Home Assistant's hourly statistics (the change of each hour since midnight plus what the counter added since the last full hour), like the Energy dashboard. Reading the counters at midnight failed when a sensor was unavailable then (an inverter switched off at night), and today's totals stayed empty (#53).
- Installation: with only a grid meter per phase (no per-phase consumption), each phase shows its grid power instead of "—".
- Configuration guide: `solar_power` should be the inverter's AC output when the home consumption is computed; the Huawei example uses it and notes that the Panels section needs DeyeCloud data (#53).

## 1.4.3

- The dashboard no longer jumps to the top whenever the card refreshes (#55). The card used to replace its whole frame on every update; Home Assistant draws that frame a moment later, so for an instant the card had no height and the page scrolled up. The frame now stays and only its contents are updated.

## 1.4.2

- Power sensors in kW or MW and energy sensors in Wh or MWh are converted (before, only some readings converted kW, so a solar power sensor in kW was read as watts).
- `energy_sensors: total` for lifetime energy counters (an energy meter's total import/export, an inverter's total yield): today's energy is counted from their reading at midnight instead of showing the lifetime total. Longer periods already came from Home Assistant's statistics and work with either kind.
- A [configuration guide for any inverter](docs/configuration.md): every `entities:` entry with its unit and sign, what the card checks (units, state class), helper sensors for what is missing, and complete examples, including Huawei with a separate energy meter (#53).

## 1.4.1

- `background: glass` (also in the editor): a translucent, blurred card, so a background image set on the dashboard view shows through it. Light glass in Diorama and Paper, dark in the other themes.

## 1.4.0

Everything from the 1.3.0 and 1.4.0 betas, now stable.

**New themes**
- **Reactor** (`reactor`): a helmet HUD around an arc reactor with copper coils on a ring of light. One light segment per 10% of solar power against the installation's size (`pv_capacity`, else the inverter's rating), an overdrive glow above 80%, inner arcs that turn while the battery charges or discharges. The weather shows on the visor: sun glare, stars, rain running down the glass, snow with frost, fog, lightning. Gauges for the battery level and solar share, an atmospheric scan line and a status (overdrive, nominal output, reserve power, grid assist, standby). A start-up sequence the first time the card is shown.
- **Gate Command** (`gate`): a gate control room with a dialing computer listing every flow. Compact: a smaller gate whose chevrons are the connection points of solar cells, a zero point module (battery), a dial home device (grid) and the mountain base (home). Wide: the full gate with nine chevrons for the battery level. The ring carries the 39 gate symbols.

**Layout and sections**
- **Wide layout** for every theme (`wide: true`, also in the editor): the main view and the chart side by side, the other sections in two balanced columns (each section goes to the shorter column), inverter details open. Below about 880 px the card stays compact.
- **Today at a glance** and **Comparison** (`show_insights`, on by default in the wide layout): peaks with their time, the battery's range and cycles, time without the grid; today against yesterday, the 7-day average and this month.

**Panels**
- `panels_per_string` (a number or a list per string, also in the editor with one field per PV string): groups optimizer tiles into strings (`[11, 7]`), or, without optimizers, shows an estimate per panel from the string power, marked ≈.
- `panels_average: per_string` (also in the editor): the average and the weakest panel for each string on its own, with a summary under each string.

**Fixes**
- Animations continue across re-renders instead of starting over (Reactor, as Foundation).
- The comparison table stays in its column on narrower wide cards.
- Wide layout in Home Assistant: sections no longer all end up in the right column.
- Reactor: the visor frame and the readouts scale together, so the frame never cuts through the sun, battery, grid or home readouts, at any card width.

`show_weather` / `weather_entity` now apply to the Reactor theme too.

## 1.4.0-beta.5

- Reactor: a larger visor frame, so it no longer cuts through the sun, battery, grid and home readouts.

## 1.4.0-beta.4

- Reactor: the battery and solar gauges end above the battery and grid flow lines instead of crossing them.

## 1.4.0-beta.3

- `panels_average: per_string` (also in the editor): the panel average and the weakest panel are worked out for each string on its own, with a summary under each string, so a string facing another way does not make the other look weak. The default (`all`) stays as before.

## 1.4.0-beta.2

- Reactor: the animations carry on across re-renders (every minute and on each new reading) instead of starting over, as the Foundation orbits do.
- Reactor: a start-up sequence the first time the card is shown: the visor frame draws in, the reactor powers up segment by segment, the gauges fill and the readouts appear. With `animation: false` or reduced motion it is skipped.

## 1.4.0-beta

A test release: install it from HACS with "Show beta versions" turned on.

- **Reactor** theme (`reactor`): a helmet HUD around an arc reactor with copper coils on a ring of light. One light segment per 10% of solar power against the installation's size (`pv_capacity`, else the inverter's rating), an overdrive glow above 80%, inner arcs that turn while the battery charges (one way) or discharges (the other). The weather shows on the visor glass: sun glare, stars, rain drops running down, snow with frost, fog, lightning. Gauges for the battery level and the solar share, an atmospheric scan line and a status (overdrive, nominal output, reserve power, grid assist, standby). Compact and wide.
- `show_weather` / `weather_entity` apply to the Reactor theme too.

## 1.3.0-beta.4

- Wide layout in Home Assistant: the sections were all placed in the right column, leaving the space under the main view empty. The card measured the columns before Home Assistant's card frame had laid them out; it now waits for the layout.

## 1.3.0-beta.3

- Wide layout: two columns down the whole card, the main view on the left and the chart on the right, with each following section placed in the shorter column. Both columns end at about the same height, with no empty gap under the main view. The layout follows the card's width when it changes (tablet rotation, window resize).
- The comparison table no longer runs into the next column on narrower wide cards: column headings wrap, and the table scrolls sideways if it still does not fit.

## 1.3.0-beta.2

- Panels with optimizers are grouped by `panels_per_string` too: `[11, 7]` shows a string of 11 and one of 7 instead of two equal halves (#37). Without the option the panels are split by `panel_strings` as before.

## 1.3.0-beta

A test release: install it from HACS with "Show beta versions" turned on.

- **Gate Command** theme (`gate`): a gate control room with a dialing computer that lists every flow and a status line; the event horizon ripples while power flows and the glyph ring turns slowly while the battery charges or discharges. Compact: a smaller gate whose four chevrons are the connection points of pictures in the corners (solar cells, a zero point module filled to the battery level, a dial home device for the grid, the mountain base for the home), linked by flow lines and pulsing gently while power flows; the other five chevrons show the battery level. Wide (`wide: true`): the full gate with all nine chevrons for the battery level, the dialing computer and the chart side by side.
- **Wide layout** for every theme (`wide: true`, also in the editor): the main view and the chart side by side, the other sections open below in balanced columns, with the inverter details shown without a click. A missing section (no panels, no battery) leaves no gap. Below about 880 px of card width the card stays compact.
- **Today at a glance** and **Comparison** sections (`show_insights`, on by default in the wide layout, also in the editor): solar and consumption peaks with their time, the battery's range and cycles today, time without the grid; today against yesterday (with the trend), the 7-day average and this month for production, consumption, grid import and export. Calculated from Home Assistant's history and statistics, so they work with any inverter.
- **Panel estimate without optimizers**: `panels_per_string` (a number, or a list per string; also in the editor). When the panels don't report their own data, the Panels section shows each string's power divided over its panels and today's energy divided over all panels, on dashed tiles marked ≈, with a note that this is an estimate. The Diorama roof draws that many modules. The editor shows one field per PV string the inverter reports ("PV1 · now 342 V"), so each string can have its own count; without string data it shows a single field. The demo has a "no optimizers" setting.
- **Gate**: chevrons drawn after the show's: a metal arrowhead housing, a clamp that drops into place when the chevron locks and a triangular light; a redrawn dial home device (pedestal, two rings of nineteen keys, the red dome); the wide gate has the corner pictures too.
- Gate: the ring carries the 39 gate symbols, traced from a drawing of the gate, in the show's order with the point of origin at the top.
- The theme picker in the editor wraps to fit nine themes.
- Demo: always loads the latest card (no stale copy from the browser cache), shows the card version, and switches to the wide layout when a wide width is picked.

## 1.2.0

- **Several batteries**: the `batteries:` option (name, soc, power, capacity, optional voltage, temperature and `invert`). The themes show one combined battery (summed power, charge weighted by capacity, total capacity for the forecast, also in the power chart); the Installation section shows each battery with its charge, power, voltage and temperature, and warns when one of them is too cold or hot. The demo has a "two batteries" setting.
- **Diorama weather**: the sky follows a Home Assistant weather entity (`weather_entity`, otherwise the first one found; `show_weather: false` turns it off, also in the editor): drifting clouds, a grey sky when overcast, rain, snow, fog and lightning; twinkling stars on clear nights; the temperature next to the clock.
- **Atlantis, Foundation and Far galaxy**: the centre is the inverter, where all flows meet. It shows the inverter's power (Atlantis also its load against rated power on the ring) instead of the battery level, which read as if the centre were a source. The battery level moved to the battery node ("Battery 37%"); Far galaxy marks a battery at its reserve there in red.
- **Foundation**: the orbits stay still and the planets travel all the way round them, instead of the whole ellipses swinging; the sphere breathes more slowly.
- **Far galaxy**: a calmer trench (slower, fainter), slower flow dots and a gentle pulse instead of a blink at the battery reserve.
- Looping animations keep their place when the card refreshes instead of starting over.

## 1.1.0

- Dutch translation, thanks to @furian88.
- Home consumption is calculated when there is no consumption sensor: panels + grid (+ import, − export) + battery (+ discharge, − charge). Works for the live value, the power chart and the daily/period energy, so setups that only have PV and grid sensors (e.g. SolarEdge over Modbus) no longer need a helper sensor.
- Battery forecast: a time on another day shows the weekday ("Fri 17:13" instead of "17:13"), and a rate so slow that the battery would take more than 2 days (a trickle of charge in the evening) shows "Charging slowly" without a time instead of "Full in 4 days, about 17:13".
- Demo: the clock follows the scenario (noon 12:30, evening 19:30, night 03:00…), so the Diorama sky and the forecast times match the data.

## 1.0.3

- New option `show_battery: false` (also in the editor: "The installation has a battery") for PV installations without a battery. Every theme drops the battery node and its flow; the battery forecast, charge/discharge tiles, battery and SOC chart series and the battery readings in the Installation section are hidden. Atlantis, Foundation and Far galaxy show today's self-sufficiency in the middle instead of the charge level; LCARS and Diorama show today's grid figures in place of the battery ones.
- Demo: a "Battery" switch.

## 1.0.2

- Grid power on DeyeCloud stations that only report the net grid power ("Grid Net Power", `wirePower`): the card showed the grid as 0 W / balanced while importing. The net power is now used (+ import, − export), also in the power chart.
- When a DeyeCloud station sensor is missing or has no value, the inverter's own sensor is used instead: `TotalGridPower`, `TotalSolarPower`, `TotalConsumptionPower`, `BatteryPower`, `SOC`.

## 1.0.1

- LICENSE uses the plain MIT layout, so GitHub and HACS recognize it; both copyright holders are kept.
- Smaller animated preview in the README (2.9 MB).

## 1.0.0

First stable release: everything from the 0.1 betas, tested on a live DeyeCloud installation.

- `show_autarky` is now `show_self_sufficiency`, matching the label. The old name keeps working, and the visual editor switches to the new one on the next change.
- Releases are regular releases, so HACS offers updates without "Show beta versions".
- A live demo runs on GitHub Pages, and the README shows an animated preview of all themes.
- HACS validation runs in GitHub Actions.

## 0.1.8-beta

- Installation: phases are shown only when at least two have voltage or carry power. Single-phase inverters that report L2/L3 as 0 W / 0 V no longer get empty phase tiles; the rest of the section stays.

## 0.1.7-beta

- New **Installation** section in every theme:
  - power on each phase with grid power, voltage and the spread between phases;
  - inverter load against its rated power;
  - battery temperature, voltage and current, with a warning when the battery is below 10 °C or above 45 °C;
  - the generator while it runs.
- DeyeCloud sensors are found automatically; other inverters set them under `entities:`.
- New options: `show_system` (also in the editor) and `inverter_power_rating`.
- LCARS: a battery that is too cold or too hot sets the status to caution.

## 0.1.6-beta

- Three new themes:
  - `expanse`: a ship's power distribution display with orbital trajectories and a segmented charge bar.
  - `foundation`: a radiant of turning golden orbits around the battery, with a written forecast.
  - `galaxy`: a targeting computer in a trench, with an opening crawl telling where the power comes from.

## 0.1.5-beta

- Chart legend entries are buttons: a click hides or shows that series (PV, home, battery, grid, SOC; PV, consumption, grid import on the bar charts). The scale follows the visible series, the tooltip drops hidden ones, and the choice is remembered in the browser.

## 0.1.4-beta

- Flow dots move smoothly in the direction of the flow in every theme. The animation used a CSS variable inside its keyframes, which Chromium does not interpolate, so the dots stood still or jumped.
- Paper: dots run along the Sankey ribbons, between the label columns.
- LCARS: a light wave runs over the lit segments, backwards for battery charging and grid export.
- With "reduce motion" switched on in the system the dots move three times slower instead of stopping; only decorative effects (pulsing, breathing, the LCARS wave) stop. `animation: false` still turns everything off.

## 0.1.3-beta

- Translations moved to `translations/<language>.json`, one file per language; the build embeds them and the editor lists every language automatically.
- `scripts/check-translations.mjs` reports missing keys, typos and placeholder mistakes.
- GitHub Actions check every pull request and rebuild `solar-flow-card.js` after a merge.
- `CONTRIBUTING.md`: how to add a language.
- Language codes with a region (`pt-br`) are supported.

## 0.1.2-beta

- Language picker in the visual editor (Home Assistant language, English, Polski). The `language` option already worked in YAML.

## 0.1.1-beta

- Tiles and summary labels wrap to two lines instead of being cut off ("Rozładowanie magazynu", "Samowystarczalność").
- Paper: the sentence lists only the sources in use, as shares of what they supply right now, adding up to 100% (it could show "battery 112%" when the inverter used part of the battery's power).
- Paper: the Sankey diagram has "From / To" headings and a grey "Losses" band for the power that goes into the inverter but not out of it, so both sides match.

## 0.1.0-beta

First public beta.

- Five themes: Diorama, Aurora, Paper, LCARS, Atlantis.
- DeyeCloud sensors found automatically; other inverters through `entities:`.
- Periods 24H / 3D / 7D / month / all time with charts from Home Assistant's history and statistics.
- Period summary (self-sufficiency, self-consumption, savings, CO₂, yield per kWp), each item can be switched off.
- Battery forecast, inverter details, optimizer tiles.
- Installations without PV (battery with an EMS): `show_solar: false`.
- English and Polish.
