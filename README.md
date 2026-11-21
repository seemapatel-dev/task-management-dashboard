# Task Management Dashboard

A full-stack task management application built with Vue 3, TypeScript, Django, and Django REST Framework. Users can create an account, manage personal tasks, organize work into projects, and customize workspace preferences.

## Features

- Email-based registration and JWT authentication
- Personal task creation, editing, completion, and deletion
- Task priority, status, project label, and due date
- Dashboard and calendar views
- Project organization
- Per-user workspace preferences
- Responsive Vue single-page application

**Data persistence:** Tasks are stored in the Django backend. Projects and preferences currently use browser local storage, so they remain on that browser and do not synchronize across devices. This is a known limitation.

## Technology

| Layer | Stack |
|---|---|
| Frontend | Vue 3, TypeScript, Vue Router, Vite |
| Backend | Python, Django, Django REST Framework |
| Authentication | Simple JWT |
| Database | PostgreSQL in deployment; SQLite can be used for local development |
| Hosting configuration | Vercel |

## Repository layout

```text
.
├── .github/workflows/ci.yml
├── backend/
│   ├── config/
│   ├── tasks/
│   ├── requirements.txt
│   └── vercel.json
└── frontend/
    ├── src/
    ├── package.json
    └── vercel.json
```

## Run locally

### Prerequisites

- Python 3.12 (or a version supported by the pinned Django release)
- Node.js 22 and npm
- A database; SQLite is suitable for local development

### Backend

```bash
cd backend
python -m venv .venv
```

Activate the environment:

**Windows PowerShell**
```powershell
.venv\Scripts\Activate.ps1
```

**macOS/Linux**
```bash
source .venv/bin/activate
```

Install dependencies:

```bash
python -m pip install -r requirements.txt
```

Create `.env` inside `backend/` with a development secret and database URL:

```env
DJANGO_DEBUG=True
DJANGO_SECRET_KEY=replace-with-a-new-local-development-secret
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
FRONTEND_ORIGINS=http://localhost:5173
CSRF_TRUSTED_ORIGINS=http://localhost:5173
DATABASE_URL=sqlite:///db.sqlite3
```

Generate a secret for local use with:

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Run migrations and start Django:

```bash
python manage.py migrate
python manage.py runserver
```

The API is available at `http://127.0.0.1:8000/api/`.

### Frontend

In a separate terminal:

```bash
cd frontend
npm ci
npm run dev
```

Vite normally serves the app at `http://localhost:5173`.

The frontend reads its API root from `VITE_API_BASE_URL`. Set it in `frontend/.env.local` for local development:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

If it is not set, the current deployed backend URL is used as the fallback.

## API overview

All endpoints are under `/api/`.

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| POST | `auth/register/` | Create an account | No |
| POST | `auth/login/` | Obtain JWT tokens | No |
| POST | `auth/token/refresh/` | Refresh an access token | Refresh token |
| GET | `auth/me/` | Current user profile | Yes |
| GET, POST | `tasks/` | List or create the signed-in user's tasks | Yes |
| GET, PUT, PATCH, DELETE | `tasks/<id>/` | Read or modify one of the signed-in user's tasks | Yes |

Send authenticated requests with:

```http
Authorization: Bearer <access_token>
```

## Deployment configuration

Configure these variables in the backend hosting environment. Do not commit real secrets.

| Variable | Purpose |
|---|---|
| `DJANGO_SECRET_KEY` | Newly generated private Django secret |
| `DJANGO_DEBUG` | Set to `False` in production |
| `DJANGO_ALLOWED_HOSTS` | Comma-separated exact backend hostnames, without scheme |
| `FRONTEND_ORIGINS` | Comma-separated exact frontend origins, including `https://` |
| `CSRF_TRUSTED_ORIGINS` | Comma-separated trusted origins, including `https://` |
| `DATABASE_URL` | Production database connection string |

For the frontend deployment, set `VITE_API_BASE_URL` to the deployed backend API root, ending in `/api`.

The previously committed Django secret must be considered exposed. Generate a replacement and update the hosting environment before deploying the security changes. If the old commented database password was ever real or reused, rotate it too.

## Quality checks

The GitHub Actions workflow runs:

- Django system checks and backend API tests
- Frontend dependency installation, TypeScript checking, and production build

Run the same checks locally:

```bash
cd backend
python manage.py check
python manage.py test
```

```bash
cd frontend
npm ci
npm run build
```

## Known limitations and roadmap

- Projects and preferences are browser-local; backend persistence and multi-device sync are future work.
- Add profile editing and complete account-management flows.
- Expand tests for validation, task updates/deletion, and session expiration.
- Add a project license before inviting reuse or redistribution.
- Add screenshots and a hosted demo link after verifying the public deployment.

## Contributing

Bug reports and pull requests are welcome. Please include steps to reproduce bugs and tests for behavior changes. Keep credentials, access tokens, and personal data out of issues and commits.

## License

No license has been selected yet. Until a license is added, others do not automatically have permission to reuse, modify, or redistribute this code.
