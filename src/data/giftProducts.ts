export interface GiftProduct {
  id: string;
  name: string;
  price: number;
}

export const giftProducts: GiftProduct[] = [
  { id: 'book-relativity', name: 'Книга о теории относительности', price: 1800 },
  { id: 'smart-speaker', name: 'Умная колонка', price: 6990 },
  { id: 'coffee-kit', name: 'Набор specialty кофе', price: 3200 },
  { id: 'wireless-headphones', name: 'Беспроводные наушники', price: 11990 },
  { id: 'desk-lamp', name: 'Настольная лампа', price: 4500 },
  { id: 'online-course', name: 'Сертификат на онлайн-курс', price: 15900 },
  { id: 'puzzle', name: 'Премиум-головоломка', price: 2400 },
  { id: 'tablet', name: 'Планшет для заметок', price: 24990 },
];

export function giftWeight(price: number): number {
  return 1 / Math.sqrt(price);
}
