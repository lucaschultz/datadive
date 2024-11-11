---
title: Third Party Services
---

Datadive uses third party services to avoid implementing complex functionality that is not core to the platform. This chapter provides an overview of the services used by Datadive, explaining their purpose, structure, and interactions.

### Turso

Turso is a distributed database system that builds upon the core functionality of libSQL which is an open source fork of SQLite. It takes the simplicity and ease-of-use of the SQLite database engine and extends it to a distributed architecture. Datadive uses libSQL Databases hosted on Turso to store and manage data for the platform. The main reason is that Turso provides a full featured, scalable database system that can handle large amounts of data and high query loads. It offer features like point-in-time restore, multi-database schemas and fault tolerance which are essential for a platform like Datadive. These features are complicated to implement and maintain, so using Turso allows the Datadive team to focus on building the core functionality of the platform. [][#TURSO]

### Resend

Resend is an email service designed specifically for developers to build, test, and send transactional emails at scale. The platform aims to provide a reliable and scalable email delivery solution, focusing on deliverability and compliance to ensure successful email communication for its customers.

Email delivery is a critical part of the Datadive platform, as it is used to send notifications, alerts, and reports to users. Resend provides a simple API that allows Datadive to send emails programmatically, without having to manage email servers or infrastructure. The platform also offers features like tracking, analytics, and reporting, which help the Datadive team monitor the performance of their email campaigns and improve deliverability. [][#RESEND]