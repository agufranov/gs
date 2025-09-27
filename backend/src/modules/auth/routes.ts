import { formatUsernameHook } from "@/hooks/formatUsername";
import { AuthService } from "@/services";
import {
  AUTH_COOKIE_NAME,
  ErrorResponse,
  SignInRequest,
  SignInRequestSchema,
  UserResponse,
} from "@gs/shared";
import { FastifyInstance } from "fastify";

export default function authRoutes(server: FastifyInstance) {
  server.post<{
    Body: SignInRequest;
    Reply: ErrorResponse;
  }>(
    "/signIn",
    {
      [formatUsernameHook.stage]: formatUsernameHook.handler,
      schema: {
        body: SignInRequestSchema,
      },
    },
    async (request, reply) => {
      const { prisma } = server;
      const { username, password } = request.body;
      const authService = new AuthService(prisma);

      let user;

      try {
        user = await authService.signIn({ username, password });
      } catch (error: any) {
        return reply.code(401).send({ error: error.message });
      }

      if (!user) {
        return reply.code(500).send({ error: "User not found after creation" });
      }

      const session = await authService.createSession(user.id);

      reply.setCookie(AUTH_COOKIE_NAME, session.data, {
        httpOnly: true,
        secure: true,
        path: "/",
      });

      return reply.code(200).send();
    }
  );

  server.post("/signOut", async (request, reply) => {
    const { prisma } = server;
    const authService = new AuthService(prisma);

    reply.clearCookie(AUTH_COOKIE_NAME);

    const sessionId = request.cookies[AUTH_COOKIE_NAME];
    if (sessionId) {
      await authService.signOut(sessionId);
    }
  });

  server.get<{ Reply: UserResponse | undefined }>(
    "/profile",
    async (request, reply) => {
      return request.user;
    }
  );
}
