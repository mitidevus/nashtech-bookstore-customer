import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItemQuantity: 0,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.cartItemQuantity = action.payload;
    },
    resetCart: (state) => {
      state.cartItemQuantity = 0;
    },
  },
});

export const selectCartItemQuantity = (state: {
  cart: { cartItemQuantity: number };
}) => state.cart.cartItemQuantity;

export const { setCart, resetCart } = cartSlice.actions;
