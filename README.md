# MPloyChek - Background Verification SPA

A full-stack Single Page Application built with **Angular 14** and **Node.js / Express**, featuring role-based authentication, async API demonstration, and user management , built for the MPloyChek internship code challenge.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Angular 14, TypeScript, SCSS, RxJS, Reactive Forms |
| Backend | Node.js, Express.js 5 |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Storage | In-memory (Node.js runtime , no DB setup needed) |
| Blockchain sim | UUID-based record IDs |

---

## Project Structure

```
mploychek-final/
│
├── backend/                        # Node.js + Express API server
│   ├── server.js                   # All API routes, auth, data
│   ├── package.json
│   └── node_modules/               # Pre-installed, ready to use
│
├── frontend-dist/                  # Pre-built Angular production bundle
│   └── frontend/
│       ├── index.html
│       ├── main.*.js
│       ├── polyfills.*.js
│       ├── runtime.*.js
│       └── styles.*.css
│
├── frontend-src/                   # Full Angular source code
│   └── app/
│       ├── models/
│       │   ├── user.model.ts       # User, LoginRequest, LoginResponse interfaces
│       │   └── record.model.ts     # VerificationRecord, DashboardStats interfaces
│       ├── services/
│       │   ├── auth.service.ts     # Login, logout, JWT, BehaviorSubject user state
│       │   ├── records.service.ts  # Fetch verification records + stats
│       │   ├── user.service.ts     # CRUD users (Admin only)
│       │   └── loading.service.ts  # Global loading state (BehaviorSubject)
│       ├── guards/
│       │   ├── auth.guard.ts       # Redirects unauthenticated to /login
│       │   └── admin.guard.ts      # Redirects non-admins to /dashboard
│       ├── interceptors/
│       │   ├── auth.interceptor.ts     # Injects Bearer token on every request
│       │   └── loading.interceptor.ts  # Shows/hides global top loading bar
│       ├── auth/login/             # Login page component
│       ├── dashboard/dashboard/    # Main dashboard component
│       ├── admin/admin-panel/      # Admin user management component
│       └── shared/
│           ├── navbar/             # Top navigation bar
│           └── loading-spinner/    # Global animated loading bar
│
├── angular.json                    # Angular workspace config
├── tsconfig.json                   # TypeScript config (skipLibCheck: true)
├── frontend-package.json           # Frontend npm dependencies
├── start.sh                        # One-command startup script
└── README.md
```

---

## Prerequisites

- **Node.js** v16 or higher (tested on v22)
- **npm** v8 or higher
- **http-server** (for serving the pre-built frontend)

---

## Quick Start (Recommended)

### Step 1 - Install http-server globally (one time only)

```bash
npm install -g http-server
```

### Step 2 - Start the backend

Open a terminal and run:

```bash
cd mploychek-final/backend
node server.js
```

You should see:
```
MPloyChek API running on http://localhost:3000
```

### Step 3 - Serve the frontend

Open a **second terminal** and run:

```bash
cd mploychek-final
http-server frontend-dist/frontend -p 4200 --cors
```

### Step 4 - Open the app

Visit **http://localhost:4200** in your browser.

---

## OR - One-Command Start (uses both terminals automatically)

```bash
cd mploychek-final
chmod +x start.sh
./start.sh
```

Then open **http://localhost:4200**

Press `Ctrl+C` to stop both servers.

---

## Demo Login Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | admin@mploychek.com | Admin@123 |
| General User | ayush@mploychek.com | User@123 |
| General User | priya@mploychek.com | User@123 |

---

## Features Walkthrough

### 1. Login Page (`/login`)

- **Reactive Form** with `FormBuilder` and `Validators` , validates email format, required fields, and minimum password length (6 chars)
- **Role selector** , dropdown for `General User` / `Admin` (display only; actual role comes from the API)
- **Show/Hide password** toggle button
- **Quick-fill buttons** , pre-fills Admin or User credentials for demo
- **API Delay slider** (0ms → 3000ms in 500ms steps) , sends `?delay=<ms>` to the login API to demonstrate async processing; the submit button shows a spinner during the wait
- **Error banner** , displays server error messages (wrong password, user not found)
- JWT token and user object stored in `localStorage` on successful login

### 2. Dashboard (`/dashboard`) - All Logged-In Users

- **User profile header** , shows name, avatar initials, role, and department pulled from the JWT/profile API
- **API Delay slider** , same concept as login; drag to add delay, click Refresh to re-fetch records and observe the shimmer loading state
- **Admin Stats Cards** (Admin only) , live counts for Total Records, Verified, Pending, Failed, and Total Users
- **Verification Records Table:**
  - **Search** , filters by candidate name or position in real time
  - **Status filter** , dropdown to filter by All / Verified / Pending / In Progress / Failed
  - **Sortable columns** , click any column header (Candidate, Position, Status) to sort ascending/descending
  - **Status badges** , colour-coded pills (green = Verified, yellow = Pending, blue = In Progress, red = Failed)
  - **Risk indicators** , coloured dot + label (green = Low, yellow = Medium, red = High)
  - **Checks progress bar** , visual bar showing how many of 5 checks are complete
  - **Access control** , Admin sees all 8 records; General Users see only their 3 assigned records
