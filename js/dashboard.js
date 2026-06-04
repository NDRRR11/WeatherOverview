console.log("dashboard.js loaded");

import { MAPS } from '../config/maps.js';
import { alertsHtml } from './alerts.js';
import { loadConditions, loadForecast } from './weather.js';
import { loadAirQuality } from './airquality.js';
import { loadAlerts } from './alerts.js';
import { loadTicker } from './ticker.js';

const c = document.getElementById('content');

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
   MAIN ROUTER
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
          <div class="card" id="alerts">Loading...</div>
          <div class="card" id="ticker">Loading...</div>

        </div>
      </div>
    `;

    // 🔥 NOW WE ACTUALLY ACTIVATE THE DATA LAYER
    loadConditions();
    loadForecast();
    loadAirQuality();
    loadAlerts();
    loadTicker();

    return;
  }

  /* ALERTS TAB */
  if (name === 'alerts') {
    c.innerHTML = alertsHtml();
    return;
  }

  /* DEFAULT MAPS */
  const src = MAPS[name];

  c.innerHTML = `
    <div class="full">
      <iframe src="${src}"></iframe>
    </div>
  `;
}

/* NAV */
document.querySelectorAll('[data-page]').forEach(btn => {
  btn.onclick = () => page(btn.dataset.page);
});

/* CLOCK */
setInterval(() => {
  const el = document.getElementById('clock');
  if (el) el.textContent = formatTime();
}, 1000);

/* START */
page('overview');
