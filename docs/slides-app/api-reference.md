# API Reference

## Overview

The Slides App provides a comprehensive REST API through Payload CMS. This API allows for programmatic access to all collections and enables integration with external systems.

## Base URL

All API requests are made to:
```
https://your-domain.com/api
```

For local development, the base URL is:
```
http://localhost:3000/api
```

## Authentication

### Public Access
Many endpoints are publicly accessible, particularly for reading course content.

### Authentication Required
Some endpoints require authentication. To authenticate, include your credentials in the request:

#### Using Cookies
After logging in through the web interface, authentication cookies will be included in requests.

#### Using Headers
Include an Authorization header with a Bearer token:
```
Authorization: Bearer <jwt-token>
```

## Content Types

The API accepts and returns JSON by default:
```
Content-Type: application/json
Accept: application/json
```

## Rate Limiting

The API implements rate limiting to prevent abuse. Standard limits apply per IP address.

## Collections API

Each collection follows the same REST API pattern:

### Get All Records
```
GET /api/:collection
```

#### Query Parameters
- `limit`: Number of records to return (default: 10, max: 100)
- `page`: Page number for pagination (default: 1)
- `sort`: Sort field (prefix with `-` for descending)
- `where`: Query constraints (see Payload documentation)
- `depth`: Depth of relationship population (default: 0)
- `locale`: Locale for localized content

#### Example Request
```
GET /api/courses?limit=5&page=1&sort=-createdAt&where[category][equals]=Development
```

#### Example Response
```json
{
  "docs": [
    {
      "id": 1,
      "title": "Advanced React Patterns",
      "slug": "advanced-react-patterns",
      "description": "Learn advanced patterns in React development",
      "category": "Development",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "totalDocs": 1,
  "limit": 5,
  "totalPages": 1,
  "page": 1,
  "pagingCounter": 1,
  "hasPrevPage": false,
  "hasNextPage": false,
  "prevPage": null,
  "nextPage": null
}
```

### Get Single Record
```
GET /api/:collection/:id
```

#### Query Parameters
- `depth`: Depth of relationship population (default: 0)
- `locale`: Locale for localized content

#### Example Request
```
GET /api/courses/1
```

#### Example Response
```json
{
  "id": 1,
  "title": "Advanced React Patterns",
  "slug": "advanced-react-patterns",
  "description": "Learn advanced patterns in React development",
  "category": "Development",
  "sections": [
    {
      "id": 1,
      "title": "Introduction",
      "order": 1
    }
  ],
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

### Create Record
```
POST /api/:collection
Content-Type: application/json
```

#### Example Request
```
POST /api/courses
Content-Type: application/json

{
  "title": "Introduction to TypeScript",
  "description": "Learn the basics of TypeScript",
  "category": "Development",
  "level": "Beginner"
}
```

#### Example Response
```json
{
  "doc": {
    "id": 2,
    "title": "Introduction to TypeScript",
    "slug": "introduction-to-typescript",
    "description": "Learn the basics of TypeScript",
    "category": "Development",
    "level": "Beginner",
    "createdAt": "2023-01-02T00:00:00.000Z",
    "updatedAt": "2023-01-02T00:00:00.000Z"
  }
}
```

### Update Record
```
PUT /api/:collection/:id
Content-Type: application/json
```

#### Example Request
```
PUT /api/courses/2
Content-Type: application/json

