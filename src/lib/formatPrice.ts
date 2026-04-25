const priceFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
});

export function formatPrice(price: number): string {
  return priceFormatter.format(price).replace(/\u00a0/g, ' ');
}
