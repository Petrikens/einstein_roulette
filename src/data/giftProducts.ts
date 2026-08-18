export interface GiftProduct {
  id: string;
  name: string;
  price: number;
}

export const giftProducts: GiftProduct[] = [
  { id: 'gift-01', name: 'Набор магнитов', price: 1.5 },
  { id: 'gift-02', name: 'Брелок', price: 1.5 },
  { id: 'gift-03', name: 'Кружка', price: 6 },
  { id: 'gift-04', name: 'Сертификат', price: 5 },
  { id: 'gift-05', name: 'Брелок + магнит', price: 2 },
  { id: 'gift-06', name: 'Носки', price: 6 },
  { id: 'gift-07', name: 'Носки + сертификат', price: 11 },
  { id: 'gift-08', name: 'Носки + брелок', price: 7.5 },
  { id: 'gift-9', name: 'Шоппер', price: 12 },
  { id: 'gift-10', name: 'Сертификат + магнит', price: 5.5 },
  { id: 'gift-11', name: 'Сертификат + брелок', price: 6.5 },
  { id: 'gift-12', name: 'Носки + магнит', price: 6.5 },
];
