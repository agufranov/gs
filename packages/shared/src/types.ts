import { Type } from "@fastify/type-provider-typebox";
import { Round, RoundPlayer, User } from "@prisma/client";

// Auth types
export const SignInRequestSchema = Type.Object({
  username: Type.String({ minLength: 1 }),
  password: Type.String({ minLength: 1 }),
});

export type SignInRequest = Type.Static<typeof SignInRequestSchema>;

export const USER_SELECT_FIELDS = {
  id: true,
  username: true,
  role: true,
} as const;

export type UserResponse = Pick<User, keyof typeof USER_SELECT_FIELDS>;

// Round types
export type RoundResponse = Omit<Round, "startAt" | "endAt"> & {
  startAt: string;
  endAt: string;
  players: (RoundPlayer & { user: UserResponse })[];
  winner: UserResponse | null;
};

// Common types
export type ErrorResponse = { error: string };

// Frontend specific types
export type RoundStatus = "cooldown" | "started" | "ended";

export const ROUND_STATUS_NAMES: { [k in RoundStatus]: string } = {
  cooldown: "Cooldown",
  started: "Активен",
  ended: "Завершён",
};
