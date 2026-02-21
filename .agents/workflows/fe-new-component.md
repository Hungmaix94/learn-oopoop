---
description: Scaffold a complete React component end-to-end (FE)
---

## Prerequisites
Before starting, ask: "What is the component name and which domain does it belong to?"

## Steps

1. Read the existing components in `src/components/{domain}/` to understand the naming convention.
// turbo
2. Run `pnpm lint` to verify no pre-existing errors before we start.
3. Create `src/components/{domain}/{Name}.tsx` with full TypeScript props and JSDoc.
4. Create `src/components/{domain}/__tests__/{Name}.test.tsx` with RTL tests covering:
   - Default render test
   - User interaction test (if applicable)
   - Error/empty state test (if applicable)
5. Add the component export to `src/components/{domain}/index.ts`.
// turbo
6. Run `pnpm test` and assert all tests pass.
// turbo
7. Run `pnpm build` to confirm no TypeScript errors.
8. Report back with: component file path, test file path, and a summary of what was implemented.