- **Global loading bar** , an animated orange shimmer bar at the top of the page fires on every HTTP request via the `LoadingInterceptor`

### 3. Admin Panel (`/admin`) - Admin Only

- **Double-guarded route** , `AuthGuard` checks login, `AdminGuard` checks role; non-admins are redirected to `/dashboard`
- **Users table** , lists all users with name, email, role badge, department, and join date
- **Create User form** (toggle with "+ Add User" button):
  - Full validation: required name, valid email, password min 6 chars
  - Fields: Full Name, Email, Password, Department (Engineering / Operations / Management / HR / Finance), Role
  - Success/error banners on submission
  - User list refreshes automatically after creation
- **Delete user** , trash icon button; disabled for Admin accounts; confirmation dialog before deletion

---

## API Reference

Base URL: `http://localhost:3000`

All protected endpoints require the header:
```
Authorization: Bearer <jwt_token>
```

All `GET` endpoints accept an optional `?delay=<milliseconds>` query parameter to simulate slow responses.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | None | Login. Body: `{ userId, password }`. Returns `{ token, user }` |
| `GET` | `/api/auth/me` | JWT | Returns the current user's profile |
| `GET` | `/api/records` | JWT | Returns records. Admin gets all 8; General User gets their assigned 3 |
| `GET` | `/api/users` | Admin | Returns all users (passwords excluded) |
| `POST` | `/api/users` | Admin | Creates a new user. Body: `{ userId, password, name, role, department }` |
| `DELETE` | `/api/users/:id` | Admin | Deletes a user by ID. Cannot delete Admin accounts |
| `GET` | `/api/stats` | Admin | Returns aggregate counts: `{ totalRecords, verified, pending, inProgress, failed, totalUsers }` |

### Example - Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"userId":"admin@mploychek.com","password":"Admin@123"}'
```

### Example - Get Records with 1s delay

```bash
curl http://localhost:3000/api/records?delay=1000 \
  -H "Authorization: Bearer <your_token>"
```

---

## Angular Architecture Details

### Routing

```typescript
{ path: '',         redirectTo: 'login',     pathMatch: 'full' }
{ path: 'login',    component: LoginComponent }
{ path: 'dashboard',component: DashboardComponent, canActivate: [AuthGuard] }
{ path: 'admin',    component: AdminPanelComponent, canActivate: [AuthGuard, AdminGuard] }
{ path: '**',       redirectTo: 'login' }
```

### HTTP Interceptors

**AuthInterceptor** , Clones every outgoing request and injects the stored JWT as a `Bearer` token header automatically, so individual service calls never handle auth headers manually.

**LoadingInterceptor** , Calls `LoadingService.show()` when a request starts and `LoadingService.hide()` in the `finalize()` operator when it completes or errors. `LoadingService` uses a request counter (not a boolean) so concurrent requests don't prematurely hide the bar.

### State Management

`AuthService` exposes `currentUser$` as a `BehaviorSubject<User | null>`. Components subscribe to this to reactively update the navbar and dashboard when the user logs in or out. No external state library is needed.

### Async Processing Demo

The delay mechanism works end-to-end:
1. UI slider sets `apiDelay` (number in ms)
2. Service passes it as `?delay=<ms>` query param
3. Express `withDelay` middleware calls `setTimeout(next, delay)` before executing the handler
4. `LoadingInterceptor` keeps the loading bar visible for the full duration
5. The shimmer animation in the table shows while `loadingRecords = true`

---

## Rebuild Frontend from Source (Optional)

If you want to modify and rebuild the Angular app:

```bash
# Install Angular CLI globally
npm install -g @angular/cli@14

# Install frontend dependencies
cd mploychek-final
npm install --prefix . --package-lock=false
# OR copy frontend-package.json to package.json and run npm install

# Serve in development mode (requires backend running on :3000)
cd frontend-src
ng serve --port 4200

# Or build for production
ng build --configuration=production
```

---

## Evaluation Criteria Mapping

| Criterion | Implementation |
|---|---|
| Angular framework & libraries | Reactive Forms, RouterModule, HttpClientModule, FormsModule, RxJS operators (`tap`, `finalize`, `BehaviorSubject`), Angular CLI project structure |
| API & cloud framework knowledge | RESTful Express API, JWT auth, bcrypt password hashing, role-based middleware, query-param async delay simulation |
| UI aspects | Custom dark theme, animated loading bar, shimmer skeletons, responsive table, status badges, animated blobs on login, CSS transitions |
| Clean code architecture | Feature modules, dedicated services per domain, interceptor pattern, guard pattern, TypeScript interfaces for all models, SCSS component encapsulation |
| Creative design | Original dark orange brand theme matching MPloyChek's colour palette, no copied templates |

---

*Built by Ayush Sinha , MPloyChek Software Engineer Intern Code Challenge*