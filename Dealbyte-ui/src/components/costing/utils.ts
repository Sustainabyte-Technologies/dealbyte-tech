export function formatMoney(val: number): string {
  if (isNaN(val) || val === null || val === undefined) return '0.00';
  return val.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function calcPriceFromCost(cost: number, marginPct: number): number {
  const margin = Number(marginPct || 0);
  if (margin >= 100) return cost * 2;
  const price = Number(cost || 0) / (1 - margin / 100);
  return Math.round(price * 100) / 100;
}

export function roundToHundred(val: number): number {
  return Math.round(val / 100) * 100;
}
