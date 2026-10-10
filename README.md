# Vacations

A full-stack vacations system. Registered users browse vacations and like or unlike
them; an admin adds, edits and deletes vacations and views reports.

**GitHub:** <!-- TODO: paste the repository URL here -->

---

## Stack

| Layer | Technology |
|---|---|
| Database | MySQL 8 |
| Backend | Node.js, Express, TypeScript |
| Frontend | React, TypeScript, Vite |
| Auth | JWT |
| AI | OpenAI, plus an MCP server exposing database tools |

---

## Project structure

```
Database/   the database export (schema + data)
Backend/    the REST API
Frontend/   the React client
```

---

## Running with Docker

From the project root:

```bash
docker compose up -d --build
```

- Frontend: http://localhost:5173
- Backend: http://localhost:4000

The MySQL container loads the export from `Database/` on first start, so the
database arrives ready with 14 vacations and three users.

---

## Running locally

### 1. Database

Import `Database/vacations.sql` into MySQL (Workbench, or the command line):

```bash
mysql -u root -p < Database/vacations.sql
```

### 2. Backend

```bash
cd Backend
npm install
npm start
```

Runs on port 4000. Needs a `.env` file with the database credentials, the JWT
secret, the password salt and the OpenAI key.

### 3. Frontend

```bash
cd Frontend
npm install
npm run dev
```

Runs on port 5173.

---

## Test users

| Email | Password | Role |
|---|---|---|
| admin@vacations.com | admin1234 | Admin |
| john@vacations.com | john1234 | User |
| dana@vacations.com | dana1234 | User |

---

## Pages

**Everyone** — register, sign in.

**Registered users** — the vacations page (cards, 9 per page, filters for all /
liked / active / upcoming, like and unlike), an AI page that writes a travel guide
for any destination, and an MCP page that answers questions about the vacations in
the database.

**Admin** — add, edit and delete vacations, plus a reports page with a likes-per-
destination chart and a CSV download.

---

## API

| Method | Route | Access |
|---|---|---|
| POST | `/api/register` | public |
| POST | `/api/login` | public |
| GET | `/api/vacations` | user |
| GET | `/api/vacations/:id` | user |
| POST | `/api/vacations` | admin |
| PUT | `/api/vacations/:id` | admin |
| DELETE | `/api/vacations/:id` | admin |
| POST | `/api/vacations/like/:id` | user |
| DELETE | `/api/vacations/like/:id` | user |
| GET | `/api/vacations/images/:name` | public |
| GET | `/api/report` | admin |
| GET | `/api/report/csv` | admin |
| POST | `/api/ai/recommendations` | user |
| POST | `/api/mcp/vacations` | user |

The Postman collection is at `Backend/project3-vacations.json`.

---

## Tests

```bash
cd Backend
npm test
```

35 tests covering authentication, the vacations CRUD routes, likes, the reports
endpoints and every route guard.
