# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Start development server:**
```bash
yarn dev
```

**Build for production:**
```bash
yarn build
```

**Linting and formatting:**
```bash
yarn lint        # Check for linting errors
yarn lint:fix    # Fix auto-fixable linting errors
yarn format      # Format code with Prettier
```

**Preview production build:**
```bash
yarn preview
```

## Architecture Overview

This is a React/TypeScript medical consultation application using a **feature-based architecture**. Each domain is self-contained with its own API, components, hooks, routes, and types.

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite (with SWC)
- **Styling**: Tailwind CSS + Radix UI primitives
- **State Management**: Redux Toolkit + React Query
- **Routing**: React Router v6
- **Real-time**: Pusher WebSockets
- **Internationalization**: i18next (Romanian, Russian, English)
- **Forms**: React Hook Form + Zod validation

### Feature Structure Pattern
Each feature follows this structure:
```
src/features/[feature-name]/
├── api/           # API calls and data fetching
├── components/    # Feature-specific components
├── hooks/         # Custom hooks
├── routes/        # Route definitions and pages
├── types/         # TypeScript types
└── index.ts       # Public exports
```

### Key Features
- `conversations` - Core chat functionality with Pusher WebSockets
- `dashboard` - Analytics and overview
- `wallet` - Payment management
- `video-appointment` - Video consultation scheduling
- `medical-centre-appointment` - Medical center bookings
- `profile` - User management
- `auth` - Authentication with protected routes

### State Management Strategy
- **Redux Toolkit**: Complex chat state (conversations, messages)
- **React Query**: Server state management and caching
- **Local State**: Component-specific state with useState

### Component Organization
- `src/components/ui/` - Generic UI components (shadcn/ui based)
- `src/components/shared/` - Reusable business components
- `src/components/layout/` - Application shell components
- `src/features/*/components/` - Feature-specific components

### API Layer
- Centralized Axios instance with auth interceptors
- Feature-based API functions
- Automatic token management and 401 handling

### Important Conventions
- Path aliases configured in vite.config.ts (use `@/` for src)
- Strict TypeScript mode enabled
- Feature exports through index.ts files
- Multi-language support with namespaced translations
- Tailwind with custom medical app design system

### Real-time Communication
Uses Pusher WebSockets for live chat functionality. Configuration requires:
- `VITE_SOCKET_PUSHER_KEY`
- `VITE_SOCKET_PUSHER_CLUSTER`

### Required Environment Variables
The app requires several environment variables for API, Pusher, and Firebase configuration. See existing .env files or deployment config for the complete list.