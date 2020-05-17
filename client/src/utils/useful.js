
const round = (val, decimals) => Number(Math.round(`${val}e${decimals}`) + `e-${decimals}`);

export { round };
