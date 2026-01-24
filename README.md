# Task Manager

A task management system with role-based access control. Admins can create workspaces and assign tasks to users. Users can view their assigned tasks and update status.

## Setup

Install dependencies and run:

```bash
cd server
npm install
npm run dev

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

## Tech Used

Node.js, Express,JWT,Bcryptjs MongoDB, React, Vite, Tailwind CSS

## API

Auth:
- POST /auth/register
- POST /auth/login
- GET /auth/profile

Workspaces:
- POST /workspaces (admin)
- GET /workspaces
- PATCH /workspaces/:id (admin)
- DELETE /workspaces/:id (admin)
- GET /workspaces/:id/tasks

Tasks:
- POST /tasks/:workspaceId (admin)
- GET /tasks/my-tasks
- PATCH /tasks/:id/status
- DELETE /tasks/:id (admin)



## Database

MongoDB with collections for users, workspaces, and tasks.

User: name, email, password, role
Workspace: name, createdBy, isActive
Task: title, description, status, assignedTo, workspace


## Scalability

Current system uses single MongoDB instance and Express server. To scale: add database indexing on workspace and user fields for faster queries, implement API caching for frequently accessed data, separate frontend and backend into different servers, use load balancing if traffic increases.


## Security

JWT authentication with 1-day expiration. Passwords hashed with bcryptjs. Admin routes protected with middleware.
