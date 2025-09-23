import { SKIP_ROUTE_HOOKS } from "@/const/skipRouteHooks";
import { Hook } from "@/hooks/types";
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
    await new Promise((r) => setTimeout(r, 700));

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
      const session = await request.server.prisma.authSession.findUnique({
        where: { data: sessionId },
        select: { user: { select: { id: true, username: true, role: true } } },
      });
      request.user = session?.user;
    } catch (err) {
      throw err;
    }
  },
  stage: "onRequest",
};
