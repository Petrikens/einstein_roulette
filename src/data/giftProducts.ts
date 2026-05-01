export interface GiftProduct {
  id: string;
  name: string;
  price: number;
}

export const giftProducts: GiftProduct[] = [
  { id: 'gift-01', name: '2 \u043c\u0430\u0433\u043d\u0438\u0442\u0430', price: 2 },
  { id: 'gift-02', name: '3 \u043c\u0430\u0433\u043d\u0438\u0442\u0430', price: 3 },
  { id: 'gift-03', name: '4 \u043c\u0430\u0433\u043d\u0438\u0442\u0430', price: 4 },
  { id: 'gift-04', name: '\u0421\u0435\u0440\u0442\u0438\u0444\u0438\u043a\u0430\u0442 \u043d\u0430 \u0431\u0430\u0440', price: 5 },
  { id: 'gift-05', name: '\u041a\u043e\u0432\u0440\u0438\u043a', price: 7 },
  { id: 'gift-06', name: '\u041a\u0440\u0443\u0436\u043a\u0430', price: 8 },
  { id: 'gift-07', name: '\u0421\u0435\u0440\u0442\u0438\u0444\u0438\u043a\u0430\u0442 \u043d\u0430 \u0431\u0430\u0440 + \u043c\u0430\u0433\u043d\u0438\u0442', price: 6 },
  { id: 'gift-08', name: '\u041a\u043e\u0432\u0440\u0438\u043a \u0434\u043b\u044f \u043c\u044b\u0448\u043a\u0438 + \u043c\u0430\u0433\u043d\u0438\u0442', price: 8 },
  { id: 'gift-09', name: '\u041a\u0440\u0443\u0436\u043a\u0430 + \u043c\u0430\u0433\u043d\u0438\u0442', price: 9 },
  { id: 'gift-10', name: '\u041a\u043e\u0432\u0440\u0438\u043a + \u0441\u0435\u0440\u0442\u0438\u0444\u0438\u043a\u0430\u0442 \u043d\u0430 \u0431\u0430\u0440', price: 12 },
  { id: 'gift-11', name: '\u041a\u0440\u0443\u0436\u043a\u0430 + \u0441\u0435\u0440\u0442\u0438\u0444\u0438\u043a\u0430\u0442 \u043d\u0430 \u0431\u0430\u0440', price: 13 },
  { id: 'gift-12', name: '\u041a\u0440\u0443\u0436\u043a\u0430 + \u043a\u043e\u0432\u0440\u0438\u043a', price: 15 },
  { id: 'gift-13', name: '\u041a\u0440\u0443\u0436\u043a\u0430 + \u043a\u043e\u0432\u0440\u0438\u043a + \u043c\u0430\u0433\u043d\u0438\u0442', price: 16 },
];
