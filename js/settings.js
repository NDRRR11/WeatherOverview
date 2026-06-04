
export const settings={
rotate:localStorage.getItem('rotate')!=='false',
interval:+(localStorage.getItem('interval')||60)
};
