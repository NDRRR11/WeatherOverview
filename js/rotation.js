
export function startRotation(){ console.log('rotation placeholder'); }

let rotationTimer;

let rotationIndex = 0;


function getRotationTabs(){

    return [...document.querySelectorAll(".rotationTab:checked")]
        .map(tab => tab.value);

}


export function startRotation(){

    stopRotation();


    const enabledTabs = getRotationTabs();


    if(enabledTabs.length < 2){
        return;
    }


    const interval =
    Number(
        document.getElementById("rotationInterval").value
    ) * 1000;


    rotationTimer =
    setInterval(()=>{

        const tabs = getRotationTabs();

        rotationIndex =
        (rotationIndex + 1) % tabs.length;


        page(tabs[rotationIndex]);


    }, interval);

}



export function stopRotation(){

    if(rotationTimer){
        clearInterval(rotationTimer);
    }

}
