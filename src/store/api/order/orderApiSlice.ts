import { Order } from "types/order";
import { apiSlice } from "../baseApiSlice";

const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getOrder: build.query<Order, string>({
      query: (id) => `orders/${id}`,
    }),
  }),
});

export const { useGetOrderQuery, useLazyGetOrderQuery } = orderApiSlice;
