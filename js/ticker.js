export async function loadTicker() {
  const items = [
    "SPC outlook: monitoring severe weather potential across Plains...",
    "NHC: no active tropical cyclones in Atlantic basin...",
    "USGS: monitoring river flooding conditions in Midwest...",
    "NOAA: wildfire smoke possible in Northern Plains..."
  ];

  let i = 0;

  function rotate() {
    document.getElementById("ticker").innerHTML = `
      <h3>National Weather Highlights</h3>
      <div>${items[i]}</div>
    `;
    i = (i + 1) % items.length;
  }

  rotate();
  setInterval(rotate, 6000);
}
