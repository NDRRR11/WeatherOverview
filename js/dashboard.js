console.log("dashboard.js loaded");

/* ---------------------------
   IMPORTS
----------------------------*/
import { loadAlertTicker } from './alertsTicker.js';
import { MAPS } from '../config/maps.js';

import { loadAlerts } from './alerts.js';
import { loadConditions, loadForecast } from './weather.js';
import { loadAirQuality } from './airquality.js';
import { loadTicker } from './ticker.js';

/* ---------------------------
   ROOT ELEMENT
----------------------------*/
const c = document.getElementById('content');

/* ---------------------------
   CLOCK
----------------------------*/
function formatTime() {
  return new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/* ---------------------------
   SETTINGS STATE (SAFE DEFAULTS)
----------------------------*/
const settings = {
  rotate: localStorage.getItem('rotate') !== 'false',
  interval: parseInt(localStorage.getItem('interval') || '60', 10)
};

/* ---------------------------
   TIMERS
----------------------------*/
let refreshTimer = null;
let clockTimer = null;
let rotationTimer = null;
let rotationIndex = 0;

/* ---------------------------
   ROTATION PAGES (DEFAULT SET)
----------------------------*/
const rotationPages = [
  "overview",
  "local",
  "national",
  "air",
  "river",
  "alerts"
];

/* ---------------------------
   SETTINGS UI
----------------------------*/
function renderSettings() {
  c.innerHTML = `
    <div class="panel">
      <h2>Dashboard Settings</h2>

      <h3>Auto Rotation</h3>
      <label>
        <input type="checkbox" id="rotateToggle">
        Enable Auto Rotation
      </label>

      <h3>Rotation Interval</h3>
      <select id="rotationInterval">
        <option value="30">30 Seconds</option>
        <option value="60">60 Seconds</option>
        <option value="120">120 Seconds</option>
        <option value="300">300 Seconds</option>
      </select>

      <h3>Auto Refresh</h3>
      <select id="refreshInterval">
        <option value="0">Off</option>
        <option value="5">5 Minutes</option>
        <option value="10">10 Minutes</option>
        <option value="15">15 Minutes</option>
        <option value="30">30 Minutes</option>
      </select>

      <h3>Startup Page</h3>
      <select id="startupPage">
        <option value="overview">Overview</option>
        <option value="local">Local Radar</option>
        <option value="national">National Radar</option>
        <option value="air">Air Quality</option>
        <option value="river">River Conditions</option>
        <option value="alerts">ND Alerts</option>
      </select>

      <h3>Rotation Tabs</h3>

      <label><input type="checkbox" class="rotationTab" value="overview" checked> Overview</label><br>
      <label><input type="checkbox" class="rotationTab" value="local" checked> Local Radar</label><br>
      <label><input type="checkbox" class="rotationTab" value="national" checked> National Radar</label><br>
      <label><input type="checkbox" class="rotationTab" value="air" checked> Air Quality</label><br>
      <label><input type="checkbox" class="rotationTab" value="river" checked> River Conditions</label><br>
      <label><input type="checkbox" class="rotationTab" value="alerts" checked> ND Alerts</label>
    </div>
  `;

  const rotateToggle = document.getElementById("rotateToggle");
  const intervalSelect = document.getElementById("rotationInterval");

  if (rotateToggle) rotateToggle.checked = settings.rotate;
  if (intervalSelect) intervalSelect.value = settings.interval;
}

/* ---------------------------
   DATA REFRESH ENGINE
----------------------------*/
function refreshAll() {
  try {
    loadConditions();
    loadForecast();
    loadAirQuality();
    loadAlerts();
    loadTicker();
  } catch (e) {
    console.error("refreshAll error:", e);
  }
}

function startDashboardEngine() {
  if (refreshTimer) clearInterval(refreshTimer);
  if (clockTimer) clearInterval(clockTimer);

  clockTimer = setInterval(() => {
    const el = document.getElementById("clock");
    if (el) el.textContent = formatTime();
  }, 1000);

  refreshTimer = setInterval(refreshAll, 60000);

  refreshAll();
}

/* ---------------------------
   ROTATION ENGINE (SAFE)
----------------------------*/
function getEnabledRotationPages() {
  const checkboxes = document.querySelectorAll(".rotationTab:checked");
  return [...checkboxes].map(c => c.value);
}

function startRotationEngine() {
  if (rotationTimer) clearInterval(rotationTimer);

  const enabled = localStorage.getItem("rotate");
  if (enabled === "false") return;

  const interval =
    (parseInt(localStorage.getItem("interval") || "60", 10)) * 1000;

  rotationTimer = setInterval(() => {

    const pages = getEnabledRotationPages();

    if (!pages.length) return;

    rotationIndex = (rotationIndex + 1) % pages.length;

    const next = pages[rotationIndex];

    if (typeof window.page === "function") {
      window.page(next);
    }

  }, interval);
}

/* ---------------------------
   PAGE ROUTER
----------------------------*/
function page(name) {
  console.log("page:", name);

  /* OVERVIEW */
  if (name === 'overview') {

    c.innerHTML = `
      <div class="overview">

        <div class="leftRadar">
          <iframe src="${MAPS.local}"></iframe>
        </div>

        <div class="rightPanel">

          <div class="clock" id="clock">
            ${formatTime()}
          </div>

          <div class="card" id="conditions">Loading...</div>
          <div class="card" id="forecast">Loading...</div>
          <div class="card" id="air">Loading...</div>

          <div class="card">
            <h3>North Dakota Alerts</h3>
            <div id="alerts-content">Loading...</div>
          </div>

          <div class="card" id="ticker">Loading...</div>

        </div>

      </div>
    `;

    startDashboardEngine();
    return;
  }

  /* SETTINGS */
  if (name === 'settings') {
    renderSettings();
    return;
  }

  /* DEFAULT MAP */
  const src = MAPS[name];

  c.innerHTML = `
    <div class="full">
      <iframe src="${src}"></iframe>
    </div>
  `;
}

/* ---------------------------
   NAVIGATION
----------------------------*/
document.querySelectorAll('[data-page]').forEach(btn => {
  btn.onclick = () => page(btn.dataset.page);
});

/* ---------------------------
   GLOBAL ACCESS
----------------------------*/
window.page = page;

/* ---------------------------
   INIT
----------------------------*/
page('overview');

loadAlertTicker();
setInterval(loadAlertTicker, 300000);

startRotationEngine();
