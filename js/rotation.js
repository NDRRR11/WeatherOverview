let rotationTimer = null;
let rotationIndex = 0;

/* -----------------------------
   SAVE SETTINGS
------------------------------*/
function saveRotationSettings() {
    const enabledTabs = [...document.querySelectorAll(".rotationTab:checked")]
        .map(t => t.value);

    const intervalEl = document.getElementById("rotationInterval");
    const toggleEl = document.getElementById("rotateToggle");

    localStorage.setItem("rotationTabs", JSON.stringify(enabledTabs));
    localStorage.setItem("rotationInterval", intervalEl ? intervalEl.value : "60");
    localStorage.setItem("rotationEnabled", toggleEl ? toggleEl.checked : "false");
}

/* -----------------------------
   LOAD SETTINGS INTO UI
------------------------------*/
function loadRotationSettings() {
    const savedTabs = JSON.parse(localStorage.getItem("rotationTabs") || "[]");
    const interval = localStorage.getItem("rotationInterval");
    const enabled = localStorage.getItem("rotationEnabled");

    document.querySelectorAll(".rotationTab").forEach(tab => {
        tab.checked = savedTabs.length ? savedTabs.includes(tab.value) : true;
    });

    const intervalEl = document.getElementById("rotationInterval");
    if (intervalEl && interval) {
        intervalEl.value = interval;
    }

    const toggleEl = document.getElementById("rotateToggle");
    if (toggleEl && enabled !== null) {
        toggleEl.checked = enabled === "true";
    }
}

/* -----------------------------
   GET ACTIVE TABS
------------------------------*/
function getRotationTabs() {
    return [...document.querySelectorAll(".rotationTab:checked")]
        .map(t => t.value);
}

/* -----------------------------
   START ROTATION
------------------------------*/
export function startRotation() {
    try {
        stopRotation();

        const enabled = localStorage.getItem("rotationEnabled");
        if (enabled === "false") return;

        const tabs = getRotationTabs();
        if (!tabs || tabs.length < 2) return;

        const intervalEl = document.getElementById("rotationInterval");
        const interval = Number(intervalEl?.value || 60) * 1000;

        rotationTimer = setInterval(() => {
            const activeTabs = getRotationTabs();
            if (!activeTabs.length) return;

            rotationIndex = (rotationIndex + 1) % activeTabs.length;

            if (typeof window.page === "function") {
                window.page(activeTabs[rotationIndex]);
            } else {
                console.warn("page() function not found");
            }

        }, interval);

    } catch (err) {
        console.error("Rotation start failed:", err);
    }
}

/* -----------------------------
   STOP ROTATION
------------------------------*/
export function stopRotation() {
    if (rotationTimer) {
        clearInterval(rotationTimer);
        rotationTimer = null;
    }
}

/* -----------------------------
   INIT SETTINGS (CALL ON LOAD)
------------------------------*/
export function initRotationSettings() {
    loadRotationSettings();

    // attach listeners safely
    document.querySelectorAll(".rotationTab").forEach(el => {
        el.addEventListener("change", saveRotationSettings);
    });

    const intervalEl = document.getElementById("rotationInterval");
    const toggleEl = document.getElementById("rotateToggle");

    if (intervalEl) intervalEl.addEventListener("change", saveRotationSettings);
    if (toggleEl) toggleEl.addEventListener("change", saveRotationSettings);
}
