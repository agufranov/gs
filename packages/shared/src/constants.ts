import { Role } from "@prisma/client";

// Auth constants
export const AUTH_COOKIE_NAME = "sessionId";

export const SPECIAL_ROLES: Record<string, Role> = {
  admin: "ADMIN",
  nikita: "NIKITA",
};

export const SKIP_ROUTE_HOOKS = {
  auth: ["/auth/signIn", "/auth/signUp"],
};
