console.log("dashboard.js loaded");

import { MAPS } from '../config/maps.js';
import { alertsHtml, loadAlerts } from './alerts.js';

import { loadConditions, loadForecast } from './weather.js';
import { loadAirQuality } from './airquality.js';
import { loadTicker } from './ticker.js';

/* ---------------------------
   DOM ROOT
----------------------------*/
const c = document.getElementById('content');

/* ---------------------------
   CLOCK FORMAT
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
   SETTINGS STATE
----------------------------*/
export const settings = {
  rotate: localStorage.getItem('rotate') !== 'false',
  interval: +(localStorage.getItem('interval') || 60)
};

/* ---------------------------
   SETTINGS RENDER
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
    </div>
  `;

  const rotateToggle = document.getElementById("rotateToggle");
  const intervalSelect = document.getElementById("rotationInterval");

  if (rotateToggle) rotateToggle.checked = settings.rotate;
  if (intervalSelect) intervalSelect.value = settings.interval;
}

/* ---------------------------
   LIVE DASHBOARD ENGINE
----------------------------*/
let refreshTimer = null;
let clockTimer = null;

function refreshAll() {
  loadConditions();
  loadForecast();
  loadAirQuality();
  loadAlerts();
  loadTicker();
}

function startDashboardEngine() {

  // prevent duplicate intervals
  if (refreshTimer) clearInterval(refreshTimer);
  if (clockTimer) clearInterval(clockTimer);

  // CLOCK (1 sec)
  clockTimer = setInterval(() => {
    const el = document.getElementById("clock");
    if (el) el.textContent = formatTime();
  }, 1000);

  // DATA (60 sec)
  refreshTimer = setInterval(() => {
    refreshAll();
  }, 60000);

  // initial load
  refreshAll();
}

let rotationTimer = null;
let rotationIndex = 0;

const rotationPages = [
  "overview",
  "local",
  "national",
  "air",
  "river",
  "alerts"
];

function startRotationEngine() {

  // prevent duplicates
  if (rotationTimer) clearInterval(rotationTimer);

  // check if enabled
  const enabled = localStorage.getItem("rotate") !== "false";
  if (!enabled) return;

  const interval =
    (parseInt(localStorage.getItem("interval")) || 60) * 1000;

  rotationTimer = setInterval(() => {

    rotationIndex++;

    if (rotationIndex >= rotationPages.length) {
      rotationIndex = 0;
    }

    const pageName = rotationPages[rotationIndex];

    if (typeof window.page === "function") {
      window.page(pageName);
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

  /* ALERTS PAGE */
  if (name === 'alerts') {
    c.innerHTML = alertsHtml();
    return;
  }

  /* DEFAULT MAP VIEW */
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
   GLOBAL ACCESS FIX
----------------------------*/
window.page = page;

/* ---------------------------
   INITIAL LOAD
----------------------------*/
page('overview');
startRotationEngine();
