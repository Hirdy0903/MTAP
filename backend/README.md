Jira-Like SaaS MVP Backend — Complete Learning Flow
Project Goal
# Architecture Decisions
- Feature-based modular backend architecture
- Multi-tenant SaaS design using organizationId
- Membership model for RBAC
- Nested routes for tenant resources
- Middleware-driven security flow
- MongoDB + Mongoose for flexible schema design

This project is a beginner-friendly but real-world multi-tenant SaaS backend inspired by Jira.

Main learning goals:

Backend architecture
Authentication
JWT flow
Multi-tenancy
RBAC
Middleware flow
Secure APIs
SaaS backend engineering



# Features

- JWT Authentication
- Multi-Tenant Architecture
- Organization-Based SaaS Structure
- RBAC (Role-Based Access Control)
- Projects CRUD
- Issues CRUD
- Nested Routing
- Tenant Isolation
- Secure Middleware-Based APIs


Also Add API Flow Diagram

Client Request
    ↓
Routes
    ↓
Auth Middleware
    ↓
Organization Middleware
    ↓
Role Middleware
    ↓
Controller
    ↓
MongoDB
    ↓
Response

Tech stack:

Node.js
Express
MongoDB
Mongoose
JWT
bcrypt
FINAL PROJECT STRUCTURE
backend/
└── src/
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
    │   │   ├── auth.model.js
    │   │   ├── auth.controller.js
    │   │   └── auth.routes.js
    │   │
    │   ├── organizations/
    │   │   ├── organization.model.js
    │   │   ├── membership.model.js
    │   │   ├── organization.controller.js
    │   │   └── organization.routes.js
    │   │
    │   ├── projects/
    │   │   ├── project.model.js
    │   │   ├── project.controller.js
    │   │   └── project.routes.js
    │   │
    │   └── issues/
    │       ├── issue.model.js
    │       ├── issue.controller.js
    │       └── issue.routes.js
    │
    ├── utils/
    │   └── asyncHandler.js
    │
    ├── app.js
    └── server.js
HOW TO REVISIT THIS PROJECT

Whenever revisiting:

DO NOT randomly open files.

Follow this exact flow.

This flow teaches backend architecture step-by-step.

STEP 1 — SERVER ENTRY POINT
Read:
server.js
Learn:
How server starts
How MongoDB connects
How app listens on port

Understand:

server starts from here
STEP 2 — EXPRESS APP FLOW
Read:
app.js
Learn:
Middleware registration
Route mounting
Request flow
Global error handling

Understand:

every request enters app.js first
STEP 3 — DATABASE CONNECTION
Read:
config/db.js
Learn:
Mongoose connection
Environment variables
MongoDB startup

Understand:

backend connects database here
STEP 4 — ASYNC HANDLER
Read:
utils/asyncHandler.js
MOST IMPORTANT BEGINNER CONCEPT

Learn:

Why try/catch repetition is bad
Async error handling
Express next(error)

Understand:

asyncHandler automatically catches async errors
STEP 5 — GLOBAL ERROR MIDDLEWARE
Read:
middlewares/error.middleware.js
Learn:
Centralized error handling
Express error middleware
Status codes

Understand:

all backend errors finally come here
STEP 6 — AUTH MODULE

Read in order:

6.1 auth.model.js
Learn:
User schema
Password field
timestamps

Understand:

this defines how users are stored
6.2 auth.controller.js
Learn:
Signup flow
Login flow
bcrypt hashing
JWT generation

MOST IMPORTANT:

password is hashed before saving

and:

JWT token generated during login
6.3 auth.routes.js
Learn:
Express router
API routes
Controller connection

Understand:

routes connect requests to controllers
STEP 7 — JWT AUTH MIDDLEWARE
Read:
middlewares/auth.middleware.js
VERY IMPORTANT CONCEPT

Learn:

Authorization headers
JWT verification
req.user attachment

Understand deeply:

