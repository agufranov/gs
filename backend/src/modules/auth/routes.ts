import { SPECIAL_ROLES } from "@/const/specialRoles";
import { formatUsernameHook } from "@/hooks/formatUsername";
import { AUTH_COOKIE_NAME } from "@/modules/auth/const";
import bcrypt from "bcrypt";
import { FastifyInstance } from "fastify";
import { ErrorResponse } from "../rounds/types";
import { SignInRequest, UserResponse } from "./types";

export default function authRoutes(server: FastifyInstance) {
  server.post<{
    Body: SignInRequest;
    Reply: { debugSessionId: string } | ErrorResponse;
  }>(
    "/signIn",
    {
      [formatUsernameHook.stage]: formatUsernameHook.handler,
    },
    async (request, reply) => {
      // console.log('schema', request.server.getSchema('/auth/signIn'))
      const { prisma } = server;
      const { username, password } = request.body;

      try {
        // TODO inject abstract db
        let user = await prisma.user.findFirst({
          where: {
            username,
          },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              username,
              passwordHash: await bcrypt.hash(password, 5),
              role: SPECIAL_ROLES[username],
            },
          });
        }

        if (!(await bcrypt.compare(password, user.passwordHash))) {
          // TODO fix type error
          return reply.code(401).send({ error: "Wrong password" });
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

        return reply.code(200).send({ debugSessionId: session.data });
      } catch (err) {
        console.error(err);
      }
    }
  );

  server.post("/signOut", async (request, reply) => {
    const { prisma } = server;

    reply.clearCookie(AUTH_COOKIE_NAME);

    await prisma.authSession.delete({
      where: { data: request.cookies[AUTH_COOKIE_NAME] },
    });
  });

  server.get<{ Reply: UserResponse | undefined }>(
    "/profile",
    async (request, reply) => {
      return request.user;
    }
  );
}
