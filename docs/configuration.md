# Configuration guide for any inverter

The card works with any inverter that Home Assistant can read. With
[hass-deyecloud](https://github.com/heavenknows1978/hass-deyecloud) it finds
the sensors by itself. With anything else you point it at your sensors under
`entities:`. This page explains what each entry expects, what the card checks,
and which helper sensors to create when your integration doesn't provide
something directly.

The full list of card options (themes, layout, sections, prices…) is in the
[README](../README.md#configuration). This page is only about data.

## How the card uses your sensors

| What | Read from | Used for |
|---|---|---|
| **Live power** (W) | the current state of the `*_power` sensors | the animated flow, the battery forecast, the Installation section |
| **Power history** | the recorder history of the same sensors | the 24H and 3D charts, "Today at a glance" |
| **Today's energy** (kWh) | the current state of the `*_energy` sensors | the 24H totals and summary |
| **Energy over longer periods** | Home Assistant's long-term statistics of the `*_energy` sensors | 3D, 7D, month, all time, the comparison |

The card calls nothing in the cloud: everything comes from Home Assistant.

## What the card checks

- **Units.** Power may be in `W`, `kW` or `MW`, and energy in `Wh`, `kWh` or `MWh`. The card converts them (`unit_of_measurement`). Sensors without a unit are taken as W and kWh.
- **`device_class`** is not checked. Any sensor with a numeric state works.
- **`state_class`** matters only for the energy sensors. The 3D, 7D, month and all-time periods come from long-term statistics, which Home Assistant keeps only for sensors with `state_class: total_increasing` or `total`. `measurement` energy sensors still work for today, but the longer periods stay empty.
- **Daily or lifetime energy sensors.** By default the card expects energy sensors that reset at midnight (e.g. "daily yield", "today's import"). If yours keep counting forever, like most energy meters, set `energy_sensors: total`. The card then takes today's energy from Home Assistant's hourly statistics (the same way the Energy dashboard does), so the sensors need `state_class: total_increasing` or `total`; it works even when a sensor is unavailable at night. All `*_energy` sensors of one card should be of the same kind; if they are not, see [Helpers](#helpers).

## Entities

All entries are optional. The card shows what it gets. With nothing for the battery it hides the battery, and without a consumption sensor it works out the home consumption itself (see below).

### Live power

| Key | Meaning | Sign |
|---|---|---|
| `solar_power` | Power from the panels. Use the inverter's **AC output** (active power): without `load_power` the card computes the home as `solar + grid + battery`, which needs the power the inverter actually delivers. The DC input is a little higher (inverter losses). | always ≥ 0 |
| `load_power` | Power used by the home. **Optional:** without it the card computes `solar + grid + battery` (grid + import, battery + discharge). | ≥ 0 |
| `grid_power` | Power exchanged with the grid, one signed sensor. | **+ import, − export** (`invert_grid: true` if yours is the other way round) |
| `grid_import_power`, `grid_export_power` | The same as two sensors, both ≥ 0. Use these *or* `grid_power`. | ≥ 0 |
| `battery_power` | Battery power, one signed sensor. | **+ discharging, − charging** (`invert_battery: true` for the other way round) |
| `battery_charge_power`, `battery_discharge_power` | The same as two sensors, both ≥ 0. Use these *or* `battery_power`. | ≥ 0 |
| `battery_soc` | Battery level. | % |

### Energy

| Key | Meaning |
|---|---|
| `solar_energy` | Energy from the panels |
| `load_energy` | Energy used by the home. **Optional:** without it the card computes `solar + import − export + discharge − charge`. |
| `grid_import_energy` | Energy taken from the grid |
| `grid_export_energy` | Energy sent to the grid |
| `battery_charge_energy` | Energy charged into the battery |
| `battery_discharge_energy` | Energy taken from the battery |

kWh (Wh and MWh are converted), daily by default or lifetime with `energy_sensors: total`. They need `state_class: total_increasing` or `total` for the periods longer than today.

### Installation section (all optional)

| Key | Meaning |
|---|---|
| `load_power_l1` … `_l3` | Home power per phase (W) |
| `grid_power_l1` … `_l3` | Grid power per phase (W, + import) |
| `grid_voltage_l1` … `_l3` | Voltage per phase (V) |
| `inverter_power` | Inverter output power (W), for the inverter load bar |
| `inverter_rated_power` | Inverter rated power (W). Or set `inverter_power_rating` in kW instead. |
| `battery_temperature`, `battery_voltage`, `battery_current` | Battery readings (°C, V, A) |
| `generator_power` | Generator power (W), shown while it runs |
| `pv1_power` … `pv4_power` | Power of each PV string (W) |
| `pv1_voltage` … `pv4_voltage`, `pv1_current` … `pv4_current` | Voltage (V) and current (A) of each PV string; without `pvN_power` the card shows voltage × current |

A single-phase installation simply gives `_l1` only; the card shows the phases it gets.

With only grid power per phase (no per-phase consumption), each phase shows its grid power: the bar is green while the phase exports and red while it imports.

The PV string entries fill the **Inverter details** (tap the inverter in the flow, always open in the wide layout) and let `panels_per_string` estimate the panels. Any other sensor goes under `inverter_details:`, a list shown as tiles in the same section (a text state such as "On-grid" works too):

```yaml
inverter_details:
  - sensor.inverter_internal_temperature
  - entity: sensor.inverter_efficiency
    name: Efficiency
  - sensor.inverter_device_status
```

Without any of these (and without DeyeCloud) the card shows no inverter details and no link to them.

## Helpers

Home Assistant can create the missing pieces without YAML: **Settings → Devices & services → Helpers → Create helper**.

| You have | You need | Helper |
|---|---|---|
| Grid power per phase only | `grid_power` | **Combine the state of several sensors** (type *Sum*) of the three phase powers |
| Two inverters | `solar_power`, `solar_energy` … | **Combine the state of several sensors** (*Sum*) of the matching sensors |
| Power only (W), no energy (kWh) | an `*_energy` sensor | **Integral sensor** (Riemann sum, method *left*, unit prefix *k*) of the power sensor |
| A lifetime counter, but you want a daily one | a daily `*_energy` sensor | **Utility meter**, reset cycle *daily* |
| A grid sensor that is + while exporting | `grid_power` with + import | `invert_grid: true` (no helper needed) |
| One signed sensor, but you prefer two | `grid_import_power` / `grid_export_power` | **Template sensor**: `{{ max(states('sensor.grid_power') | float(0), 0) }}` and `{{ max(-(states('sensor.grid_power') | float(0)), 0) }}` |

## Examples

### DeyeCloud

Nothing to set: the sensors are found automatically. With several DeyeCloud stations pick one with `station_id`.

```yaml
type: custom:solar-flow-card
theme: diorama
battery_capacity: 10
```

### A hybrid inverter with a battery

```yaml
type: custom:solar-flow-card
theme: reactor
battery_capacity: 10.2        # kWh, for the battery forecast
battery_min_soc: 15           # %, the reserve the forecast counts down to
pv_capacity: 8                # kWp
entities:
  solar_power: sensor.inverter_pv_power
  battery_power: sensor.inverter_battery_power      # + discharging
  battery_soc: sensor.inverter_battery_soc
  grid_power: sensor.inverter_grid_power            # + import
  load_power: sensor.inverter_load_power
  solar_energy: sensor.inverter_daily_pv_energy
  grid_import_energy: sensor.inverter_daily_grid_import
  grid_export_energy: sensor.inverter_daily_grid_export
  battery_charge_energy: sensor.inverter_daily_battery_charge
  battery_discharge_energy: sensor.inverter_daily_battery_discharge
```

### Huawei (huawei_solar) without a battery, with a separate grid meter

A Huawei inverter with optimizers on two strings (11 + 7 panels) and a three-phase energy meter at the house connection (here a ZAMEL MEW-01 over MQTT). The meter reports power per phase (negative while exporting) and lifetime import/export counters.

1. Create a *Sum* helper of the three phase powers, `sensor.grid_power_total`: `sensor.0_electricity_meter_power_active_phase_1`, `_2`, `_3`.
2. The meter's energy counters and the inverter's total yield never reset, so the card uses `energy_sensors: total`.

```yaml
type: custom:solar-flow-card
theme: reactor
show_battery: false
energy_sensors: total
pv_capacity: 7.4                       # kWp of your panels
inverter_power_rating: 5.5             # kW
entities:
  solar_power: sensor.inverter_active_power            # W, AC output of the inverter
  grid_power: sensor.grid_power_total                  # W, + import / − export (Sum helper)
  inverter_power: sensor.inverter_active_power         # W, AC output
  grid_power_l1: sensor.0_electricity_meter_power_active_phase_1
  grid_power_l2: sensor.0_electricity_meter_power_active_phase_2
  grid_power_l3: sensor.0_electricity_meter_power_active_phase_3
  grid_voltage_l1: sensor.0_electricity_meter_voltage_phase_1
  grid_voltage_l2: sensor.0_electricity_meter_voltage_phase_2
  grid_voltage_l3: sensor.0_electricity_meter_voltage_phase_3
  solar_energy: sensor.inverter_total_yield                                # kWh, lifetime
  grid_import_energy: sensor.0_electricity_meter_total_forward_active_energy  # kWh, lifetime
  grid_export_energy: sensor.0_electricity_meter_total_reverse_active_energy  # kWh, lifetime
  pv1_voltage: sensor.inverter_pv_1_voltage
  pv1_current: sensor.inverter_pv_1_current
  pv2_voltage: sensor.inverter_pv_2_voltage
  pv2_current: sensor.inverter_pv_2_current
panels_per_string: [11, 7]
inverter_details:
  - sensor.inverter_internal_temperature
  - sensor.inverter_efficiency
  - sensor.inverter_device_status
```

`load_power` and `load_energy` are left out: the card works out the home's consumption from the panels and the grid. Without per-phase consumption, the Installation section shows the grid power of each phase.

With the PV string voltage and current, `panels_per_string: [11, 7]` shows each string with an estimate per panel (the optimizers' own readings are not used). The inverter's temperature, efficiency and status show in the Inverter details.

With an hourly net-balancing tariff, add `virtual_storage: true`: the card works out each hour's balance from the two ZAMEL counters (see the [README](../README.md#virtual-storage-hourly-net-balancing)). With [ha-balance-neto](https://github.com/miguelangellv/ha-balance-neto) installed you can point it at its net balance sensor instead (`virtual_storage: { entity: sensor.… }`).

If you prefer daily sensors instead, use `sensor.inverter_daily_yield` for `solar_energy` and two *Utility meter* helpers (daily) for the grid counters, and leave out `energy_sensors: total`.

## What DeyeCloud provides, for comparison

The card reads these DeyeCloud station values; the `entities:` key with the same meaning is next to each.

| DeyeCloud metric | `entities:` key |
|---|---|
| `generationPower` | `solar_power` |
| `consumptionPower` | `load_power` |
| `wirePower` (+ import) | `grid_power` |
| `purchasePower` / `gridPower` | `grid_import_power` / `grid_export_power` |
| `batteryPower` (+ discharging) | `battery_power` |
| `chargePower` / `dischargePower` | `battery_charge_power` / `battery_discharge_power` |
| `batterySOC` | `battery_soc` |
| `generationValue` (today) | `solar_energy` |
| `consumptionValue` (today) | `load_energy` |
| `purchaseValue` / `gridValue` (today) | `grid_import_energy` / `grid_export_energy` |
| `chargeValue` / `dischargeValue` (today) | `battery_charge_energy` / `battery_discharge_energy` |

## Checking your setup

- **Developer tools → States:** each sensor has a number as its state and the unit you expect.
- **Developer tools → Statistics:** the energy sensors are listed without errors (needed for 3D, 7D, month and all time).
- **The card's animation:** while the panels produce, the flow from the sun should run toward the home or the grid. If the grid line runs the wrong way, add `invert_grid: true`.
