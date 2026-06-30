export async function loadAlertTicker(){

    const ticker =
        document.getElementById("alertTicker");

    if(!ticker){
        return;
    }


    try {

        const response = await fetch(
            "https://api.weather.gov/alerts/active?area=ND",
            {
                headers:{
                    "User-Agent":
                    "ND Situational Awareness Dashboard"
                }
            }
        );


        const data = await response.json();


        if(!data.features || data.features.length === 0){

            ticker.innerHTML =
            `
            <div id="alertTickerText">
            ✓ No Active North Dakota Weather Alerts
            </div>
            `;

            return;
        }


        const alerts =
        data.features.map(alert => {

            const props =
            alert.properties;

            return `
            ${props.event}
            - ${props.areaDesc}
            `;

        });


        ticker.innerHTML =
        `
        <div id="alertTickerText">
        ⚠ ${alerts.join("   |   ⚠ ")}
        </div>
        `;


    }
    catch(error){

        ticker.innerHTML =
        `
        <div id="alertTickerText">
        Weather alert feed unavailable
        </div>
        `;

        console.error(error);

    }

}
