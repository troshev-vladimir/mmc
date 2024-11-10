export default function getCurrencySymbol(currencyId: number): string {
  if (currencyId === 2) return "$";
  if (currencyId === 3) return `€`;
  return `₽`;
}
