# Solar Flow Card

[![HACS Custom](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://hacs.xyz/docs/faq/custom_repositories/)
[![Release](https://img.shields.io/github/v/release/gratak/solar-flow-card?label=version)](https://github.com/gratak/solar-flow-card/releases)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

[![Open your Home Assistant instance and open this repository in the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=gratak&repository=solar-flow-card&category=plugin)

**[Try it in your browser](https://gratak.github.io/solar-flow-card/demo/)**: all themes, scenarios and languages on demo data, no installation needed.

![Solar Flow Card themes](docs/themes.gif)

A Home Assistant dashboard card for solar installations with a battery: live power flow, charts, a battery forecast, inverter details and per-panel production, in ten themes, compact or wide.

DeyeCloud sensors are found automatically; any other inverter works by pointing the card at its entities, see the [configuration guide for any inverter](docs/configuration.md).

| Diorama | Aurora | Paper | LCARS |
|---|---|---|---|
| ![Diorama](docs/diorama.png) | ![Aurora](docs/aurora.png) | ![Paper](docs/paper.png) | ![LCARS](docs/lcars.png) |

| Atlantis | Expanse | Foundation | Far galaxy |
|---|---|---|---|
| ![Atlantis](docs/atlantis.png) | ![Expanse](docs/expanse.png) | ![Foundation](docs/foundation.png) | ![Far galaxy](docs/galaxy.png) |

**Gate Command**, wide (`wide: true`):

![Gate Command, wide](docs/gate-wide.png)

**Reactor**, compact and wide:

| Reactor | Reactor, wide |
|---|---|
| ![Reactor](docs/reactor.png) | ![Reactor, wide](docs/reactor-wide.png) |

## Features

- **Live power flow** between solar, battery, grid and home, animated in the direction energy moves.
- **Periods** 24H, 3D, 7D, month and all time for production, consumption, grid import/export and battery charge/discharge.
- **Charts** following the selected period: power over the day (24H, 3D) and daily or monthly energy bars (7D, month, all). Hover or tap for values; click a legend entry to hide or show that series (remembered in the browser).
- **Period summary**: self-sufficiency, self-consumption, savings, avoided CO₂ and yield per kWp (energy produced per kW of installed panels; compare days and installations). Each item can be switched off.
- **Installations without PV** (battery with an EMS): `show_solar: false`. **Without a battery** (PV only): `show_battery: false`.
- **Battery forecast**: time until full while charging, time until the reserve while discharging.
- **Installation**: power on each phase (L1/L2/L3) with grid power and voltage and the spread between phases, inverter load against its rated power, battery temperature, voltage and current with a warning when the battery is too cold or hot to charge fully, and the generator while it runs.
- **Inverter details** (tap the inverter or the house): PV strings, temperatures, battery and grid readings.
- **Panels**: one tile per optimizer with today's production; the weakest panel is highlighted when it falls below 85% of the median. Without optimizers, `panels_per_string` gives an estimate per panel from the string power.
- **Wide layout** (`wide: true`) for every theme: everything visible at once on a wide dashboard, plus "Today at a glance" (peaks, battery range and cycles, time without the grid) and a comparison with yesterday, the week and the month.
- English, Polish and Dutch, with a visual editor; [more languages welcome](CONTRIBUTING.md#add-or-improve-a-translation).

History comes from Home Assistant itself (recorder history and long-term statistics), so the card adds no requests to your inverter's cloud.

## Themes

| Theme | Look |
|---|---|
| `diorama` | An isometric house with your panels on the roof; the sky follows the time of day and the weather (drifting clouds, rain, snow, fog, lightning), windows light up at night. |
| `aurora` | Neon rings and glowing flows on a night sky. |
| `paper` | An editorial page: a sentence that explains the moment and a Sankey diagram of where the power goes. |
| `lcars` | A starship operations panel with segment bars, a battery cell gauge and a status line. |
| `atlantis` | A holographic power core: the inverter in a crystal with its load on the ring, hexagonal panels. |
| `expanse` | A ship's power distribution display: bracketed readouts, orbital trajectories and a segmented charge bar with the reserve in red. |
| `foundation` | A radiant of slowly turning golden orbits around the inverter, with a battery forecast written below. |
| `galaxy` | A targeting computer flying down a trench, with the moment told as an opening crawl; the target turns red at the battery reserve. |
| `gate` | A gate control room with a dialing computer listing every flow. Compact: a smaller gate whose four chevrons are the connection points of pictures in the corners (solar cells, a zero point module filled to the battery level, a dial home device for the grid, the mountain base for the home); they pulse while power flows, the other five show the battery level. Wide: the full gate with all nine chevrons for the battery level, the dialing computer and the chart side by side. |
| `reactor` | A helmet HUD around an arc reactor. Its light segments glow with the solar power (one of ten per 10% of the installation's size, `pv_capacity`), with an overdrive glow above 80%; the inner arcs turn while the battery charges or discharges. The weather shows on the visor: sun glare, stars at night, rain running down the glass, snow, fog and lightning. Gauges for the battery level and the solar share, and a status line (nominal output, reserve power, grid assist). |

## Installation

### HACS

Click the button to open the card in HACS on your Home Assistant (HACS must be installed):

[![Open your Home Assistant instance and open this repository in the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=gratak&repository=solar-flow-card&category=plugin)

Or add it by hand:

1. HACS → ⋮ → **Custom repositories** → add `https://github.com/gratak/solar-flow-card`, type **Dashboard**.
2. Search for **Solar Flow Card**, **Download**.
3. Reload the browser. HACS adds the dashboard resource for you.

### Manual

Copy `solar-flow-card.js` to `config/www/` and add a dashboard resource `/local/solar-flow-card.js` of type **JavaScript module**.

## Configuration

For inverters other than DeyeCloud, the [configuration guide](docs/configuration.md) explains every `entities:` entry, the units and state classes the card expects, the helper sensors to create when something is missing, and has complete examples (including Huawei with a separate energy meter).

The visual editor covers the theme, title, language, your installation, sections and the summary items. `period`, `panel_strings` and the sensor options are YAML only.

```yaml
type: custom:solar-flow-card
theme: diorama
battery_capacity: 23.5
battery_min_soc: 20
pv_capacity: 8
pv_panels: 16
price_import: 1.10
price_export: 0.30
co2_factor: 0.7
```

### General

| Option | Default | Description |
|---|---|---|
| `theme` | `diorama` | `diorama`, `aurora`, `paper`, `lcars`, `atlantis`, `expanse`, `foundation`, `galaxy`, `gate` or `reactor`. |
| `title` | station name | Card title. |
| `language` | Home Assistant language | `en`, `pl` or `nl`; also in the visual editor. |
| `background` | – | `glass`: a translucent, blurred card that lets the dashboard view's background image show through (light glass in Diorama and Paper, dark in the other themes). Also in the editor. |
| `wide` | `false` | Wide layout for a wide dashboard (a panel view or a full-width section): the main view and the chart side by side, every section open below in columns, inverter details included. Below about 880 px of card width the card stays compact. Also in the editor. |
| `show_insights` | with `wide` | "Today at a glance" (solar and consumption peaks with their time, the battery's range today, battery cycles, time without the grid) and a comparison of today with yesterday, the 7-day average and this month. Shown in the wide layout; `true` shows it in the compact layout too, `false` hides it. Also in the editor. |
| `period` | `today` | Tab shown when the dashboard opens: `today`, `3d`, `7d`, `month` or `all`. |
| `station_id` | first station | DeyeCloud station, when the account has several. |
| `animation` | `true` | Animated flows. |
| `load_fonts` | `false` | `true` loads the theme's own fonts from Google Fonts (see [Fonts](#fonts)). By default the card uses fonts already on your device and connects nowhere. Also in the editor. |
| `font_url` | – | Your own font stylesheet instead, e.g. a self-hosted copy in `/config/www` (`/local/fonts/solar-flow-card.css`). |
| `show_weather` | `true` | Diorama and Reactor: draw the weather of a Home Assistant weather entity (the Diorama sky, the Reactor visor), with the temperature next to the clock. |
| `weather_entity` | first `weather.*` entity | Weather entity for the Diorama and Reactor themes. |

### Your installation

| Option | Default | Description |
|---|---|---|
| `show_solar` | `true` | `false` for installations without PV (a battery with an EMS): every theme drops the sun, roof modules, PV production and the PV-based summary items. |
| `show_battery` | `true` | `false` for installations without a battery: every theme drops the battery, its flows, forecast, tiles and chart series; themes that showed the charge level in the middle show today's self-sufficiency instead. |
| `battery_capacity` | – | Usable battery capacity in kWh. Enables the battery forecast and the stored energy. |
| `battery_min_soc` | `10` | Battery reserve in %. "Lasts until" counts down to this level. |
| `pv_capacity` | – | PV size in kWp. Enables the yield per kWp. |
| `pv_panels` | `8` | Modules drawn on the Diorama roof when no optimizers are found. |
| `inverter_power_rating` | from the inverter | Inverter rated power in kW, for the inverter load. DeyeCloud reports it; set it for other inverters. |
| `panels_average` | `all` | `per_string`: the average and the weakest panel for each string on its own, with a summary under each string (useful when the strings face different ways). `all`: over all panels. Also in the editor. |
| `panels_per_string` | – | Panels on each string, a number or a list (`[11, 7]`). Groups the optimizer tiles into strings in that order, and without optimizers shows an estimate per panel from the inverter's string power, marked ≈ with a note. The editor shows one field per string the inverter reports, with its current voltage. |
| `panel_strings` | `1` (`2` above 8 panels) | Number of strings the panels are split into, in order. |
| `price_import` | – | Price per kWh bought from the grid. Enables the savings. |
| `price_export` | `0` | Price per kWh sold to the grid. |
| `currency` | by language (`zł`, `€`) | Currency shown with the savings. |
| `co2_factor` | `0.5` | kg of CO₂ per kWh from the grid (Poland: about `0.7`). |

### Fonts

By default the card loads nothing from the internet: each theme uses the fonts already on your device (for example Segoe UI, Roboto or San Francisco, a condensed font for the sci-fi themes and a serif for Paper and Foundation). The themes were designed with their own fonts (Nunito, Space Grotesk, Fraunces, Antonio, Exo 2, Rajdhani, Cinzel, Orbitron…), which you can get in two ways:

- `load_fonts: true` loads them from Google Fonts. Your browser then connects to Google's servers, which see your IP address.
- `font_url` loads a stylesheet you host yourself. Download the fonts (for example with [google-webfonts-helper](https://gwfh.mranftl.com/fonts)), put them and a CSS file with their `@font-face` rules in `/config/www/fonts/`, and set `font_url: /local/fonts/solar-flow-card.css`. Keep the font family names (e.g. `"Nunito"`), the themes ask for them by name.

A font installed on your device is used too, with neither option.

### Sections

| Option | Default | Description |
|---|---|---|
| `show_energy` | `true` | Energy section: period tabs, chart, tiles and summary. |
| `show_chart` | `true` | Chart in the energy section. |
| `show_forecast` | `true` | Battery forecast (needs `battery_capacity`). |
| `show_system` | `true` | Installation: phases, inverter load, battery temperature/voltage/current, generator (shown when the data exists). |
| `show_panels` | `true` | Optimizer / panel tiles (shown only when panel data exists). |
| `inverter_details` | – | Any sensors to show in the Inverter details, e.g. the temperature or status of an inverter that is not DeyeCloud. See the [configuration guide](docs/configuration.md#installation-section-all-optional). |
| `virtual_storage` | – | Virtual storage with hourly net balancing, see [below](#virtual-storage-hourly-net-balancing). |
| `sections` | all | Which parts the card shows and in what order, see [Choosing and ordering sections](#choosing-and-ordering-sections). |
| `collapsible` | `false` | `true`: tap a section's title to fold it into one line with its key value (also in the editor). The browser remembers what you folded. |
| `collapsed` | – | With `collapsible`: the sections that start folded, e.g. `[panels, system]`. |

#### Choosing and ordering sections

`sections:` lists what the card shows, in that order. Anything left out is hidden. Without it the card shows everything as before, and the `show_…` options keep working either way.

| Id | Section |
|---|---|
| `flow` | The theme's main view (the animated scene) |
| `today` | Diorama: the three "today" tiles under the scene |
| `sources` | Diorama: "Where today's home power comes from" |
| `inverter` | Inverter details (opened from the inverter in the main view) |
| `forecast` | Battery forecast |
| `virtual_storage` | Virtual storage |
| `system` | Installation |
| `energy` | Energy: period tabs, chart, tiles and summary |
| `insights` | Today at a glance |
| `comparison` | Comparison with yesterday, the week and the month |
| `panels` | Panels |

```yaml
sections:
  - today
  - sources
  - virtual_storage
  - energy
collapsible: true
collapsed: [energy]
```

Listing `insights` or `comparison` shows them in the compact layout too. In the wide layout the energy section leads across the full width and the others follow in your order. Without `flow` the card uses the compact layout. LCARS and Gate keep their frame: there `flow` always shows, and Gate places the energy section itself.

### Period summary

| Option | Default | Description |
|---|---|---|
| `show_self_sufficiency` | `true` | Self-sufficiency: share of consumption not taken from the grid. (`show_autarky` from the beta versions still works.) |
| `show_self_use` | `true` | Self-consumption: share of PV production used on site. |
| `show_savings` | `true` | Savings (needs `price_import`). |
| `show_co2` | `true` | Avoided CO₂. |
| `show_yield` | `true` | Yield per kWp: energy produced per kW of installed panels (needs `pv_capacity`). |

### Sensors

| Option | Default | Description |
|---|---|---|
| `entities` | DeyeCloud, automatic | Sensors for other inverters, see below. |
| `panels` | DeyeCloud optimizers | Per-panel energy sensors, see below. |
| `batteries` | – | Several batteries (e.g. a hybrid inverter's BAT1 and BAT2), see below. |
| `invert_battery` | `false` | Your signed battery power is positive while charging. |
| `invert_grid` | `false` | Your signed grid power is positive while exporting. |
| `energy_sensors` | `daily` | `total`: your energy sensors are lifetime counters (they never reset, like most energy meters); today's energy comes from Home Assistant's hourly statistics, like the Energy dashboard. See the [configuration guide](docs/configuration.md). |

### Other inverters

Set the entities the card should use. Every key is optional; use either separate import/export (charge/discharge) sensors or one signed sensor. Without a consumption sensor (`load_power`, `load_energy`) the card calculates it: panels + grid import − grid export + battery discharge − battery charge.

```yaml
type: custom:solar-flow-card
entities:
  solar_power: sensor.pv_power                 # W
  load_power: sensor.house_power               # W
  battery_power: sensor.battery_power          # W, + discharging / − charging
  battery_soc: sensor.battery_soc              # %
  grid_power: sensor.grid_power                # W, + import / − export
  # or: grid_import_power / grid_export_power, battery_charge_power / battery_discharge_power
  solar_energy: sensor.pv_energy_today         # kWh today, state_class total_increasing
  load_energy: sensor.house_energy_today
  grid_import_energy: sensor.grid_import_today
  grid_export_energy: sensor.grid_export_today
  battery_charge_energy: sensor.battery_charge_today
  battery_discharge_energy: sensor.battery_discharge_today
  # Installation section, all optional:
  load_power_l1: sensor.load_l1                # W per phase, also _l2, _l3
  grid_power_l1: sensor.grid_l1                # W per phase, + import, also _l2, _l3
  grid_voltage_l1: sensor.voltage_l1           # V per phase, also _l2, _l3
  inverter_power: sensor.inverter_output_power # W
  inverter_rated_power: sensor.inverter_rated  # W (or the inverter_power_rating option)
  battery_temperature: sensor.battery_temp     # °C
  battery_voltage: sensor.battery_voltage      # V
  battery_current: sensor.battery_current      # A
  generator_power: sensor.generator_power      # W
panels:                                        # optional, energy today per panel
  - sensor.panel_1_energy_today
  - entity: sensor.panel_2_energy_today
    power: sensor.panel_2_power
    name: South 2
```

### Virtual storage (hourly net balancing)

Some tariffs balance import and export within each hour: energy sent to the grid earlier in the hour pays for energy taken later in the same hour. `virtual_storage` shows that hour's balance as a virtual battery: the energy exported minus imported since the full hour (green while there is a surplus, red for a deficit), a bar with the time until it resets, and today's hours with a surplus and the energy balanced. The period summary gets an extra value, **self-sufficiency with hourly balancing**: the share of consumption not covered by the import left after each hour's balancing (for 24H, 3D, 7D and month).

```yaml
virtual_storage: true                 # calculated from the grid energy counters
```

```yaml
virtual_storage:
  entity: sensor.net_balance          # optional: a ready sensor, e.g. from ha-balance-neto
  negative: zero                      # show (default): a deficit in red; zero: clamp at 0 kWh
```

| Key | Default | Description |
|---|---|---|
| `entity` | – | A sensor with this hour's balance in kWh (positive = surplus), resetting every full hour, e.g. the net balance of [ha-balance-neto](https://github.com/miguelangellv/ha-balance-neto). Without it the card calculates the balance itself. |
| `negative` | `show` | `zero` shows a deficit as 0 kWh. |
| `count_as_own` | `false` | `true` counts the energy balanced within the hour as your own: self-sufficiency (the period summary, today's bar and the themes' "self-sufficiency today") then includes hourly balancing, and the separate "with hourly balancing" value is not shown. |

With virtual storage, the **savings** follow the hourly settlement: the import and export left after each hour's balancing are what the utility bills. In Diorama, "Where today's power came from" shows the balanced energy as its own segment (virtual storage), and the grid segment only the import left after balancing.

The card calculates the balance from the `grid_import_energy` and `grid_export_energy` sensors (daily or lifetime counters, with `state_class: total_increasing` or `total`): Home Assistant's 5-minute statistics since the full hour plus what the counters added since. Today's hours and the extra self-sufficiency value come from the hourly statistics, so they also need these two sensors when you use `entity`.

### Several batteries

Two or more batteries (on one inverter's two battery inputs, on two inverters, or AC-coupled) are listed under `batteries:`. The themes show them as one battery: the power is summed, the charge level is weighted by capacity (10 kWh at 80% and 5 kWh at 20% make 60%) and the forecast uses the total capacity. The Installation section shows each battery with its charge, power, voltage and temperature.

```yaml
type: custom:solar-flow-card
batteries:
  - name: LiFePO4 48 V
    soc: sensor.bat1_soc                       # %
    power: sensor.bat1_power                   # W or kW, + discharging / − charging
    capacity: 10                               # kWh
    voltage: sensor.bat1_voltage               # optional
    temperature: sensor.bat1_temperature       # optional
  - name: HV 200 V
    soc: sensor.bat2_soc
    power: sensor.bat2_power
    capacity: 13.5
    invert: true                               # this one is + while charging
```

`battery_capacity` defaults to the sum of the capacities; `invert_battery` flips all of them.

The 3D, 7D, month and all-time totals and bars come from the long-term statistics of the daily energy sensors, so those need `state_class: total_increasing`. Statistics are compiled hourly; today's part always uses the live sensor.

## Roadmap

Planned, in no particular order. Ideas and votes are welcome in [issues](https://github.com/gratak/solar-flow-card/issues).

- **A visual editor for every option, rethought**: not everyone likes writing YAML. The editor covers the theme, the numbers and the switches today. It should also cover:
  - the sensors (`entities:`) with entity pickers, the most important part for inverters other than DeyeCloud;
  - `energy_sensors`, `invert_grid` and `invert_battery`;
  - `sections:` (pick and drag to reorder) and `collapsed`;
  - `virtual_storage` (entity, negative balance, count as own);
  - `inverter_details`, `batteries`, `panels` and `weather_entity`.
  
  The editor itself is to be reorganized into groups (appearance, sensors, sections, summary, advanced), so that the growing number of options stays easy to find.
- **PV production forecast** ([#69](https://github.com/gratak/solar-flow-card/issues/69)), planned for 1.7.0, from forecast sensors such as Solcast or Forecast.Solar:
  - today's forecast and what is still expected ("forecast 25 kWh · 8 kWh left") next to the solar reading, the remaining value from its own sensor;
  - a forecast section with today and the next days as bars in kWh, scaled automatically, with the pessimistic–optimistic range where the sensor gives it (Solcast `estimate10` / `estimate90`);
  - today's progress: produced so far next to what is still expected;
  - the hourly forecast as a line in the 24H chart next to the actual production (Solcast `detailedHourly`).
- **Several inverters** (`inverters:`, like `batteries:`): power and energy summed by the card without helper sensors, for example an on-grid and an off-grid inverter of different brands, with each inverter listed separately in the Installation section. Until then, combine them with Home Assistant "Sum" helpers under `entities:`.

## Translations

The card speaks English, Polish and Dutch (thanks to @furian88). Every language is one JSON file in [`translations/`](translations/); adding yours takes a copy of `en.json` and no programming. See [CONTRIBUTING.md](CONTRIBUTING.md#add-or-improve-a-translation).

## Development

The card is built from `src/*.js` and `translations/*.json` into `solar-flow-card.js` (after a merge into `main` a GitHub Action does this automatically):

```sh
node scripts/build.mjs
```

`demo/index.html` (also [online](https://gratak.github.io/solar-flow-card/demo/)) runs the card against a stand-in Home Assistant (`demo/mock-hass.js`) with DeyeCloud-style data; serve the repository root and open it to try themes, scenarios and languages. `node scripts/screenshots.mjs` (needs Playwright) renders the screenshots in `docs/`.

## License

MIT. The data layer started from the Energy Flow card of [hass-deyecloud](https://github.com/heavenknows1978/hass-deyecloud) by Trần Công Tuấn Anh, also MIT.
