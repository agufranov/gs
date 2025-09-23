import { User } from "@prisma/client";

export const AUTH_COOKIE_NAME = "sessionId";

export const USER_FIELDS = ["id", "role", "username"] satisfies (keyof User)[];
