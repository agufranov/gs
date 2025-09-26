import { adminsOnlyHook } from "@/hooks/adminsOnly";
import { RoundService } from "@/services";
import { FastifyInstance } from "fastify";
import { ErrorResponse, RoundResponse } from "./types";

export default async function roundRoutes(server: FastifyInstance) {
  server.get<{ Reply: RoundResponse[] | ErrorResponse }>(
    "/",
    async (request, reply) => {
      const { prisma } = server;
      const roundService = new RoundService(prisma);

      try {
        const rounds = await roundService.getAllRounds();
        return rounds;
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
      const roundService = new RoundService(prisma);
      const id = Number(request.params.id);

      try {
        const round = await roundService.getRoundById(id);

        if (!round) {
          return reply.code(404).send({ error: "Round not found" });
        }

        return round;
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
      const roundService = new RoundService(prisma);

      try {
        const cooldownSeconds = Number.parseInt(
          process.env.COOLDOWN_DURATION ?? "0",
          10
        );
        const roundSeconds = Number.parseInt(
          process.env.ROUND_DURATION ?? "0",
          10
        );

        const round = await roundService.createRound({
          cooldownSeconds,
          roundSeconds,
        });

        return reply.code(200).send(round);
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
      const roundService = new RoundService(prisma);

      if (!request.user?.id) {
        reply.code(401).send({ error: "Unauthorized" });
        return;
      }

      const roundId = Number(request.params.id);
      const userId = Number(request.user.id);

      try {
        const result = await roundService.joinRound(roundId, userId);

        if (!result.success) {
          const statusCode = result.error === "Round not found" ? 404 : 400;
          return reply.code(statusCode).send({ error: result.error });
        }

        return reply.code(204).send();
      } catch (error) {
        console.error("Error joining round:", error);
        reply.code(500).send({ error: "Internal server error" });
      }
    }
  );

  server.post<{ Params: { id: number } }>(
    "/:id/tap",
    async (request, reply) => {
      const { prisma } = server;
      const roundService = new RoundService(prisma);

      if (!request.user?.id) {
        reply.code(401).send({ error: "Unauthorized" });
        return;
      }

      try {
        const roundId = Number(request.params.id);
        const userId = Number(request.user.id);

        const result = await roundService.tapRound(roundId, userId);

        if (!result.success) {
          return reply.code(400).send({ error: result.error });
        }

        reply.code(204).send();
      } catch (error) {
        console.error("Error tapping:", error);
        reply.code(500).send({ error: "Internal server error" });
      }
    }
  );
}
