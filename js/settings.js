export const settings = {
    rotate: localStorage.getItem('rotate') !== 'false',
    interval: +(localStorage.getItem('interval') || 60)
};

/* ---------------------------
   SETTINGS PAGE RENDER
----------------------------*/
export function renderSettings(c) {

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

            <label><input type="checkbox" class="rotationTab" value="overview"> Overview</label><br>
            <label><input type="checkbox" class="rotationTab" value="local"> Local Radar</label><br>
            <label><input type="checkbox" class="rotationTab" value="national"> National Radar</label><br>
            <label><input type="checkbox" class="rotationTab" value="air"> Air Quality</label><br>
            <label><input type="checkbox" class="rotationTab" value="river"> River Conditions</label><br>
            <label><input type="checkbox" class="rotationTab" value="alerts"> ND Alerts</label>
        </div>
    `;

    // restore values AFTER DOM exists
    const rotateToggle = document.getElementById("rotateToggle");
    const intervalSelect = document.getElementById("rotationInterval");

    if (rotateToggle) rotateToggle.checked = settings.rotate;
    if (intervalSelect) intervalSelect.value = settings.interval;

    attachSettingsListeners();
}

/* ---------------------------
   SAFE EVENT BINDING (CRITICAL FIX)
----------------------------*/
function attachSettingsListeners() {

    const tabs = document.querySelectorAll(".rotationTab");

    tabs.forEach(box => {
        box.addEventListener("change", saveRotationSettings);
    });

    const interval = document.getElementById("rotationInterval");
    const toggle = document.getElementById("rotateToggle");

    if (interval) {
        interval.addEventListener("change", saveRotationSettings);
    }

    if (toggle) {
        toggle.addEventListener("change", saveRotationSettings);
    }

    loadRotationSettings();
}
