
export function alertsHtml(){
  return `
    <div class="panel" id="alerts">
      <h2>North Dakota Alerts</h2>
      <div>Loading live alerts...</div>
    </div>
  `;
}
eexport async function loadAlerts() {
  const el = document.getElementById("alerts");
  if (!el) return;

  try {
    const res = await fetch(
      "https://api.weather.gov/alerts/active?area=ND"
    );

    const data = await res.json();
    const features = data.features || [];

    const warnings = features.filter(f =>
      (f.properties?.event || "").includes("Warning")
    );

    const watches = features.filter(f =>
      (f.properties?.event || "").includes("Watch")
    );

    const advisories = features.filter(f =>
      (f.properties?.event || "").includes("Advisory")
    );

    el.innerHTML = `
      <h3>North Dakota Alerts</h3>

      <div><strong>Warnings:</strong> ${warnings.length}</div>
      <div><strong>Watches:</strong> ${watches.length}</div>
      <div><strong>Advisories:</strong> ${advisories.length}</div>

      <div style="margin-top:10px">
        ${features.slice(0, 6).map(f => `
          <div>• ${f.properties?.event || "Unknown Event"}</div>
        `).join("")}
      </div>
    `;

  } catch (e) {
    el.innerHTML = `
      <h3>North Dakota Alerts</h3>
      <div>⚠ Alerts feed unavailable</div>
    `;
  }
}
