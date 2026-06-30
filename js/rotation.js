let rotationTimer;

let rotationIndex = 0;


function saveRotationSettings(){

    const enabledTabs =
        [...document.querySelectorAll(".rotationTab:checked")]
        .map(tab => tab.value);


    localStorage.setItem(
        "rotationTabs",
        JSON.stringify(enabledTabs)
    );


    localStorage.setItem(
        "rotationInterval",
        document.getElementById("rotationInterval").value
    );


    localStorage.setItem(
        "rotationEnabled",
        document.getElementById("rotateToggle").checked
    );
}



function loadRotationSettings(){

    const savedTabs =
        JSON.parse(
            localStorage.getItem("rotationTabs")
        );


    if(savedTabs){

        document
        .querySelectorAll(".rotationTab")
        .forEach(tab=>{

            tab.checked =
            savedTabs.includes(tab.value);

        });

    }


    const interval =
    localStorage.getItem("rotationInterval");


    if(interval){

        document.getElementById("rotationInterval")
        .value = interval;

    }


    const enabled =
    localStorage.getItem("rotationEnabled");


    if(enabled !== null){

        document.getElementById("rotateToggle")
        .checked =
        enabled === "true";

    }

}



function getRotationTabs(){

    return [...document.querySelectorAll(".rotationTab:checked")]
    .map(tab => tab.value);

}



export function startRotation(){

    saveRotationSettings();

    stopRotation();


    const tabs = getRotationTabs();


    if(tabs.length < 2){
        return;
    }


    const interval =
    Number(
        document.getElementById("rotationInterval").value
    ) * 1000;


    rotationTimer =
    setInterval(()=>{

        const activeTabs = getRotationTabs();

        rotationIndex =
        (rotationIndex + 1)
        % activeTabs.length;


        page(activeTabs[rotationIndex]);


    }, interval);

}



export function stopRotation(){

    if(rotationTimer){
        clearInterval(rotationTimer);
    }

}
