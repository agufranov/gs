import { addSeconds } from "date-fns";
import { FastifyInstance } from "fastify";
import { USER_SELECT_FIELDS } from "../auth/const";

// TODO typing

export default async function roundRoutes(server: FastifyInstance) {
  server.get("/rounds", async (request, reply) => {
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

      // Transform dates to ISO strings
      const transformedRounds = rounds.map((round) => ({
        ...round,
        startAt: round.startAt.toISOString(),
        endAt: round.endAt.toISOString(),
      }));

      return { rounds: transformedRounds };
    } catch (error) {
      console.error("Error fetching rounds:", error);
      reply.code(500);
      throw error;
    }
  });

  server.get<{ Params: { id: number } }>(
    "/rounds/:id",
    async (request, reply) => {
      const { prisma } = server;
      const { id } = request.params;

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
          return reply.code(404).send({ error: "User not found" });
        }

        // Transform dates to ISO strings
        const transformedRound = {
          ...round,
          startAt: round.startAt.toISOString(),
          endAt: round.endAt.toISOString(),
        };

        return transformedRound;
      } catch (error) {
        console.error("Error fetching round:", error);
        reply.code(500);
        throw error;
      }
    }
  );

  // POST /rounds - Create new round
  server.post("/rounds", async (request, reply) => {
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

      // Transform dates to ISO strings
      const transformedRound = {
        ...round,
        // startAt: round.startAt.toISOString(),
        // endAt: round.endAt.toISOString(),
      };

      return reply.code(200).send(transformedRound);
    } catch (error) {
      console.error("Error creating round:", error);
      reply.code(500);
      throw error;
    }
  });
}
