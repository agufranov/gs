import helmet from "@fastify/helmet";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import Fastify from "fastify";
import { authHook } from "./hooks/auth";
import authRoutes from "./modules/auth/routes";
import cookiePlugin from "./plugins/cookie";
import prismaPlugin from "./plugins/prisma";
import sensiblePlugin from "./plugins/sensible";

const fastify = Fastify({
  logger: {
    level: "info",
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
});

// Register plugins
fastify.register(helmet, {
  contentSecurityPolicy: false,
});

fastify.register(sensiblePlugin);
fastify.register(prismaPlugin);
fastify.register(cookiePlugin);

fastify.addHook(authHook.stage, authHook.handler);

fastify.register(swagger, {
  swagger: {
    info: {
      title: "GS Backend API",
      description: "Backend API for GS project",
      version: "1.0.0",
    },
    host: "localhost:3000",
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
  },
});

fastify.register(swaggerUi, {
  routePrefix: "/docs",
  uiConfig: {
    docExpansion: "list",
    deepLinking: false,
  },
  uiHooks: {
    onRequest: function (request: any, reply: any, next: any) {
      next();
    },
    preHandler: function (request: any, reply: any, next: any) {
      next();
    },
  },
  staticCSP: true,
  transformStaticCSP: (header: any) => header,
});

// Register routes
fastify.register(authRoutes, { prefix: "/auth" });

// Health check endpoint
fastify.get("/health", async (request, reply) => {
  return { status: "ok", timestamp: new Date().toISOString() };
});

// Start server
const start = async () => {
  try {
    const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
    const host = process.env.HOST || "0.0.0.0";

    await fastify.listen({ port, host });
    console.log(`🚀 Server is running on http://${host}:${port}`);
    console.log(
      `📚 API Documentation available at http://${host}:${port}/docs`
    );
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
