# IssuePilot AI – Complete Project Blueprint

## 1. Project Architecture
- Monorepo-style structure with two main folders: frontend and backend.
- Frontend: React + Vite + Tailwind CSS + React Router + Axios.
- Backend: Node.js + Express.js + MongoDB + Mongoose.
- Authentication: JWT with bcrypt password hashing.
- File uploads: Multer + Cloudinary.
- AI integration: Groq API for issue priority suggestions, daily project summaries, project progress summaries, and bug-fix suggestions.
- Pattern: MVC with controllers, models, routes, middleware, and services.
- API style: RESTful JSON APIs.

## 2. Folder Structure
- /frontend
  - /src
    - /components
    - /pages
    - /services
    - /context
    - App.jsx
    - main.jsx
    - index.css
- /backend
  - /src
    - /config
    - /controllers
    - /middleware
    - /models
    - /routes
    - /services
    - app.js
    - server.js
  - .env.example

## 3. Database Schema
### User
- name: String
- email: String (unique)
- password: String (hashed)
- createdAt: Date

### Project
- name: String
- description: String
- createdBy: ObjectId (User)
- createdAt: Date
- updatedAt: Date

### Issue
- title: String
- description: String
- priority: String (Low, Medium, High, Critical)
- status: String (Open, In Progress, Closed)
- assignee: String
- screenshotUrl: String
- projectId: ObjectId (Project)
- createdBy: ObjectId (User)
- createdAt: Date
- updatedAt: Date

### ActivityLog
- action: String
- description: String
- projectId: ObjectId (Project)
- issueId: ObjectId (Issue)
- createdBy: ObjectId (User)
- createdAt: Date

## 4. Complete API List
### Auth
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

### Projects
- GET /api/projects
- POST /api/projects
- GET /api/projects/:id
- PUT /api/projects/:id
- DELETE /api/projects/:id
- GET /api/projects/:id/activity
- GET /api/projects/:id/issues
- POST /api/projects/:id/issues

### Issues
- GET /api/issues
- POST /api/issues
- GET /api/issues/:id
- PUT /api/issues/:id
- DELETE /api/issues/:id

### AI
- POST /api/ai/suggest-priority
- GET /api/ai/daily-summary
- POST /api/ai/project-summary
- POST /api/ai/suggest-fix

## 5. Frontend Pages
- LoginPage
- RegisterPage
- DashboardPage
- ProjectsPage
- ProjectDetailsPage
- IssuesPage

## 6. React Components
- Navbar
- ProtectedRoute
- ProjectForm
- IssueForm
- IssueCard
- ActivityList
- EmptyState

## 7. Backend Controllers
- authController
- projectController
- issueController
- aiController

## 8. Routes
- authRoutes
- projectRoutes
- issueRoutes
- aiRoutes

## 9. Middleware
- authMiddleware
- errorMiddleware
- uploadMiddleware

## 10. Services
- authService
- projectService
- issueService
- aiService
- cloudinaryService

## 11. AI Flow
- User enters issue title and description.
- Backend sends prompt to Groq API.
- Backend returns suggested priority.
- If Groq key is unavailable, backend falls back to a simple rule-based suggestion.
- Daily summary uses project and issue data to generate a short summary.
- Project summary returns completed issues, pending issues, and overall progress.
- Bug-fix suggestions analyze issue descriptions and return possible root cause, suggested fix, and optional notes.

## 12. Authentication Flow
- User registers with name, email, password.
- Password is hashed with bcrypt.
- Backend creates JWT.
- Frontend stores token in localStorage.
- Protected routes use JWT in Authorization header.

## 13. Navigation Flow
- Public routes: Login, Register.
- Private routes: Dashboard, Projects, Issues, Project Details.
- Navbar links to Dashboard, Projects, Issues.
- User can create projects and issues from the UI.

## 14. Deployment Plan
- Frontend: deploy to Vercel or Netlify.
- Backend: deploy to Render or Railway.
- Database: MongoDB Atlas.
- File storage: Cloudinary.
- Environment variables stored securely in deployment platform.

## 15. Final File Tree
- /docs/BLUEPRINT.md
- /frontend/package.json
- /frontend/index.html
- /frontend/vite.config.js
- /frontend/src/main.jsx
- /frontend/src/App.jsx
- /frontend/src/index.css
- /frontend/src/context/AuthContext.jsx
- /frontend/src/services/api.js
- /frontend/src/components/Navbar.jsx
- /frontend/src/components/ProtectedRoute.jsx
- /frontend/src/components/ProjectForm.jsx
- /frontend/src/components/IssueForm.jsx
- /frontend/src/components/IssueCard.jsx
- /frontend/src/components/ActivityList.jsx
- /frontend/src/pages/LoginPage.jsx
- /frontend/src/pages/RegisterPage.jsx
- /frontend/src/pages/DashboardPage.jsx
- /frontend/src/pages/ProjectsPage.jsx
- /frontend/src/pages/ProjectDetailsPage.jsx
- /frontend/src/pages/IssuesPage.jsx
- /backend/package.json
- /backend/.env.example
- /backend/src/app.js
- /backend/src/server.js
- /backend/src/config/db.js
- /backend/src/config/cloudinary.js
- /backend/src/models/User.js
- /backend/src/models/Project.js
- /backend/src/models/Issue.js
- /backend/src/models/ActivityLog.js
- /backend/src/middleware/auth.js
- /backend/src/middleware/error.js
- /backend/src/middleware/upload.js
- /backend/src/controllers/authController.js
- /backend/src/controllers/projectController.js
- /backend/src/controllers/issueController.js
- /backend/src/controllers/aiController.js
- /backend/src/routes/authRoutes.js
- /backend/src/routes/projectRoutes.js
- /backend/src/routes/issueRoutes.js
- /backend/src/routes/aiRoutes.js
- /backend/src/services/aiService.js
- /backend/src/services/cloudinaryService.js
