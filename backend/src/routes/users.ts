import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
  CreateUserRequest,
  UpdateUserRequest,
  User,
  UserResponse,
} from "../types/user";

// In-memory storage for demo purposes
// In a real application, this would be a database
let users: User[] = [
  {
    id: "1",
    username: "johndoe",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    username: "janesmith",
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02"),
  },
];

// Helper function to convert User to UserResponse
const userToResponse = (user: User): UserResponse => ({
  id: user.id,
  username: user.username,
  createdAt: user.createdAt.toISOString(),
  updatedAt: user.updatedAt.toISOString(),
});

// Helper function to generate unique ID
const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export default async function userRoutes(fastify: FastifyInstance) {
  // GET /api/users - Get all users
  fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    const userResponses = users.map(userToResponse);
    return {
      success: true,
      data: userResponses,
      count: userResponses.length,
    };
  });

  // GET /api/users/:id - Get user by ID
  fastify.get(
    "/:id",
    async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;
      const user = users.find((u) => u.id === id);

      if (!user) {
        reply.code(404);
        return {
          success: false,
          error: "User not found",
        };
      }

      return {
        success: true,
        data: userToResponse(user),
      };
    }
  );

  // POST /api/users - Create new user
  fastify.post(
    "/",
    {
      schema: {
        body: {
          type: "object",
          required: ["username", "password"],
          properties: {
            username: { type: "string", minLength: 1 },
            password: { type: "string", minLength: 6 },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{ Body: CreateUserRequest }>,
      reply: FastifyReply
    ) => {
      const { username, password } = request.body;

      // Check if username already exists
      const existingUser = users.find((u) => u.username === username);
      if (existingUser) {
        reply.code(400);
        return {
          success: false,
          error: "Username already exists",
        };
      }

      const newUser: User = {
        id: generateId(),
        username,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      users.push(newUser);

      reply.code(201);
      return {
        success: true,
        data: userToResponse(newUser),
      };
    }
  );

  // PUT /api/users/:id - Update user
  fastify.put(
    "/:id",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            username: { type: "string", minLength: 1 },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{
        Params: { id: string };
        Body: UpdateUserRequest;
      }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;
      const updateData = request.body;

      const userIndex = users.findIndex((u) => u.id === id);
      if (userIndex === -1) {
        reply.code(404);
        return {
          success: false,
          error: "User not found",
        };
      }

      // Check if username already exists (excluding current user)
      if (updateData.username) {
        const existingUser = users.find(
          (u) => u.username === updateData.username && u.id !== id
        );
        if (existingUser) {
          reply.code(400);
          return {
            success: false,
            error: "Username already exists",
          };
        }
      }

      const updatedUser: User = {
        ...users[userIndex],
        ...updateData,
        updatedAt: new Date(),
      };

      users[userIndex] = updatedUser;

      return {
        success: true,
        data: userToResponse(updatedUser),
      };
    }
  );

  // DELETE /api/users/:id - Delete user
  fastify.delete(
    "/:id",
    async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;
      const userIndex = users.findIndex((u) => u.id === id);

      if (userIndex === -1) {
        reply.code(404);
        return {
          success: false,
          error: "User not found",
        };
      }

      const deletedUser = users.splice(userIndex, 1)[0];

      return {
        success: true,
        data: userToResponse(deletedUser),
        message: "User deleted successfully",
      };
    }
  );

  // GET /api/users/search?q=query - Search users
  fastify.get(
    "/search",
    async (
      request: FastifyRequest<{ Querystring: { q: string } }>,
      reply: FastifyReply
    ) => {
      const { q } = request.query;

      if (!q || q.trim().length === 0) {
        reply.code(400);
        return {
          success: false,
          error: "Search query is required",
        };
      }

      const searchTerm = q.toLowerCase();
      const filteredUsers = users.filter((user) =>
        user.username.toLowerCase().includes(searchTerm)
      );

      const userResponses = filteredUsers.map(userToResponse);

      return {
        success: true,
        data: userResponses,
        count: userResponses.length,
        query: q,
      };
    }
  );
}
