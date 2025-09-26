import { USER_SELECT_FIELDS } from "@/modules/auth/const";
import { RoundResponse } from "@/modules/rounds/types";
import { addSeconds } from "date-fns";
import { BaseService } from "./BaseService";

export interface CreateRoundData {
  cooldownSeconds: number;
  roundSeconds: number;
}

export interface JoinRoundResult {
  success: boolean;
  error?: string;
}

export interface TapResult {
  success: boolean;
  error?: string;
}

export class RoundService extends BaseService {
  async getAllRounds(): Promise<RoundResponse[]> {
    const rounds = await this.prisma.round.findMany({
      include: {
        players: {
          include: {
            user: {
              select: USER_SELECT_FIELDS,
            },
          },
        },
        winner: {
          select: USER_SELECT_FIELDS,
        },
      },
      orderBy: {
        startAt: "desc",
      },
    });

    return rounds.map((round) => ({
      ...round,
      startAt: round.startAt.toISOString(),
      endAt: round.endAt.toISOString(),
    }));
  }

  async getRoundById(id: number): Promise<RoundResponse | null> {
    const round = await this.prisma.round.findUnique({
      where: { id },
      include: {
        players: {
          include: {
            user: {
              select: USER_SELECT_FIELDS,
            },
          },
        },
        winner: {
          select: USER_SELECT_FIELDS,
        },
      },
    });

    if (!round) {
      return null;
    }

    return {
      ...round,
      startAt: round.startAt.toISOString(),
      endAt: round.endAt.toISOString(),
    };
  }

  async createRound({
    cooldownSeconds,
    roundSeconds,
  }: CreateRoundData): Promise<RoundResponse> {
    const startAt = addSeconds(
      new Date(),
      Number.isFinite(cooldownSeconds) ? cooldownSeconds : 0
    );
    const endAt = addSeconds(
      startAt,
      Number.isFinite(roundSeconds) ? roundSeconds : 0
    );

    const round = await this.prisma.round.create({
      data: {
        startAt,
        endAt,
      },
    });

    return {
      ...round,
      startAt: round.startAt.toISOString(),
      endAt: round.endAt.toISOString(),
      players: [],
      winner: null,
    };
  }

  async joinRound(roundId: number, userId: number): Promise<JoinRoundResult> {
    try {
      await this.prisma.$transaction(async (tx) => {
        const inserted = await tx.$executeRaw`
          INSERT INTO "RoundPlayers" ("roundId", "userId")
          SELECT ${roundId}, ${userId}
          WHERE EXISTS (
            SELECT 1 FROM "Rounds" r
            WHERE r.id = ${roundId} AND r."startAt" > NOW() AT TIME ZONE 'UTC'
          )
          ON CONFLICT ("roundId", "userId") DO NOTHING`;

        if (Number(inserted) === 1) {
          return { success: true };
        }

        const existing = await tx.roundPlayer.findUnique({
          where: { roundId_userId: { roundId, userId } },
          select: { roundId: true },
        });

        if (existing) {
          return {
            success: false,
            error: "You have already joined this round",
          };
        }

        const round = await tx.round.findUnique({
          where: { id: roundId },
          select: { id: true, startAt: true },
        });

        if (!round) {
          return { success: false, error: "Round not found" };
        }

        return {
          success: false,
          error: "Cannot join: round has already started",
        };
      });

      return { success: true };
    } catch (error) {
      console.error("RoundService.joinRound error:", error);
      return { success: false, error: "Internal server error" };
    }
  }

  async tapRound(roundId: number, userId: number): Promise<TapResult> {
    try {
      const rows: Array<{ taps: number; score: number }> = await this.prisma
        .$queryRaw`
          UPDATE "RoundPlayers" rp
          SET
            "taps" = rp."taps" + 1,
            "score" = rp."score" + CASE WHEN ((rp."taps" + 1) % 11) = 0 THEN 10 ELSE 1 END
          FROM "Rounds" r
          WHERE r.id = rp."roundId"
            AND rp."roundId" = ${roundId}
            AND rp."userId" = ${userId}
            AND r."startAt" < NOW() AT TIME ZONE 'UTC'
            AND r."endAt" > NOW() AT TIME ZONE 'UTC'
          RETURNING rp."taps", rp."score";
        `;

      if (!rows || rows.length === 0) {
        return {
          success: false,
          error: "Cannot tap: round not active or player not joined",
        };
      }

      return { success: true };
    } catch (error) {
      console.error("RoundService.tapRound error:", error);
      return { success: false, error: "Internal server error" };
    }
  }
}
