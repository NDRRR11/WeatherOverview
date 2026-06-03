
export const settings={
rotate:localStorage.getItem('rotate')!=='false',
interval:+(localStorage.getItem('interval')||60)
};


export function startRotation(){ console.log('rotation placeholder'); }


export function alertsHtml(){
return '<div class="panel"><h2>ND Alerts</h2><p>Future NWS feed integration.</p></div>';
}
