# E-Learning Platform Specification (`slides-app`)

## Overview
This specification outlines the architecture, features, and data model for the E-Learning Platform, a Next.js application powered by Supabase and PayloadCMS.

The goal is to build a performance-focused, scalable course delivery system using **Next.js App Router (TypeScript)**, **Supabase**, and **PayloadCMS**.

## Architecture

### Frontend Stack
*   **Framework**: Next.js (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **State Management**: React Server Components (RSC) for data fetching; minimal client-side state.
*   **Pattern**: Server-first architecture with strict separation of Client/Server components.

### Backend & Database
*   **Service**: Supabase (PostgreSQL)
*   **CMS**: PayloadCMS (for content management)
*   **Auth**: Supabase Auth (Email/Password, OAuth providers).
*   **Storage**: Supabase Storage (for media assets).
*   **Security**: Row Level Security (RLS) policies.

## User Flows

### 1. Course Discovery
*   **Route**: `/courses` (Public)
*   **Features**:
    *   Paginated list of available courses.
    *   Search and filtering by category/tags.
    *   Course thumbnails, titles, short descriptions.

### 2. Course Syllabus
*   **Route**: `/courses/[courseId]` (Public/Protected)
*   **Features**:
    *   Detailed course overview.
    *   Expandable syllabus (Sections -> Lessons).
    *   Unlock/Lock logic based on user enrollment.

### 3. Lesson Viewer
*   **Route**: `/courses/[courseId]/lessons/[lessonId]` (Protected)
*   **Features**:
    *   Interactive lesson player.
    *   Ordered sequence of slides.
    *   Progress indicator.

### 4. Slide Content
*   **Route**: `/slides/[slideId]` (Protected - Component)
*   **Content Types**:
    *   `text`: Rich text content (Markdown/MDX).
    *   `image`: Visual media.
    *   `video`: Embedded video player.
    *   `quiz`: Interactive questions (Multiple Choice, etc.).
*   **Functionality**:
    *   Next/Previous navigation.
    *   Automatic progress saving.

## Database Schema (Supabase)

### Tables

| Table | Columns | Description |
| :--- | :--- | :--- |
| `courses` | `id` (PK), `title`, `description`, `thumbnail`, `created_at` | Top-level course metadata. |
| `sections` | `id` (PK), `course_id` (FK), `title`, `order` | Grouping for lessons within a course. |
| `lessons` | `id` (PK), `section_id` (FK), `title`, `order` | Individual learning units. |
| `slides` | `id` (PK), `lesson_id` (FK), `type`, `content` (JSONB), `order` | Atomic content blocks (Text, Video, Quiz). |
| `user_progress` | `user_id` (FK), `slide_id` (FK), `completed` (BOOL), `updated_at` | Tracks user completion status per slide. |

### Data Access Patterns
*   **Server Components**: Direct DB queries using Supabase Client.
*   **Caching**: `revalidateTag` for ISR/SSG strategies where applicable.
*   **Performance**: Indexed Foreign Keys (FKs) for efficient JOINs.

## Implementation Roadmap

1.  **Project Setup**: Initialize Next.js, configure Tailwind, setup Supabase client.
2.  **Database Migration**: Apply schema SQL.
3.  **UI Components**: Build atomic components (Card, Button, Input) using Shadcn UI principles.
4.  **Core Features**: Implement Course List -> Detail -> Slide Viewer flow.
5.  **Polishing**: Add loading states, error boundaries, and animations.
