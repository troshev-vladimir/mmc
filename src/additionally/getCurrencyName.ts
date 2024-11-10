export default function getCurrencyName(currencyId: number): string {
  if (currencyId === 2) return "Usd";
  if (currencyId === 3) return "Eur";
  return "Rub";
}
