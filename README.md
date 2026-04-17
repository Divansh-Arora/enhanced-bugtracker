# BugTracker MERN — Enhanced v2.0

A full-stack bug tracking application built with MongoDB, Express, React, and Node.js.

## ✨ New Features in v2.0

### Team Management
- Add team members to projects by email
- Remove members from projects
- Dedicated **Team** page showing all users and their project associations

### Ticket Assignment
- Assign tickets to specific team members
- Unassign by clicking the avatar on a ticket
- Assignee dropdown shows only project members

### Enhanced UI
- **Kanban board** view with To Do / In Progress / Done columns
- **List view** toggle for compact overview
- Dark, professional design with Sora + DM Sans fonts
- Animated project cards with color-coded accents
- Color-coded priority badges and status indicators
- Avatar system with generated colors per user
- Progress bar on profile page
- Modal dialogs for project creation and team management
- Responsive grid layouts

## 🚀 Getting Started

### Backend
```bash
cd backend
npm install
# Create .env with MONGO_URI and JWT_SECRET
npm start
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## 🗂 Project Structure

```
backend/
  models/
    User.js          — name, email, password
    Project.js       — title, description, userId, members[]
    Ticket.js        — title, description, priority, status, projectId, assignedTo
  routes/
    userRoutes.js    — register, login, search, getAll, getById
    projectRoutes.js — create, getAll, getById, addMember, removeMember
    ticketRoutes.js  — create, getByProject, getAll, update, delete

frontend/src/
  App.js        — Layout, Sidebar, Avatar component
  Login.js      — Sign in / Sign up
  Project.js    — Project grid, create modal, team modal
  Ticket.js     — Kanban board + list view, ticket assignment
  Team.js       — All users with project counts
  Profile.js    — User stats, progress, projects, recent tickets
  index.css     — Global design tokens and utility classes
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/users/register | Register user |
| POST | /api/users/login | Login |
| GET | /api/users/search?email= | Search users |
| GET | /api/users | Get all users |
| POST | /api/projects/create | Create project |
| GET | /api/projects | Get all projects |
| GET | /api/projects/:id | Get project by ID |
| POST | /api/projects/:id/members | Add member by email |
| DELETE | /api/projects/:id/members/:userId | Remove member |
| POST | /api/tickets/create | Create ticket |
| GET | /api/tickets/:projectId | Get tickets by project |
| GET | /api/tickets/all | Get all tickets |
| PUT | /api/tickets/:id | Update status/assignee |
| DELETE | /api/tickets/:id | Delete ticket |
