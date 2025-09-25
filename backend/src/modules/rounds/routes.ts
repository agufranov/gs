import { adminsOnlyHook } from "@/hooks/adminsOnly";
import { addSeconds } from "date-fns";
import { FastifyInstance } from "fastify";
import { USER_SELECT_FIELDS } from "../auth/const";
import { ErrorResponse, RoundResponse } from "./types";

export default async function roundRoutes(server: FastifyInstance) {
  server.get<{ Reply: RoundResponse[] | ErrorResponse }>(
    "/",
    async (request, reply) => {
      const { prisma } = server;

      try {
        const rounds = await prisma.round.findMany({
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
      } catch (error) {
        console.error("Error fetching rounds:", error);
        reply.code(500);
        throw error;
      }
    }
  );

  server.get<{ Params: { id: number }; Reply: RoundResponse | ErrorResponse }>(
    "/:id",
    async (request, reply) => {
      const { prisma } = server;
      const id = Number(request.params.id);

      try {
        const round = await prisma.round.findUnique({
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
          return reply.code(404).send({ error: "Round not found" });
        }

        return {
          ...round,
          startAt: round.startAt.toISOString(),
          endAt: round.endAt.toISOString(),
        };
      } catch (error) {
        console.error("Error fetching round:", error);
        reply.code(500);
        throw error;
      }
    }
  );

  // POST /rounds - Create new round
  server.post(
    "/",
    {
      [adminsOnlyHook.stage]: adminsOnlyHook.handler,
    },
    async (request, reply) => {
      const { prisma } = server;

      try {
        const cooldownSeconds = Number.parseInt(
          process.env.COOLDOWN_DURATION ?? "0",
          10
        );
        const roundSeconds = Number.parseInt(
          process.env.ROUND_DURATION ?? "0",
          10
        );

        const startAt = addSeconds(
          new Date(),
          Number.isFinite(cooldownSeconds) ? cooldownSeconds : 0
        );
        const endAt = addSeconds(
          startAt,
          Number.isFinite(roundSeconds) ? roundSeconds : 0
        );

        const round = await prisma.round.create({
          data: {
            startAt,
            endAt,
          },
        });

        return reply.code(200).send({
          ...round,
          startAt: round.startAt.toISOString(),
          endAt: round.endAt.toISOString(),
        });
      } catch (error) {
        console.error("Error creating round:", error);
        reply.code(500);
        throw error;
      }
    }
  );

  server.post<{ Params: { id: number } }>(
    "/:id/join",
    async (request, reply) => {
      const { prisma } = server;

      if (!request.user?.id) {
        reply.code(401).send({ error: "Unauthorized" });
        return;
      }

      const roundId = Number(request.params.id);
      const userId = Number(request.user!.id);
      await prisma.$transaction(async (tx) => {
        const inserted = await tx.$executeRaw`
INSERT INTO "RoundPlayers" ("roundId", "userId")
SELECT ${roundId}, ${userId}
WHERE EXISTS (
  SELECT 1 FROM "Rounds" r
  WHERE r.id = ${roundId} AND r."startAt" > NOW() AT TIME ZONE 'UTC'
)
ON CONFLICT ("roundId", "userId") DO NOTHING`;

        if (Number(inserted) === 1) {
          reply.code(204).send();
          return;
        }

        const existing = await tx.roundPlayer.findUnique({
          where: { roundId_userId: { roundId, userId } },
          select: { roundId: true },
        });

        if (existing) {
          reply.code(400).send({ error: "You have already joined this round" });
          return;
        }

        const round = await tx.round.findUnique({
          where: { id: roundId },
          select: { id: true, startAt: true },
        });

        if (!round) {
          reply.code(404).send({ error: "Round not found" });
          return;
        }

        reply
          .code(400)
          .send({ error: "Cannot join: round has already started" });
      });

      reply.code(204).send();
    }
  );

  server.post<{ Params: { id: number } }>(
    "/:id/tap",
    async (request, reply) => {
      const { prisma } = server;

      if (!request.user?.id) {
        reply.code(401).send({ error: "Unauthorized" });
        return;
      }

      try {
        const roundId = Number(request.params.id);
        const userId = Number(request.user.id);

        const rows: Array<{ taps: number; score: number }> =
          await prisma.$queryRaw`
INSERT INTO "RoundPlayers" ("roundId", "userId", "taps", "score")
SELECT ${roundId}, ${userId}, 1, CASE WHEN (1 % 11) = 0 THEN 10 ELSE 1 END
WHERE EXISTS (
  SELECT 1 FROM "Rounds" r
  WHERE r.id = ${roundId}
    AND r."startAt" < NOW() AT TIME ZONE 'UTC'
    AND r."endAt" > NOW() AT TIME ZONE 'UTC'
)
ON CONFLICT ("roundId", "userId") DO UPDATE SET
  "taps" = "RoundPlayers"."taps" + 1,
  "score" = "RoundPlayers"."score" + CASE WHEN (("RoundPlayers"."taps" + 1) % 11) = 0 THEN 10 ELSE 1 END
RETURNING "taps", "score";
        `;

        if (!rows || rows.length === 0) {
          reply
            .code(400)
            .send({ error: "Cannot tap: round not active or not found" });
          return;
        }

        reply.code(204).send();
      } catch (error) {
        console.error("Error tapping:", error);
        reply.code(500).send({ error: "Internal server error" });
      }
    }
  );
}
