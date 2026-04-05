# Finance Data Processing and Access Control Backend

Backend API for a finance dashboard system with:

- user and role management
- financial records CRUD + filtering
- dashboard summary/analytics APIs
- role-based access control
- validation and structured error handling

Tech stack:

- Node.js + Express
- PostgreSQL (`pg`)
- Raw SQL queries (no ORM)
- JWT auth, bcrypt hashing, Zod validation

## Roles and Access

- `viewer`: dashboard-only read access
- `analyst`: can read financial records and dashboard data
- `admin`: full access to users and financial records

## Project Structure

```txt
src/
  app.js
  server.js
  config/
  db/
    queries/
  middlewares/
  modules/
    auth/
    user/
    finance/
    dashboard/
  routes/
  utils/
sql/
  schema.sql
  seed.sql
```

Architecture flowchart and file map:

- `docs/backend-flowchart.md`
- `docs/api-reference.md` (complete endpoint documentation)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create and seed PostgreSQL tables:

```sql
-- run in order
\i sql/schema.sql
\i sql/seed.sql
```

3. Configure `.env`:

```env
PORT=3000
DATABASE_URL=postgresql://<user>:<pass>@<host>/<db>?sslmode=require
JWT_SECRET=your_strong_secret
JWT_EXPIRES_IN=1d
```

4. Start server:

```bash
npm run dev
```

Base URL: `http://localhost:3000/api`

## Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`

Use returned token in requests:

```txt
Authorization: Bearer <token>
```

## API Summary

### Health

- `GET /api/health` (public)

### Users (authenticated)

- `GET /api/users/me` (`admin`, `analyst`, `viewer`)
- `POST /api/users` (`admin`)
- `GET /api/users` (`admin`) with query: `status`, `role`, `page`, `limit`
- `GET /api/users/:id` (`admin`)
- `PATCH /api/users/:id/status` (`admin`)
- `PATCH /api/users/:id/role` (`admin`)
- `DELETE /api/users/:id` (`admin`)

### Financial Records (authenticated)

- `POST /api/finance` (`admin`)
- `GET /api/finance` (`admin`, `analyst`) with query:
  - `userId`, `type`, `category`, `startDate`, `endDate`, `page`, `limit`
- `GET /api/finance/:id` (`admin`, `analyst`)
- `PUT /api/finance/:id` (`admin`)
- `DELETE /api/finance/:id` (`admin`)

### Dashboard (authenticated)

- `GET /api/dashboard/summary` (`admin`, `analyst`, `viewer`)
- `GET /api/dashboard/category-totals` (`admin`, `analyst`, `viewer`)
- `GET /api/dashboard/recent-activity` (`admin`, `analyst`, `viewer`) with `limit`
- `GET /api/dashboard/monthly-trends` (`admin`, `analyst`, `viewer`)

Dashboard filters supported where relevant:

- `userId`, `type`, `category`, `startDate`, `endDate`

## Validation and Errors

- Request body/query/params are validated via Zod.
- Standardized JSON error format:

```json
{
  "success": false,
  "message": "Validation failed",
  "details": {}
}
```

## Notes and Assumptions

- Registration allows selecting role (`admin`, `analyst`, `viewer`) for assignment/demo convenience.
- Account `status` is enforced during authenticated requests (`inactive` users are blocked).
- Passwords are hashed using `bcrypt`.
- Financial records use hard delete (no soft delete).
