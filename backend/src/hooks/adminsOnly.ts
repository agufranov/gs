import { FastifyReply, FastifyRequest } from "fastify";
import { Hook } from "./types";

export const adminsOnlyHook: Hook<"preHandler"> = {
  handler: async (request: FastifyRequest, reply: FastifyReply) => {
    if (request.user?.role !== "ADMIN") {
      reply.code(403).send({ error: "This action requires admin rights" });
      throw { error: "NO RIGHTS" };
    }
  },
  stage: "preHandler",
};
