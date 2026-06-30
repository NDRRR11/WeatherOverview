
export const settings={
rotate:localStorage.getItem('rotate')!=='false',
interval:+(localStorage.getItem('interval')||60)
};
if(name==='settings'){
    c.innerHTML=`
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
                <option value="60" selected>60 Seconds</option>
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

            <p>
                Settings persistence will be enabled in the next version.
            </p>
        </div>
    `;
}
document
.querySelectorAll(".rotationTab")
.forEach(box=>{

    box.addEventListener(
        "change",
        saveRotationSettings
    );

});


document
.getElementById("rotationInterval")
.addEventListener(
    "change",
    saveRotationSettings
);


document
.getElementById("rotateToggle")
.addEventListener(
    "change",
    saveRotationSettings
);


loadRotationSettings();
