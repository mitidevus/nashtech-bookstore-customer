import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UserSliceType } from "../../types/store/user";
import { User } from "../../types/user";
import auth from "../../utils/auth";

const initialState: UserSliceType = {
  userInfo: null,
  isLoggedIn: Boolean(auth.getAccessToken()),
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },

    setUserInfo: (state, action: PayloadAction<User>) => {
      state.userInfo = action.payload;
    },

    logOut: (state) => {
      state.userInfo = null;
      state.isLoggedIn = false;

      auth.logout();
    },
  },
});

export const selectIsLoggedIn = (state: { user: UserSliceType }) =>
  state.user.isLoggedIn;

export const selectUserInfo = (state: { user: UserSliceType }) =>
  state.user.userInfo;

export const { setIsLoggedIn, setUserInfo, logOut } = userSlice.actions;
