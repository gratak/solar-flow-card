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
const CARD_VERSION = "2.1.0-beta.2";
// The card's type is custom:home-energy-hub since 2.0.0. The old name stays
// registered so dashboards with custom:solar-flow-card keep working.
const CARD_TAG = "home-energy-hub";
const EDITOR_TAG = "home-energy-hub-editor";
const LEGACY_CARD_TAG = "solar-flow-card";
const LEGACY_EDITOR_TAG = "solar-flow-card-editor";
const CARD_TYPE = `custom:${CARD_TAG}`;
const LEGACY_CARD_TYPE = `custom:${LEGACY_CARD_TAG}`;
const THEMES = ["diorama", "aurora", "paper", "lcars", "atlantis", "expanse", "foundation", "galaxy", "gate", "reactor"];
// Every period a tab can show; `periods:` picks and orders them.
const PERIODS = ["today", "3d", "7d", "month", "last_month", "year", "all"];
const DEFAULT_PERIODS = ["today", "3d", "7d", "month", "all"];
// Periods charted month by month.
const MONTHLY_PERIODS = ["year", "all"];
function periodList(config) {
  const list = Array.isArray(config?.periods) ? [...new Set(config.periods.map((p) => String(p).trim().toLowerCase()).filter((p) => PERIODS.includes(p)))] : [];
  return list.length ? list : DEFAULT_PERIODS;
}
// A flow below this many watts counts as idle.
const ACTIVE_W = 5;
