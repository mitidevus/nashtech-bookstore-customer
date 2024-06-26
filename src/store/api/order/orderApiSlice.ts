import { Order as SortOrder } from "constants/sort";
import { GetList } from "types/app";
import { Order } from "types/order";
import { apiSlice } from "../baseApiSlice";

const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getOrders: build.query<
      GetList<Order>,
      {
        page: number;
        take: number;
        order: SortOrder;
      }
    >({
      query: ({ page, take, order }) => ({
        url: `orders`,
        params: {
          page,
          take,
          order,
        },
      }),
    }),
    getOrder: build.query<Order, string>({
      query: (id) => `orders/${id}`,
    }),
    cancelOrder: build.mutation<void, string>({
      query: (id) => ({
        url: `orders/${id}/cancel`,
        method: "PATCH",
      }),
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useLazyGetOrdersQuery,
  useGetOrderQuery,
  useLazyGetOrderQuery,
  useCancelOrderMutation,
} = orderApiSlice;
