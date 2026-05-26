# MPloyChek - Background Verification SPA

Full-stack Angular 14 + Node.js application for background verification workflow management.

## Tech Stack
- **Frontend**: Angular 14, TypeScript, SCSS, RxJS
- **Backend**: Node.js, Express.js, JWT Auth, bcryptjs
- **Architecture**: Modular Angular (AuthModule, DashboardModule, AdminModule, SharedModule)

## Setup & Run

### Prerequisites
- Node.js 16+

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Start Backend (port 3000)
```bash
cd backend
node server.js
```

### 3. Serve Frontend (port 4200)
The app is pre-built. Serve the dist folder:
```bash
cd frontend
npx http-server dist/frontend -p 4200 --cors -o
```

### OR use the startup script:
```bash
./start.sh
```

## Demo Credentials

| Role         | Email                    | Password   |
|-------------|--------------------------|------------|
| Admin        | admin@mploychek.com      | Admin@123  |
| General User | ayush@mploychek.com      | User@123   |
| General User | priya@mploychek.com      | User@123   |

## Features

### Login Page
- Reactive Form with full validation (email, password, min length)
- Role selector (General User / Admin)
- Show/hide password toggle
- API Delay slider (0–3000ms) to demonstrate async processing
- Quick-fill demo buttons
- JWT token stored in localStorage

### Dashboard (All Users)
- User profile card with name, role, department
- Verification records table with:
  - Search by candidate name / position
  - Filter by status (All, Verified, Pending, In Progress, Failed)
  - Sortable columns (click headers)
  - Visual status badges and risk indicators
  - Progress bar for checks completed
- API delay slider for async demo (re-fetches with delay)
- Admin sees all records; General Users see only their assigned records
- Admin stats cards (total, verified, pending, failed, users)

### Admin Panel (Admin only)
- Full user list with role, department, join date
- Create new users with validation
- Delete users (non-admin only)
- Protected by AdminGuard + AuthGuard

## Architecture

```
frontend/src/app/
├── models/           # User, VerificationRecord, DashboardStats interfaces
├── services/         # AuthService, RecordsService, UserService, LoadingService
├── guards/           # AuthGuard, AdminGuard
├── interceptors/     # AuthInterceptor (JWT), LoadingInterceptor (global loader)
├── auth/login/       # Login component
├── dashboard/        # Dashboard component
├── admin/            # Admin panel component
└── shared/           # Navbar, LoadingSpinner
```

## API Endpoints

| Method | Endpoint          | Auth     | Description              |
|--------|-------------------|----------|--------------------------|
| POST   | /api/auth/login   | —        | Login, returns JWT       |
| GET    | /api/auth/me      | JWT      | Get current user profile |
| GET    | /api/records      | JWT      | Get verification records |
| GET    | /api/users        | Admin    | List all users           |
| POST   | /api/users        | Admin    | Create user              |
| DELETE | /api/users/:id    | Admin    | Delete user              |
| GET    | /api/stats        | Admin    | Dashboard statistics     |

All GET endpoints support `?delay=<ms>` parameter for async demo.
