---
title: Datadive Packages
---

This chapter provides an overview of the packages of the Datadive platform, explaining their purpose and structure.

Except for some configuration packages, all packages have a main entrypoint that exports the main functionality of the package. Additionally, some packages have another entrypoint that exports the error classes contained in the package. This is done to prevent type errors when exporting functions that may return the error classes from other packages.

### The `@datadive/db` Package

The `@datadive/db` package contains database-specific code, including migrations, seeds, and functions to initialize the database connection. It is separated into tenant and landlord database code. Additionally, it includes a CLI for common development tasks, such as running migrations or seeding the database.

- `execute` - Function that executes a query on the database and returns a result either containing the data or an error.
- `executePaginated` - Function that executes a query on the database and returns a result containing the paginated data or an error.
- `executeTakeFirst` - Function that executes a query on the database and returns a result containing the first row of the data or an error if the query failed or no data was found.
- `createDatabaseClient` - Function that creates a new database client instance. The database client is used to communicate with a database.
- `createLandlordKysely` - Factory function that creates a new Kysely instance using a database client. Use the kysely instance to build queries which may be executed using the execution functions.
- `LandlordTable` - Enum like object that contains the names of all tables that are available in the landlord database. Use this object to reference tables in queries.
- `createTenantKysely` - Factory function that creates a new Kysely instance using a database client. Use the kysely instance to build queries which may be executed using the execution functions.
- `TenantTable` - Enum like object that contains the names of all tables that are available in the tenant database. Use this object to reference tables in queries.
- `DbError` - Module that contains all error classes that may be returned when using the database.
- `LandlordDatabaseSchema` - Type that represents the schema of the landlord database.
- `TenantDatabaseSchema` - Type that represents the schema of the tenant database.
- `Selectable` - Utility type to get the type of a data that can be selected from a table in either the landlord or tenant database. This can be used to get the the type of e.g. the result of a select query on the landlord user table by using `Selectable<LandlordTable, typeof LandlordTable.User>`.
- `Insertable` - Utility type to get the type of a data that can be inserted into a table in either the landlord or tenant database. This can be used to get the the type of e.g. the data that can be inserted into the landlord user table by using `Insertable<LandlordTable, typeof LandlordTable.User>`. The insertable type may not be the same as the selectable type, as some columns may be automatically generated by the database.
- `Updatable` - Utility type to get the type of a data that can be updated in a table in either the landlord or tenant database. This can be used to get the the type of e.g. the data that can be updated in the landlord user table by using `Updatable<LandlordTable, typeof LandlordTable.User>`. The updatable type may not be the same as the selectable or insertable type, as some columns may be automatically generated by the database.
- `migrate` - Function that runs database migrations.
- `getMigrationInfo` - Function that returns information about the current state of the database migrations, e.g. wether a migration has been run or not.
- `createDatabase` - Function that creates a new database. This function is used to create the tenant databases when a new tenant is created.

### The `@datadive/email` Package

The `@datadive/email` package contains code for sending emails. It does not contain any templates, as these are stored in the `@datadive/core` package co-located with the code that uses them. This package is basically a thin abstraction around Resend which is the service used to send emails. It's main entrypoint has the following exports:

- `EmailError` - Module that contains all error classes that may be returned when using the email functions.
- `createEmail` - Factory function that creates a new email object which contains all functions necessary to send emails.

### The `@datadive/utils` Package

The `@datadive/utils` package includes utilities used throughout the Datadive platform. These functions are not tied to any specific part of the platform and can be utilized across multiple packages. The package offers three entry points: `@datadive/utils/browser` for browser-specific utilities, `@datadive/utils/common` for utilities applicable in both browser and server environments, and `@datadive/utils/type` for utility types. Since the package includes numerous exports, primarily simple functions or types with attached JSDoc comments, they will not be listed here.

### The `@datadive/auth` Package

The `@datadive/auth` package contains code for authenticating users and managing user sessions. It provides functions handling user authentication and authorization. The package is divided into two main parts, one part for tenant authorization and one part for landlord authorization. The session handling is implemented according to the instructions of Lucia Auth. It's main entrypoint has the following exports:

- `createLandlordAuth` - Factory function that creates a new auth object which contains all functions necessary to authenticate users.
- `createTenantAuth` - Factory function that creates a new auth object which contains all functions necessary to authenticate users.
- `AuthError` - Module that contains all error classes that may be returned when using the auth functions.

### The `@datadive/spec` Package

The `@datadive/spec` package contains the specifications for the Datadive HTTP API. It uses the `@asteasolutions/zod-to-openapi` to define the routes and models of the API in Typescript. The spec is used to provide validation and type safety to the backend, to generate an API client for the frontend, and to generate the OpenAPI documentation. The package exports:

- `LandlordEndpoints` - Object that contains the specification of all landlord endpoints of the API.
- `TenantEndpoints` - Object that contains the specification of all tenant endpoints of the API.
- `ApiError` - Object that contains the specifications of all errors that may be returned by the API.
- `ApiErrorName` - Enum-like object that contains the names of all errors that may be returned by the API.
- `ApiErrorCode` - Enum-like object that contains the codes of all errors that may be returned by the API.

### The `@datadive/core` Package

The `@datadive/core` package contains the core functionality of the Datadive platform. It includes the main application logic, such as handling user interactions, managing data, and orchestrating the communication between the backend and the Jupyter components. The package is divided into tenant and landlord code. It's main entrypoint has the following exports:

- `createLandlordCore` - Factory function that creates a new core object which contains all functions that implement the core functionality of the landlord part of the platform.
- `createTenantCore` - Factory function that creates a new core object which contains all functions that implement the core functionality of the tenant part of the platform.
- `CoreError` - Module that contains all error classes that may be returned when using the core functions.

### The `@datadive/jupyter` Package

The `@datadive/jupyter` package includes code for communicating with the Jupyter components of the Datadive platform. It is divided into functions for interacting with the JupyterHub API and the Jupyter Server API. The package utilizes the OpenAPI specification of the Jupyter APIs to generate a client, which is then wrapped to offer a more streamlined API and semantic error classes. It's main entrypoint has the following exports:

- `createJupyterHubClient` - Factory function that creates a new JupyterHub communication client object which contains all functions necessary to interact with the JupyterHub component.
- `createJupyterServerClient` - Factory function that creates a new Jupyter Server communication client object which contains all functions necessary to interact with the Jupyter Server component.
- `JupyterError` - Module that contains all error classes that may be returned when using the functions of either client.

+++

### The Configuration Packages

The Datadive repository includes several configuration packages that are used to distribute shared configuration files across the repository. The configuration packages include `@datadive/eslint` which contains the ESLint configuration, `@datadive/storybook` which contains the Storybook configuration, and `@datadive/tsconfig` which contains the TypeScript configuration for the Datadive repository. These packages are used to ensure consistent linting, formatting, and build configurations across the Datadive codebase.