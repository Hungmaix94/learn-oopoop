# Frontend Architecture Documentation

## Overview

The Slides App frontend is built with Next.js 15 using the App Router and follows modern React best practices. The architecture separates concerns between public-facing pages, administrative interfaces, and specialized slide viewing experiences.

## Directory Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (frontend)/         # Public-facing pages
│   │   ├── courses/        # Course listing and detail pages
│   │   ├── dashboard/      # User dashboard
│   │   ├── login/          # Authentication pages
│   │   ├── profile/        # User profile pages
│   │   ├── register/       # Registration pages
│   │   ├── seed/           # Data seeding utilities
│   │   ├── layout.tsx      # Root layout for frontend
│   │   └── page.tsx        # Homepage
│   ├── (payload)/          # Payload admin interface
│   ├── (slides)/           # Slide viewing interface
│   │   └── slides/         # Individual slide pages
│   │       └── [slideId]/  # Dynamic slide ID routes
│   │           └── page.tsx
│   ├── api/                # API routes
│   ├── my-route/           # Custom route example
│   └── layout.tsx          # Root application layout
├── components/             # Reusable React components
│   ├── courses/            # Course-specific components
│   ├── layout/             # Layout components
│   ├── lessons/            # Lesson-specific components
│   ├── slides/             # Slide viewing components
│   ├── syllabus/           # Syllabus components
│   └── ui/                 # Generic UI components
├── lib/                    # Utility functions and libraries
├── utilities/              # Payload-specific utilities
└── payload.config.ts       # Payload configuration
```

## Application Routing

### Route Groups

#### `(frontend)` - Public-Facing Routes
- Purpose: Publicly accessible pages for course browsing and learning
- Examples: Home page, course listings, course details
- Authentication: Generally unauthenticated (with exceptions)

#### `(payload)` - Administrative Interface
- Purpose: Payload CMS admin panel
- Access: Requires authentication
- Functionality: Content management, user management

#### `(slides)` - Slide Viewing Interface
- Purpose: Specialized slide viewing experience
- Access: May require authentication depending on course access
- Functionality: Interactive slide navigation, progress tracking

### Key Routes

#### Frontend Routes
- `/` - Homepage with course promotion and features
- `/courses` - Course listing page with filtering
- `/courses/[courseId]` - Course detail page with syllabus
- `/courses/[courseId]/lessons/[lessonId]` - Lesson listing within course
- `/profile` - User profile management
- `/login` - User authentication
- `/register` - User registration

#### Slide Viewing Routes
- `/slides/[slideId]` - Individual slide viewing with navigation

## Component Architecture

### Layout Components
Located in `src/components/layout/`, these components provide consistent structure across the application:

- `Header` - Navigation and user controls
- `Footer` - Site-wide footer information
- `Sidebar` - Secondary navigation and information

### Course Components
Located in `src/components/courses/`, these handle course-specific functionality:

- `CourseCard` - Display individual courses in listings
- `CourseGrid` - Grid layout for course listings
- `CourseSyllabus` - Detailed syllabus view
- `EnrollmentForm` - Course enrollment functionality

### Lesson Components
Located in `src/components/lessons/`, these manage lesson-specific features:

- `LessonList` - List lessons within a section
- `LessonCard` - Display individual lessons
- `LessonProgress` - Track lesson completion

### Slide Components
Located in `src/components/slides/`, these provide the core slide viewing experience:

- `VideoPlayer` - Video playback with controls
- `QuizComponent` - Interactive quiz functionality
- `ProgressTracker` - Track and update user progress
- `SlideNavigation` - Previous/next slide navigation

### UI Components
Located in `src/components/ui/`, these are generic reusable components:

- `Button` - Styled buttons with variants
- `Input` - Form inputs with validation
- `Card` - Content containers
- `Modal` - Overlay dialogs
- `Dropdown` - Menu components

## Data Fetching Strategy

### Server Components
Most components in the application are server components that fetch data directly from the Payload API:

```typescript
// Example of server component data fetching
const payload = await getPayloadHMR({ config });
const courses = await payload.find({
  collection: 'courses',
  limit: 10,
});
```

### Client Components
Client components are used sparingly for interactive functionality:

- Slide navigation controls
- Progress tracking
- Video player controls
- Quiz interactions
- Form submissions

### Caching and Performance
- Server components leverage Next.js caching mechanisms
- Static generation where appropriate
- Dynamic rendering for personalized content
- Optimistic updates for user interactions

## Styling Approach

### Tailwind CSS
The application uses Tailwind CSS for styling with the following characteristics:

- Utility-first approach for rapid development
- Consistent design system through configuration
- Responsive design out of the box
- Dark mode support using Tailwind's dark mode features

### Custom Components
Reusable styled components are built using:
- Radix UI primitives for accessibility
- Tailwind CSS for styling
- clsx for conditional class names
- tailwind-merge for class name merging

## State Management

### Server-Side State
- User authentication state is managed through Payload's auth system
- Course and content data is fetched server-side
- Progress tracking uses the User Progress collection

### Client-Side State
- Minimal client-side state for interactive components
- React hooks for component-specific state
- URL parameters for navigation state

## Accessibility

### Standards Compliance
- WCAG 2.1 AA compliance
- Semantic HTML structure
- Proper heading hierarchy
- ARIA attributes where necessary

### Keyboard Navigation
- Full keyboard navigation support
- Focus management for interactive elements
- Skip links for main content

## Internationalization

While not currently implemented, the architecture supports internationalization through:
- Parameterized text content
- Locale detection
- Translation file structure compatibility

## Performance Optimization

### Image Optimization
- Next.js Image component for optimized images
- Lazy loading for off-screen images
- Proper sizing and formats

### Code Splitting
- Automatic code splitting by Next.js
- Dynamic imports for heavy components
- Route-based splitting

### Caching
- Next.js caching headers
- Payload API caching
- Browser caching strategies

## Security Considerations

### Input Sanitization
- Payload's built-in sanitization
- Server-side validation
- Content security policies

### Authentication
- Payload's authentication system
- Role-based access control
- Session management

### Data Protection
- Sensitive data not exposed to client
- Proper access controls on collections
- Secure API endpoint design