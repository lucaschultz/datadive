---
title: Technologies
---

As already mentioned, maintainability is the most important requirement for the Datadive codebase. The selection of technologies was made in such a way that it presents a low entry barrier for contributing code to Datadive. This approach involves using a limited number of programming languages and technologies. It also prioritizes tools that assist developers in the development process, such as those that enable static analysis of the code to prevent bugs before they are committed and enforce best practices.

Other important factors in technology selection include the adoption rate and popularity within the JavaScript ecosystem. These factors are significant because widely adopted technologies tend to be more stable, offer more learning resources, and are more likely to receive ongoing maintenance. Additionally, choosing technologies commonly used in the industry can provide developers contributing to Datadive with valuable experience that extends beyond the project's scope. To assess the adoption rate and popularity of technologies, this thesis considers the Stack Overflow Developer Survey 2024, the State of JavaScript 2022, and the GitHub Octoverse 2023. [][#STACKOVERFLOW_SURVEY] [][#STATE_OF_JS] [][#OCTOVERSE]

The following sections describe the major technologies used in the Datadive codebase and the reasons for their selection. Please note that not all dependencies used in Datadive are listed here, since some are only relevant for specific parts of the codebase. The technologies described here are those that have a significant impact on the overall architecture and development process of Datadive.

### Typescript

Since Datadive is an application with a very interactive frontend, one of the earliest requirements was that the frontend should be a SPA. Thus, the Datadive client app, which is the part of Datadive that provides the user interface, is executed in the browser. Although modern browsers theoretically allow the execution of WebAssembly[^WASM] (WASM) compiled code, which can be written in a variety of different languages, all modern frameworks for creating SPA's use JavaScript as the primary language. Despite WebAssembly being a promising technology, it is not yet widely adopted in the industry, and the tools and libraries available for it are not as mature as those for JavaScript. Additionally, WebAssembly is not intended to replace JavaScript in the browser but to complement it. [][#WEBASSEMBLY] [][#STACKOVERFLOW_SURVEY]

