
export function alertsHtml(){
return '<div class="panel"><h2>ND Alerts</h2><p>Future NWS feed integration.</p></div>';
}
export async function loadAlerts() {
  try {
    const res = await fetch(
      "https://api.weather.gov/alerts/active?area=ND"
    );
    const data = await res.json();

    const alerts = data.features || [];

    const warnings = alerts.filter(a =>
      a.properties.severity === "Severe" ||
      a.properties.severity === "Extreme"
    );

    const watches = alerts.filter(a =>
      a.properties.event.includes("Watch")
    );

    const advisories = alerts.filter(a =>
      a.properties.event.includes("Advisory")
    );

    document.getElementById("alerts").innerHTML = `
      <h3>North Dakota Alerts (Statewide)</h3>

      <div>
        Warnings: ${warnings.length} •
        Watches: ${watches.length} •
        Advisories: ${advisories.length}
      </div>

      <ul>
        ${alerts.slice(0, 4).map(a => `
          <li>${a.properties.event}</li>
        `).join("")}
      </ul>
    `;
  } catch (e) {
    document.getElementById("alerts").innerHTML =
      "<h3>North Dakota Alerts</h3><div>Unavailable</div>";
  }
}
