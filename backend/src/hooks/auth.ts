import { SKIP_ROUTE_HOOKS } from "@/const/skipRouteHooks";
import { Hook } from "@/hooks/types";
import { AuthService } from "@/services";
import { UserResponse } from "@/types";

declare module "fastify" {
  interface FastifyRequest {
    user?: UserResponse;
  }
}

// TODO we need to exclude swagger, so add this hook only for specific subset?
export const authHook: Hook<"onRequest"> = {
  handler: async (request, reply) => {
    const { url } = request;

    // TODO debug
    // await new Promise((r) => setTimeout(r, 700));

    if (url && /^\/swagger\/.*/.test(url)) {
      return;
    }

    if (url && SKIP_ROUTE_HOOKS.auth.includes(url)) {
      return;
    }
    const { sessionId } = request.cookies;
    if (!sessionId) {
      reply.code(401);
      throw { error: "UNAUTHORIZED" };
    }
    try {
      const authService = new AuthService(request.server.prisma);
      request.user = (await authService.getSessionUser(sessionId)) || undefined;
    } catch (err) {
      throw err;
    }
  },
  stage: "onRequest",
};
