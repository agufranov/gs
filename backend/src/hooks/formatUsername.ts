import { FastifyRequest } from "fastify";
import { Hook } from "./types";

export const formatUsernameHook: Hook<"preValidation"> = {
  // TODO solve problem
  // @ts-expect-error
  handler: async (request: FastifyRequest<{ Body: { username: string } }>) => {
    request.body.username = request.body.username.trim().toLowerCase();
  },
  stage: "preValidation",
};
