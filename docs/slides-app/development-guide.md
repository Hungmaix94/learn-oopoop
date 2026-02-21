# Development Guide

## Overview

This guide provides detailed instructions for developing and extending the Slides App. It covers everything from setting up your development environment to deploying new features.

## Prerequisites

Before starting development, ensure you have:

- Node.js 18.20.2+ or Node.js 20.9.0+
- pnpm 9.x or 10.x
- PostgreSQL database (local or remote)
- Git version control

## Setting Up Development Environment

### 1. Clone the Repository

```bash
git clone <repository-url>
cd slides-app
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Then update the `.env` file with your specific configuration:

```bash
# Database configuration
DATABASE_URL="postgresql://username:password@localhost:5432/slides_app_dev"

# Payload secret (use a strong random value in production)
PAYLOAD_SECRET="dev-secret-key-for-development"

# Node environment
NODE_ENV="development"
```

### 4. Initialize the Database

Run the Payload migrations to set up your database:

```bash
pnpm payload migrate
```

### 5. Generate TypeScript Types

Generate TypeScript types from your Payload collections:

```bash
pnpm run generate:types
```

### 6. Start the Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

## Development Workflow

### Making Changes to Collections

When you modify collection configurations:

1. Update the collection file in `src/collections/`
2. Regenerate TypeScript types: `pnpm run generate:types`
3. Restart the development server if necessary
4. Run migrations if you've added new fields: `pnpm payload migrate`

### Adding New Collections

1. Create a new collection file in `src/collections/`
2. Import and add it to the collections array in `src/payload.config.ts`
3. Run `pnpm run generate:types` to update TypeScript definitions
4. Create corresponding components in `src/components/`
5. Add routes if needed in `src/app/`

### Working with Frontend Components

1. Create new components in the appropriate directory under `src/components/`
2. Use the existing UI component patterns for consistency
3. Follow the Tailwind CSS classes used throughout the application
4. Ensure components are properly typed with TypeScript
5. Add responsive design considerations

### Adding New Pages

1. Create new routes in the `src/app/` directory following Next.js App Router conventions
2. Use server components for data fetching when possible
3. Use client components only when interactivity is required
4. Follow the existing layout patterns
5. Ensure proper SEO meta tags are included

## Code Standards

### TypeScript

- Use strict TypeScript with `strict: true` in tsconfig.json
- Define proper types for all props and return values
- Use interfaces for object shapes
- Prefer type assertions over type casts when necessary

### Naming Conventions

- Use PascalCase for React components
- Use camelCase for functions and variables
- Use UPPER_SNAKE_CASE for constants
- Use kebab-case for file names and directory names

### Component Structure

Follow this structure for new components:

```tsx
'use client' // If needed

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ComponentProps {
  // Define prop types
}

export function ComponentName({ prop }: ComponentProps) {
  // Component logic
  
  return (
    <div className={cn('base-classes', 'conditional-classes')}>
      {/* JSX content */}
    </div>
  )
}
```

### Styling

- Use Tailwind CSS utility classes
- Leverage the `cn` utility function for conditional classes
- Maintain consistent spacing and typography
- Ensure responsive design for all screen sizes
- Implement dark mode support where appropriate

## Testing

### Running Tests

Run all tests:

```bash
pnpm test
```

Run integration tests only:

```bash
pnpm test:int
```

Run end-to-end tests only:

```bash
pnpm test:e2e
```

### Writing Tests

#### Unit Tests
- Use Vitest for unit testing
- Place test files adjacent to the code being tested or in a `__tests__` directory
- Test individual functions and components in isolation

#### Integration Tests
- Test how multiple components work together
- Focus on critical user flows
- Mock external dependencies where appropriate

#### End-to-End Tests
- Use Playwright for E2E testing
- Test complete user journeys
- Cover critical functionality paths

## Database Operations

### Migrations

Payload handles database migrations automatically. When you modify collections:

1. Make changes to your collection configuration
2. Run `pnpm payload migrate:create` to create a migration
3. Review the generated migration file
4. Run `pnpm payload migrate` to apply the migration

### Seeding Data

Use the seed route (`/seed`) to populate your database with sample data during development.

### Backup and Restore

Regularly backup your development database:

```bash
pg_dump -U username -d slides_app_dev > backup.sql
```

Restore from backup:

```bash
psql -U username -d slides_app_dev < backup.sql
```

## Performance Optimization

### Bundle Analysis

Analyze your bundle size:

```bash
pnpm build
npx @next/bundle-analyzer
```

### Image Optimization

- Use the Next.js Image component for all images
- Specify dimensions to prevent layout shift
- Use appropriate image formats (WebP, AVIF when supported)

### Code Splitting

- Use dynamic imports for heavy components
- Implement route-based code splitting
- Lazy load non-critical components

## Debugging

### Common Issues

#### Type Generation Problems
If you encounter type errors after modifying collections:

1. Run `pnpm run generate:types`
2. Restart your TypeScript server (in VS Code: Ctrl+Shift+P → "TypeScript: Restart TS Server")

#### Database Connection Issues
- Verify your DATABASE_URL is correct
- Ensure PostgreSQL is running
- Check that the database exists and has proper permissions

#### Build Failures
- Clear Next.js cache: `rm -rf .next`
- Verify all dependencies are installed: `pnpm install`
- Check for syntax errors in your code

### Debugging Tools

- Use the Payload admin panel to inspect data
- Enable Next.js debug mode with environment variables
- Use browser developer tools for frontend debugging
- Check server logs for backend issues

## Extending Functionality

### Adding New Features

1. Plan the feature and identify required data models
2. Create/update collections as needed
3. Generate types: `pnpm run generate:types`
4. Create UI components
5. Add routes/pages
6. Implement business logic
7. Write tests
8. Document the feature

### Custom Payload Plugins

Create custom functionality using Payload plugins:

```typescript
import type { Config, Plugin } from 'payload'

const myPlugin = (options: { collection: string }): Plugin => {
  return (config: Config): Config => ({
    ...config,
    collections: config.collections?.map(collection => {
      if (collection.slug === options.collection) {
        return {
          ...collection,
          hooks: {
            ...collection.hooks,
            beforeChange: [
              ...(collection.hooks?.beforeChange || []),
              (args) => {
                // Custom hook logic
              }
            ]
          }
        }
      }
      return collection
    })
  })
}
```

### Custom Fields

Extend Payload with custom field types:

```typescript
import type { Field } from 'payload/types'

const customField: Field = {
  name: 'customField',
  type: 'text',
  admin: {
    components: {
      Field: '/path/to/custom-field-component',
    },
  },
  hooks: {
    beforeValidate: [(value) => /* validation logic */],
  },
}
```

## Version Control

### Branching Strategy

- Use feature branches for new functionality
- Name branches descriptively (e.g., `feature/course-search`, `fix/progress-tracking`)
- Keep pull requests focused on a single feature or fix
- Update your branch before merging to avoid conflicts

### Commit Messages

Follow conventional commits format:

```
feat: add course search functionality
fix: resolve progress tracking issue
docs: update collection documentation
style: format code according to lint rules
refactor: simplify slide navigation component
test: add unit tests for quiz component
chore: update dependencies
```

## Continuous Integration

The application is configured with CI pipelines that:

- Run tests on every push
- Check code formatting and linting
- Build the application to verify no errors
- Perform security scans

Ensure your code passes all checks before pushing to shared branches.