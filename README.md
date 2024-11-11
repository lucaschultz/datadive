# Datadive

A web application for data analysis that provides a user-friendly interface for creating, editing, and sharing data analysis workflows. Head over to the [Datadive documentation](https://docs.datadive.app) to learn more.

## Overview

Datadive is a platform that enables users to explore, visualize, and analyze data interactively. It provides:

- A cell-based interface where each cell represents a step in the data analysis workflow
- The ability to write code when needed while maintaining a GUI-focused experience
- Isolated environments for users to work in
- Integration with Jupyter for code execution
- Multi-tenancy support
- Type-safe development with TypeScript

## Architecture

The platform consists of three main components:

- Frontend: React-based single page application
- Backend: TypeScript API built with Hono.js
- Jupyter Components: JupyterHub managing isolated Jupyter servers for code execution

## Repository Structure

Datadive uses a monorepo structure managed by Bun workspaces. The codebase is organized into:

### Apps (`/apps`)

- `api` - Backend HTTP API
- `web` - Frontend React application
- `docs` - Documentation site

### Packages (`/packages`)

- `auth` - Authentication and authorization
- `core` - Core business logic
- `db` - Database access and migrations
- `email` - Email sending functionality
- `jupyter` - Jupyter integration
- `spec` - API specification
- `ui` - Shared React components
- `utils` - Shared utilities

Configuration packages in `/packages/config`:

- `eslint` - ESLint configuration
- `tsconfig` - TypeScript configuration

## Development

### Prerequisites

- JupyterHub running on a local Kubernetes cluster
- VSCode (recommended)
- Bun runtime/package manager
- (Free) Turso account for database
- (Free) Resend account for email

### Setup

1. Clone the repository:

```bash
git clone https://github.com/lucaschultz/datadive.git
cd datadive
```

2. Install dependencies:

```bash
bun install
bun run build
```

3. Set up environment files:

```bash
cp apps/web/.env.development.example apps/web/.env.development.local
cp apps/api/.env.development.example apps/api/.env.development.local
```

4. Configure environment variables in `.env.development.local` files with your API keys

5. Generate app key:

```bash
bun run cli make:app-key --env=apps/api/.env.development.local --force
```

6. Create landlord database:

```bash
bun run cli make:landlord --env=apps/api/.env.development.local development
```

7. Seed landlord database:

```bash
bun run cli seed:landlord --env=apps/api/.env.development.local
```

### Running Locally

Start the development server:

```bash
bun run dev
```

The API will be available at http://localhost:3000 and the web app at http://localhost:3001.

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the [LICENSE](LICENSE) file in the repository.

## Acknowledgments

Built as part of a thesis project at the Behavioral Security Research Group at the University of Bonn.
