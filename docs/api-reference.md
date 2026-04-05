# Finance Backend API Reference

This document describes the live API implemented in this repository.

## Base URL

`http://localhost:3000/api`

## Authentication

Most endpoints require a JWT access token:

`Authorization: Bearer <token>`

Token is returned by:

- `POST /auth/register`
- `POST /auth/login`

## Roles Used by API

Only these roles are accepted by request validation and authorization checks:

- `admin`
- `analyst`
- `viewer`

## Response Format

### Success

```json
{
  "success": true,
  "message": "Human-readable success message",
  "data": {}
}
```

### Error

```json
{
  "success": false,
  "message": "Error message",
  "details": {}
}
```

`details` appears only when extra context exists (for example validation errors).

## Common Error Cases

- `400` validation failure, bad filters, invalid references (for example invalid `userId`)
- `401` missing/invalid/expired token
- `403` inactive user or insufficient role
- `404` resource not found
- `409` duplicate data (for example email already exists)
- `500` unexpected server error

Validation errors return:

```json
{
  "success": false,
  "message": "Validation failed",
  "details": {
    "fieldErrors": {
      "email": ["Invalid email address"]
    }
  }
}
```

## Health

### GET `/health`

Auth: public  
Roles: public

Response `200`:

```json
{
  "success": true,
  "message": "Finance backend is healthy",
  "data": {
    "timestamp": "2026-04-05T10:50:00.000Z"
  }
}
```

## Auth Endpoints

### POST `/auth/register`

Auth: public  
Roles: public

Body:

```json
{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "password": "StrongPass123",
  "role": "viewer"
}
```

Rules:

- `name`: string, 2-100 chars
- `email`: valid email, max 100 chars
- `password`: string, 8-72 chars
- `role`: optional, one of `admin|analyst|viewer`, default `viewer`

Response `201`:

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "status": "active",
      "created_at": "2026-04-05T10:50:00.000Z",
      "updated_at": "2026-04-05T10:50:00.000Z",
      "role": "viewer"
    },
    "token": "jwt"
  }
}
```

### POST `/auth/login`

Auth: public  
Roles: public

Body:

```json
{
  "email": "alice@example.com",
  "password": "StrongPass123"
}
```

Rules:

- `email`: required valid email
- `password`: required non-empty string

Response `200`:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "status": "active",
      "created_at": "2026-04-05T10:50:00.000Z",
      "updated_at": "2026-04-05T10:50:00.000Z",
      "role": "viewer"
    },
    "token": "jwt"
  }
}
```

## User Endpoints

All `/users` routes require authentication.

### GET `/users/me`

Auth: required  
Roles: `admin`, `analyst`, `viewer`

Response `200`:

```json
{
  "success": true,
  "message": "Current user fetched successfully",
  "data": {
    "id": "uuid",
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "status": "active",
    "created_at": "2026-04-05T10:50:00.000Z",
    "updated_at": "2026-04-05T10:50:00.000Z",
    "role": "viewer"
  }
}
```

### POST `/users`

Auth: required  
Roles: `admin`

Body:

```json
{
  "name": "Bob Analyst",
  "email": "bob@example.com",
  "password": "StrongPass123",
  "role": "analyst",
  "status": "active"
}
```

Rules:

- `name`: 2-100 chars
- `email`: valid email, max 100 chars
- `password`: 8-72 chars
- `role`: `admin|analyst|viewer` (default `viewer`)
- `status`: `active|inactive` (default `active`)

Response `201`: created user object.

### GET `/users`

Auth: required  
Roles: `admin`

Query params:

- `status`: optional `active|inactive`
- `role`: optional `admin|analyst|viewer`
- `page`: optional positive integer, default `1`
- `limit`: optional positive integer <= `100`, default `20`

Response `200`:

```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalItems": 0,
      "totalPages": 1
    }
  }
}
```

### GET `/users/:id`

Auth: required  
Roles: `admin`

Path params:

- `id`: UUID

Response `200`: single user object.

### PATCH `/users/:id/status`

Auth: required  
Roles: `admin`

Path params:

- `id`: UUID

Body:

```json
{
  "status": "inactive"
}
```

Rules:

- `status`: required, `active|inactive`

Response `200`: updated user object.

### PATCH `/users/:id/role`

Auth: required  
Roles: `admin`

Path params:

- `id`: UUID

Body:

```json
{
  "role": "viewer"
}
```

Rules:

- `role`: required, `admin|analyst|viewer`

Response `200`: updated user object.

### DELETE `/users/:id`

Auth: required  
Roles: `admin`

Path params:

- `id`: UUID

Response `200`:

```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": {
    "id": "uuid",
    "email": "deleted.user@example.com"
  }
}
```

