# Slides App Documentation

## Overview

The Slides App is a comprehensive e-learning platform built with Payload CMS and Next.js. It provides a complete solution for creating, managing, and consuming educational content through an interactive interface.

## Table of Contents

1. [Architecture](#architecture)
2. [Features](#features)
3. [Collections](#collections)
4. [Frontend Structure](#frontend-structure)
5. [Installation](#installation)
6. [Development](#development)
7. [Deployment](#deployment)
8. [API Reference](#api-reference)
9. [Troubleshooting](#troubleshooting)

## Architecture

The application follows a modern full-stack architecture:

- **Backend**: Payload CMS with PostgreSQL database
- **Frontend**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with dark mode support
- **Rich Text**: Lexical editor
- **Type Safety**: Full TypeScript integration

## Features

### Core Features
- Course management system with hierarchical structure (Courses → Sections → Lessons → Slides)
- Multiple content types (text, image, video, quiz)
- User progress tracking
- Role-based access control
- Interactive slide viewer
- Media management system

### Technical Features
- Server-side rendering with Next.js
- Type-safe API with generated types
- Responsive design for all device sizes
- Dark/light mode support
- Comprehensive testing setup

## Collections

The application uses several Payload collections to manage educational content:

### Courses
- Title, description, category, difficulty level
- Duration, rating, enrollment count
- Instructor information

### Sections
- Organize lessons within courses
- Ordering and duration tracking

### Lessons
- Individual learning units within sections
- Type classification (video, article, quiz)
- Estimated time for completion

### Slides
- Core content units with multiple types
- JSON-based content storage for flexibility
- Relationship to lessons

### Users
- Role-based access (admin, instructor, student)
- Profile information and metadata

### User Progress
- Track completion status
- Progress percentage tracking
- Enrollment date recording

### Media
- Image and video upload management
- Automatic thumbnail generation
- Focal point adjustment

## Frontend Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (frontend)/         # Public-facing pages
│   ├── (payload)/          # Payload admin interface
│   └── (slides)/           # Slide viewing interface
├── collections/            # Payload collection configurations
├── components/             # React components
│   ├── courses/            # Course-related components
│   ├── lessons/            # Lesson-related components
│   ├── slides/             # Slide viewing components
│   ├── syllabus/           # Syllabus components
│   └── ui/                 # Reusable UI components
├── lib/                    # Utility functions
├── utilities/              # Payload utility functions
└── payload.config.ts       # Payload configuration
```

## Installation

### Prerequisites
- Node.js 18.20.2+ or Node.js 20.9.0+
- pnpm 9.x or 10.x
- PostgreSQL database

### Steps

1. Clone the repository:
```bash
git clone <repository-url>
cd slides-app
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Update the `.env` file with your database connection string:
```bash
DATABASE_URL="postgresql://username:password@localhost:5432/slides_app"
PAYLOAD_SECRET="your-very-secure-secret-key"
```

5. Initialize the database:
```bash
pnpm payload migrate
```

6. Generate types:
```bash
pnpm run generate:types
```

## Development

### Running the Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

### Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm generate:types` - Generate TypeScript types from Payload collections
- `pnpm generate:importmap` - Generate import map for admin components
- `pnpm test` - Run all tests
- `pnpm test:int` - Run integration tests
- `pnpm test:e2e` - Run end-to-end tests

### Development Workflow

1. Make changes to collection configurations in `src/collections/`
2. Regenerate types: `pnpm run generate:types`
3. Restart the development server if needed
4. Test changes in the browser

## Deployment

### Environment Variables

For production deployment, ensure the following environment variables are set:

```bash
DATABASE_URL="postgresql://username:password@host:port/database"
PAYLOAD_SECRET="your-production-secret-key"
NODE_ENV="production"
```

### Building for Production

```bash
pnpm build
```

### Running in Production

```bash
pnpm start
```

## API Reference

### Payload REST API

The application exposes a full REST API through Payload CMS. Endpoints follow the pattern:

```
GET    /api/:collection
POST   /api/:collection
GET    /api/:collection/:id
PUT    /api/:collection/:id
DELETE /api/:collection/:id
```

### Example Requests

Get all courses:
```
GET /api/courses
```

Get a specific course:
```
GET /api/courses/:id
```

Create a new slide:
```
POST /api/slides
Content-Type: application/json

{
  "title": "Introduction to React",
  "lesson": "lesson-id",
  "type": "text",
  "content": {
    "textContent": "<p>This is the slide content</p>"
  }
}
```

## Troubleshooting

### Common Issues

#### Database Connection Errors
- Ensure PostgreSQL is running
- Verify the DATABASE_URL in your environment variables
- Check that the database exists and has proper permissions

#### Type Generation Issues
- Run `pnpm run generate:types` after making changes to collections
- Ensure all collection configurations are valid

#### Build Failures
- Clear the Next.js cache: `rm -rf .next`
- Verify all dependencies are installed: `pnpm install`

### Development Tips

- Always restart the development server after changing collection configurations
- Use the Payload admin panel to manage content during development
- Leverage the generated TypeScript types for type-safe development