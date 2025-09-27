import { Role } from "@prisma/client";

export const SPECIAL_ROLES: Record<string, Role> = {
  admin: "ADMIN",
  nikita: "NIKITA",
};
