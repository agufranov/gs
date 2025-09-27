"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SKIP_ROUTE_HOOKS = exports.SPECIAL_ROLES = exports.AUTH_COOKIE_NAME = void 0;
// Auth constants
exports.AUTH_COOKIE_NAME = "sessionId";
exports.SPECIAL_ROLES = {
    admin: "ADMIN",
    nikita: "NIKITA",
};
exports.SKIP_ROUTE_HOOKS = {
    auth: ['/auth/signIn', '/auth/signUp'],
};
