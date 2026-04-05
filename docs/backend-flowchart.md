# Backend Flowchart and File Map

This document shows how requests move through the backend and how files are organized.

## 1) Request Lifecycle (High-Level)

```mermaid
flowchart TD
    A["Client / Frontend"] --> B["src/server.js"]
    B --> C["src/app.js"]
    C --> D["Express JSON + URL-encoded parsers"]
    C --> E["/api router: src/routes/index.js"]

    E --> E1["GET /health public"]
    E --> E2["/auth"]
    E --> E3["/users"]
    E --> E4["/finance"]
    E --> E5["/dashboard"]

    E2 --> V1[validate.middleware.js]
    V1 --> AC[auth.controller.js]
    AC --> AS[auth.service.js]
    AS --> UQ[db/queries/users.queries.js]
    AS --> HU[utils/hash.js]
    AS --> JU[utils/jwt.js]

    E3 --> M1[auth.middleware.js]
    M1 --> M2[role.middleware.js for admin routes]
    M2 --> V2[validate.middleware.js]
    V2 --> UC[user.controller.js]
    UC --> US[user.service.js]
    US --> UQ

    E4 --> F1[auth.middleware.js]
    F1 --> F2[role.middleware.js]
    F2 --> V3[validate.middleware.js]
    V3 --> FC[finance.controller.js]
    FC --> FS[finance.service.js]
    FS --> FQ[db/queries/finance.queries.js]
    FS --> UQ

    E5 --> D1[auth.middleware.js]
    D1 --> D2[role.middleware.js]
    D2 --> V4[validate.middleware.js]
    V4 --> DC[dashboard.controller.js]
    DC --> DS[dashboard.service.js]
    DS --> DQ[db/queries/dashboard.queries.js]

    UQ --> DB[(PostgreSQL)]
    FQ --> DB
    DQ --> DB

    C --> NF[notFoundHandler]
    NF --> EH[errorHandler]
```

## 2) File Responsibility Map

```mermaid
flowchart LR
    subgraph Entry
      S1[src/server.js]
      S2[src/app.js]
      S3[src/routes/index.js]
    end

    subgraph Config
      C1[src/config/env.js]
      C2[src/config/db.js]
    end

    subgraph Middleware
      M1[src/middlewares/auth.middleware.js]
      M2[src/middlewares/role.middleware.js]
      M3[src/middlewares/validate.middleware.js]
      M4[src/middlewares/error.middleware.js]
    end

    subgraph Modules
      A1[src/modules/auth/*.js]
      U1[src/modules/user/*.js]
      F1[src/modules/finance/*.js]
      D1[src/modules/dashboard/*.js]
    end

    subgraph DataAccess
      Q1[src/db/index.js]
      Q2[src/db/queries/users.queries.js]
      Q3[src/db/queries/finance.queries.js]
      Q4[src/db/queries/dashboard.queries.js]
    end

    subgraph Utilities
      U2[src/utils/jwt.js]
      U3[src/utils/hash.js]
      U4[src/utils/helper.js]
    end

    S1 --> S2 --> S3
    S2 --> M4
    S3 --> Modules

    Modules --> M1
    Modules --> M2
    Modules --> M3
    Modules --> U2
    Modules --> U3
    Modules --> U4

    Modules --> Q2
    Modules --> Q3
    Modules --> Q4
    Q2 --> Q1
    Q3 --> Q1
    Q4 --> Q1

    C1 --> S1
    C1 --> U2
    C1 --> Q1
```

## 3) Endpoint to File Trace

- `POST /api/auth/register` -> `modules/auth/auth.routes.js` -> `auth.controller.register` -> `auth.service.register` -> `users.queries` + `hash` + `jwt`.
- `POST /api/auth/login` -> `modules/auth/auth.routes.js` -> `auth.controller.login` -> `auth.service.login` -> `users.queries` + `hash` + `jwt`.
- `GET /api/users/me` -> `modules/user/user.routes.js` -> `auth.middleware` -> `user.controller.getCurrentUser` -> `user.service.getCurrentUser` -> `users.queries.getUserById`.
- `Users admin CRUD` -> `modules/user/user.routes.js` -> `auth.middleware` + `role.middleware(admin)` + `validate.middleware` -> `user.controller.*` -> `user.service.*` -> `users.queries.*`.
- `Finance CRUD/list` -> `modules/finance/finance.routes.js` -> `auth.middleware` + `role.middleware` + `validate.middleware` -> `finance.controller.*` -> `finance.service.*` -> `finance.queries.*` (plus `users.queries` for user validation).
- `Dashboard endpoints` -> `modules/dashboard/dashboard.routes.js` -> `auth.middleware` + `role.middleware(admin|analyst|viewer)` + `validate.middleware` -> `dashboard.controller.*` -> `dashboard.service.*` -> `dashboard.queries.*`.

## 4) Quick Mental Model

- `routes`: endpoint definitions + middleware chain.
- `controller`: HTTP layer (status codes + response shape).
- `service`: business logic and rule checks.
- `db/queries`: SQL and data retrieval/write.
- `middlewares`: cross-cutting concerns (auth, roles, validation, errors).
- `utils`: reusable helpers (JWT, bcrypt, async error wrapper).
