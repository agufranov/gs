# The Last of Guss Project

A full-stack application with shared types and Prisma schema managed by Nx.

## Project Structure

```
gs/
├── packages/
│   └── shared/                 # Shared package with types and Prisma schema
│       ├── prisma/            # Prisma schema and migrations
│       └── src/               # Shared types and constants
├── backend/                   # Backend API (Fastify + TypeScript)
├── frontend/                  # Frontend app (React + Vite)
└── package.json              # Root package with dev scripts
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- PostgreSQL database

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
# Copy the example environment file
cp packages/shared/example.env packages/shared/.env

# Edit backend/.env with your database URL
DATABASE_URL="postgresql://username:password@localhost:5432/gs_db"
```

3. Set up the database:

```bash
# Generate Prisma client and run migrations
cd packages/shared
npm run db:migrate
```

### Development

Run both frontend and backend in development mode:

```bash
npm run dev
```

This will start:

- Frontend on http://localhost:5173
- Backend on http://localhost:3000

### Individual Commands

- Frontend only: `npm run dev:frontend`
- Backend only: `npm run dev:backend`
- Build all: `npm run build`
- Test all: `npm run test`
- Lint all: `npm run lint`

### Database Commands

All database commands are run from the shared package:

```bash
cd packages/shared

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Open Prisma Studio
npm run db:studio

# Push schema changes (for development)
npm run db:push
```

## Architecture

### Shared Package (`@gs/shared`)

Contains:

- **Types**: All shared TypeScript types and interfaces
- **Constants**: Shared constants and configuration
- **Prisma Schema**: Database schema and migrations
- **Prisma Client**: Generated database client

### Backend

- **Framework**: Fastify with TypeScript
- **Database**: Prisma ORM with PostgreSQL
- **Architecture**: Service layer pattern with controllers
- **Authentication**: Session-based auth with cookies

### Frontend

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **UI**: Chakra UI with Tailwind CSS
- **State Management**: TanStack Query
- **Routing**: TanStack Router

## Nx Workspace

This project uses Nx for:

- Monorepo management
- Build orchestration
- Task running
- Code generation

### Available Nx Commands

```bash
# Run tasks for all projects
nx run-many --target=build --all
nx run-many --target=test --all
nx run-many --target=lint --all

# Run tasks for specific projects
nx build shared
nx build backend
nx build frontend
```

## Development Workflow

1. **Database Changes**: Update schema in `packages/shared/prisma/schema.prisma`
2. **Run Migration**: `cd packages/shared && npm run db:migrate`
3. **Update Types**: Types are automatically shared between frontend and backend
4. **Test Changes**: Use `npm run dev` to test both applications

## Deployment

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm run build
# Serve the dist/ directory with your preferred static file server
```
