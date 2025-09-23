import { User } from "@prisma/client";
import { USER_SELECT_FIELDS } from "./const";

export interface SignInRequest {
  username: string;
  password: string;
}

export type UserResponse = Pick<User, keyof typeof USER_SELECT_FIELDS>;