{
  "description": "Comprehensive introduction to TypeScript fundamentals"
}
```

#### Example Response
```json
{
  "doc": {
    "id": 2,
    "title": "Introduction to TypeScript",
    "slug": "introduction-to-typescript",
    "description": "Comprehensive introduction to TypeScript fundamentals",
    "category": "Development",
    "level": "Beginner",
    "createdAt": "2023-01-02T00:00:00.000Z",
    "updatedAt": "2023-01-02T00:00:00.000Z"
  }
}
```

### Delete Record
```
DELETE /api/:collection/:id
```

#### Example Request
```
DELETE /api/courses/2
```

#### Example Response
```json
{
  "doc": {
    "id": 2,
    "title": "Introduction to TypeScript",
    "slug": "introduction-to-typescript",
    "description": "Comprehensive introduction to TypeScript fundamentals",
    "category": "Development",
    "level": "Beginner",
    "createdAt": "2023-01-02T00:00:00.000Z",
    "updatedAt": "2023-01-02T00:00:00.000Z"
  }
}
```

## Specific Collection Endpoints

### Courses Collection
```
/api/courses
```

#### Additional Fields
- `thumbnail`: Upload field referencing Media collection
- `instructor`: Group field with nested fields

#### Example with Relationships
```
GET /api/courses?depth=2
```
This will populate nested relationships up to 2 levels deep.

### Slides Collection
```
/api/slides
```

#### Special Considerations
- `content` field stores structured content as JSON
- `type` field determines content rendering approach

#### Example with Content Filtering
```
GET /api/slides?where[type][equals]=video
```

### User Progress Collection
```
/api/user-progress
```

#### Authentication Required
All operations on user progress require authentication.

#### Example Request
```
GET /api/user-progress?where[user][equals]=123
```

### Media Collection
```
/api/media
```

#### File Upload
Upload files using multipart/form-data:
```
POST /api/media
Content-Type: multipart/form-data

file: <file-data>
```

## Authentication API

### Login
```
POST /api/users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "user-password"
}
```

#### Response
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt-token-string"
}
```

### Logout
```
POST /api/users/logout
```

### Forgot Password
```
POST /api/users/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### Reset Password
```
POST /api/users/reset-password
Content-Type: application/json

{
  "token": "reset-token",
  "password": "new-password"
}
```

## GraphQL API

The application also provides a GraphQL API at:
```
POST /api/graphql
```

### Example GraphQL Query
```graphql
query GetCourses {
  Courses(limit: 5) {
    docs {
      id
      title
      slug
      description
      sections {
        id
        title
        lessons {
          id
          title
          type
        }
      }
    }
    totalDocs
  }
}
```

### Example GraphQL Mutation
```graphql
mutation CreateCourse {
  createCourse(data: {
    title: "New Course Title"
    description: "Course description"
    category: "Development"
  }) {
    id
    title
    slug
  }
}
```

## Error Handling

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `422`: Unprocessable Entity
- `500`: Internal Server Error

### Error Response Format
```json
{
  "errors": [
    {
      "message": "Error message",
      "field": "field-name"
    }
  ]
}
```

## Querying

### Where Clause
Use the `where` parameter to filter results:

#### Equality
```
where[field][equals]=value
```

#### Partial Matching
```
where[field][contains]=partial-value
```

#### Range Queries
```
where[field][greater_than]=10
where[field][less_than_equal]=100
```

#### Logical Operators
```
where[and][0][field1][equals]=value1
where[and][1][field2][equals]=value2

where[or][0][field1][equals]=value1
where[or][1][field2][equals]=value2
```

### Sorting
Sort results using the `sort` parameter:
```
sort=fieldName          // Ascending
sort=-fieldName         // Descending
```

Multiple sorts:
```
sort=field1,-field2     // field1 ascending, field2 descending
```

## Advanced Features

### File Upload
Upload files to the Media collection:
```
POST /api/media
Content-Type: multipart/form-data

file: <file-data>
alt: "Alternative text for accessibility"
```

### Relationship Population
Control relationship depth with the `depth` parameter:
```
GET /api/courses?depth=3
```

### Field Selection
Select specific fields to reduce payload:
```
GET /api/courses?select=title,description,category
```

### Aggregation
Perform aggregation operations (if supported by your database):
```
GET /api/courses?aggregate[avg]=rating
```

## Webhooks

The API supports webhooks for real-time notifications. Configure webhooks through the Payload admin panel.

### Supported Events
- `afterOperation`: Triggered after any CRUD operation
- `afterChange`: Triggered after record creation or update
- `afterDelete`: Triggered after record deletion