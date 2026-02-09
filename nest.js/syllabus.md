# NestJS Zero to Hero Syllabus

This comprehensive course takes you from the core concepts of NestJS to advanced application architecture, focusing on building scalable backend systems.

## 🚀 Module 1: The Foundations of NestJS
**File:** `1.core.md`
*   **Introduction:** Why choose NestJS over Express.
*   **Core Concepts:**
    *   Modules (Structural organization).
    *   Controllers (Request handling).
    *   Services (Business logic).
    *   Dependency Injection (DI).
*   **Data Handling:** Using DTOs and Validation with `class-validator`.

## 🔄 Module 2: Logic Flow & Middleware
**File:** `2.logic_flow.md`
*   **Middleware:** Intercepting requests.
*   **Guards:** Authentication and Authorization.
*   **Pipes:** Data validation and transformation.
*   **Interceptors:** Response modification and logging.
*   **Execution Order:** The lifecycle of a NestJS request.

## 💾 Module 3: Database & Security
**File:** `3.database.md`
*   **ORM Integration:**
    *   SQL (TypeORM) entities and repositories.
    *   NoSQL (Mongoose) schemas and models.
*   **Configuration:** Managing environment variables with `@nestjs/config`.
*   **Security:** Authentication using Passport (Local & JWT Strategies).

## ✅ Module 4: Quality Assurance (Testing)
**File:** `4.testing.md`
*   **Philosophy:** Why testing is crucial in NestJS.
*   **Unit Testing:** Isolating services and mocking dependencies with Jest.
*   **E2E Testing:** Simulating full HTTP requests with `supertest`.
*   **Test Runners:** `test:watch`, `test:cov`.

## 🌐 Module 5: Advanced Architecture
**File:** `5.advanced.md`
*   **Microservices:**
    *   Architecture patterns (TCP, Redis, RabbitMQ).
    *   Inter-service communication.
*   **Real-time Applications:** WebSockets and Gateways.
*   **Hybrid Applications:** Combining REST and Microservices.
