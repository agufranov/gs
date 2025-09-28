import { PrismaClient } from "@gs/shared";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

export default fp(async (server: FastifyInstance) => {
  const prisma = new PrismaClient();

  await prisma.$connect();

  server.decorate("prisma", prisma);

  server.addHook("onClose", async (server) => {
    await server.prisma.$disconnect();
  });
});
