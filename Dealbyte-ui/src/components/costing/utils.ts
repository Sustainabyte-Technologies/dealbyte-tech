export function formatMoney(val: number): string {
  if (isNaN(val) || val === null || val === undefined) return '0.00';
  return val.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Gross Margin Formula: Price = Total Cost / (1 - Margin/100)
// For 40% Margin: Price = Total Cost / 0.60
// Profit Margin = (Total Cost / 0.60) - Total Cost
export function calcPriceFromCost(cost: number, marginPct: number = 40): number {
  const margin = marginPct !== undefined && marginPct !== null && !isNaN(Number(marginPct)) ? Number(marginPct) : 40;
  if (margin >= 100) return (Number(cost) || 0) * 2;
  const divisor = Math.max(0.01, (100 - margin) / 100);
  const price = Number(cost || 0) / divisor;
  return Math.round(price * 100) / 100;
}

export function calcMarginAmount(cost: number, marginPct: number = 40): number {
  const price = calcPriceFromCost(cost, marginPct);
  return Math.max(0, price - (Number(cost) || 0));
}

export function roundToHundred(val: number): number {
  return Math.ceil(val / 100) * 100;
}
