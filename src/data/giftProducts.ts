export interface GiftProduct {
  id: string;
  name: string;
  price: number;
}

export const giftProducts: GiftProduct[] = [
  { id: 'gift-01', name: 'Набор магнитов', price: 3 },
  { id: 'gift-02', name: 'Кружка', price: 8 },
  { id: 'gift-03', name: 'Сертификат', price: 5 },
  { id: 'gift-04', name: 'Коврик', price: 7 },
  { id: 'gift-05', name: 'Носки', price: 6 },
  { id: 'gift-06', name: 'Носки + сертификат', price: 11 },
  { id: 'gift-7', name: 'Шоппер', price: 12 },
  { id: 'gift-8', name: 'Сертификат + магнит', price: 6 },
  { id: 'gift-9', name: 'Носки + магнит', price: 7 },
];