## Finance Endpoints

All `/finance` routes require authentication.

### POST `/finance`

Auth: required  
Roles: `admin`

Body:

```json
{
  "userId": "uuid",
  "amount": 1200.5,
  "type": "income",
  "category": "Salary",
  "note": "March salary",
  "date": "2026-03-31"
}
```

Rules:

- `userId`: UUID
- `amount`: number >= 0
- `type`: `income|expense`
- `category`: 1-50 chars
- `note`: optional, nullable, max 300 chars
- `date`: `YYYY-MM-DD`

Response `201`: created record object.

### GET `/finance`

Auth: required  
Roles: `admin`, `analyst`

Query params:

- `userId`: optional UUID
- `type`: optional `income|expense`
- `category`: optional string 1-50 chars
- `startDate`: optional `YYYY-MM-DD`
- `endDate`: optional `YYYY-MM-DD`
- `page`: optional positive integer, default `1`
- `limit`: optional positive integer <= `100`, default `20`

Response `200`:

```json
{
  "success": true,
  "message": "Financial records fetched successfully",
  "data": {
    "items": [
      {
        "id": "uuid",
        "user_id": "uuid",
        "user_name": "Alice Johnson",
        "amount": "1200.50",
        "type": "income",
        "category": "Salary",
        "note": "March salary",
        "date": "2026-03-31T00:00:00.000Z",
        "created_at": "2026-04-05T10:50:00.000Z",
        "updated_at": "2026-04-05T10:50:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalItems": 1,
      "totalPages": 1
    }
  }
}
```

### GET `/finance/:id`

Auth: required  
Roles: `admin`, `analyst`

Path params:

- `id`: UUID

Response `200`: single financial record with `user_name`.

### PUT `/finance/:id`

Auth: required  
Roles: `admin`

Path params:

- `id`: UUID

Body: at least one field is required.

```json
{
  "amount": 900.0,
  "category": "Freelance",
  "note": "Updated note"
}
```

Allowed fields:

- `userId` (UUID)
- `amount` (number >= 0)
- `type` (`income|expense`)
- `category` (1-50 chars)
- `note` (nullable, max 300 chars)
- `date` (`YYYY-MM-DD`)

Response `200`: updated record object.

### DELETE `/finance/:id`

Auth: required  
Roles: `admin`

Path params:

- `id`: UUID

Response `200`:

```json
{
  "success": true,
  "message": "Financial record deleted successfully",
  "data": {
    "id": "uuid"
  }
}
```

## Dashboard Endpoints

All `/dashboard` routes require authentication and allow roles: `admin`, `analyst`, `viewer`.

Shared optional filters:

- `userId` (UUID)
- `type` (`income|expense`)
- `category` (1-50 chars)
- `startDate` (`YYYY-MM-DD`)
- `endDate` (`YYYY-MM-DD`)

### GET `/dashboard/summary`

Response `200`:

```json
{
  "success": true,
  "message": "Dashboard summary fetched successfully",
  "data": {
    "total_income": "5000.00",
    "total_expense": "2200.00",
    "net_balance": "2800.00"
  }
}
```

### GET `/dashboard/category-totals`

Response `200`:

```json
{
  "success": true,
  "message": "Category totals fetched successfully",
  "data": [
    {
      "type": "expense",
      "category": "Rent",
      "total": "1200.00"
    }
  ]
}
```

### GET `/dashboard/recent-activity`

Extra query param:

- `limit`: optional positive integer <= `100`, default `5`

Response `200`: array of recent records ordered by `created_at DESC`.

### GET `/dashboard/monthly-trends`

Response `200`:

```json
{
  "success": true,
  "message": "Monthly trends fetched successfully",
  "data": [
    {
      "month": "2026-03-01T00:00:00.000Z",
      "income": "5000.00",
      "expense": "2200.00"
    }
  ]
}
```

## Quick cURL Examples

Register:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Alice\",\"email\":\"alice@example.com\",\"password\":\"StrongPass123\",\"role\":\"viewer\"}"
```

Login:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"alice@example.com\",\"password\":\"StrongPass123\"}"
```

List users (admin token):

```bash
curl "http://localhost:3000/api/users?page=1&limit=20" \
  -H "Authorization: Bearer <token>"
```

Create finance record (admin token):

```bash
curl -X POST http://localhost:3000/api/finance \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d "{\"userId\":\"<uuid>\",\"amount\":1000,\"type\":\"income\",\"category\":\"Salary\",\"note\":null,\"date\":\"2026-04-01\"}"
```

Dashboard summary:

```bash
curl "http://localhost:3000/api/dashboard/summary?startDate=2026-01-01&endDate=2026-12-31" \
  -H "Authorization: Bearer <token>"
```
