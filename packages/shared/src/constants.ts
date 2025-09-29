import { Role } from "@prisma/client";
import { RoundStatus } from "./types";

// Auth constants
export const AUTH_COOKIE_NAME = "sessionId";

export const SPECIAL_ROLES: Record<string, Role> = {
  admin: "ADMIN",
  nikita: "NIKITA",
} as const;

export const SKIP_ROUTE_HOOKS = {
  auth: ["/auth/signIn", "/auth/signUp"],
};

export const ROUND_STATUS_NAMES: { [k in RoundStatus]: string } = {
  cooldown: "Cooldown",
  started: "Активен",
  ended: "Завершён",
};
