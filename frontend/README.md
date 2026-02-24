# Document Signature Frontend

React frontend for your Spring Boot Document Signature backend.

## Backend APIs used

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/documents`
- `GET /api/documents/{id}`
- `POST /api/signatures`
- `GET /api/audits`

## Run

1. Start your Java backend on `http://localhost:8080`.
2. Start frontend:

```bash
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## API base URL

By default, frontend calls relative `/api/*` routes and Vite proxies to `http://localhost:8080`.

If you want direct API calls, create `.env`:

```bash
VITE_API_BASE_URL=http://localhost:8080
```

## Current scope

This UI covers:

- Register/Login and JWT token storage
- Document upload by file name
- Load document by ID
- Apply signature coordinates (page/x/y)
- Fetch and display audit logs
- Session dashboard metrics

