import { User } from "./user";

export type LoginDto = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

export type SignUpDto = LoginDto & {
  name: string;
};

export type RefreshTokenResponse = {
  accessToken: string;
  refreshToken: string;
};
