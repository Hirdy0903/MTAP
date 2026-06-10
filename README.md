Why I Built This Project

Write:

This is my first serious backend engineering project.

The goal was not to clone Jira completely.

The goal was to learn:

- Backend architecture
- Authentication
- JWT
- Authorization
- Multi-tenancy
- RBAC
- Middleware design
- MongoDB relationships
- SaaS architecture

while building a practical project.
Section 2
Architecture Decisions

Document every decision.

Example:

### Why Node.js + Express

Simple ecosystem.
Large community.
Good for learning backend fundamentals.

### Why MongoDB

Flexible schema design.
Easy to iterate during MVP stage.

### Why Module Based Architecture

Keeps code organized by feature.

### Why Membership Model

A user can belong to multiple organizations.

### Why organizationId Everywhere

To achieve tenant isolation.

### Why Nested Routes

Resources naturally belong to parent resources.
Section 3
Build Timeline

This is the MOST valuable section.

Day 1
Express Setup
MongoDB Connection
Environment Variables

Learned:

Server startup flow
Database connection lifecycle
Day 2
asyncHandler
Global Error Middleware

Learned:

How Express handles async errors
Day 3
User Model
Signup API
Login API
bcrypt
JWT

Learned:

Authentication
Password Security
JWT Lifecycle
Day 4
Auth Middleware
Protected Routes

Learned:

Request Authentication
Authorization Headers
req.user
Day 5
Organization Model
Membership Model
Organization APIs

Learned:

Multi-Tenant Architecture
Day 6
RBAC
Role Middleware
Projects Module

Learned:

Permission Systems
Day 7
Issues Module

Learned:

Real SaaS Resource Hierarchy
Section 4
Complete Request Lifecycle
Client Request
      │
      ▼
app.js
      │
      ▼
Route
      │
      ▼
Auth Middleware
      │
      ▼
Organization Middleware
      │
      ▼
Role Middleware
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

Then explain every step.

Section 5
Authentication Deep Dive
Files
auth.model.js
auth.controller.js
auth.routes.js
auth.middleware.js
Signup Flow
Request
   │
   ▼
Validate Data
   │
   ▼
Hash Password
   │
   ▼
Store User
Login Flow
Request
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
Send Token
Protected Route Flow
Request
   │
   ▼
Authorization Header
   │
   ▼
JWT Verify
   │
   ▼
Find User
   │
   ▼
Attach req.user
Section 6
Multi-Tenancy Deep Dive

This should be one of the biggest sections.

Explain:

Without Multi-Tenancy

Company A
Company B

All data mixed together

vs

With Multi-Tenancy

Organization A
Organization B

Data isolated

Explain:

organizationId

is the most important field.

Section 7
Membership System

Explain why Organization alone was not enough.

Problem:

One User
Multiple Organizations

Solution:

Membership Collection

Relationship:

User
 │
 ▼
Membership
 │
 ▼
Organization
Section 8
RBAC Deep Dive

Explain:

Admin
Member

and:

roleMiddleware()

flow.

Section 9
Projects Module

For every controller function write:

createProject()

Purpose:

Create project inside organization.

Concepts learned:

RBAC
Tenant Isolation
getProjects()

Purpose:

Retrieve organization projects.

Concepts learned:

Tenant Filtering
getSingleProject()

Purpose:

Secure project access.

Concepts learned:

IDOR Prevention
updateProject()

Purpose:

Modify project.
deleteProject()

Purpose:

Remove project.
Section 10
Issues Module

Do exactly same.

Document every controller.

Section 11
Security Concepts Learned

Document:

Password Hashing

Why:

Never store plaintext passwords.
JWT

Why:

Stateless authentication.
Tenant Isolation

Why:

Prevent cross-company data access.
RBAC

Why:

Control actions based on role.
Middleware

Why:

Separate concerns.
Section 12
Biggest Learnings

Write your own reflections:

- First time implementing JWT.
- First time implementing RBAC.
- First time building a multi-tenant backend.
- Learned middleware chaining.
- Learned request lifecycle.
- Learned MongoDB relationships.
- Learned SaaS architecture basics.
