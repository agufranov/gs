import { FastifyRequest } from "fastify";

export const formatUsernameHook = {
  handler: async (request: FastifyRequest<{ Body: { username: string } }>) => {
    request.body.username = request.body.username.trim().toLowerCase();
  },
  stage: "preValidation",
};
