import { SPECIAL_ROLES } from "@/const/specialRoles";
import { formatUsernameHook } from "@/hooks/formatUsername";
import { AUTH_COOKIE_NAME } from "@/modules/auth/const";
import bcrypt from "bcrypt";
import { FastifyInstance } from "fastify";
import { SignInRequest } from "./types";

export default function authRoutes(server: FastifyInstance) {
  // TODOODOT (wip) create schema with something like zod, and export to frontend somehow
  server.post<{ Body: SignInRequest; Reply: { debugSessionId: string } }>(
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
          // return reply.code(404).send({ error: "Wrong password" }); // TODO wrong
          // TODO register
          user = await prisma.user.create({
            data: {
              username,
              passwordHash: await bcrypt.hash(password, 5),
              role: SPECIAL_ROLES[username],
            },
          });
        }

        if (!(await bcrypt.compare(password, user.passwordHash))) {
          return reply.code(401).send({ error: "Wrong password" });
        }

        const session = await prisma.authSession.create({
          data: {
            userId: user.id,
          },
        });

        // TODO... prod mode
        reply.setCookie(AUTH_COOKIE_NAME, session.data, {
          httpOnly: false,
          secure: false,
          sameSite: "lax",
        });

        return reply.code(200).send({ debugSessionId: session.data });
      } catch (err) {
        console.error(err);
      }
    }
  );

  server.post("/signOut", async (request, reply) => {
    // reply.clearCookie doesn't work!
    reply.setCookie(AUTH_COOKIE_NAME, "").send({});
  });

  server.get("/profile", async (request, reply) => {
    return { user: request.user };
  });
}
