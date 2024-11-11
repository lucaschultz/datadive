---
title: Apps
slug: apps
author: Luca Schultz
description: An overview of the Datadive applications
---

The Datadive repository contains three separate applications: the frontend, the backend, and the documentation. Each application is stored in a separate package in the `/apps` directory of the repository. This chapter provides an overview of each application, explaining its purpose and structure.

All applications are set up to be built using the `bun run build` command. This command compiles the TypeScript code into JavaScript and outputs it to the `dist` directory. You can then start the server with the `bun run start` command, which runs the compiled code in production mode using the configuration from the `.env.production.local` file. To start the development server with hot reloading[^HOT_RELOADING], use the `bun run dev` command. This command launches the server in development mode using the configuration from the `.env.development.local` file.

### The `@datadive/api` App

The API application is the backend of the Datadive platform. It provides a HTTP API for interacting with the platform that is implemented using Hono.js. The API application is responsible for handling requests from the frontend, executing data analysis tasks, and managing user data. It interacts with the tenant and landlord databases to store and retrieve data, as well as with the Jupyter components to execute data analysis workflows. The API application is designed to be scalable and extensible, allowing new endpoints and functionality to be added easily. All endpoints follow the specification defined in the `@datadive/spec` package.

<figure id="fig-api-package-structure" style="line-height: 1.3;">

```bash
api/
├── README.md
├── package.json
├── src/
│   ├── api-env.ts
│   ├── index.ts
│   ├── landlord/
│   │   ├── middleware/       # Landlord specific middleware
│   │   ├── routes/           # Landlord specific routes
│   │   └── shared/           # Shared landlord code
│   ├── reset.d.ts
│   ├── shared/
│   │   ├── exceptions/       # Shared exceptions
│   │   └── utilities/        # Shared utilities
│   └── tenant/
│       ├── middleware/       # Tenant specific middleware
│       ├── routes/           # Tenant specific routes
│       └── shared/           # Shared tenant code
├── tsconfig.build.json
└── tsconfig.json
```

  <figcaption>
    Structure of the `@datadive/api` application
  </figcaption>
</figure>

As shown in figure <a class="ref" href="#fig-api-package-structure">19</a>, the code is divided between tenant and landlord functionality, with each part containing its own set of routes and middleware. The entrypoint of the server is located in the `src/index.ts` file, which initializes the server and sets up the routes and middleware of both the tenant and landlord parts. It also serves the build output of the React web application, which is the fallback response for all requests that do not match an API endpoint.

The configuration for the development mode of the API application is stored in the `.env.development.local` environment file. This file contains the configuration for the landlord database connection, the port on which the server should run, and other configuration that is specific to the development environment. The environment files are loaded and validated before the server is started, ensuring that the application runs with the correct configuration. The schema for the environment files is defined in the `src/api-env.ts` file, which uses the T3 Env (see [env.t3.gg](https://env.t3.gg)) package and Zod (see [zod.dev](https://zod.dev)) for validation. An example of the environment file is provided in the `.env.example` file.

+++

### The `@datadive/web` App

The web application is the frontend of the Datadive platform. It's implemented using React, Vite and TanStack Router. The web application is an SPA that includes both the landlord and tenant interfaces. The landlord interface is used by administrators to manage users, projects, and notebooks, while the tenant interface is used by users for data analysis tasks. The web application interacts with the Datadive HTTP API to handle user interactions. It uses TanStack Query and an API client generated from the OpenAPI specification to communicate for data fetching.

The datadive web application is very minimal, only a demo application to show the concept of the platform and provide a skeleton for future development. It is not intended to be a full-featured application, but rather a starting point for building a more complex frontend with rich functionality.

The code is divided between tenant and landlord functionality, with each part containing its own set of pages and components. The entrypoint of the application is located in the `src/main.tsx` file. Pages are stored in the `src/routes` directory, according to the conventions of the file based routing system of TanStack Router. Landlord routes are located in the `src/routes/landlord` directory, while tenant routes are located in the `src/routes` directory. Pages are tightly coupled to TanStack router, using it's features like `useRoute` and `useParams` to access the current route and parameters. Components are stored in the `src/components` directory, with shared components located in the `src/components/shared` directory, landlord specific components in the `src/components/landlord` directory, and tenant specific components in the `src/components/tenant` directory. Components are designed to be reusable and composable, following the principles of component-driven development. They should not use any TanStack Router specific features but instead rely on props and context to access data and functionality.

The application can be build using the `bun run build` command, which creates a production build of the web application and outputs it to the `dist` directory. The production build can be started using the `bun run start` command, which serves the compiled code using the configuration from the `.env.production.local` file. The production build is also served by the API application.

### The `@datadive/docs` App

The documentation application is a static site that provides information about the Datadive platform. It is implemented using Astro.js and more specifically Starlight template (see [starlight.astro.build](https://starlight.astro.build)). The documentation application is stored in the `/apps/docs` directory of the repository.

The folder structure of the documentation application is determined by the folder structure of Starlight. The documentation is stored

<!-- Footnotes -->

[^HOT_RELOADING]: Hot reloading is a feature that automatically reloads the application when changes are made to the code. This allows developers to see the changes immediately without having to manually refresh the page. Hot reloading is a common feature in modern frontend development tools and frameworks.
