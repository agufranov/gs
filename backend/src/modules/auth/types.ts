import { User } from "@prisma/client";
import { USER_FIELDS } from "./const";

export interface SignInRequest {
  username: string;
  password: string;
}

export type UserResponse = Pick<User, (typeof USER_FIELDS)[number]>;
