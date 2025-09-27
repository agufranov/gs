"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROUND_STATUS_NAMES = exports.USER_SELECT_FIELDS = exports.SignInRequestSchema = void 0;
const type_provider_typebox_1 = require("@fastify/type-provider-typebox");
// Auth types
exports.SignInRequestSchema = type_provider_typebox_1.Type.Object({
    username: type_provider_typebox_1.Type.String({ minLength: 1 }),
    password: type_provider_typebox_1.Type.String({ minLength: 1 }),
});
exports.USER_SELECT_FIELDS = {
    id: true,
    username: true,
    role: true,
};
exports.ROUND_STATUS_NAMES = {
    cooldown: 'Cooldown',
    started: 'Активен',
    ended: 'Завершён',
};
