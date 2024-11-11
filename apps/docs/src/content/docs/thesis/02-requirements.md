---
title: Requirements
slug: thesis/requirements
author: Luca Schultz
description: The requirements for the Datadive platform
sidebar:
  order: 2
---

This thesis distinguishes between functional and technical requirements, as they serve different purposes in software development and must be managed differently throughout the project lifecycle.

### Functional Requirements

The functional requirements for the Datadive platform were derived from the needs of users. The key requirements, in no particular order, are:

- _Comprehensiveness_: In the future, the platform should encompass the entire workflow of scientific data analysis projects, including data import, tidying, transformation, analysis, and visualization.
- _Flexibility_: The platform should allow users to write code instead of relying solely on the built in functionalities. This ensures the platform is adaptable to the specific needs of researchers and can be used even if not all features are available in the GUI.
- _Extensibility_: The platform should be extensible, allowing users to customize their workflows by adding new functionalities. These extensions should be reusable across users and projects, enabling users to permanently enhance the platform's capabilities.
- _Integration_: The platform should integrate with external tools and services commonly used in scientific research. It should support importing and exporting data in commonly used formats, such as CSV, JSON and common Excel formats.
- _Collaboration_: The platform should support collaboration between users by allowing them to share projects, notebooks, and files.
- _Helpful Feedback_: The platform should provide users with helpful feedback and guidance on how to use its features effectively. For example, an integration with the Qualtrics survey maker could allow users to import Qualtrics survey files and use the included metadata to recommend appropriate statistical tests for analyzing the data.
- _User-Friendly Interface_: The platform should have a user-friendly interface that is easy to navigate and understand.
- _Security & Privacy_: The platform should ensure the security and privacy of user data by implementing appropriate access controls and security mechanisms. It should collect only the necessary data and provide users with control over their data.
- _Accessibility_: The platform should be accessible to users with disabilities.

### Technical Requirements

These requirements are focused on the technical aspects of the platform and guide the development of the Datadive platform. The key technical requirements are:

- _Maintainability_: The platform should be maintainable, allowing developers to easily understand and contribute to the codebase while working independently on different parts of the platform.
- _Isolated Environments_: The platform should provide isolated environments for users to work in, ensuring that each user has their own workspace to store data and execute code. This prevents interference between users, ensures data privacy and security and prevents the execution of malicious code on Datadive's servers.
- _Arbitrary Code Execution_: To provide fallback options for users whose requirements are not not met by the built-in functionality , the platform should support writing and executing arbitrary code.
- _Customizable Execution Environments_: The platform should allow users to customize their execution environments by installing additional libraries and packages which are not part of the default environment.
- _Performance_: The platform should be performant, providing users with a responsive and smooth experience. This includes fast loading times, quick execution of code, and minimal latency in interactions.
- _Reliability_: The platform should be reliable, ensuring that users can access their data and work without interruptions. This includes high availability, fault tolerance, and data durability.
- _Scalability_: The platform should be scalable to support a large number of users and data analysis tasks. This ensures that the platform can handle increasing workloads and user demands without performance degradation.

These requirements guided the architectural decisions made during this thesis, ensuring the platform is well-positioned to meet these requirements as it evolves.
