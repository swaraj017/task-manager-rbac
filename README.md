# Task Manager

A task management system with role-based access control. Admins can create workspaces and assign tasks to users. Users can view their assigned tasks and update status.

## Quick Start

1) Server
```bash
cd server
npm install
# create a .env file (see Environment) then run
npm run dev
```
Runs on http://localhost:5000

2) Client
```bash
cd client
npm install
npm run dev
```

Backend runs on localhost:5000
Frontend runs on localhost:5173


## Admin Login

Email: swaraj@gmail.com
Password: 123


## Here u can check Demo User Login- who have tasks!

Email: yash@gmail.com
password:123

## How It Works

Admin can:
- Create workspaces
- Create and assign tasks to users
- Manage task status
- Delete tasks

Users can:
- View assigned tasks
- Update task status (Pending → In Progress → Completed)
- Filter tasks by status

## Tech Stack

- Backend: Node.js, Express, MongoDB, JWT, bcryptjs
- Frontend: React, Vite, Tailwind CSS

## API (base path: /api)

Auth:
- POST /api/auth/register
- POST /api/auth/login
- GET  /api/auth/profile

Workspaces:
- POST   /api/workspaces           (admin)
- GET    /api/workspaces
- PATCH  /api/workspaces/:id       (admin)
- DELETE /api/workspaces/:id       (admin)
- GET    /api/workspaces/:id/tasks

Tasks:
- POST   /api/tasks/:workspaceId   (admin)
- GET    /api/tasks/my-tasks
- PATCH  /api/tasks/:id/status
- DELETE /api/tasks/:id            (admin)

## Database Models

- User: name, email, password, role
- Workspace: name, createdBy, isActive
- Task: title, description, status, assignedTo, workspace

## Notes on Scalability

- Add indexes on workspace, assignedTo fields
- Implement caching for frequently accessed reads
- Split frontend/backend deployments; use load balancing as needed

## Security

- JWT auth with 1-day expiration
- Passwords hashed with bcryptjs
- Admin routes protected with middleware
