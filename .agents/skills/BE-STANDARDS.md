---
description: BE standards for NestJS modules, Prisma, DTOs, and API documentation
---

# Backend Team Standards (NestJS + Prisma + PostgreSQL)

## Stack
- **Framework**: NestJS (latest)
- **ORM**: Prisma
- **DB**: PostgreSQL (via Supabase or Docker)
- **Auth**: JWT with Guards
- **Docs**: Swagger (OpenAPI) via `@nestjs/swagger`
- **Testing**: Jest + Supertest (e2e)

## Module Rules

When creating or modifying a NestJS module you MUST:
1. Use the NestJS CLI structure: `{entity}.module.ts`, `{entity}.controller.ts`, `{entity}.service.ts`.
2. Place all files under `src/{entity}/`.
3. Register the module in `app.module.ts`.
4. **Never** put business logic in a Controller — Controllers only call Services.

## DTO Rules

1. Create `dto/create-{entity}.dto.ts` and `dto/update-{entity}.dto.ts`.
2. Use `PartialType(Create{Entity}Dto)` for Update DTOs.
3. Every field MUST have a `class-validator` decorator (`@IsString()`, `@IsNumber()`, etc.).
4. Every field MUST have a `@ApiProperty()` decorator with a meaningful `description` and `example`.

## Database / Prisma Rules

1. **NEVER** run `prisma migrate deploy` autonomously — always pause for human approval.
2. Always run `prisma migrate dev --create-only` first, and show the SQL diff to the user.
3. Add `@@index` to foreign keys and columns used in WHERE clauses.
4. Use soft deletes (`deletedAt DateTime?`) for any entity that might need recovery.

## Swagger Rules

Every Controller method MUST have:
- `@ApiTags('{entity}')` on the controller class
- `@ApiOperation({ summary: '...' })` on each method
- `@ApiResponse({ status: 200/201, description: '...' })` on each method
- `@ApiResponse({ status: 400/401/404, description: '...' })` on error cases

## PR Checklist (before requesting review)
- [ ] `pnpm lint` passes
- [ ] `pnpm test` passes (unit tests for Services)
- [ ] `pnpm build` compiles without TypeScript errors
- [ ] Swagger UI shows the new endpoint with correct types
- [ ] Migration SQL diff reviewed and approved by Tech Lead
