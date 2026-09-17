export default function getLavaTopMinimumAmount(currencyId: number): number {
  if (currencyId === 2) return 5;
  if (currencyId === 3) return 6;
  return 50;
}

export function isLavaTopAmountValid(amount: unknown, currencyId: number): boolean {
  const value = Number(amount);
  return Number.isFinite(value) && value >= getLavaTopMinimumAmount(currencyId);
}
