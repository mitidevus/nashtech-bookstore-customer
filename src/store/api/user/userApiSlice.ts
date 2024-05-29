import { setIsLoggedIn, setUserInfo } from "store/slice/userSlice";
import { LoginDto, LoginResponse, SignUpDto, SignupResponse } from "types/auth";
import auth from "utils/auth";
import { apiSlice, apiWithToastSlice } from "../baseApiSlice";

const userApiToastSlice = apiWithToastSlice.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<LoginResponse, LoginDto>({
      query: (body) => ({
        url: "auth/login",
        method: "POST",
        body,
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;

        dispatch(setUserInfo(data.user));
        dispatch(setIsLoggedIn(true));
        auth.setToken(data.accessToken, data.refreshToken);
      },
    }),
    signup: build.mutation<SignupResponse, SignUpDto>({
      query: (body) => ({
        url: "auth/signup",
        method: "POST",
        body,
      }),
    }),
  }),
});

const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    logout: build.mutation<void, void>({
      query: (body) => ({
        url: "auth/logout",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useLoginMutation, useSignupMutation } = userApiToastSlice;

export const { useLogoutMutation } = userApiSlice;
