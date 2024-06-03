import { Book } from "./book";

export type CartItemDto = {
  bookId: number;
  quantity: number;
};

export type CartItem = CartItemDto & {
  book: Book;
  totalPrice: number;
};

export type Cart = {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
  finalPrice: number;
  discount: number;
};
