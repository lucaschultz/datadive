---
title: Development Environment Setup
slug: thesis/development-environment-setup
author: Luca Schultz
description: Setting up the development environment for the Datadive platform
sidebar:
  order: 9
---

The setup of the development environment contains several steps that need to be followed to ensure that the Datadive platform can be developed and tested locally. This chapter provides a step-by-step guide on how to set up the development environment for the Datadive platform. The guide covers the installation of the required tools, the configuration of the development environment, and the setup of the project repository.

### Jupyter Hub

The Datadive platform uses JupyterHub as a component of the backend. It is used to manage Jupyter Servers for users, which in turn are used to manage and execute notebooks. Subsequently, JupyterHub needs to be installed and configured to run the Datadive platform. Since JupyterHub is run in Kubernetes, the setup of a local Kubernetes cluster is required. To set up a local Jupyter Hub environment, follow the steps in the Zero to JupyterHub guide for a local Kubernetes Cluster in Minikube. [][#ZERO_TO_JUPYTERHUB]

### VSCode

VSCode is the recommended code editor for developing the Datadive platform. It provides a rich set of features for code editing, debugging, and version control. It is possible to use other code editors, but the Datadive repository contains settings and extensions for VSCode that make development easier. To install Visual Studio Code, download the installer from the official website and follow the installation instructions for your operating system. [][#VSCODE]

### Bun

Bun is the runtime environment for the Datadive platform. It is also the package manager used to manage the dependencies of the platform. To install Bun, follow the installation instructions on the official website. [][#BUN]

### Turso Account

The Datadive platform utilizes Turso as a third-party service for distributed databases. To use Turso, create a free account on the Turso website (see [turso.tech](https://turso.tech)). Datadive requires one database for the landlord and one for each tenant. The free account has some limitations: as of this writing, it supports 500 databases with a maximum of 9GB of storage, 1 billion rows read, and 25 million rows written per month. However, these limits are more than sufficient for the development and testing purposes of the Datadive platform.

### Resend Account

Resend is a third-party service used by the Datadive platform to send transactional emails. To use Resend, create an account on the Resend website. A free account allows sending up to 3000 emails per month and 100 emails per day. This limit is sufficient for the development and testing purposes of the Datadive platform. [][#RESEND]

### Repository Setup

The Datadive repository is hosted on GitHub and contains all the code for the platform. To clone the repository, run the following command:

```bash
git clone https://github.com/lucaschultz/datadive.git
```

This command will create a local copy of the repository in a directory named `datadive`. Navigate to this directory to start working on the Datadive platform. The Datadive platform has several dependencies that need to be installed before you can start developing. To install the dependencies, run the following command in the root directory of the repository:

```bash
bun install
```

This command will install all the required packages and tools needed to run the Datadive platform. Once the installation is complete, build all packages by running:

```bash
turbo build
```

This might take a while as it compiles all the TypeScript code into JavaScript. It is necessary because some of the packages depend on the build output of other packages.

#### Environment Files

After the build is complete, set up the `.env` files for development. Datadive needs two env files for development, one for the API and one for the web app. The repository contains example files that you can copy and modify. At the root of the repository, run:

```bash
cp apps/web/.env.development.example apps/web/.env.development.local && cp apps/api/.env.development.example apps/api/.env.development.local
```

You don't need to change anything in the frontend env file. The backend file needs to be modified. Open the `apps/api/.env.development.local` file in your code editor. Replace `<TURSO_API_KEY>` with a valid API key for the Turso Platform API. This API key can be created either in the Turso web interface or using the turso CLI by running:

```bash
turso auth api-tokens mint <api-token-name>
```

Replace `<api-token-name>` with a name for the API token. The command will return an API key that you can use in the `.env.development.local` file. Next, replace `<RESEND_API_KEY>` with a valid API key for the Resend API. This API key can be created in the Resend web interface.

The Datadive repository includes a CLI tool that can be used for common development tasks such as creating a landlord or tenant, running migrations, or generating a new app key. An app key is used to encrypt sensitive data in the database and is required for the development environment. To generate a new app key, run:

```bash
bun run cli make:appkey --env=apps/api/.env.development.local --force
```

This command will generate a new app key and store it in the `apps/api/.env.development.local` file. The `--force` flag is used to overwrite the existing `<APP_KEY>` placeholder or app key. The app key is used to encrypt sensitive data in the database and should be kept secret. If you change the app key, you'll need to reset the landlord and delete all tenants. Therefore, it is recommended to save a backup of the app key in a secure location like a password manager.

The Datadive platform requires a landlord to manage tenants. To create a landlord, run the following command in the root directory of the repository:

```bash
bun run cli make:landlord --replace-env-vars --env=apps/api/.env.development.local dev
```

This command will create a landlord database using the Turso API, run the landlord migrations, and print the connection details to the console. The connection details include the database URL and token, which are required to connect to the landlord database. The command will also replace the `<LANDLORD_DATABASE_URL>` and `<LANDLORD_DATABASE_AUTH_TOKEN>` placeholders in the `apps/api/.env.development.local` file with the connection details.

### Creating a Tenant

To create a tenant using the CLI, run the following command in the root directory of the repository:

```bash
bun run cli make:tenant --env=apps/api/.env.development.local dev
```

This will create a tenant database using the Turso API and run the tenant migrations.

### Running Datadive

To start the Datadive platform, run the following command in the root directory of the repository:

```bash
bun run dev
```

This command will start the Datadive platform in development mode. The platform includes both the API and the web application. The API will be accessible at `http://localhost:3000`, while the web application will be available at `http://localhost:3001`. You can access the web application in your browser and use an API client, such as [curl](https://curl.se) or [Bruno](https://github.com/usebruno/bruno), to begin developing and testing the Datadive platform.

The API's development server hosts a specification that includes all the implemented endpoints on the Datadive platform. You can access this specification at `http://localhost:3000/spec` to explore the available endpoints and their parameters. To create users for either landlord or tenants, use the sign-up endpoints provided by the Datadive API.
