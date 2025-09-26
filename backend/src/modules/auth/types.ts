import { Type } from "@fastify/type-provider-typebox";
import { User } from "@prisma/client";
import { USER_SELECT_FIELDS } from "./const";

export const SignInRequestSchema = Type.Object({
  username: Type.String({ minLength: 1, }),
  password: Type.String({ minLength: 1 }),
});

export type SignInRequest = Type.Static<typeof SignInRequestSchema>;

export type UserResponse = Pick<User, keyof typeof USER_SELECT_FIELDS>;
