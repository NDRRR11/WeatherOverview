console.log("dashboard.js loaded");

import { loadAlertTicker } from './alertsTicker.js';
import { MAPS } from '../config/maps.js';

import { loadAlerts } from './alerts.js';
import { loadConditions, loadForecast } from './weather.js';
import { loadAirQuality } from './airquality.js';
import { loadTicker } from './ticker.js';


const c = document.getElementById('content');


function formatTime() {
  return new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}


/* ---------------------------
   SETTINGS
----------------------------*/

const settings = {
  rotate: localStorage.getItem("rotate") !== "false",
  interval: Number(localStorage.getItem("interval") || 60)
};


function saveSettings(){

  const rotate =
    document.getElementById("rotateToggle");

  const interval =
    document.getElementById("rotationInterval");


  const tabs =
    [...document.querySelectorAll(".rotationTab:checked")]
    .map(t=>t.value);


  if(rotate){
    localStorage.setItem(
      "rotate",
      rotate.checked
    );
  }


  if(interval){
    localStorage.setItem(
      "interval",
      interval.value
    );
  }


  localStorage.setItem(
    "rotationTabs",
    JSON.stringify(tabs)
  );
}



function loadSettings(){

  const rotate =
    document.getElementById("rotateToggle");

  const interval =
    document.getElementById("rotationInterval");


  const savedTabs =
    JSON.parse(
      localStorage.getItem("rotationTabs") || "[]"
    );


  if(rotate){
    rotate.checked = settings.rotate;
  }


  if(interval){
    interval.value = settings.interval;
  }


  document
  .querySelectorAll(".rotationTab")
  .forEach(tab=>{

    tab.checked =
      savedTabs.length === 0 ||
      savedTabs.includes(tab.value);

  });

}



/* ---------------------------
   SETTINGS PAGE
----------------------------*/

function renderSettings(){

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
<input class="rotationTab" type="checkbox" value="overview">
Overview
</label><br>


<label>
<input class="rotationTab" type="checkbox" value="local">
Local Radar
</label><br>


<label>
<input class="rotationTab" type="checkbox" value="national">
National Radar
</label><br>


<label>
<input class="rotationTab" type="checkbox" value="air">
Air Quality
</label><br>


<label>
<input class="rotationTab" type="checkbox" value="river">
River Conditions
</label><br>


<label>
<input class="rotationTab" type="checkbox" value="alerts">
ND Alerts
</label>


</div>

`;


loadSettings();


document
.querySelectorAll(".rotationTab")
.forEach(box=>{

box.addEventListener(
"change",
saveSettings
);

});


document
.getElementById("rotateToggle")
.addEventListener(
"change",
saveSettings
);


document
.getElementById("rotationInterval")
.addEventListener(
"change",
saveSettings
);

}



/* ---------------------------
   DATA ENGINE
----------------------------*/

let refreshTimer;
let clockTimer;


function refreshAll(){

loadConditions();
loadForecast();
loadAirQuality();
loadAlerts();
loadTicker();

}



function startDashboardEngine(){

if(refreshTimer)
clearInterval(refreshTimer);

if(clockTimer)
clearInterval(clockTimer);



clockTimer=setInterval(()=>{

const el=document.getElementById("clock");

if(el)
el.textContent=formatTime();


},1000);



refreshTimer=setInterval(
refreshAll,
60000
);


refreshAll();

}



/* ---------------------------
   ROTATION
----------------------------*/

let rotationTimer;
let rotationIndex=0;



function getRotationPages(){

const saved =
JSON.parse(
localStorage.getItem("rotationTabs") || "[]"
);


return saved.length
?
saved
:
[
"overview",
"local",
"national",
"air",
"river",
"alerts"
];

}



function startRotationEngine(){

if(rotationTimer)
clearInterval(rotationTimer);


if(localStorage.getItem("rotate")==="false")
return;



rotationTimer=setInterval(()=>{


const pages=getRotationPages();


rotationIndex =
(rotationIndex+1)
% pages.length;


page(
pages[rotationIndex]
);


},
Number(
localStorage.getItem("interval") || 60
)*1000
);


}



/* ---------------------------
   ROUTER
----------------------------*/

function page(name){


if(name==="settings"){

renderSettings();
return;

}



if(name==="overview"){


c.innerHTML=`

<div class="overview">


<div class="leftRadar">

<iframe src="${MAPS.local}"></iframe>

</div>


<div class="rightPanel">


<div class="clock" id="clock">
${formatTime()}
</div>


<div class="card" id="conditions">
Loading...
</div>


<div class="card" id="forecast">
Loading...
</div>


<div class="card" id="air">
Loading...
</div>


<div class="card">

<h3>North Dakota Alerts</h3>

<div id="alerts-content">
Loading...
</div>

</div>


<div class="card" id="ticker">
Loading...
</div>


</div>


</div>

`;


startDashboardEngine();

return;

}



c.innerHTML=`

<div class="full">

<iframe src="${MAPS[name]}"></iframe>

</div>

`;

}



document
.querySelectorAll("[data-page]")
.forEach(btn=>{

btn.onclick=()=>page(btn.dataset.page);

});



window.page=page;



page("overview");


loadAlertTicker();


setInterval(
loadAlertTicker,
300000
);


startRotationEngine();
