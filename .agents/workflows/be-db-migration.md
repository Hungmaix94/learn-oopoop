---
description: Safe database migration — generate, review, and apply with human approval gates
---

## CRITICAL RULE
**NEVER run `prisma migrate deploy` without explicit user approval. This workflow contains mandatory human checkpoint gates.**

## Steps

1. Show the current `schema.prisma` and ask the user to describe the change needed.
2. Apply the schema change to `schema.prisma`.
3. Run `pnpm prisma migrate dev --create-only --name {change_name}`.
// turbo
4. Run `pnpm prisma migrate diff --from-migrations ./prisma/migrations --to-schema-datamodel ./prisma/schema.prisma` to generate the SQL diff.
5. Display the full SQL diff to the user. **STOP and ask: "Please review the SQL above carefully. Type APPROVE to continue, or describe any changes needed."**
6. ONLY after receiving 'APPROVE': Run `pnpm prisma migrate deploy`.
7. Run `pnpm prisma generate` to update the Prisma client.
// turbo
8. Run `pnpm test` to detect any regression from the schema change.
9. Report: migration name, tables affected, columns added/modified/dropped, and whether a rollback plan is needed.

## Rollback Instructions (if needed)
- For non-destructive changes: revert schema + run `prisma migrate dev` to create a rollback migration.
- For destructive changes (DROP COLUMN): restore from DB snapshot taken before this workflow began.
