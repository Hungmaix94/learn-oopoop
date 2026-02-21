---
description: Automated PR review checklist for both FE and BE changes
---

## What This Workflow Does
Performs an automated structural review of all changes in the current branch before merge.
It does NOT modify any files — all steps are read-only checks.

## Steps

// turbo-all
1. Run `git diff main...HEAD --name-only` to list all changed files.
2. For each changed `.tsx` / `.ts` file (FE):
   - Check for `console.log` statements — flag any found.
   - Check if a matching `.test.tsx` file exists — flag missing tests.
   - Check if loading + error states are handled for any `useQuery`/`useMutation` usage.
3. For each changed `.controller.ts` file (BE):
   - Check for missing `@ApiOperation` decorator on each method.
   - Check for missing `@ApiResponse` decorators.
   - Flag any business logic found directly in controllers.
4. For each changed `.service.ts` file (BE):
   - Check for a corresponding `.service.spec.ts` test file.
5. Run `pnpm lint`.
6. Run `pnpm test`.
7. Run `pnpm build`.
8. Generate a structured review report:

```
## PR Review Summary
### Automated Checks
- Lint:  ✅ Pass | ❌ Fail
- Tests: ✅ Pass | ❌ Fail  
- Build: ✅ Pass | ❌ Fail

### Issues Found
- [List of flagged items]

### Recommendation
[ ] Ready to merge | [ ] Needs fixes (see above)
```

9. Ask the user: "Review the report above. Should I fix any of the flagged issues, or are you ready to merge?"
