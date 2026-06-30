export const settings = {
    rotate: localStorage.getItem("rotate") !== "false",
    interval: Number(localStorage.getItem("interval") || 60),
    tabs: JSON.parse(localStorage.getItem("rotationTabs") || "[]")
};


/* ---------------------------
   SAVE SETTINGS
----------------------------*/
export function saveRotationSettings() {

    const rotateToggle =
        document.getElementById("rotateToggle");

    const intervalSelect =
        document.getElementById("rotationInterval");


    const enabledTabs =
        [...document.querySelectorAll(".rotationTab:checked")]
        .map(tab => tab.value);


    if (rotateToggle) {
        localStorage.setItem(
            "rotate",
            rotateToggle.checked
        );
    }


    if (intervalSelect) {
        localStorage.setItem(
            "interval",
            intervalSelect.value
        );
    }


    localStorage.setItem(
        "rotationTabs",
        JSON.stringify(enabledTabs)
    );


    console.log("Settings saved:", {
        rotate: rotateToggle?.checked,
        interval: intervalSelect?.value,
        tabs: enabledTabs
    });
}



/* ---------------------------
   LOAD SETTINGS
----------------------------*/
function loadRotationSettings() {

    const rotateToggle =
        document.getElementById("rotateToggle");

    const intervalSelect =
        document.getElementById("rotationInterval");


    const savedTabs =
        JSON.parse(
            localStorage.getItem("rotationTabs") || "[]"
        );


    if (rotateToggle) {
        rotateToggle.checked =
            localStorage.getItem("rotate") !== "false";
    }


    if (intervalSelect) {

        intervalSelect.value =
            localStorage.getItem("interval") || "60";

    }


    document
    .querySelectorAll(".rotationTab")
    .forEach(tab => {

        // Default all checked if nothing saved
        if(savedTabs.length === 0){
            tab.checked = true;
        }
        else {
            tab.checked =
                savedTabs.includes(tab.value);
        }

    });
}



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



        <h3>Rotation Tabs</h3>

        <label>
        <input type="checkbox" class="rotationTab" value="overview">
        Overview
        </label><br>


        <label>
        <input type="checkbox" class="rotationTab" value="local">
        Local Radar
        </label><br>


        <label>
        <input type="checkbox" class="rotationTab" value="national">
        National Radar
        </label><br>


        <label>
        <input type="checkbox" class="rotationTab" value="air">
        Air Quality
        </label><br>


        <label>
        <input type="checkbox" class="rotationTab" value="river">
        River Conditions
        </label><br>


        <label>
        <input type="checkbox" class="rotationTab" value="alerts">
        ND Alerts
        </label>


    </div>

    `;


    // IMPORTANT:
    // Restore AFTER HTML exists

    loadRotationSettings();


    document
    .querySelectorAll(".rotationTab")
    .forEach(tab => {

        tab.addEventListener(
            "change",
            saveRotationSettings
        );

    });


    document
    .getElementById("rotateToggle")
    ?.addEventListener(
        "change",
        saveRotationSettings
    );


    document
    .getElementById("rotationInterval")
    ?.addEventListener(
        "change",
        saveRotationSettings
    );
}
