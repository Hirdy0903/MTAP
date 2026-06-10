1. Project Overview
# Jira-Like Multi-Tenant SaaS Backend

This is my first serious backend engineering project.

The goal of this project was not to clone Jira completely but to learn:

- Backend Architecture
- Authentication
- JWT
- Authorization
- Multi-Tenancy
- RBAC
- Middleware Design
- MongoDB Relationships
- SaaS Architecture

Tech Stack:
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
2. What I Built Chronologically

Ye sabse important section hai.

Phase 1
│
├── Express Setup
├── MongoDB Connection
├── Environment Variables
├── server.js
└── app.js

Learned:
- Server startup flow
- Express application flow

↓

Phase 2
│
├── asyncHandler
└── Error Middleware

Learned:
- Async error handling
- Express middleware chain

↓

Phase 3
│
├── User Model
├── Signup API
├── Login API
├── Password Hashing
└── JWT Generation

Learned:
- Authentication
- Password Security

↓

Phase 4
│
├── Auth Middleware
└── Protected Routes

Learned:
- JWT Verification
- Authorization Headers
- req.user

↓

Phase 5
│
├── Organization Model
├── Membership Model
├── Create Organization API
└── Get Organizations API

Learned:
- Multi-Tenancy
- SaaS Data Isolation

↓

Phase 6
│
├── Organization Middleware
├── Role Middleware
└── RBAC

Learned:
- Access Control
- Tenant Security

↓

Phase 7
│
├── Project Model
├── Create Project
├── Get Projects
├── Update Project
└── Delete Project

Learned:
- Nested Resources
- Tenant Filtering

↓

Phase 8
│
├── Issue Model
├── Create Issue
├── Get Issues
├── Update Issue
└── Delete Issue

Learned:
- Jira Core Functionality
3. Folder Structure
backend/
│
├── config/
│   └── db.js
│
├── middlewares/
│   ├── auth.middleware.js
│   ├── organization.middleware.js
│   ├── role.middleware.js
│   └── error.middleware.js
│
├── modules/
│   ├── auth/
│   ├── organizations/
│   ├── projects/
│   └── issues/
│
├── utils/
│   └── asyncHandler.js
│
├── app.js
└── server.js
4. Complete Request Lifecycle
Client
  │
  ▼
app.js
  │
  ▼
Route
  │
  ▼
Middleware
  │
  ▼
Controller
  │
  ▼
Model
  │
  ▼
MongoDB
  │
  ▼
Response
5. Authentication Flow
Signup
   │
   ▼
Hash Password
   │
   ▼
Store User
Login
   │
   ▼
Find User
   │
   ▼
Compare Password
   │
   ▼
Generate JWT
   │
   ▼
Return Token
Protected Route
   │
   ▼
Auth Header
   │
   ▼
Verify JWT
   │
   ▼
Find User
   │
   ▼
Attach req.user
6. Multi-Tenancy Flow
User
 │
 ▼
Organization
 │
 ▼
Membership
 │
 ▼
Role
 │
 ▼
Projects
 │
 ▼
Issues
7. Database Relationships
User
 │
 │ 1:N
 ▼
Membership
 │
 │ N:1
 ▼
Organization
 │
 │ 1:N
 ▼
Project
 │
 │ 1:N
 ▼
Issue
8. Why Membership Model Exists

Problem:

One User
can belong to
multiple organizations

Solution:

User
 │
 ▼
Membership
 │
 ▼
Organization

Membership stores:

userId
organizationId
role
9. RBAC Flow
Request
 │
 ▼
Organization Middleware
 │
 ▼
Membership Found
 │
 ▼
roleMiddleware
 │
 ├── admin
 │      ▼
 │   Allow
 │
 └── member
        ▼
   Restrict
10. Project Module
createProject()

Purpose:

Create project inside organization.

Learned:

RBAC
Tenant Isolation
getProjects()

Purpose:

Get organization projects.

Learned:

Tenant Filtering
getSingleProject()

Purpose:

Secure project access.

Learned:

IDOR Prevention
updateProject()

Purpose:

Modify project.
deleteProject()

Purpose:

Delete project.
11. Issue Module
createIssue()

Purpose:

Create issue inside project.
getIssues()

Purpose:

Get all project issues.
getSingleIssue()

Purpose:

Secure issue access.
updateIssue()

Purpose:

Update issue.
deleteIssue()

Purpose:

Delete issue.
12. Most Important Concepts Learned
JWT
Login
→ Generate Token
→ Send Token
→ Verify Token
→ req.user
Multi-Tenancy
organizationId

is used to isolate tenant data.

RBAC
membership.role

controls permissions.

Middleware Chaining
Request
│
├── Auth Middleware
├── Organization Middleware
├── Role Middleware
└── Controller
Tenant Filtering

Always:

{
   _id: resourceId,
   organization: organizationId
}

Never:

findById(resourceId)

alone.

13. Revision Order (MOST IMPORTANT)

Whenever revisiting project:

1. server.js
2. app.js
3. db.js
4. asyncHandler.js
5. error.middleware.js

AUTH
6. auth.model.js
7. auth.controller.js
8. auth.routes.js
9. auth.middleware.js

MULTI TENANCY
10. organization.model.js
11. membership.model.js
12. organization.controller.js
13. organization.middleware.js

RBAC
14. role.middleware.js

PROJECTS
15. project.model.js
16. project.controller.js
17. project.routes.js

ISSUES
18. issue.model.js
19. issue.controller.js
20. issue.routes.js
14. Future Improvements
Validation
Pagination
Rate Limiting
Helmet
Redis
File Uploads
Notifications
Caching
Final Learning Outcome
✔ Backend Architecture
✔ JWT Authentication
✔ Authorization
✔ Middleware Design
✔ MongoDB Relationships
✔ Multi-Tenancy
✔ RBAC
✔ SaaS Backend Thinking
✔ Nested Routing
✔ Secure API Design

