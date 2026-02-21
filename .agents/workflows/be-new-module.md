---
description: Scaffold a complete NestJS CRUD module with DTOs, Swagger, and unit tests (BE)
---

## Prerequisites
Before starting, ask: "What is the entity name and what fields does it need?"

## Steps

1. Read `schema.prisma` to understand the existing schema conventions.
2. Add the new Prisma model to `schema.prisma`. Show the diff to the user and ask: "Does this schema look correct? Confirm to proceed with migration."
3. Run `pnpm prisma migrate dev --create-only --name add_{entity}`.
// turbo
4. Run `pnpm prisma generate` to update the Prisma client.
5. Scaffold the module structure under `src/{entity}/`:
   - `{entity}.module.ts`
   - `{entity}.controller.ts`
   - `{entity}.service.ts`
   - `dto/create-{entity}.dto.ts`
   - `dto/update-{entity}.dto.ts`
6. Register the module in `app.module.ts`.
7. Add full Swagger decorators to every controller method.
8. Write unit tests for `{Entity}Service` in `src/{entity}/{entity}.service.spec.ts`.
   - Mock `PrismaService` using Jest mocks.
   - Test: findAll, findOne (success), findOne (not found), create, update, remove.
// turbo
9. Run `pnpm test` and assert all tests pass.
// turbo
10. Run `pnpm build` to confirm no TypeScript errors.
11. Report: list of created files, migration name, and any edge cases to review.
