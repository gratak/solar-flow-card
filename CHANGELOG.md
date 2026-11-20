# Changelog

## 2.2.0

**A showroom scene for Diorama** ([#150](https://github.com/gratak/solar-flow-card/issues/150)), in the style of an EV maker's app. Nothing to change when upgrading from 2.1.x: the drawn scene stays the default. The details of each step are in the betas below.

- `diorama_style: showroom` replaces the drawn scene with a rendered modern house with a solar roof, a home battery, a power line and your car on the driveway, by day on a light studio background, at night (and with `dark_mode`) on a dark one with lit windows.
- The flows are thin glowing lines with a pulse of light running the way the power flows, shown only while power flows.
- The values come in two styles, chosen with `showroom_labels`: a strip along the bottom of the picture (`bar`, the default) or small glass chips with an icon beside each element (`icons`).
- The car is labelled "EV"; a name set for it shows as its tooltip.
- Readable by day and by night, on a light or a dark card, and on narrow cards.
- In the editor under Appearance → Scene and Appearance → Values. The two pictures add about 26 KB to the card.

## 2.2.0-beta.4

- **Showroom values in two styles**, chosen with `showroom_labels` (in the editor under Appearance → Values):
  - `bar` (the default): a strip along the bottom of the picture with each value's icon and name;
  - `icons`: small glass chips with an icon beside the roof, the battery, the pole, the house and the car, kept inside narrow cards.
- The car is labelled "EV"; a name set for it shows as its tooltip.
- The labels with leader lines from beta.3 are gone.

## 2.2.0-beta.3

- **Showroom redesigned, closer to an EV maker's app:**
  - Flows are thin glowing lines with a pulse of light running the way the power flows, shown only while power flows; no more dotted lines or faint idle streaks.
  - The pills are replaced by labels: the name in the element's colour above a large value, tied by a fine line to a dot on what it measures (the roof, the battery cabinet, the pole, the house, the car), so it is clear which value belongs where.
  - The picture is cropped to the house, so the house is larger; the clock moves under the title.
  - Labels stay readable in every combination of day/night and a light or dark card.

## 2.2.0-beta.2

- **Showroom easier to read:** at night the pills are light glass with white values and a rim instead of dark on dark, and a little larger in the showroom scene by day too. The flows that carry power are thicker and glow more; the idle routes are a faint line instead of a white streak across the house. The battery's pill sits under the battery cabinet and says what it is ("55% battery −1.32 kW") instead of floating at the side.

## 2.2.0-beta.1

- **Showroom scene for Diorama** ([#150](https://github.com/gratak/solar-flow-card/issues/150)): `diorama_style: showroom` replaces the drawn scene with a rendered modern house with a solar roof, a home battery and a power line, in the style of an EV maker's app. By day on a light studio background, at night (and with `dark_mode`) on a dark one with lit windows. The flows glow over the picture: from the roof, along the battery's wall, along the power line and to the car on the driveway; the pills keep their places. The two pictures add about 26 KB to the card. In the editor under Appearance → Scene. The drawn scene stays the default.

## 2.1.1

- **A compact energy section** ([#151](https://github.com/gratak/solar-flow-card/issues/151)): with a single period under `periods` the tab bar is hidden, as there is nothing to choose; `energy_title: false` hides the section's heading. With `period_browse: false` too, the section shows just the chart (or not, with `show_chart: false`), the tiles and the summary. In the editor under Look → Period tabs.
- **Atlantis on a phone:** the battery label on the left ("Storage 96%") was cut at the card's edge on narrow cards; its letters are set closer there now.

## 2.1.0

The biggest update since 2.0: a quick start in the editor, browsing earlier periods, time-of-use and dynamic tariffs, payback, and much more. Nothing to change when upgrading from 2.0.x: every new option is optional and in the visual editor. The details of each step are in the betas below.

**Setup**
- **Quick start:** for a new card the editor asks whether to use a three-step wizard (where the data comes from, prices, look) or the usual editor. DeyeCloud and Home Assistant's Energy dashboard are found automatically; for an inverter integration (Huawei Solar, SolarEdge, Fronius, GoodWe, Victron, Solarman and others) its sensors are proposed by their meaning.
- **Works without configuration with the Energy dashboard:** without sensors of its own (or DeyeCloud), the card uses the ones set up under Settings → Dashboards → Energy.

**Periods**
- **Browse earlier periods:** arrows under the tabs step back a day (with that day's power chart), three days, a week, a month or a year. `period_browse: false` hides them.
- **Period tabs of your choice** ([#119](https://github.com/gratak/solar-flow-card/issues/119)): `periods:` picks and orders the tabs, with two new ones: `last_month` and `year`.

**Prices and money**
- **Purchase prices by period:** for time-of-use tariffs, `price_import_periods` lists prices with their hours, days (working days, weekend) and months, as many as the tariff has; `holidays_as_weekend` counts Poland's public holidays as weekend days.
- **Dynamic tariffs in any country:** a market price sensor (spot, Nord Pool, ENTSO-E, RCE…) as the purchase price, with `price_import_add` and `price_import_multiplier`: (price + surcharge) × multiplier, hour by hour.
- **Payback** ([#124](https://github.com/gratak/solar-flow-card/issues/124)): `payback: { cost, saved_before }` shows how much of the system's cost the savings have paid back and when it will be paid off; hour by hour with changing prices.
- **Costs:** `show_costs: true` adds the cost of the energy bought and the value of the energy sold.
- **Cheapest hours:** the cheapest hours in a row among the coming ones (`price_window`) and coming negative prices.

**Home and installation**
- **Grid down** ([#140](https://github.com/gratak/solar-flow-card/issues/140)): with `grid_status` (automatic with DeyeCloud) the card shows "Grid down" instead of "Balanced".
- **Grid guard:** `voltage_limit` marks a phase above 253 V; `main_fuse` shows each phase's share of the main fuse.
- **Battery over the next day:** the charge level simulated hour by hour from the PV forecast and the home's usual consumption.
- **Consumers:** where the home's power goes, device by device.
- **Phase names** ([#136](https://github.com/gratak/solar-flow-card/issues/136)): `phase_names: [House, Garage, Pump]`.

**Look**
- **An electric car in Diorama** ([#126](https://github.com/gratak/solar-flow-card/issues/126)): `ev: { power, soc, name, color }`.
- **Dark Diorama** ([#125](https://github.com/gratak/solar-flow-card/issues/125)): `dark_mode: true` or `auto`.
- **Your colours:** `colors: { solar, load, grid, battery }`.
- **Spanish:** thanks to @PedroFlores199 ([#146](https://github.com/gratak/solar-flow-card/pull/146)).

**Automations**
- **Blueprints for the solar surplus:** switch a device on with surplus, and charge the car from surplus; importable from the README.

**Fixes**
- Battery and grid power on the 24H and 3D charts with one-way sensors ([#120](https://github.com/gratak/solar-flow-card/issues/120)).
- Narrow cards: period tabs, Diorama pills, LCARS readouts and folded headers no longer get cut.
- The "Year ago" comparison column shows only with real data.

## 2.1.0-beta.12

- **Spanish:** a full Spanish translation, thanks to @PedroFlores199 ([#146](https://github.com/gratak/solar-flow-card/pull/146)). Home Assistant set to any Spanish (Spain, Mexico, Argentina…) uses it automatically.
- **Browse earlier periods:** arrows under the period tabs step back and forward: a day at a time in 24H (with that day's power chart), three days or a week at a time, a month at a time, a year at a time. The dates of the period shown sit between the arrows; a click on them returns to the current period, as does choosing another tab. The tiles, the chart, the savings and the costs follow the period shown. `period_browse: false` hides the arrows; also in the editor under Look → Period tabs.

## 2.1.0-beta.11

- **Purchase price from a market price sensor:** for a dynamic tariff in any country, `price_import` can be a market price sensor (spot, Nord Pool, ENTSO-E, RCE…) with what the tariff adds: `price_import_add` per kWh (margin, distribution, taxes) and `price_import_multiplier` (e.g. VAT). The purchase price is (price + surcharge) × multiplier, hour by hour, also in the price chart. The purchase price sensor can now be chosen in the editor with every settlement (net-billing and net-metering too), with both fields beside it.

## 2.1.0-beta.10

- **Purchase prices by period:** for tariffs whose price depends on the hour, the day or the season, `price_import_periods` lists the prices with their hours, days (every day, working days, weekend) and months, as many periods as the tariff has. Outside them `price_import` applies. Savings, costs and payback are worked out hour by hour at the price of each hour. `holidays_as_weekend: true` counts Poland's public holidays as weekend days. All in the editor under Summary and prices → Purchase prices by period.

## 2.1.0-beta.9

- **Quick start on request:** a new card no longer opens the quick start by itself. The editor first asks how to set the card up: with the quick start, or by hand in the usual editor. The quick start can still be opened later from the button at the top of the editor.

## 2.1.0-beta.8

- **A new car in Diorama** ([#126](https://github.com/gratak/solar-flow-card/issues/126)): the boxy hatchback is replaced by a picture of a sleek white electric saloon with a glass roof, drawn from the scene's own angle. It is dimmed at night like the rest of the scene.
- **Car colour:** `ev: { color: "#b3121b" }` paints it (the glass and the wheels stay dark); white by default. Also in the editor under Installation → Electric car.

## 2.1.0-beta.7

- **Grid down** ([#140](https://github.com/gratak/solar-flow-card/issues/140)): with a grid status sensor the card shows "Grid down" in place of "Balanced" when the grid is disconnected, in every theme (LCARS: in the status bar too).
  - `entities.grid_status`: a binary sensor ("on" while connected, or "on" when lost for a "Grid lost" / problem sensor) or a text sensor ("Off-grid", "Disconnected", "Pull-out"…).
  - `grid_off_states: [Backup]` names the states that mean the grid is down, when the card does not recognise them.
  - DeyeCloud: the inverter's grid relay status is used automatically.
  - Both in the editor under Sensors → Installation readings.

- **Period tabs on narrow cards:** with six or seven tabs (e.g. `last_month` and `year` added under `periods`) the tab names were cut to "2…", "3…" on a phone. They now go into two even rows when they do not fit in one. The default five tabs look as before.
- **Diorama on a phone:** the grid and car value pills went past the right edge of the scene on narrow cards. They are now moved inside it, and a pill moved this way does not cover its neighbour. On the narrowest cards (about 340 px and less) the house pills show the value only.
- **LCARS on a phone:** the labels of the top readout ("Self-sufficiency today") and the stored energy in the battery forecast no longer run over the edge.
- **Folded section headers:** a long section name, such as "Virtual storage · hourly balance", takes a second line instead of being cut next to its value; a long value goes to a second line too, with each number kept beside its unit.

## 2.1.0-beta.6

- **Quick start in the editor:** a three-step wizard sets up the card: where the data comes from, energy prices, and the look.
  - It opens by itself for a new card, and from the "Quick start" button at the top of the editor.
  - DeyeCloud and Home Assistant's Energy dashboard are found automatically. For an inverter integration (Huawei Solar, SolarEdge, Fronius, GoodWe, Victron, Solarman and others), its sensors are proposed by their meaning, to check and correct. For Huawei Solar the battery and grid signs are set too.
  - Prices: none, fixed, net-billing with RCE, or a dynamic tariff from a sensor.
  - Look: the theme and a preset (simple, everything, battery without panels, chart only).
  - Nothing is written until "Finish"; options the wizard does not ask about stay as they are.
- **Phase names** ([#136](https://github.com/gratak/solar-flow-card/issues/136)): `phase_names: [Maison, Gîte, Studio]` names the phase tiles, e.g. when the three "phases" are separate meters. Also in the editor under Sensors → Installation readings.

## 2.1.0-beta.5

- **Payback with a battery and a dynamic tariff** ([#124](https://github.com/gratak/solar-flow-card/issues/124)): it showed 0% for a battery charged from the grid when it is cheap and used when it is dear. With hourly prices, payback is now worked out hour by hour since the statistics begin; whole months hid the gain.
- **Savings count the cost of charging from the grid:** an hour that charges the battery from the grid now counts as a cost instead of zero, so savings with a dynamic tariff match the bill. During the day, before the battery is used, the day's savings can be negative.

## 2.1.0-beta.4

- **Every option in the visual editor:** the electric car in the Diorama scene (`ev`, under Installation), the battery's next day (`battery_day`) and the number of PV strings (`panel_strings`) can now be set there too. A check in the repository makes sure every documented option stays in the editor.
- **Diorama:** the electric car is now drawn as a car (body, cabin, windows, wheels and lights) instead of a block, and the home's pill moves aside so it does not cover it.

## 2.1.0-beta.3

- **Payback** ([#124](https://github.com/gratak/solar-flow-card/issues/124)): `payback: { cost, saved_before }` (or `payback: <cost>`). The energy section shows how much of the system's cost the all-time savings have paid back, with a bar and the estimated payback date at the average rate so far. Needs prices. Also in the editor under Summary and prices.
- **Dark Diorama** ([#125](https://github.com/gratak/solar-flow-card/issues/125)): `dark_mode: true`, or `auto` to follow Home Assistant's dark mode, puts the card around the Diorama scene in night colours. Also in the editor under Appearance.
- **An electric car in the Diorama scene** ([#126](https://github.com/gratak/solar-flow-card/issues/126)): `ev: { power, soc, name }` draws the car beside the house with its wall charger, a flow while it charges, and a pill with the power and charge level.
- **Blueprints for the solar surplus:** two Home Assistant automations to import from the README.
  - *Switch on with solar surplus*: a heater, air conditioner, water heater or plug goes on while the panels export more than a set power and off when the home imports, with delays and a minimum run time. A device switched on by hand is left on.
  - *Charge the car with solar surplus*: the wallbox's charging current follows the surplus every minute between a minimum and maximum, and charging starts and stops after a surplus or shortfall lasting a set time.

## 2.1.0-beta.2

- **Battery and grid power on the 24H and 3D charts** ([#120](https://github.com/gratak/solar-flow-card/issues/120)): with separate charge/discharge (or import/export) power sensors the chart could show too much power and charging as discharging. Such sensors often report nothing while no power flows their way, or report charging as a negative number (DeyeCloud does both); the chart kept the last reading for hours and subtracted it. A one-way sensor now counts by its size, and as 0 while it reports nothing.
- **Period tabs of your choice** ([#119](https://github.com/gratak/solar-flow-card/issues/119)): `periods:` picks and orders the tabs, with two new periods: `last_month` (the whole previous month, day by day) and `year` (this year, month by month). Leaving a period out hides its tab, for example `all`. Also in the editor under Appearance.
- **Comparison:** the "Year ago" column shows only with real data from a year ago, not as a column of zeros.

## 2.1.0-beta.1

**Works without configuration with Home Assistant's Energy dashboard**
- The card uses the sensors set up under *Settings → Dashboards → Energy* (grid, solar, battery, home; power, charge level and capacity where set) wherever it has none of its own. Several of a kind are added up. Before, a user without DeyeCloud saw an empty card until every sensor was picked by hand.
- Sensors set in the card come first, then DeyeCloud, then the Energy dashboard.
- Editor: empty fields show what was found; one click writes the sensors into the card to adjust them.

**Grid guard**
- `voltage_limit` (default 253 V, `false` = off): a phase above the limit is marked in Installation with a warning. The day's highest voltage and the time above the limit show there and in "Today at a glance".
- `main_fuse` (A per phase): each phase's current and share of the main fuse, with a warning from 90 %.

**Consumers** (section `consumers`)
- Where the home's power goes: each device's power now as a bar against the home's load, its energy today, and "Other" for the rest.
- Devices from `consumers:` or, without it, the individual devices of Home Assistant's Energy dashboard.

**Battery over the next day**
- The charge level simulated hour by hour from the hourly PV forecast and the home's usual consumption: "Next 24 h: full around 12:40 · lowest 35% around 06:00". The 24H chart continues the charge level as a dotted line.
- Needs `battery_capacity` and an hourly PV forecast (Solcast, or one set up in the Energy dashboard such as Forecast.Solar). `battery_day: false` turns it off.

**Energy prices**
- The cheapest hours in a row among the coming ones (`price_window`, default 3) are named and underlined in the chart, with the solar forecast for those hours when known.
- Coming hours with a negative price are listed.

**Smaller additions**
- **Your colours:** `colors: { solar, load, grid, battery }` for the charts, tiles and bars, also in the editor.
- **Costs:** `show_costs: true` adds the cost of the energy bought and the value of the energy sold to the summary.
- **Comparison:** a column with the same days of this month a year ago, when the statistics go back that far.

**Narrow cards**
- Values are no longer cut short: phase tiles showed "-120…" without the unit in five themes at 320 px.
- Period tabs, tile labels, insight labels and titles fit or wrap instead of ending in "…"; Polish tabs are "Mies." and "Całość".
- The comparison table fits a phone without scrolling sideways.

## 2.0.2

- **French:** a full French translation, thanks to @lboue ([#109](https://github.com/gratak/solar-flow-card/pull/109)). Home Assistant set to French uses it automatically, including Belgian, Swiss and Canadian French.

## 2.0.1

- **Portuguese:** a full European Portuguese (pt-PT) translation, thanks to @dresende ([#107](https://github.com/gratak/solar-flow-card/pull/107)). Home Assistant set to Brazilian Portuguese uses it too.

## 2.0.0

**Home Energy Hub 2.0.** Everything from the 1.8 and 2.0 betas, now stable, and a new card type. The details of each change are in the beta sections below.

### ⚠️ Possibly breaking: the card type is now `custom:home-energy-hub`
- Existing cards with `type: custom:solar-flow-card` **keep working**: the old type stays registered as an alias.
- The visual editor switches a card to the new type with the next change you make in it, and says so at the top. New cards from "Add card" use the new type.
- **What can break:**
  - card-mod or other CSS that selects the element by name (`solar-flow-card`), once a card's type was switched;
  - scripts or other cards that look for the `solar-flow-card` or `solar-flow-card-editor` elements by name.
- **Unchanged:** the repository, the file `solar-flow-card.js`, its dashboard resource, the HACS entry and every option.

### New since 1.7.1
- **Visual editor**, no longer beta:
  - almost every option, in groups;
  - each sensor field shows its value now, or what was found automatically (DeyeCloud);
  - warnings for the usual mistakes: a missing sensor, a wrong unit, a lifetime counter set up as daily, W instead of kW, the grid sign;
  - sections ticked and ordered with arrows.
- **Energy prices and settlement:**
  - prices from sensors, with savings worked out hour by hour;
  - a chart of today's and tomorrow's hourly prices;
  - net-billing (energy sold at the hourly RCE × 1.23, the RCE sensor found automatically) or net-metering (0.8 / 0.7);
  - the value of the energy sold when only an export price is set.
- **Several inverters** (`inverters:`): solar power and energy summed without helpers; each inverter listed in Installation.
- **PV forecast, part 2:**
  - the hourly forecast as a dashed line in the 24H chart (Solcast, or Home Assistant's energy forecast such as Forecast.Solar);
  - Solcast's 10–90% range on the day bars, which can be turned off.
- **Custom sections** (`custom_sections:`): your own sections with any sensors as tiles, placed and folded like the others.
- **Inverter details:**
  - no duplicate readings, with plain translated names;
  - unused PV inputs and an empty second battery input hidden;
  - load-side voltages only when they differ from the grid;
  - string tiles in even rows.
- **Narrow cards and phones:** sections and chart labels stay inside the card.
- **Name:** Solar Flow Card is now Home Energy Hub.
- **License:** GPL-3.0-or-later (versions up to 1.8.0-beta.8 stay MIT; translations stay MIT).

## 2.0.0-beta.4

- **PV forecast:** the 10–90% brackets on the day bars can be turned off with `pv_forecast.range: false` ([#69](https://github.com/gratak/solar-flow-card/issues/69)). Without the brackets, the bars are scaled to the forecasts alone.
- **Editor:** switches for the brackets and for the hourly forecast line in the 24H chart (`hourly`) under PV forecast. Both are on by default; only a switch turned off is written to the YAML.

## 2.0.0-beta.3

- **Custom sections:** values show as many decimals as the sensor reports, at most two (49.98 Hz, 231.8 V, −0.7 A). Before, 49.98 Hz was rounded to 50.0 Hz. `decimals:` still overrides it.
- **Wide layout:** a folded energy section keeps its margins instead of touching the card's edge.

## 2.0.0-beta.2

- **Custom sections** (`custom_sections:`): sections of your own with a title and any sensors, shown as tiles. Examples: each phase's load and voltage, a heat pump, an EV charger.
  - `max` adds a bar.
  - Power and energy are shown as everywhere in the card; other values with their unit, text states as they are.
  - They are `custom_1`, `custom_2`… in `sections:` and `collapsed:`, so they can be placed anywhere, for example right after the main view, and stay open while the rest is folded.
  - In the editor: **Sections → Custom sections**.
- **Dutch:** clearer wording of the net-billing button in the editor.

## 2.0.0-beta.1

Everything since 1.8.0-beta.8. The card has grown enough for a new major version: several inverters, energy prices and settlement, the PV forecast in detail and the visual editor. Your dashboards keep working: the card type stays `custom:solar-flow-card`.

**License**
- **GPL-3.0-or-later** (was MIT). You may still use, share and change the card, also commercially, but what you distribute must stay under the same license with its source code, so it cannot become a closed, paid product.
  - Versions up to 1.8.0-beta.8 stay available under MIT.
  - The translations remain MIT.

**Several inverters** (`inverters:`)
- An on-grid and an off-grid inverter, or two of different brands, without helper sensors. The card sums their solar power and energy for the flow, the charts, the statistics and the savings.
- The Installation section lists each inverter with its power, its load and today's production. The total load is their sum.
- In the editor: an Inverters list under Installation.

**Energy prices and settlement**
- **Energy prices chart** (`prices` in `sections:`). It works with a price sensor that lists its hourly prices (ProfitEMS or PSE RCE, Nord Pool, Tibber and similar). It shows:
  - today's prices by the hour, from green to red, and tomorrow's once they are published;
  - the hour now marked, and negative prices below the line;
  - the cheapest and the dearest of the coming hours.
- **Settlement: net-billing or net-metering** (`settlement`, also in the editor). You enter only the import price.
  - **Net-billing:** the energy sold is valued at the hourly RCE price × 1.23, the deposit value under the Polish rules (`billing_factor`; `1` turns it off). The card finds an RCE price sensor in Home Assistant by itself.
  - **Net-metering:** each kWh sent back is worth 0.8 of a kWh bought, or 0.7 above 10 kWp (`metering_ratio`).
- **Export price only:** the summary shows the value of the energy sold, instead of no money value at all.
- **Editor:**
  - With fixed prices it finds an RCE sensor and offers to switch to net-billing with one click.
  - A hint explains what the import price includes: energy and the per-kWh distribution charges, without monthly fixed fees.

**PV forecast, part 2** ([#69](https://github.com/gratak/solar-flow-card/issues/69))
- **Hourly forecast in the 24H chart:** a dashed line next to the actual production.
  - It comes from Solcast's `detailedHourly`, or else from Home Assistant's own energy forecast (Forecast.Solar and the other integrations chosen in the Energy dashboard).
  - `pv_forecast.hourly: false` turns it off, and the legend hides it.
- **The pessimistic–optimistic range** (Solcast `estimate10`–`estimate90`) as a bracket on each day's bar.

**Narrow cards**
- On a phone the sections no longer run past the card's right edge. This happened with a long heading or a wide theme font, as in Reactor and LCARS.
- The chart axis labels stay inside the chart; on a narrow card the prices axis shows a label every 12 hours.
- The phase tiles fit in LCARS.

## 1.8.0-beta.8

- **Prices from sensors:** `price_import` and `price_export` accept a price sensor as well as a number, e.g. the hourly RCE price under net-billing or a dynamic tariff.
  - The savings are worked out hour by hour, each hour's energy at that hour's mean price; for all time, month by month.
  - The hour in progress uses the current price.
  - With virtual storage, only the energy left after each hour's balancing counts.
  - Prices per kWh and per MWh are both read correctly, and a negative export price lowers the savings as it does on the bill.
- **Editor:** "Prices from sensors" under Summary and prices, showing the current price. Warnings when the unit is not a price per kWh or MWh, and when the sensor keeps no hourly history.

## 1.8.0-beta.7

- **PV strings, even rows:** the string tiles (Inverter details and Panels) take as many columns as fit for the number of strings, so no tile is left alone in the last row.
  - 2 strings: side by side or stacked.
  - 3: three in a row or stacked.
  - 4: four in a row, 2 × 2 or stacked.
  - 5 or more: three or two per row.
  
  On a phone the Inverter details show two strings per row instead of one.

## 1.8.0-beta.6

- **Load-side voltages:** they show only while they do not follow the grid, i.e. when the grid is down or a phase differs by more than 10 V (running off-grid), and then all phases together. Before, a phase a few volts off the grid's could show on its own.

## 1.8.0-beta.5

- **Inverter details, full names:** each tile is as wide as its name and the row is filled, instead of narrow tiles with truncated names and empty space next to them.
- **No more echoes:**
  - a numbered battery reading at zero (an empty second battery input) is hidden;
  - a single numbered one that equals the total is hidden;
  - the load-side voltage is shown only when it differs from the grid's, for example when running off-grid.

## 1.8.0-beta.4

**Solar Flow Card is now Home Energy Hub.** It has grown into a hub for the whole home's energy, with or without solar or a battery, so it got a name to match. Nothing changes for your dashboards: the card type stays `custom:solar-flow-card`, the repository and the file name stay the same, and updates keep coming through HACS as before.

- **Inverter details, clearer and without duplicates.** DeyeCloud reports some readings twice under different names (the phase voltages as ACVoltageRUA/SVB/TWC and as GridVoltageL1/L2/L3; BatteryCurrent and BatteryTotalCurrent), and the duplicates could push other readings out.
  - Each reading now shows once.
  - Each reading has a plain, translated name: Voltage L1–L3, Frequency, Inverter AC/DC side, Battery.

## 1.8.0-beta.3

- **Unused PV inputs are hidden.** Inverters such as Deye report every PV input, also the ones with nothing connected (0 V, 0 A).
  - With `panels_per_string` the Inverter details show as many strings as the list has.
  - Without it, they hide the strings at zero while another one produces.
- **Panels without optimizers:** the string tiles are wider, so their text no longer wraps over several lines in the wide layout.
- **Editor, DeyeCloud:** the installation readings (phases, voltages, battery temperature and so on) and the PV strings show what was found automatically, like the power and energy sensors. Each group says how many sensors were found. The Installation group shows the inverter's rated power when DeyeCloud reports it.
- **Editor:** boxes you open inside a group stay open while you edit. Raw values are rounded.

## 1.8.0-beta.2

The editor now covers every option and helps avoid the usual mistakes:

- **Each sensor field shows its value right now**, or, when left empty, what DeyeCloud found by itself.
- **Warnings** where a setting would break the card:
  - a sensor that does not exist;
  - a unit that does not fit, e.g. a voltage sensor in a power field;
  - an energy sensor without the statistics the longer periods need;
  - a lifetime counter set up as a daily sensor;
  - a single grid or battery sensor together with the import/export (charge/discharge) pair;
  - a PV size, inverter rating or battery capacity entered in W/Wh instead of kW/kWh;
  - importing more than the panels produce, a hint at the grid sign.
  
  Under the sign switches, the current solar, grid and battery power with the settings as they are.
- **Several batteries** (`batteries:`), **panel sensors** (`panels:`) and **inverter details with names** are edited in the editor too.
- **History for the charts** (`…_history`), for sensors kept out of the recorder, in an advanced box under Sensors.
- **Confirmation** before removing a filled battery, panel or detail, or unticking the last section. A note about privacy when Google Fonts are switched on.

## 1.8.0-beta.1

**The new visual editor (beta).** Not everyone likes YAML, so the editor now covers almost every option, in groups that open on tap:

- **Appearance:** theme, title, language, starting period, wide layout, glass, animations, fonts, collapsible sections, chart and weather.
- **Sensors:** every `entities:` key picked from your Home Assistant entities (live power, energy, installation readings, PV strings), whether the energy sensors reset daily or never, and the grid and battery sign.
- **Sections:** tick what the card shows and change the order with the arrows. With collapsible sections, also choose which start folded. The old `show_energy` / `show_forecast` / `show_system` / `show_panels` switches become part of this list.
- **Installation:** battery, PV size, inverter, panels per string.
- **Summary and prices:** prices, currency, CO₂ factor and the summary items.
- **Virtual storage** and **PV forecast** with entity pickers.
- **More:** extra inverter sensors, the weather entity, a self-hosted font stylesheet.

Several batteries (`batteries:`) and per-panel sensors (`panels:`) stay in YAML for now. Options the editor does not show are kept as they are. Please report anything odd in the issues.

## 1.7.1

- **German** translation (thanks @AndiBo62), completed with the keys added since it was started.
- **24H and 3D without power history:** when the power sensors have no recorded history (for example excluded from the recorder), the chart shows the average power of each hour from the energy statistics instead of "No history". A note under the chart names the sensors without history.
- When there is nothing to draw at all, the message names the power sensors that have no history and asks whether they are excluded from the recorder.

## 1.7.0

- **Several cards instead of one:** a card whose `sections:` leave out `flow` shows its sections as one plain card. The sections lose their own box and a line separates them, so parts of the card can sit anywhere on a dashboard. Cards on the same page share the history and statistics they load, so Home Assistant is asked once. See the README for an example.
- **Panels without optimizers:** with `panels_per_string` the Panels section shows one tile per string (its power, and ≈ power and today's energy per panel) instead of a row of identical estimated tiles for every panel.
- **Separate history sensors** (#74): every live power sensor under `entities:` accepts a `_history` twin, e.g. `grid_power_history`. The charts and "Today at a glance" read the twin, so a fast live sensor can stay out of the recorder.
- **PV production forecast** (`pv_forecast`, #69), from Solcast, Forecast.Solar or similar sensors. What is still expected today shows at the solar reading (in Diorama under "Today from the roof"). A new **PV forecast** section (`pv_forecast` in `sections:`) shows today and the next days as bars, with today's production so far.

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
