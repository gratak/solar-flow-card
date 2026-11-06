# Contributing

Thanks for helping! Bug reports and ideas go to the [issues](https://github.com/gratak/solar-flow-card/issues).

## Add or improve a translation

Every language is one file in [`translations/`](translations/), named by its language code: `en.json`, `pl.json`, `de.json`, `pt-br.json`. You only edit that file; no JavaScript, no build.

1. Copy `translations/en.json` to `translations/<code>.json`, e.g. `de.json`. Use a lower-case [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) code, with a region only when it matters (`pt-br.json`).
2. Translate the **values**, never the keys:
   ```json
   "batteryForecast": "Akku-Prognose",
   ```
3. Fill in the three settings at the top:
   - `languageName`: the language in its own name, shown in the card editor (`"Deutsch"`).
   - `locale`: used for numbers, dates and times (`"de-DE"`).
   - `currency`: default currency for savings (`"€"`).
4. Keep the placeholders in curly braces exactly as they are, in any order the sentence needs: `"Full in {d}"` → `"Voll in {d}"`. They are replaced by numbers and times.
5. Open a pull request. A check runs on it and lists any problem.

You can leave a text out; the card then shows the English one. Partial translations are welcome.

### Check it yourself (optional)

With [Node.js](https://nodejs.org) installed:

```sh
node scripts/check-translations.mjs   # missing keys, typos, placeholders
node scripts/build.mjs                # rebuild solar-flow-card.js
```

To see the card in your language, serve the repository root (for example `npx serve .`) and open `demo/index.html?language=de`.

Home Assistant picks the language automatically from the user's profile; it can also be set per card in the editor or with `language: de`.

### Placeholders

| Placeholder | Becomes |
|---|---|
| `{d}` | a duration, e.g. `2 h 10 min` |
| `{time}` | a clock time, e.g. `22:40` |
| `{soc}`, `{pct}` | a percentage number |
| `{kwh}`, `{cap}`, `{power}` | a value with its unit |
| `{n}`, `{count}` | a number |
| `{name}`, `{date}`, `{source}`, `{parts}` | a name, date or list |

## Code changes

The card is written in `src/*.js` and built into `solar-flow-card.js` with `node scripts/build.mjs`. You don't have to commit the built file: after a merge into `main` it is rebuilt automatically.

`demo/index.html` runs the card against a stand-in Home Assistant (`demo/mock-hass.js`), with every theme, several scenarios and both PV and battery-only setups.

## License of contributions

Code you contribute is licensed under the project's [GPL-3.0-or-later](LICENSE). Translations (`translations/*.json`) are licensed under the [MIT License](translations/LICENSE), like the existing ones.
