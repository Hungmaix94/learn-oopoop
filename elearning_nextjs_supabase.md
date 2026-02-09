# E‑Learning Platform (Next.js + Supabase)

## Overview
Build an **e‑learning web app** using **Next.js App Router (TypeScript)** and **Supabase**.
Focus on **performance**, **clean architecture**, and **scalability**.

---

## User Flow

### 1. Course List
- Route: `/courses`
- Public page
- Display:
  - Title
  - Thumbnail
  - Short description
  - Total lessons
- Pagination / infinite scroll

### 2. Course Detail (Syllabus)
- Route: `/courses/[courseId]`
- Display:
  - Course info
  - Syllabus (sections → lessons)
- Lessons ordered
- Support locked/unlocked lessons (future)

### 3. Lesson Slides List
- Route: `/courses/[courseId]/lessons/[lessonId]`
- Display:
  - Ordered slides
  - Progress indicator

### 4. Slide Detail
- Route: `/slides/[slideId]`
- Content types:
  - `text`
  - `image`
  - `video`
  - `quiz` (extensible)
- Features:
  - Next / Previous navigation
  - Save progress

---

## Database Schema (Supabase)

### courses
- `id`
- `title`
- `description`
- `thumbnail`
- `created_at`

### sections
- `id`
- `course_id`
- `title`
- `order`

### lessons
- `id`
- `section_id`
- `title`
- `order`

### slides
- `id`
- `lesson_id`
- `type` — text | image | video | quiz
- `content` — JSONB
- `order`

### user_progress
- `user_id`
- `slide_id`
- `completed`
- `updated_at`

---

## Data Access Pattern

- Use **Supabase Server Components**
- Typed queries
- Suggested functions:
  - `getCourses()`
  - `getCourseDetail(courseId)`
  - `getLessonSlides(lessonId)`
  - `getSlide(slideId)`

- Cache with `revalidateTag`

---

## Frontend Stack

- Next.js App Router
- TypeScript
- Server Components (default)
- Client Components only for:
  - slide navigation
  - progress tracking
- TailwindCSS
- No Redux

---

## Performance Rules

- Route-level `loading.tsx`
- Parallel data fetching
- Minimal client-side JS
- Indexed foreign keys in Supabase

---

## Future Extensions

- Admin / Student roles
- Paid courses
- Resume last slide
- Quiz scoring

