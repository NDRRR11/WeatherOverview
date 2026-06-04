
export function alertsHtml(){
return '<div class="panel"><h2>ND Alerts</h2><p>Future NWS feed integration.</p></div>';
}
export async function loadAlerts() {
  const el = document.getElementById("alerts");
  if (!el) return;

  try {
    const res = await fetch(
      "https://api.weather.gov/alerts/active?area=ND"
    );

    const data = await res.json();

    const features = data.features || [];

    if (!features.length) {
      el.innerHTML = `
        <h3>North Dakota Alerts</h3>
        <div>No active statewide alerts</div>
      `;
      return;
    }

    el.innerHTML = `
      <h3>North Dakota Alerts</h3>
      <div>Warnings: ${features.filter(f => f.properties.event.includes("Warning")).length}</div>
      <div>Watches: ${features.filter(f => f.properties.event.includes("Watch")).length}</div>
      <div>Advisories: ${features.filter(f => f.properties.event.includes("Advisory")).length}</div>

      <div style="margin-top:8px">
        ${features.slice(0, 5).map(f => `
          <div>• ${f.properties.event}</div>
        `).join("")}
      </div>
    `;

  } catch (e) {
    el.innerHTML = `
      <h3>North Dakota Alerts</h3>
      <div>Alerts unavailable</div>
    `;
  }
}
