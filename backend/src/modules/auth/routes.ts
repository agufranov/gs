import { formatUsernameHook } from "@/hooks/formatUsername";
import { AUTH_COOKIE_NAME } from "@/modules/auth/const";
import { AuthService } from "@/services";
import { FastifyInstance } from "fastify";
import { ErrorResponse } from "../rounds/types";
import { SignInRequest, SignInRequestSchema, UserResponse } from "./types";

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

      const result = await authService.signIn({ username, password });

      if (!result.success) {
        return reply
          .code(401)
          .send({ error: result.error || "Authentication failed" });
      }

      // Get the user to create session
      const user = await prisma.user.findFirst({
        where: { username },
      });

      if (!user) {
        return reply.code(500).send({ error: "User not found after creation" });
      }

      const session = await prisma.authSession.create({
        data: {
          userId: user.id,
        },
      });

      // TODO... prod mode
      reply.setCookie(AUTH_COOKIE_NAME, session.data, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
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
