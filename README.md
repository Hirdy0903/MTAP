Jira-Like SaaS MVP Backend — Complete Learning FlowProject Goal

This project is a beginner-friendly but real-world multi-tenant SaaS backend inspired by Jira.

Main learning goals:

Backend architectureAuthenticationJWT flowMulti-tenancyRBACMiddleware flowSecure APIsSaaS backend engineering

Tech stack:

Node.jsExpressMongoDBMongooseJWTbcryptFINAL PROJECT STRUCTUREbackend/└── src/├── config/│   └── db.js│├── middlewares/│   ├── auth.middleware.js│   ├── organization.middleware.js│   ├── role.middleware.js│   └── error.middleware.js│├── modules/│   ├── auth/│   │   ├── auth.model.js│   │   ├── auth.controller.js│   │   └── auth.routes.js│   ││   ├── organizations/│   │   ├── organization.model.js│   │   ├── membership.model.js│   │   ├── organization.controller.js│   │   └── organization.routes.js│   ││   ├── projects/│   │   ├── project.model.js│   │   ├── project.controller.js│   │   └── project.routes.js│   ││   └── issues/│       ├── issue.model.js│       ├── issue.controller.js│       └── issue.routes.js│├── utils/│   └── asyncHandler.js│├── app.js└── server.jsHOW TO REVISIT THIS PROJECT

Whenever revisiting:
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
- Client Request
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


# Architecture Decisions

- Feature-based modular backend architecture
- Multi-tenant SaaS design using organizationId
- Membership model for RBAC
- Nested routes for tenant resources
- Middleware-driven security flow
- MongoDB + Mongoose for flexible schema design

DO NOT randomly open files.

Follow this exact flow.

This flow teaches backend architecture step-by-step.

STEP 1 — SERVER ENTRY POINTRead:server.jsLearn:How server startsHow MongoDB connectsHow app listens on port

Understand:

server starts from hereSTEP 2 — EXPRESS APP FLOWRead:app.jsLearn:Middleware registrationRoute mountingRequest flowGlobal error handling

Understand:

every request enters app.js firstSTEP 3 — DATABASE CONNECTIONRead:config/db.jsLearn:Mongoose connectionEnvironment variablesMongoDB startup

Understand:

backend connects database hereSTEP 4 — ASYNC HANDLERRead:utils/asyncHandler.jsMOST IMPORTANT BEGINNER CONCEPT

Learn:

Why try/catch repetition is badAsync error handlingExpress next(error)

Understand:

asyncHandler automatically catches async errorsSTEP 5 — GLOBAL ERROR MIDDLEWARERead:middlewares/error.middleware.jsLearn:Centralized error handlingExpress error middlewareStatus codes

Understand:

all backend errors finally come hereSTEP 6 — AUTH MODULE

Read in order:

6.1 auth.model.jsLearn:User schemaPassword fieldtimestamps

Understand:

this defines how users are stored6.2 auth.controller.jsLearn:Signup flowLogin flowbcrypt hashingJWT generation

MOST IMPORTANT:

password is hashed before saving

and:

JWT token generated during login6.3 auth.routes.jsLearn:Express routerAPI routesController connection

Understand:

routes connect requests to controllersSTEP 7 — JWT AUTH MIDDLEWARERead:middlewares/auth.middleware.jsVERY IMPORTANT CONCEPT

Learn:

Authorization headersJWT verificationreq.user attachment

Understand deeply:

token→ verify→ fetch user→ attach req.user

This is core backend authentication flow.

STEP 8 — ORGANIZATIONS MODULE

This is where multi-tenancy starts.

Read in order:

8.1 organization.model.jsLearn:Organization schemaTenant concept

Understand:

every company/team becomes an organization8.2 membership.model.jsMOST IMPORTANT MULTI-TENANT FILELearn:User ↔ organization relationshipRole storageRBAC architecture

Understand deeply:

membership controls tenant access

and:

one user can belong to multiple organizations8.3 organization.controller.jsLearn:Create organizationGet user organizations

Understand:

organization APIs start tenant system8.4 organization.routes.jsLearn:Route structureNested resource mountingSTEP 9 — ORGANIZATION MIDDLEWARERead:middlewares/organization.middleware.jsONE OF THE MOST IMPORTANT FILESLearn:Membership verificationTenant access validationreq.organizationreq.membership

Understand deeply:

user must belong to organization

This is real SaaS security.

STEP 10 — ROLE MIDDLEWARE (RBAC)Read:middlewares/role.middleware.jsLearn:Role-based access controlAdmin/member permissions

Understand:

RBAC controls what user can do

Example:

admin can create projectmember cannotSTEP 11 — PROJECTS MODULE

Read in order:

11.1 project.model.jsLearn:Project schemaorganization fieldcreatedBy

MOST IMPORTANT:

organization field enables tenant isolation11.2 project.controller.jsLearn:CRUD operationsTenant filteringSecure Mongo queries

MOST IMPORTANT CONCEPT:

Never:

findById()

alone in SaaS apps.

Always:

_id + organization

Example:

Project.findOne({_id: projectId,organization: organizationId})

This prevents cross-tenant access.

11.3 project.routes.jsLearn:Nested routesMiddleware chaining

Understand request flow:

auth→ organization→ role→ controllerSTEP 12 — ISSUES MODULE

This becomes the actual Jira-like functionality.

Read in order:

12.1 issue.model.jsLearn:Status enumsPriority enumsAssignee system

Understand:

issues are actual work items12.2 issue.controller.jsLearn:Issue CRUDTenant-safe issue queriesProject validation

MOST IMPORTANT:

issue belongs to BOTH organization and project12.3 issue.routes.jsLearn:Deep nested routing

Example:

/organizations//projects//issuesMOST IMPORTANT CONCEPTS OF ENTIRE PROJECT

JWT FLOWlogin→ token generated→ token sent in headers→ middleware verifies token→ req.user attached

MULTI-TENANCYorganizationId isolates tenant data

Every query must filter by organization.

RBACmembership.role controls permissions

NESTED ROUTES/organizations//projects//issues

Resources belong to parent resources.

MIDDLEWARE FLOW

Always think:

request→ middleware→ middleware→ controller→ responseCOMPLETE BACKEND FLOWSignup/Login→ Create Organization→ Membership Validation→ Create Project→ Create Issues→ Manage Issues

This is the complete SaaS MVP backend flow.

CURRENT BACKEND STATUSCOMPLETED

✅ Authentication✅ JWT✅ Protected routes✅ Multi-tenancy✅ Organizations✅ Memberships✅ RBAC✅ Projects CRUD✅ Issues CRUD✅ Nested routing✅ Secure tenant isolation

WHAT CAN BE ADDED LATER

These are optional production improvements:

ValidationPaginationRate limitingHelmetRedisNotificationsFile uploadsActivity logs

NOT required for MVP.

FINAL ADVICE

Do NOT memorize code.

Always understand:

WHY this middleware existsWHY this query uses organizationIdWHY req.user is attachedWHY nested routes are used
