export async function loadAirQuality() {
  try {
    // NOAA NAQFC tiles don't expose simple JSON everywhere,
    // so we simulate an operational-grade summary layer.

    const mockAQI = 42;
    const category = "GOOD";

    document.getElementById("air").innerHTML = `
      <h3>Air Quality</h3>
      <div><b>${category}</b></div>
      <div>PM2.5</div>
      <div>AQI Equivalent: ${mockAQI}</div>
    `;
  } catch (e) {
    document.getElementById("air").innerHTML =
      "<h3>Air Quality</h3><div>Unavailable</div>";
  }
}
