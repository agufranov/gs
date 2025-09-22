# GS Backend API

A TypeScript backend API built with Fastify, featuring user management endpoints.

## Features

- **Fastify** - Fast and low overhead web framework
- **TypeScript** - Type-safe development
- **Swagger Documentation** - Interactive API documentation
- **CORS Support** - Cross-origin resource sharing
- **Helmet** - Security headers
- **User CRUD Operations** - Complete user management

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
npm start
```

## API Endpoints

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/search?q=query` - Search users

### Health Check

- `GET /health` - Server health status

## API Documentation

Once the server is running, visit:

- **Swagger UI**: http://localhost:3000/docs
- **Health Check**: http://localhost:3000/health

## Development

The server runs on port 3000 by default. You can change this by setting the `PORT` environment variable.

```bash
PORT=8080 npm run dev
```

## Project Structure

```
backend/
├── src/
│   ├── routes/
│   │   └── users.ts          # User routes
│   ├── types/
│   │   └── user.ts           # User type definitions
│   └── server.ts             # Main server file
├── package.json
├── tsconfig.json
└── README.md
```
