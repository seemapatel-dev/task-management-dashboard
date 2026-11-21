# Task Management Dashboard

A full-stack task management application with a Vue 3 frontend and Django REST Framework backend. Users can register, sign in, manage tasks, organize work into projects, and view a dashboard.

## Features

- User registration and email/password login
- JWT-based authentication
- Personal task list with create, view, update, and delete operations
- Task status, priority, project name, description, and due date
- Dashboard summary of task status and priority
- Project organization and workspace preferences in the frontend
- Responsive single-page application using Vue Router

> **Current implementation note:** Tasks are stored through the authenticated backend API. Projects and workspace settings are currently stored in browser local storage, so they do not sync between browsers or devices.

## Technology stack

**Frontend**
- Vue 3
- TypeScript
- Vue Router
- Vite

**Backend**
- Python
- Django
- Django REST Framework
- Simple JWT
- PostgreSQL support via `dj-database-url` and `psycopg2-binary`

## Repository structure

```text
.
├── backend/
│   ├── config/       # Django project configuration
│   ├── tasks/        # User and task models, serializers, API views
│   ├── requirements.txt
│   └── vercel.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── router/
    │   ├── views/
    │   ├── api.ts
    │   └── stores.ts
    ├── package.json
    └── vercel.json
```

## Run locally

### Requirements

- Python and pip (use a version supported by the pinned Django release)
- Node.js and npm
- A PostgreSQL database, or another database configured for Django

### 1. Backend

Open a terminal:

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment:

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
pip install -r requirements.txt
```

Create a `.env` file in the backend directory. Generate a new development secret key with:

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Add the generated value and your database connection to `.env`:

```env
DJANGO_DEBUG=True
DJANGO_SECRET_KEY=paste-the-generated-key-here
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
FRONTEND_ORIGINS=http://localhost:5173
CSRF_TRUSTED_ORIGINS=http://localhost:5173
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE_NAME
```

Then run database migrations and start the development server:

```bash
python manage.py migrate
python manage.py runserver
```

The backend will normally be available at `http://127.0.0.1:8000`.

### 2. Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite prints the local frontend URL in the terminal (normally `http://localhost:5173`).

The frontend API base URL is currently configured in `frontend/src/api.ts`. For local development, make sure it points to your local backend API at `http://127.0.0.1:8000/api`.

## API endpoints

The backend routes are defined under `/api/`.

| Method | Endpoint | Purpose | Authentication |
|---|---|---|---|
| POST | `/api/auth/register/` | Register a user | No |
| POST | `/api/auth/login/` | Obtain JWT tokens | No |
| POST | `/api/auth/token/refresh/` | Refresh an access token | Refresh token |
| GET | `/api/auth/me/` | Get the signed-in user | Yes |
| GET | `/api/tasks/` | List the signed-in user's tasks | Yes |
| POST | `/api/tasks/` | Create a task | Yes |
| GET | `/api/tasks/<id>/` | Retrieve a task | Yes |
| PUT/PATCH | `/api/tasks/<id>/` | Update a task | Yes |
| DELETE | `/api/tasks/<id>/` | Delete a task | Yes |

Authenticated requests use the header:

```http
Authorization: Bearer <access_token>
```

## Deployment environment variables

Configure these variables in the backend deployment environment before deploying:

- `DJANGO_SECRET_KEY`: a newly generated, private secret key. Do not reuse the key that was previously committed.
- `DJANGO_DEBUG=False`
- `DJANGO_ALLOWED_HOSTS`: comma-separated exact backend hostnames (without `https://`).
- `FRONTEND_ORIGINS`: comma-separated exact frontend origins, including `https://`.
- `CSRF_TRUSTED_ORIGINS`: comma-separated trusted origins, including `https://`.
- `DATABASE_URL`: the production database connection string.

The application intentionally fails to start in production if `DJANGO_SECRET_KEY` is missing. This is safer than silently using a known fallback key. Make sure all required variables are configured in the hosting provider before deploying.

## Security notes

- The previous Django secret key was committed to source control. Treat it as exposed: generate a new key, update the deployment environment, and never reuse the old value.
- Restrict allowed hosts and CORS origins to the actual deployed domains.
- The temporary public CORS-debug endpoint has been removed.
- Keep database credentials and all other secrets out of source control.
- Configure HTTPS and review authentication, CSRF, and JWT settings before using real user data.

## Development

Issues and pull requests are welcome. Please include reproduction steps for bug reports and tests for behavior changes.

## License

No license has been added yet. Until a license is selected, the repository's code should not be assumed to be available for reuse or redistribution.
