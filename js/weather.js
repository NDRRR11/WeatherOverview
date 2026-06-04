const KBIS = "BIS"; // Bismarck Airport station ID

async function getJSON(url) {
  const res = await fetch(url);
  return await res.json();
}

/* --------------------------
   CURRENT CONDITIONS
---------------------------*/
export async function loadConditions() {
  try {
    const obs = await getJSON(
      `https://api.weather.gov/stations/${KBIS}/observations/latest`
    );

    const p = obs.properties;

    const temp = Math.round(p.temperature.value * 9/5 + 32);
    const dew = Math.round(p.dewpoint.value * 9/5 + 32);
    const wind = p.windSpeed.value;

    document.getElementById("conditions").innerHTML = `
      <h3>Current Conditions (KBIS)</h3>
      <div><b>${temp}°F</b> • ${p.textDescription || "—"}</div>
      <div>Dew Point: ${dew}°F</div>
      <div>Wind: ${wind ? wind + " mph" : "Calm"}</div>
    `;
  } catch (e) {
    document.getElementById("conditions").innerHTML =
      "<h3>Current Conditions</h3><div>Data unavailable</div>";
  }
}

/* --------------------------
   FORECAST
---------------------------*/
export async function loadForecast() {
  try {
    const point = await getJSON(
      "https://api.weather.gov/points/46.8083,-100.7837"
    );

    const forecastUrl = point.properties.forecast;
    const data = await getJSON(forecastUrl);

    const periods = data.properties.periods.slice(0, 3);

    document.getElementById("forecast").innerHTML = `
      <h3>Forecast</h3>
      ${periods.map(p => `
        <div>
          <b>${p.name}</b>: ${p.shortForecast}
          (${p.temperature}°${p.temperatureUnit})
        </div>
      `).join("")}
    `;
  } catch (e) {
    document.getElementById("forecast").innerHTML =
      "<h3>Forecast</h3><div>Unavailable</div>";
  }
}
