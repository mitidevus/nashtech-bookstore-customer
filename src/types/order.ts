import { OrderStatus, PaymentMethod } from "constants/order";
import { Book } from "./book";
import { User } from "./user";

export type Order = {
  id: string;
  fullName: string;
  phone: string;
  shippingAddress: string;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  totalPrice: number;
  items: {
    book: Book;
    price: number;
    finalPrice: number;
    totalPrice: number;
    quantity: number;
  }[];
  user: User;
  createdAt: string;
  updatedAt: string;
};
