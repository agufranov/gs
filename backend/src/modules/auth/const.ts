import { User } from "@prisma/client";

export const AUTH_COOKIE_NAME = "sessionId";

export const USER_SELECT_FIELDS = {
  id: true,
  role: true,
  username: true,
} satisfies { [k in keyof Partial<User>]: boolean };
