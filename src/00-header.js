/*!
 * Solar Flow Card for Home Assistant
 * https://github.com/gratak/solar-flow-card
 * MIT License. The data layer started from the Energy Flow card of
 * hass-deyecloud by Trần Công Tuấn Anh (MIT).
 *
 * Built from src/*.js by scripts/build.mjs. Edit the sources, not this file.
 */
const CARD_VERSION = "1.6.0";
const CARD_TAG = "solar-flow-card";
const EDITOR_TAG = "solar-flow-card-editor";
const THEMES = ["diorama", "aurora", "paper", "lcars", "atlantis", "expanse", "foundation", "galaxy", "gate", "reactor"];
const PERIODS = ["today", "3d", "7d", "month", "all"];
// A flow below this many watts counts as idle.
const ACTIVE_W = 5;
