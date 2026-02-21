---
description: FE standards for React/Next.js components, hooks, and API integration
---

# Frontend Team Standards (React + Next.js App Router)

## Stack
- **Framework**: Next.js 14+ (App Router)
- **Styling**: TailwindCSS + ShadCN UI
- **State**: Zustand (global), React Query (server state)
- **Forms**: React Hook Form + Zod
- **Testing**: Vitest + React Testing Library + MSW

## Component Rules

When creating or modifying a React component you MUST:
1. Place it under `src/components/{domain}/ComponentName.tsx`.
2. Use TypeScript — **no `any` types allowed**. Infer types from Zod schemas where possible.
3. Props interface must be named `{ComponentName}Props` and exported.
4. Create a test file at `src/components/{domain}/__tests__/ComponentName.test.tsx`.
5. Write at minimum: one render test, one user interaction test, one error state test.
6. Export the component from `src/components/{domain}/index.ts`.

## API Hook Rules

When creating a React Query hook:
1. Place it in `src/hooks/use{Entity}.ts`.
2. Always define a `queryKey` factory: `export const {entity}Keys = { all: [...], detail: (id) => [...] }`.
3. Always set `staleTime` appropriately (5 min for slow-changing data).
4. Always handle `isPending`, `isError`, `data` — never assume data exists.
5. Mock with MSW in tests — never mock `fetch` directly.

## PR Checklist (before requesting review)
- [ ] `pnpm lint` passes with zero errors
- [ ] `pnpm test` passes with ≥ 80% coverage on new code
- [ ] `pnpm build` compiles without TypeScript errors
- [ ] No `console.log` left in committed code
- [ ] All new API calls have loading + error states
