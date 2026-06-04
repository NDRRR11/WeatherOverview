
import {MAPS} from '../config/maps.js';
import {alertsHtml} from './alerts.js';

const c=document.getElementById('content');

function page(name){
if(name==='overview'){
c.innerHTML=`<div class="grid">
<div class="left"><iframe src="${MAPS.local}"></iframe></div>
<div class="right">
<iframe src="${MAPS.national}"></iframe>
<iframe src="${MAPS.air}"></iframe>
<div class="panel"><h2>Bismarck Conditions</h2><p>Reserved for live weather/alerts.</p></div>
</div></div>`;
return;
}
if(name==='alerts'){c.innerHTML=alertsHtml();return;}
const src=MAPS[name];
c.innerHTML=`<div class="full"><iframe src="${src}"></iframe></div>`;
}
document.querySelectorAll('[data-page]').forEach(b=>{
b.onclick=()=>page(b.dataset.page);
});

setInterval(()=>{
document.getElementById('clock').textContent=new Date().toLocaleString();
},1000);

page('overview');
