import { User } from "../user";

export type UserSliceType = {
  userInfo: User | null;
  isLoggedIn: boolean;
};
