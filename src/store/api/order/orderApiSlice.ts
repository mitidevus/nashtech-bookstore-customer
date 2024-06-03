import { resetCart } from "store/slice/cartSlice";
import { CreateOrderDto } from "types/order";
import { apiSlice } from "../baseApiSlice";

const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    createOrder: build.mutation<void, CreateOrderDto>({
      query: (body) => ({
        url: "orders",
        method: "POST",
        body,
      }),
      onQueryStarted: (_, { dispatch }) => {
        dispatch(resetCart());
      },
    }),
  }),
});

export const { useCreateOrderMutation } = orderApiSlice;
