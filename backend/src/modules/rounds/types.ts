import { UserResponse } from "@/types";
import { Round, RoundPlayer } from "@prisma/client";

export type ErrorResponse = { error: string };

export type RoundResponse = Omit<Round, "startAt" | "endAt"> & {
  startAt: string;
  endAt: string;
  players: RoundPlayer[];
  winner: UserResponse | null;
};