token
→ verify
→ fetch user
→ attach req.user

This is core backend authentication flow.

STEP 8 — ORGANIZATIONS MODULE

This is where multi-tenancy starts.

Read in order:

8.1 organization.model.js
Learn:
Organization schema
Tenant concept

Understand:

every company/team becomes an organization
8.2 membership.model.js
MOST IMPORTANT MULTI-TENANT FILE
Learn:
User ↔ organization relationship
Role storage
RBAC architecture

Understand deeply:

membership controls tenant access

and:

one user can belong to multiple organizations
8.3 organization.controller.js
Learn:
Create organization
Get user organizations

Understand:

organization APIs start tenant system
8.4 organization.routes.js
Learn:
Route structure
Nested resource mounting
STEP 9 — ORGANIZATION MIDDLEWARE
Read:
middlewares/organization.middleware.js
ONE OF THE MOST IMPORTANT FILES
Learn:
Membership verification
Tenant access validation
req.organization
req.membership

Understand deeply:

user must belong to organization

This is real SaaS security.

STEP 10 — ROLE MIDDLEWARE (RBAC)
Read:
middlewares/role.middleware.js
Learn:
Role-based access control
Admin/member permissions

Understand:

RBAC controls what user can do

Example:

admin can create project
member cannot
STEP 11 — PROJECTS MODULE

Read in order:

11.1 project.model.js
Learn:
Project schema
organization field
createdBy

MOST IMPORTANT:

organization field enables tenant isolation
11.2 project.controller.js
Learn:
CRUD operations
Tenant filtering
Secure Mongo queries

MOST IMPORTANT CONCEPT:

Never:

findById()

alone in SaaS apps.

Always:

_id + organization

Example:

Project.findOne({
   _id: projectId,
   organization: organizationId
})

This prevents cross-tenant access.

11.3 project.routes.js
Learn:
Nested routes
Middleware chaining

Understand request flow:

auth
→ organization
→ role
→ controller
STEP 12 — ISSUES MODULE

This becomes the actual Jira-like functionality.

Read in order:

12.1 issue.model.js
Learn:
Status enums
Priority enums
Assignee system

Understand:

issues are actual work items
12.2 issue.controller.js
Learn:
Issue CRUD
Tenant-safe issue queries
Project validation

MOST IMPORTANT:

issue belongs to BOTH organization and project
12.3 issue.routes.js
Learn:
Deep nested routing

Example:

/organizations/:organizationId/projects/:projectId/issues
MOST IMPORTANT CONCEPTS OF ENTIRE PROJECT
1. JWT FLOW
login
→ token generated
→ token sent in headers
→ middleware verifies token
→ req.user attached
2. MULTI-TENANCY
organizationId isolates tenant data

Every query must filter by organization.

3. RBAC
membership.role controls permissions
4. NESTED ROUTES
/organizations/:organizationId/projects/:projectId/issues

Resources belong to parent resources.

5. MIDDLEWARE FLOW

Always think:

request
→ middleware
→ middleware
→ controller
→ response
COMPLETE BACKEND FLOW
Signup/Login
→ Create Organization
→ Membership Validation
→ Create Project
→ Create Issues
→ Manage Issues

This is the complete SaaS MVP backend flow.

CURRENT BACKEND STATUS
COMPLETED

✅ Authentication
✅ JWT
✅ Protected routes
✅ Multi-tenancy
✅ Organizations
✅ Memberships
✅ RBAC
✅ Projects CRUD
✅ Issues CRUD
✅ Nested routing
✅ Secure tenant isolation

WHAT CAN BE ADDED LATER

These are optional production improvements:

Validation
Pagination
Rate limiting
Helmet
Redis
Notifications
File uploads
Activity logs

NOT required for MVP.

FINAL ADVICE

Do NOT memorize code.

Always understand:

WHY this middleware exists
WHY this query uses organizationId
WHY req.user is attached
WHY nested routes are used
