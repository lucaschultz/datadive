---
title: Architecture
---

Software architecture defines the structure of a software system, detailing its organization and the interaction of its components. It serves as a blueprint to ensure the system is scalable, reliable, and maintainable. Effective software architecture is crucial for managing complexity and guiding development to meet requirements. This thesis distinguishes between two architectural layers: code organization and system architecture. Code organization refers to the structure of the codebase, while system architecture addresses the high-level arrangement of components (e.g., the backend, a microservice, or a client app) and their interactions during runtime[^RUNTIME]. [][#SOFTWARE_ARCHITECTURE]

This chapter provides an overview of the Datadive platform's architecture, explaining the decisions and rationale behind it. It describes the high-level architecture independently from the technologies used. The following chapters discuss the selected technologies, the reasons for their choice, and the resulting code organization.

### Project Jupyter Ecosystem

The key requirement that shaped the architecture of the Datadive platform was the ability for users to write code rather than depend solely on the GUI for data analysis. This choice aimed to increase the platform's flexibility, enabling it to meet researchers' specific needs and remain functional even when not all features are accessible through the GUI. Additionally, this decision resulted in an architecture based on Project Jupyter, which provides components for authoring and executing code in a web environment. This section outlines Project Jupyter, focusing on the components relevant for the Datadive platform and their interactions.

Project Jupyter offers a platform for writing code, visualizing data, and sharing results. The code is stored in notebooks, which are organized into cells that can contain code, text, or visualizations. This cell-based interface allows users to write and execute code interactively. Project Jupyter offers several components that can be combined in various ways for use either locally or in a server environment. Project Jupyter is used by institutions like the University of Berkeley, the University of Sheffield or the Michigan State University and companies such as Bloomberg, Google and IBM. In 2017, a Team at UC San Diego analyzed over 1 million notebooks stored in public GitHub repositories [][#JUPYTER2]. In 2019 a team of project Jupyter contributors found nearly 5 million notebooks stored in public repositories in a similar effort, both numbers suggesting that Project Jupyter is a widely used tool for data science tasks. [][#JUPYTER3] [][#JUPYTER1]

<figure id="fig-notebook-format">

```jsonc
{
  "metadata": { ... },
  "cells": [
    {
      "cell_type": "markdown",
      "metadata": { ... },
      "source": ["some *markdown*"]
    },
    {
      "cell_type": "code",
      "execution_count": 1,
      "metadata": { ... },
      "source": ["print('hello, world!')"],
      "outputs": [ ... ]
    }
  ]
}
```

  <figcaption>
    Simplified example of the Jupyter Notebook JSON format. [][#JUPYTER_NOTEBOOK_FORMAT]
  </figcaption>
</figure>

When writing code in Jupyter, users interact with either Jupyter Notebook or JupyterLab. Both are JavaScript applications that run in web browsers. Jupyter Notebook is the original interface, while JupyterLab is the next-generation interface that provides enhanced functionality. JupyterLab allows users to open multiple notebooks or files, such as HTML, text, and Markdown, as tabs in the same window. It also offers a user experience similar to that of an integrated development environment[^IDE] (IDE). Both interfaces enable users to write and execute code in a notebook format. [][#JUPYTER1] [][#JUPYTER_ARCHITECTURE]

As illustrated in figure <a class="ref" href="#fig-notebook-format">3</a>, the code is stored in notebooks, which are JSON files. The top level object of the JSON file contains metadata about the notebook, such as the kernel used to execute the code. The `cells` array contains the individual cells of the notebook, which can be either code cells or markdown cells. Code cells contain the source code to be executed, while markdown cells contain text formatted using Markdown. The notebook format allows users to write code, visualize data, and share results in a single document. [][#JUPYTER_NOTEBOOK_FORMAT]

<figure id="fig-jupyter-code-execution">
  jupyter-architecture-overview.svg
  <figcaption>
    Simplified overview of the components required for Jupyter code execution [][#JUPYTER_ARCHITECTURE].
  </figcaption>
</figure>

Kernels are used to execute code in various programming languages. A kernel communicates through a lightweight messaging protocol called ZeroMQ. It executes the code sent to it and responds with the results. Additionally, it offers code completion and maintains the state of the code execution during sessions. The Jupyter ecosystem provides kernels for several programming languages, including Python, R, and Julia. [][#JUPYTER_ARCHITECTURE] [][#ZEROMQ]

The Jupyter Server acts as the communication hub between these components, as shown in figure <a class="ref" href="#fig-jupyter-code-execution">4</a>. It is responsible for saving and loading notebooks, processing user interactions (e.g., executing code cells), and managing the kernels. User interactions occur through an HTTP[^HTTP] API[^API], which the Jupyter Notebook and JupyterLab interfaces use to communicate with the Jupyter Server. [][#JUPYTER_ARCHITECTURE]

Jupyter Servers do not have a concept of users or access control. Anyone who can access a jupyter server can also access all notebooks and execute arbitrary code. To address this, the Jupyter Servers can be managed by JupyterHub, which is a multi-user server that provides access to Jupyter Servers for groups of users. It manages user authentication, access control and resource allocation like starting and stopping Jupyter Servers for users. [][#JUPYTER_ARCHITECTURE]

### Datadive Architecture

As illustrated in figure <a class="ref" href="#fig-architecture-overview">5</a>, the architecture of the Datadive platform comprises three main components: the frontend, the backend, and the Jupyter components. Jupyter Hub manages the starting and stopping of Jupyter servers for each user within a Kubernetes cluster. Kubernetes is an open-source container orchestration platform that automates the deployment, scaling, and management of containerized applications. The Jupyter servers are based on Docker[^DOCKER] images and run in Docker containers. They handle notebooks, related files, and code execution. Using separate Jupyter servers for each user ensures isolated environments for file storage and code execution. Additionally, since Jupyter Hub supports customizing the Docker images used to run the Jupyter servers, future versions of Datadive may allow users to install additional libraries and packages in their execution environments [][#JUPYTER_IMAGES].

<figure id="fig-architecture-overview">
  datadive-architecture-overview.svg
  <figcaption>
    Overview of the Datadive platform architecture.
  </figcaption>
</figure>

The backend communicates with the Jupyter components through their respective HTTP APIs [][#JUPYTERHUB_API] [][#JUPYTER_SERVER_API] [][#JUPYTER_SERVER_API_SPEC]. It acts as a communication hub between the frontend and the Jupyter components, but also provides additional functionality, such as user management, and create, read, update and delete[^CRUD] (CRUD) operations for projects, notebooks and other resources. It abstracts the complexity of the Jupyter components and provides a simplified interface for the frontend to communicate with. The frontend is a single-page application[^SPA] (SPA) that communicates with the backend using a HTTP API.

This architecture allows for a clear separation of concerns between the frontend, backend, and Jupyter components. The frontend is responsible for rendering the user interface and handling user interactions, while the backend manages the business logic and communicates with the Jupyter. The Jupyter components handle the execution of code and the management of notebooks.

In addition to separating concerns, the decision to divide the application into frontend and backend components and use a HTTP API for communication aimed to enable independent development and maintenance. Both the backend and frontend can be built according to an API specification, which outlines the endpoints and data structures for communication. This specification then serves as a contract between the frontend and backend and is used for generating an API client in the frontend and for inferring endpoint return types in the backend, enforcing the contract between the two components.

This strategy introduces some additional overhead and may slow down development. However, it enables different teams to work on the frontend and backend simultaneously without interfering with each other's tasks. As long as the API specification is followed, changes can be made to either the backend or frontend without affecting the other component. If a feature requires modifications to the API, those changes are reflected in the API specification, allowing both the frontend and backend to be updated independently. To facilitate development, the API specification can be used to mock[^MOCK] the backend API, enabling frontend developers to work without a fully functional backend. Meanwhile, backend developers can utilize API clients like Postman or cURL to make requests to the backend and develop the API independently of the frontend.

### Code Organization

Datadive is a complex software system composed of multiple components, each with specific responsibilities and interactions. To manage this complexity, the codebase is organized into separate modules, each focusing on a particular aspect of the system. This chapter provides an overview of Datadive's code organization, explaining the structure of the codebase and the rationale behind it.

Datadive employs a monorepo structure, where all the code for its frontend, backend, and Jupyter components is contained within a single repository. This approach provides several benefits. Firstly, it simplifies development by allowing developers to work on different parts of the system without the need to switch between multiple repositories, facilitating the implementation of features that span multiple components. It also ensures consistent versioning, as all components are updated together, preventing compatibility issues that might arise from changes to individual components. Furthermore, shared configurations, such as configuration files and build scripts, are centrally stored, which reduces duplication and maintains uniformity across the system. The monorepo setup supports atomic commits, enabling changes affecting multiple components to be committed simultaneously, thereby simplifying the review and merging processes. Additionally, refactoring code that spans multiple components is more straightforward when all the code resides in a single repository. Lastly, code sharing is enhanced, as utilities, configurations, and specifications can be easily accessed and used across different components, promoting efficiency and consistency. [][#GOOGLE_MONOREPO]

<figure id="fig-repo-overview" style="line-height: 1.3;">

```bash
datadive
├── CODE_OF_CONDUCT.md      # Code of conduct
├── CONTRIBUTING.md         # Contribution guidelines
├── LICENSE                 # Project license
├── README.md               # Project README
├── SECURITY.md             # Security guidelines
├── apps/
│   ├── api/                # @datadive/api package
│   ├── docs/               # @datadive/docs package
│   └── web/                # @datadive/web package
├── bun.lockb*              # Bun lockfile
├── cspell.config.yaml      # CSpell configuration
├── eslint.config.js        # Root ESLint configuration
├── package.json            # Root package.json
├── packages/
│   ├── auth/               # @datadive/auth package
│   ├── config/
│   │   ├── eslint/         # @datadive/eslint package
│   │   └── tsconfig/       # @datadive/tsconfig package
│   ├── core/               # @datadive/core package
│   ├── db/                 # @datadive/db package
│   ├── email/              # @datadive/email package
│   ├── jupyter/            # @datadive/jupyter package
│   ├── spec/               # @datadive/spec package
│   ├── turso/              # @datadive/turso package
│   ├── ui/                 # @datadive/ui package
│   └── utils/              # @datadive/utils package
├── patches/                # Patches for dependencies
├── prettier.config.js      # Prettier configuration
├── scripts/                # Scripts for common tasks
├── thesis/                 # Written thesis
├── tsconfig.json           # TypeScript configuration
└── turbo.json              # Turborepo configuration
```

  <figcaption>
  Overview of the Datadive monorepo structure, it's packages and configuration files.
  </figcaption>
</figure>

The Datadive monorepo is managed by Bun workspaces, which allow the codebase to be divided into several packages stored within the monorepo. In this context, packages are reusable pieces of code that can be installed and integrated into a software development project as dependencies. These packages are then combined to build the Datadive components. [][#BUN_WORKSPACES]

As shown in figure <a class="ref" href="#fig-repo-overview">6</a>, the repository's structure includes two main directories at the root of the project: `/apps` and `/packages`. These paths are relative to the root of the repository, containing the version control data for Datadive. The `/apps` directory includes the code for the frontend, backend, and documentation applications. In contrast, the `/packages` directory holds packages used by other packages or applications.

Datadive organizes code into packages to promote reuse and enforce architectural boundaries. Each package encapsulates specific functionality, such as database access, authentication logic, or business logic. This approach allows contributors to focus their development efforts on individual packages without feeling overwhelmed by the entire codebase. A subcategory of packages is dedicated to configuration and is stored in `packages/config`. These packages contain shared configuration files, such as ESLint or TypeScript configurations.

Each package has a consistent structure, as shown in figure <a class="ref" href="#fig-package-structure">7</a>. Typically, all configuration files are located at the root of the package, where the `package.json` file is stored. This file contains machine-readable information about the package, such as its name, version, and the entry point for accessing the code. The following paths are relative to the package root..If the package generates build output, it will be found in the top-level `dist` directory. Scripts for common development tasks are stored in the `scripts` directory. The source code is located in the `src` directory, organized into subdirectories that often separate tenant-specific and landlord-specific code. Packages often include an `src/errors` directory that contains all the errors the package can produce. The `src/index.ts` file exports the package's public API, serving as the entry point for other packages to import its functionality.

<figure id="fig-package-structure" style="line-height: 1.3;">

```plaintext
  package/
  ├── dist/                           ← Build output
  ├── scripts/                        ← Scripts for common tasks
  ├── src/                            ← Source code of the package
  │   ├── landlord/                   ← Landlord-specific code
  │   │   ├── tenant/                 ← Tenant management feature
  │   │   │   ├── create-tenant.ts
  │   │   │   └── shared/             ← Shared code for tenant management
  │   │   └── user/                   ← User management feature
  │   │       ├── list-users.ts
  │   │       └── update-user.ts
  │   ├── shared/                     ← Shared code for landlord features
  │   │   ├── types/                  ← Shared landlord types
  │   │   │   └── user.ts
  │   │   └── utils/                  ← Shared landlord utilities
  │   │       ├── parse-cookie.ts
  │   │       └── parse-date.ts
  │   └── tenant/                     ← Tenant-specific code
  │       ├── notebook/               ← Notebook feature
  │       │   ├── execute/            ← Notebook execution feature
  │       │   └── update-notebook.ts
  │       ├── shared/                 ← Shared code for tenant features
  │       │   └── types/              ← Shared tenant types
  │       │       └── notebook.ts
  │       └── user/                   ← User feature
  │           ├── update-user.ts
  │           ├── delete-user.ts
  │           └── shared/             ← Shared code for user feature
  │               └── utils/          ← Shared user utilities
  ├── package.json
  ┆
```

  <figcaption>
    Example structure of a package in the Datadive codebase.
  </figcaption>
</figure>

Within the `src` or `src/{tenant|landlord}` directory, the code is organized by feature or functionality. All code related to a specific feature is stored in a single file or, if extensive, in a directory called a "feature directory" in this thesis. Feature directories can contain other feature directories and represent a distinct scope of functionality, which narrows as the directory depth increases. For example, the core package may include a feature directory for user-related functionality at `src/tenant/user` and another for notebook-related functionality at `src/tenant/notebook`. Within the latter, the `src/tenant/notebook/execution` directory has a more specific scope, containing code related to notebook execution.

Each feature directory may include a `shared` directory that contains shared code used within the feature or across sub-features. This directory is typically organized by concern, with subdirectories for shared constants, utilities, or types. According to convention, shared code should reside in the lowest shared directory or the narrowest scope possible, meaning it should be as close as possible to the code that uses it. For example, if a utility function is used in more than one file but specific to one aspect of a feature, such as notebook execution, it should be placed in the `src/tenant/notebook/execution/shared` directory. If the utility function is used in multiple aspects of the feature, it should be in the `src/tenant/notebook/shared` directory. If it is utilized across multiple tenant specific features, it should be located in the `src/tenant/shared` directory.

The amount of nesting within feature directories should be kept as low as possible without storing an excessive number of source code files in a single directory. This thesis cannot provide an objective metric for when a feature directory should be divided into multiple subdirectories. While some numbers seem obviously incorrect—such as creating subdirectories for single files or keeping a thousand files in one directory—it is unrealistic to establish a simple set of rules that apply to all cases. Instead, future maintainers of Datadive will need to make this decision on a case-by-case basis as the codebase grows and evolves.

File names are chosen to reflect the content and purpose of the file. Files that export a single function or class are named after the exported entity. In contrast, files that export multiple entities are named either after the primary entity of the functionality they contain. For example, a file exporting a single utility function might be named `get-notebook-path.ts`, while a file exporting multiple utility functions could be named `notebook-utils.ts`. Typically, file names are written in kebab case[^KEBAB_CASE] to support case-sensitive file systems and enhance readability.

This structure follows the principle of Locality of Behavior (LoB), which asserts that the behavior of a unit of code should be clear by examining only that unit. While the principle of locality of behavior often conflicts with the Don't Repeat Yourself (DRY) principle and the Separation of Concerns (SoC) principle, no research indicates that any of these principles is more important for codebase maintainability than the others. However, some prominent computer scientists suggest that locality of behavior may be the most crucial principle for code maintainability. For example, in his book _Patterns of Software_, Richard P. Gabriel emphasizes that the key feature for easy maintenance is locality. The decision to organize much of Datadive's code around the principle of locality of behavior reflects personal preferences, as do many other choices in software development. Nevertheless, locality of behavior is a well-established principle in software development, centered around the idea of making code easy to understand. This is particularly important for a project like Datadive, where contributors may frequently change due to the nature of a project that is developed in collaboration between students and researchers.

### Data Model

The data model is a critical part of Datadive's architecture. It defines how data is organized, stored, and accessed within the system. The model provides an abstract representation of the application's data structures and relationships. This chapter outlines the data model used developed for Datadive and explains how it ties into the desired functionality of the platform.

Since Datadive relies on Jupyter components for code execution and management, the data model is aligned with Jupyter's data structures. This alignment simplifies the integration of Jupyter components and leverages the familiarity of users accustomed to Jupyter's terminology and concepts to enhance usability. At the core of the data model are users, projects, notebooks, and cells.

<figure id="fig-tenant-database-schema">
  tenant-database-schema.svg
  <figcaption>
    The database schema of the tenant database as ER diagram.
  </figcaption>
</figure>

Each Datadive user corresponds to a user in the data model, as shown in figure <a class="ref" href="#fig-tenant-database-schema">8</a>. Users create and own projects, which store metadata such as the project name and connection details to a Jupyter server instance created using JupyterHub. Each project contains notebooks, but Datadive only stores notebook metadata in the database, including the notebook name and associated project. The Jupyter server instance manages the notebook content: cells, the basic units of code, text, or other content.

Jupyter supports several cell types, with code cells and display data cells being most relevant for Datadive. Code cells contain executable code, while display data cells contain the output of code execution, such as text, images, or plots. The key difference from using Jupyter notebooks directly is that Datadive users do not create cells by writing code. Instead, they select from predefined cell templates which contain code snippets for data analysis tasks, such as loading data from a file, cleaning data, or performing statistical analysis. The code can contain placeholders for user input provided through the Datadive user interface. Each placeholder has an associated input with a name and a type, which can be a string, number, path, or a variety of other value types. These inputs generate the user interface for the cell, enabling users to provide the necessary information for the code snippet.

Many of the key interactions in Datadive revolve around cells. Users can create, read, update, and delete cells within a notebook. When a user executes a cell, Datadive requests the Jupyter server execute the notebook. The server processes the code and returns the output, which Datadive displays to the user. In the future, Datadive will support more advanced interactions, such as the creation of custom cell templates, the integration with external services or plugins to provide additional functionality, and storing the execution history of each cell. Another important part of the initially planned features are interactive cell templates. These could be used to guide users through complex data analysis tasks such as test selection or data cleaning.

One intentionally simplified part of the core data model in the initial implementation is dataset storage. Since Jupyter supports file uploads and notebook code can access the file system, Datadive does not store datasets in the database. Instead, users upload datasets through the Datadive HTTP API to the Jupyter Server, where they can be accessed in code cells. This approach simplifies the data model and reduces the complexity of managing large dataset storage in the database or a similar system. However, it also limits the platform's capabilities, as users cannot easily share datasets between projects or access them through the Datadive user interface if the underlying Jupyter server is not running. Future work on Datadive will need to improve dataset management, including the ability to upload, share, and visualize datasets directly in the platform.

Apart from the core data model, Datadive also offers features like user management, authentication, project sharing, and collaboration. These features are implemented using additional data structures and relationships that extend the core model. For example, authentication involves data structures for validating emails, resetting passwords and managing user sessions. Future versions of Datadive may also include more advanced user management features, such as roles and permissions to control access to projects and notebooks.

<figure id="fig-landlord-database-schema">
  landlord-database-schema.svg
  <figcaption>
    The database schema of the landlord database as ER diagram.
  </figcaption>
</figure>

The most complex supportive feature in the initial implementation is multi-tenancy. Multi-tenancy is a software architecture where a single instance of an application serves multiple customers, known as tenants. Tenants are typically organizations with many users who need to manage their users and data, including custom branding, tenant-specific features, plugins, and configurations. In Datadive, multi-tenancy is implemented through a separate landlord application that creates and manages tenants while routing requests to the appropriate tenant database. Each tenant has its own database, ensuring that their data is isolated and inaccessible to other tenants. This architecture features two distinct data models: one for tenant data and another for landlord data. The landlord data model, shown in figure <a class="ref" href="#fig-landlord-database-schema">9</a>, is much simpler. It only needs to store information about tenants, connection details for their databases, landlord users, and authentication details.

<!-- FOOTNOTES -->

[^DOCKER]: Docker is a platform for developing, shipping, and running applications in containers. Containers allow developers to package an application with all of its dependencies, including libraries and other binaries, and ship it as a single package. This approach ensures that the application will run consistently across different environments, regardless of the underlying system configuration. Docker containers are lightweight, portable, and isolated, making them an popular solution for deploying applications in a variety of environments, from local development machines to production servers.

[^RUNTIME]: Runtime refers to the period when a program is executed and its instructions are interpreted and processed by the computer's hardware, utilizing system resources like memory and CPU. In contrast, compile time is the stage when a high-level programming language is translated into a lower-level form, such as machine code or bytecode, that can be directly executed by the computer. This translation process, performed by a compiler, involves tasks like syntax checking, type checking, and code optimization, and occurs before the program is run.

[^SPA]: A single-page application (SPA) is a web application that interacts with the user by dynamically rewriting the current page rather than loading entire new pages from the server. This approach provides a more fluid user experience by avoiding the need to reload the entire page when the user interacts with the application. SPAs are typically built using JavaScript frameworks like React, Angular, or Vue.js.

[^CRUD]: CRUD stands for create, read, update, and delete. It refers to the four basic operations that can be performed on data. These operations are commonly used in database management systems and web applications to manage data.

[^API]: An application programming interface (API) is a set of rules and protocols that allows different software applications to communicate with each other. APIs define the methods and data formats that applications can use to request and exchange data. In the context of web development, APIs are often used to enable communication between the frontend and backend components of a web application.

[^HTTP]: The Hypertext Transfer Protocol (HTTP) is an application protocol for distributed, collaborative, hypermedia information systems. HTTP is the foundation of data communication on the internet, where hypertext documents include hyperlinks to other resources that the user can easily access. In the context of APIs, HTTP is often used to transfer JSON or XML data between clients and servers.

[^MOCK]: Mocking is the process of simulating the behavior of a component or system to test its interactions with other components or systems. In the context of API development, mocking involves creating a simulated version of the API that can be used to test the frontend application without requiring a fully functional backend.

[^IDE]: An IDE (Integrated Development Environment) is a software application that provides comprehensive facilities to computer programmers for software development. An IDE normally consists of at least a source code editor, build automation tools, and a debugger. Some IDEs contain additional features, such as version control, code review, and profiling tools. Typically, an IDE is dedicated to a specific programming language, such as Python, Java, or C++.

[^KEBAB_CASE]: Kebab case is a naming convention where words are written in all lowercase letters and separated by hyphens (`-`) instead of spaces or underscores. Kebab case is commonly used in file names, URLs, and CSS classes to improve readability and consistency. For example, a kebab case file name might be `my-file-name.ts`.
