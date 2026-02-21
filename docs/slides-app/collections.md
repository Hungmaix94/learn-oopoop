# Collections Documentation

## Overview

The Slides App uses several Payload CMS collections to manage educational content. Each collection represents a specific entity in the e-learning ecosystem.

## Collections

### Users Collection

Manages user accounts and authentication.

#### Fields
- `name`: User's display name
- `role`: User role (admin, instructor, student)
- `bio`: Brief biography
- `location`: User's location
- `company`: Company affiliation
- `joinedDate`: Account creation date
- `email`: User's email address (unique)
- Authentication fields (password, reset token, etc.)

#### Access Control
- Admins can manage all users
- Users can update their own profiles
- Role-based permissions for different actions

### Media Collection

Handles file uploads and media management.

#### Fields
- `alt`: Alt text for accessibility
- `url`: File URL
- `filename`: Original filename
- `mimeType`: File MIME type
- `filesize`: File size in bytes
- `width`/`height`: Dimensions for images
- `focalX`/`focalY`: Focal point coordinates for images

#### Features
- Automatic thumbnail generation
- Focal point adjustment for images
- File type validation
- Size limits enforcement

### Courses Collection

Represents educational courses available on the platform.

#### Fields
- `title`: Course title
- `slug`: URL-friendly identifier (auto-generated from title)
- `description`: Course description
- `thumbnail`: Course thumbnail image (relation to Media)
- `category`: Course category (Development, Design, Business, etc.)
- `duration`: Estimated course duration
- `level`: Difficulty level (Beginner, Intermediate, Expert)
- `rating`: Average course rating
- `enrolledCount`: Number of enrolled students
- `instructor`: Instructor information (group field with name, title, bio, avatar)

#### Features
- Auto-generated slugs from titles
- Category-based filtering
- Instructor information grouping
- Enrollment tracking

### Sections Collection

Organizes lessons within courses.

#### Fields
- `title`: Section title
- `order`: Order of the section within the course
- `course`: Relation to the parent course
- `duration`: Estimated section duration

#### Features
- Sequential ordering within courses
- Parent-child relationship with courses
- Duration tracking

### Lessons Collection

Individual learning units within sections.

#### Fields
- `title`: Lesson title
- `order`: Order of the lesson within the section
- `section`: Relation to the parent section
- `type`: Lesson type (video, article, quiz)
- `duration`: Estimated lesson duration
- `estimatedTime`: Time estimate in minutes

#### Features
- Type classification for different content formats
- Sequential ordering within sections
- Time estimation for planning

### Slides Collection

Core content units containing the actual educational material.

#### Fields
- `title`: Slide title
- `order`: Order of the slide within the lesson
- `lesson`: Relation to the parent lesson
- `type`: Slide type (text, image, video, quiz)
- `content`: Content stored as JSON (structured content)
- `thumbnail`: Slide thumbnail (relation to Media)
- `videoUrl`: URL for video slides

#### Features
- Multiple content types support
- Structured content storage using JSON
- Relationship to lessons
- Video URL support for video slides

### User Progress Collection

Tracks user engagement and completion status.

#### Fields
- `user`: Relation to the user
- `course`: Relation to the course (optional)
- `slide`: Relation to the slide (optional)
- `completed`: Completion status (boolean)
- `progress`: Completion percentage (0-100)
- `enrolledAt`: Enrollment date

#### Features
- Fine-grained progress tracking
- Course and slide-level tracking
- Completion percentage calculation
- Enrollment date tracking

## Relationships

### Hierarchical Structure
```
Courses
  └── Sections
      └── Lessons
          └── Slides
```

### Cross-Collection Relationships
- Users can have progress records for multiple courses and slides
- Media can be referenced by courses (thumbnails), slides (thumbnails), and instructors (avatars)
- Lessons belong to sections, which belong to courses

## Access Control

### Collection-Level Access
- Courses, sections, lessons, and slides: Public read access, admin write access
- Users: Self-management with role-based restrictions
- Media: Public read access for uploaded files
- User Progress: User-specific access with admin override

### Field-Level Access
- Password fields: Read/write restricted to owners/admins
- Role field: Write restricted to admins
- Private user information: Read restricted to owners/admins

## Validation

### Required Fields
- All collections have required fields marked appropriately
- Unique constraints on emails and slugs
- Numeric constraints (progress percentages 0-100)

### Custom Validation
- Slug formatting (lowercase, hyphens for spaces)
- Email format validation
- Content type validation for slides
- Order constraints within hierarchical structures