import { resetCart, setCart } from "store/slice/cartSlice";
import { Cart, CheckoutDto } from "types/cart";
import { Order } from "types/order";
import { apiSlice } from "../baseApiSlice";

const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getCart: build.query<Cart, void>({
      query: () => "cart",
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        dispatch(setCart(data.totalQuantity));
      },
    }),
    addToCart: build.mutation<Cart, { bookId: number; quantity: number }>({
      query: ({ bookId, quantity }) => ({
        url: "cart",
        method: "POST",
        body: { bookId, quantity },
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        dispatch(setCart(data.totalQuantity));
      },
    }),
    updateCartItems: build.mutation<Cart, { bookId: number; quantity: number }>(
      {
        query: (body) => ({
          url: "cart",
          method: "PATCH",
          body,
        }),
        onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
          const { data } = await queryFulfilled;
          dispatch(setCart(data.totalQuantity));
        },
      }
    ),
    removeCartItem: build.mutation<Cart, number>({
      query: (bookId) => ({
        url: `cart/${bookId}`,
        method: "DELETE",
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        dispatch(setCart(data.totalQuantity));
      },
    }),
    clearCart: build.mutation<Cart, void>({
      query: () => ({
        url: "cart",
        method: "DELETE",
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        dispatch(setCart(data.totalQuantity));
      },
    }),
    checkout: build.mutation<Order, CheckoutDto>({
      query: (body) => ({
        url: "cart/checkout",
        method: "POST",
        body,
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        await queryFulfilled;
        dispatch(resetCart());
      },
    }),
  }),
});

export const {
  useGetCartQuery,
  useLazyGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemsMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
  useCheckoutMutation,
} = cartApiSlice;
