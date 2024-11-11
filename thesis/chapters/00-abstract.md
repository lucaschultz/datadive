---
title: Abstract
slug: abstract
author: Luca Schultz
---

This thesis presents the design and implementation of Datadive, a web-based platform for data analysis. The platform aims to bridge the gap between GUI-based and code-based analysis tools by providing an intuitive interface while retaining the flexibility of programmatic approaches. At its core, Datadive features a cell-based interface, where each cell represents a step in the data analysis workflow. This design combines the accessibility of graphical interfaces with the power of code-based tools.

The thesis also outlines the platform's architecture, which utilizes the Project Jupyter ecosystem for code execution and management, along with a modern web stack for the backend and user interface. The system employs a multi-tenant architecture with Kubernetes for scalability and isolation, incorporating separate databases for tenant and landlord functionalities. Architectural decisions prioritize maintainability and extensibility by using TypeScript throughout the stack and implementing robust error handling and dependency injection patterns.

While the current implementation serves as a technical foundation rather than a complete platform, it lays the groundwork for future development. The thesis concludes by outlining the next steps needed to transform this foundation into a fully functional data analysis platform. These steps include enhancing data management capabilities, adding user collaboration features, and developing tools for statistical analysis assistance.
