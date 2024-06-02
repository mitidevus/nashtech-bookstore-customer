import { Cart } from "types/cart";
import { apiSlice } from "../baseApiSlice";

const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getCart: build.query<Cart, void>({
      query: () => "cart",
    }),
    addToCart: build.mutation<Cart, { bookId: number; quantity: number }>({
      query: ({ bookId, quantity }) => ({
        url: "cart",
        method: "POST",
        body: { bookId, quantity },
      }),
    }),
    updateCartItems: build.mutation<Cart, { bookId: number; quantity: number }>(
      {
        query: (body) => ({
          url: "cart",
          method: "PATCH",
          body,
        }),
      }
    ),
    removeCartItem: build.mutation<Cart, number>({
      query: (bookId) => ({
        url: `cart/${bookId}`,
        method: "DELETE",
      }),
    }),
    clearCart: build.mutation<Cart, void>({
      query: () => ({
        url: "cart",
        method: "DELETE",
      }),
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
} = cartApiSlice;
