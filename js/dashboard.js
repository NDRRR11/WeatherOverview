console.log("dashboard.js loaded");
import { MAPS } from '../config/maps.js';
import { alertsHtml } from './alerts.js';

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
   MAIN PAGE ROUTER
----------------------------*/
function page(name) {

  /* OVERVIEW */
  console.log("overview rendering");
  if (name === 'overview') {
    c.innerHTML = `
      <div class="overview">

        <!-- LEFT RADAR -->
        <div class="leftRadar">
          <iframe src="${MAPS.local}"></iframe>
        </div>

        <!-- RIGHT PANEL -->
        <div class="rightPanel">

          <div class="clock" id="clock">
            ${formatTime()}
          </div>

          <div class="card" id="conditions">
            <h3>Current Conditions (KBIS)</h3>
            Loading...
          </div>

          <div class="card" id="forecast">
            <h3>Forecast</h3>
            Loading...
          </div>

          <div class="card" id="air">
            <h3>Air Quality</h3>
            Loading...
          </div>

          <div class="card" id="alerts">
            <h3>North Dakota Alerts</h3>
            Loading...
          </div>

          <div class="card" id="ticker">
            <h3>National Weather Highlights</h3>
            Loading...
          </div>

        </div>
      </div>
    `;

    return;
  }

  /* ALERTS TAB */
  if (name === 'alerts') {
    c.innerHTML = alertsHtml();
    return;
  }

  /* DEFAULT MAP VIEWS */
  const src = MAPS[name];

  c.innerHTML = `
    <div class="full">
      <iframe src="${src}"></iframe>
    </div>
  `;
}

/* ---------------------------
   NAV BUTTONS
----------------------------*/
document.querySelectorAll('[data-page]').forEach(btn => {
  btn.onclick = () => page(btn.dataset.page);
});

/* CLOCK LIVE UPDATE */
setInterval(() => {
  const el = document.getElementById('clock');
  if (el) el.textContent = formatTime();
}, 1000);

page('overview');
import { loadConditions, loadForecast } from './weather.js';
import { loadAirQuality } from './airquality.js';
import { loadAlerts } from './alerts.js';
import { loadTicker } from './ticker.js';
if (name === 'overview') {

  c.innerHTML = `...existing layout...`;

  loadConditions();
  loadForecast();
  loadAirQuality();
  loadAlerts();
  loadTicker();

  return;
}
