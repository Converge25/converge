# Architecture Document

## Overview

This application is a full-stack web marketing platform that provides businesses with tools for email marketing, SMS marketing, social media management, popups/lead capture, analytics, and user management. The architecture follows a modern client-server model with a React-based frontend and a Node.js Express backend. The application uses a PostgreSQL database (via Neon's serverless Postgres offering) with Drizzle ORM for data management.

The system is designed to be deployed on Replit's platform, with specific configuration for their environment, while maintaining compatibility with other deployment targets through containerization.

## System Architecture

### High-Level Architecture

The application follows a standard full-stack architecture:

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│  React Frontend │<─────│  Express Server │<─────│  PostgreSQL DB  │
│  (Client-side)  │      │  (Server-side)  │      │  (Data Storage) │
│                 │      │                 │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

### Frontend Architecture

The frontend is built with React, leveraging several modern web technologies:

- **React**: Core UI library
- **TailwindCSS**: Utility-first CSS framework
- **ShadCN UI**: Component library built on Radix UI primitives
- **React Query**: Data fetching and state management
- **Wouter**: Lightweight routing solution
- **Chart.js**: Data visualization

The client-side code follows a modular component-based architecture organized by feature. Component definitions are split between UI primitives (in the components/ui directory) and domain-specific components.

### Backend Architecture

The backend is built with Express.js, providing REST API endpoints to be consumed by the frontend:

- **Express.js**: Web server framework
- **Drizzle ORM**: Database ORM with type safety
- **Zod**: Schema validation
- **SendGrid**: Email service integration

The server architecture follows a layered approach:
1. Route definitions (server/routes.ts)
2. Data access layer (server/storage.ts)
3. Database connection (db/index.ts)

### Database Schema

The database schema is defined using Drizzle ORM in the `shared/schema.ts` file, with SQL migrations managed through Drizzle Kit. The schema includes tables for:

- Users
- Tasks
- Other domain entities (email campaigns, SMS campaigns, etc.)

## Key Components

### Frontend Components

1. **Pages**: React components that represent full pages in the application
   - Dashboard
   - Email Marketing
   - SMS Marketing
   - Social Media
   - Popups
   - Analytics
   - User Management
   - Subscription
   - Settings

2. **Layout Components**: Components for consistent page structure
   - Sidebar
   - Header
   - MobileSidebar

3. **UI Components**: Reusable UI elements based on ShadCN/Radix UI
   - Buttons, Cards, Inputs, etc.
   - Charts and data visualization components

4. **Data Fetching**: React Query for API data fetching and caching

### Backend Components

1. **Express Server**: Main HTTP server (server/index.ts)
2. **API Routes**: REST API endpoints (server/routes.ts)
3. **Data Access Layer**: Database operations abstraction (server/storage.ts)
4. **Database Connection**: Neon Postgres connection setup (db/index.ts)
5. **Schema Definitions**: Drizzle ORM schema (shared/schema.ts)

### Infrastructure Components

1. **Database**: Neon serverless PostgreSQL
2. **Build System**: Vite for frontend, ESBuild for backend
3. **Development Environment**: Replit-specific configurations

## Data Flow

### Authentication Flow

1. User submits credentials to `/api/auth/login`
2. Server validates credentials against stored user data
3. On success, user information is returned to the client (minus password)
4. The frontend stores authentication state and enables authenticated features

### API Data Flow

1. Frontend components request data via React Query hooks
2. React Query manages API requests, caching, and state updates
3. Express routes handle incoming requests
4. The storage layer executes database operations via Drizzle ORM
5. Data flows back through the stack to update the UI

### Database Operations

1. Schema defined with Drizzle ORM in TypeScript
2. Zod schemas used for validation
3. Type-safe database access through Drizzle's query builder
4. Migrations managed with Drizzle Kit (`db:push` command)

## External Dependencies

### Frontend Dependencies

- **React**: UI library
- **TailwindCSS**: CSS framework
- **Radix UI**: UI primitives
- **Chart.js**: Data visualization
- **React Query**: Data fetching/caching

### Backend Dependencies

- **Express.js**: Web server
- **Drizzle ORM**: Database ORM
- **Neon Postgres Driver**: Serverless PostgreSQL client
- **SendGrid**: Email service
- **Zod**: Schema validation

### Infrastructure Dependencies

- **Vite**: Frontend build tool
- **ESBuild**: Backend bundler
- **TypeScript**: Type checking
- **Node.js**: Runtime environment

## Deployment Strategy

The application is configured for deployment on Replit's platform with specific optimizations:

1. **Development Mode**:
   - `npm run dev` starts the local development server
   - Vite handles hot module replacement
   - Runtime error overlay for debugging

2. **Production Build**:
   - `npm run build` creates optimized assets
   - Frontend built with Vite
   - Backend bundled with ESBuild

3. **Deployment**:
   - Configured for Replit's "autoscale" deployment target
   - Production server started with `npm run start`
   - Environment variables used for configuration

4. **Database Management**:
   - Drizzle migrations pushed with `npm run db:push`
   - Seed data loaded with `npm run db:seed`

## Security Considerations

1. **Authentication**: Basic username/password authentication
2. **Password Storage**: Currently stored as plaintext (noted as a placeholder in the code)
3. **API Security**: No visible CSRF protection or rate limiting
4. **Environment Variables**: Database credentials stored in environment variables

## Future Enhancements

Based on code analysis, several features are marked as "coming soon":
- Full implementation of email marketing campaigns
- SMS marketing functionality
- Social media integration
- Lead capture via popups
- Enhanced analytics dashboard
- Subscription management

The architecture is designed to support these features through its modular approach and separation of concerns.