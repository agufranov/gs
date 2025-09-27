import { Role } from "@prisma/client";
export declare const AUTH_COOKIE_NAME = "sessionId";
export declare const SPECIAL_ROLES: Record<string, Role>;
export declare const SKIP_ROUTE_HOOKS: {
    auth: string[];
};
