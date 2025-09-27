import { Type } from "@fastify/type-provider-typebox";
import { User, Round, RoundPlayer } from "@prisma/client";
export declare const SignInRequestSchema: Type.TObject<{
    username: Type.TString;
    password: Type.TString;
}>;
export type SignInRequest = Type.Static<typeof SignInRequestSchema>;
export declare const USER_SELECT_FIELDS: {
    readonly id: true;
    readonly username: true;
    readonly role: true;
};
export type UserResponse = Pick<User, keyof typeof USER_SELECT_FIELDS>;
export type RoundResponse = Omit<Round, "startAt" | "endAt"> & {
    startAt: string;
    endAt: string;
    players: (RoundPlayer & {
        user: UserResponse;
    })[];
};
export type ErrorResponse = {
    error: string;
};
export type RoundStatus = 'cooldown' | 'started' | 'ended';
export declare const ROUND_STATUS_NAMES: {
    [k in RoundStatus]: string;
};