JavaScript, or more precisely ECMAScript, is a high-level, interpreted programming language. Originally developed in the mid-1990s by Netscape, JavaScript has for many years been the most used language in software development. However, as a dynamically typed language, variable types are determined at runtime rather than at compile time. While this flexibility can allow for quicker development, it can also lead to potential runtime errors since type-related issues may not be detected until the code is executed. [][#STACKOVERFLOW_SURVEY] [][#ECMA]

To enable static code analysis tools and reduce type-related bugs, Datadive uses TypeScript. Introduced by Microsoft in 2012, TypeScript is a statically typed superset of JavaScript that gets transpiled to JavaScript by the TypeScript Compiler (`tsc`). TypeScript automatically infers type information from both the code and type annotations. This type information is utilized by IDE integrations and `tsc` to perform static analysis of the codebase. It can also allow for quicker contributions from developers who are unfamiliar with the codebase. Although developers need to learn TypeScript's type annotation features, this understanding provides insights that can help in comprehending the codebase and ensuring that changes do not unexpectedly introduce bugs. Writing code in TypeScript and transpiling it to JavaScript is supported by all web frameworks considered for the Datadive frontend. In the recent years TypeScript has gained popularity in the industry, as it is used by many large companies and open-source projects. The State of JavaScript 2022 survey reports that 68.4% of respondents have used TypeScript. The GitHub Octoverse 2023 report lists TypeScript as the 3rd most popular language on GitHub, with over 3 million repositories using it. The Stack Overflow Developer Survey 2024 reports that 38.5% of respondents have done extensive development work in TypeScript, making it the 4th most used language in the survey. [][#TS] [][#STACKOVERFLOW_SURVEY] [][#STATE_OF_JS] [][#OCTOVERSE]

The decision to use TypeScript in the frontend strongly supports its adoption for Datadive's backend development as well. Since the introduction of Node.js, the first popular JavaScript server runtime, in 2009, JavaScript has gained significant popularity for backend development. Later, TypeScript also emerged as a favored choice in this area. This growth is supported by a wide range of libraries and frameworks in the server-side JavaScript ecosystem. Using TypeScript for both the frontend and backend facilitates code sharing between the two parts of the application, including data structures and utility functions. Most importantly, this approach allows developers to work on both parts of Datadive without needing to switch between different programming languages. [][#STACKOVERFLOW_SURVEY] [][#STATE_OF_JS]

### Bun

In recent years, several new runtimes[^JS_RUNTIME] where introduced to the server-side JavaScript ecosystem. Some of these are designed for specific contexts, such as serverless environments or microservices, while others serve more general purposes and can be applied to a wide range of applications. One notable general-purpose runtime is Bun, which emphasizes performance and efficiency by integrating a JavaScript engine, a test runner, a script runner, a bundler, and a package manager into a single tool. Bun is designed to optimize execution speed and minimize startup times, supporting both JavaScript and TypeScript applications. It incorporates modern JavaScript features and aims to streamline development workflows by consolidating various tools. [][#NEW_RUNTIMES] [][#BUN]

The choice of using Bun as the runtime for the Datadive backend aims to create a more cohesive environment for developers by reducing the number of tools needed to set up a functional development environment or deploy Datadive.

+++

### Kubernetes

Kubernetes is an open-source container orchestration platform that automates the deployment, scaling, and management of containerized applications. It was originally developed by Google and is now maintained by the Cloud Native Computing Foundation (CNCF). Kubernetes provides a robust infrastructure for deploying and managing containerized applications in production environments, offering features such as load balancing, auto-scaling, and self-healing. Kubernetes is widely used in the industry for deploying microservices, web applications, and other cloud-native workloads. [][#STACKOVERFLOW_SURVEY] [][#KUBERNETES]

Datadive leverages Kubernetes to manage the deployment of Jupyter servers for each user through JupyterHub. Kubernetes provides the necessary infrastructure to manage the lifecycle of Jupyter servers, including starting, stopping, monitoring, and resource allocation. This approach allows Datadive to provide a secure and isolated environment for users to work on data analysis projects.

### Hono.js & Related Libraries

Hono.js is a web framework designed for building web applications and APIs, specifically optimized for serverless and edge computing environments. Built with TypeScript, it emphasizes type safety and adheres to web standards, which helps flatten the learning curve for developers who are new to the framework. Its design incorporates familiar concepts, such as the middleware pattern and route handler definitions from other popular frameworks. This and it's adherence to web standards makes it easier for developers to transition to Hono.js without having to learn an entirely new paradigm. [][#HONO]

One of the key advantages of Hono.js is its flexibility in deployment. It can be used in various environments, including traditional servers, serverless platforms, edge computing services and of course in the context of Bun applications. This versatility means that if the deployment strategy for Datadive changes, the codebase can be adapted without needing to rewrite the entire application. [][#HONO] [][#HONO_GETTING_STARTED]

The other reason Datadive uses Hono.js is its integration with `@asteasolutions/zod-to-openapi`. This library allows writing OpenAPI specifications in TypeScript, which can be used to provide types for Hono.js routes using `@hono/zod-openapi`, validate incoming requests using `@hono/zod-validator`, and generate an API client[^API-CLIENT] for the frontend. This integration ensures that the API specification is always up-to-date with the codebase, reducing the risk of inconsistencies between the API and the implementation. [][#HONO_ZOD_OPENAPI] [][#HONO_VALIDATION]

### libSQL

libSQL is an open-source fork of SQLite that enhances its capabilities with modern features while maintaining full compatibility. It introduces a server component for remote database connections, an `ALTER TABLE` extension for modifying column types and constraints, and several other improvements. This combination allows Datadive to benefit from SQLite's advantages, such as using an individual database per tenant or creating an in-memory database for testing, while also leveraging distributed databases for production. [][#LIBSQL]

Additionally, libSQL supports local replicas, which may enable offline features in Datadive in the future. This would allow users to work on their projects without an internet connection and synchronize their changes once they are back online. [][#TURSO]

### Kysely & Kysely Codegen

Kysely is a SQL query builder for TypeScript that provides a type-safe and composable API for constructing SQL queries. It supports various SQL dialects, including SQLite, PostgreSQL, MySQL and libSQL. Queries are type checked using TypeScript's type system, ensuring that queries are syntactically correct and type-safe at compile time. These type checks are based on types provided by the developer which describe the database structure. This approach helps prevent runtime errors and makes it easier to refactor queries as the codebase evolves. [][#KYSELY]

Kysely fits well in the objective of datadive to use strict type checks and static analysis to prevent bugs before they are committed. It's API is also designed to be similar to SQL syntax, which can make it easier for developers familiar with SQL to write queries in TypeScript.

Kysely Codegen generates the types provided to Kysely from a database schema. It works by connecting to a database and using Database introspection to extract the schema information, which is then used to generate TypeScript types for tables and columns. This process ensures that the types used in Kysely queries are always in sync with the database schema, reducing the risk of type mismatches and inconsistencies between the codebase and the database. [][#KYSELY_CODEGEN]

### React

React (see [react.dev](https://react.dev)) is a JavaScript library for building user interfaces, developed by Meta (formerly Facebook) in 2013. It employs a declarative programming model, allowing developers to describe the desired state of the UI while React updates the DOM to match that state. React is known for its component-based architecture, which enables the creation of reusable UI components. [][#REACT]

React's popularity and extensive ecosystem of libraries and tools make it a suitable choice for building the Datadive frontend. Its component-based architecture aligns well with the modular design of the frontend, allowing developers to create reusable components for different parts of the user interface. Additionally, React's strong community support and active development make it a reliable choice for long-term maintenance and scalability. [][#STACKOVERFLOW_SURVEY] [][#STATE_OF_JS]

### TanStack Router and TanStack Query

TanStack Router and TanStack Query are libraries developed by Tanner Linsley that provide routing and data fetching capabilities for React applications.

TanStack Router is a flexible and extensible routing library that allows developers to define routes and handle navigation in React applications. It supports nested routes, route parameters, and route guards, enabling developers to create complex routing structures with ease. [][#TANSTACK_ROUTER]

TanStack Query is a data fetching library that simplifies fetching, caching, and updating data in React applications. It provides a declarative API for fetching data from APIs and managing the data lifecycle, including caching, pagination, and optimistic updates. TanStack Query integrates seamlessly with TanStack Router, allowing developers to fetch data based on the current route and update the UI in response to data changes. [][#TANSTACK_QUERY]

### Vite & Vitest

Vite is a modern build tool for front-end development that focuses on speed and simplicity. It leverages native ES modules to provide fast build times and instant hot module replacement (HMR) during development. Vite supports various front-end frameworks, including React, Vue, and Svelte. It offers a streamlined development experience with features such as pre-configured development servers, optimized production builds, and built-in support for TypeScript and CSS preprocessors. [][#STATE_OF_JS] [][#VITE]

Vitest is a unit testing framework specifically designed to integrate with Vite. It provides an efficient and high-performance testing experience by utilizing Vite's architecture and optimizations. Vitest leverages Vite's on-demand compilation and native ES module support, allowing tests to run without a separate bundling process. [][#STATE_OF_JS] [][#VITEST]

Given the choice of Vite as frontend build tool, Vitest is the natural choice for testing in the datadive frontend. To keep the amount of technologies used in the Datadive codebase low, Vitest is also used for testing the backend.

### Tailwind CSS

Tailwind CSS is a utility-first CSS framework that provides a set of pre-built utility classes for styling web applications. It allows developers to create custom designs without writing custom CSS by combining utility classes to style elements. Tailwind CSS is designed to be customizable, enabling developers to create unique designs by configuring the framework's utility classes. Since it's highly flexible and efficient, Tailwind CSS has been widely adopted by developers and companies worldwide, including major tech organizations like GitHub, Netflix, and Shopify, making it one of the most popular CSS frameworks in modern web development. [][#TAILWIND] [][#STATE_OF_CSS]

The decision to use Tailwind CSS for the Datadive frontend aims to streamline the styling process and provide a consistent design system across the application. Tailwind CSS's utility classes restrict the number of custom styles available to developers, reducing the risk of inconsistent styling and making it easier to maintain and update the design system. Additionally, writing CSS using utility classes can lighten the cognitive overhead of styling elements by abstracting away the need to write custom CSS selectors and consider about class naming conventions.

### Astro.js

Astro.js is a modern web framework designed to simplify the creation of high-performance, content-focused websites. It employs a novel architecture that combines the best features of server-side rendering (SSR) and static site generation (SSG). Astro.js introduces "partial hydration," allowing developers to selectively hydrate interactive components on the client side while rendering most of the page content on the server. This approach reduces the amount of JavaScript sent to the client, leading to faster page loads and improved performance. [][#ASTRO]

Datadive utilizes Astro.js, specifically the documentation template Starlight, for its documentation. This choice somewhat deviates from the goal of using a minimal number of technologies, as Astro.js is another web framework. However, as a static site generator, Astro.js is a better fit for documentation than React, which is the frontend framework used for the Datadive client app. Most Datadive maintainers will only need to write Markdown files. Astro.js then uses these files as input to generate the documentation, meaning most developers working on Datadive won't need to learn Astro.js to contribute to the documentation. [][#STARLIGHT]

### Zod

Zod is a TypeScript-first schema declaration and validation library that provides a simple and expressive API for defining data schemas. It allows developers to define data structures using TypeScript, infer the types of the validated data to use them for type checking and validate data against those schemas at runtime. [][#ZOD]

Datadive relies heavily on Zod for defining data structures. In the backend, zod schemas are used to validate incoming requests and responses, ensuring that the data conforms to the structure defined in the Datadive API Specification. This validation helps prevent malformed data from entering the system and ensures that the data is consistent and predictable. In the frontend, zod schemas are used to validate user input and responses from the backend. By using Zod, Datadive enforces data integrity and consistency across the application, reducing the risk of runtime errors and data corruption.

### neverthrow

Neverthrow is a TypeScript library that provides a approach to error handling that is inspired by functional programming and error handling in the Rust programming language. It introduces the `Result` type, which represent the result of an operation as either a success value or an error value. By using the `Result` type, developers can handle errors in a composable and type-safe manner. [][#NEVERTHROW]

Datadive uses neverthrow to handle errors in the backend. Returning `Result` types from core methods and repositories, errors are part of a methods type signature, making it easier to reason about which errors can happen and encouraging explicit error handling.

### Radix UI

Radix UI is a collection of low-level, accessible UI components for React. It offers a set of unstyled components that developers can use to create custom designs while ensuring accessibility and usability. [][#RADIX]

Datadive utilizes Radix UI to develop accessible and customizable UI components for the client app. The unstyled nature of Radix UI components enables Datadive contributors to create custom designs. This choice was made because Datadive will feature a complex, highly interactive frontend with custom UI components not available in styled component libraries. The initial effort required to style Radix UI components can be offset by using templates like shadcn/ui, which provide pre-styled components based on Radix UI and other unstyled component libraries. [][#SHADCN]

### ESLint

ESLint is a static code analysis tool for identifying problematic patterns in JavaScript code. It enforces coding standards and best practices, helping developers write clean, consistent, and maintainable code. ESLint is highly configurable, allowing developers to customize the rules and plugins used to analyze the codebase. [][#ESLINT]

Datadive uses ESLint to enforce coding standards and best practices in the codebase. By configuring ESLint with a set of rules that align with Datadive's coding standards, developers can identify and fix potential issues before they are committed. ESLint also integrates with IDEs and text editors, providing real-time feedback on code quality and helping Datadive contributors to adhere to the established coding standards.

### Prettier

Prettier is an opinionated code formatter that automatically formats code to ensure consistency and readability. It enforces a consistent code style by parsing the code and reformatting it according to predefined rules. Prettier supports various programming languages, including JavaScript, TypeScript, CSS, and HTML. [][#PRETTIER]

Datadive uses Prettier to maintain a consistent code style across the codebase. By configuring Prettier with a set of formatting rules, developers can ensure that the code is formatted consistently and adheres to the established coding standards. Prettier integrates with IDEs and text editors, providing automatic code formatting and reducing the time spent on manual formatting tasks.

### Turborepo

Turborepo is a build system specifically designed for managing JavaScript and TypeScript monorepos. It addresses the challenges associated with such repositories by implementing efficient build and caching mechanisms. Turborepo uses a task graph to identify the minimal set of tasks required for a build, thus optimizing the build process and reducing redundant work. This task graph enables intelligent task scheduling, which can significantly decrease build times in large-scale projects. By caching outputs, Turborepo avoids unnecessary recomputation, enhancing build efficiency. This system is particularly advantageous for development teams working within monorepos, as it supports a more efficient workflow and can enhance the overall developer experience. [][#TURBOREPO]

Datadive uses Turborepo to manage the monorepo structure of the codebase. By leveraging Turborepo's build system, Datadive can optimize the build process, reduce build times, and enhance the development workflow. This choice aligns with Datadive's focus on maintainability and efficiency, as Turborepo provides a scalable solution for managing a large codebase.

<!-- Footnotes -->

[^API-CLIENT]: An API client is a software application that interacts with an API to send and receive data. API clients are used to access the functionality provided by an API, such as retrieving data, updating information, or performing specific actions.

[^JS_RUNTIME]: A runtime is an environment that executes code written in a specific programming language. Runtimes provide the necessary infrastructure to run code, including libraries, APIs, and tools for compiling, interpreting, or executing code. In the context of server-side JavaScript, a runtime is a platform that allows developers to run JavaScript code on the server, enabling the development of web applications using JavaScript for both the frontend and backend.

[^WASM]: WebAssembly (WASM) is a binary instruction format for a stack-based virtual machine. It is designed as a portable compilation target for high-level languages like C/C++/Rust, enabling code to run in the browser at near-native speed. WebAssembly is supported by all major browsers and can be executed alongside JavaScript in the same environment. [][#WEBASSEMBLY]
