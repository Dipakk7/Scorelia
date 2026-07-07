# Frontend Architecture Documentation — Scorelia

This document provides a comprehensive overview of the design system, directory mapping, state management architecture, API synchronization rules, routing paths, and deployment specifications for the Scorelia React application.

---

## 1. Directory Structure Map

```
frontend/
├── dist/                # Optimized production assets distribution
├── public/              # Static resources (icons, manifests)
├── src/
│   ├── api/             # Axios API client, interceptors, react-query hooks
│   ├── assets/          # Shared global media files
│   ├── components/      # Reusable presentation views
│   │   ├── agents/      # Multi-Agent orchestrator panels
│   │   ├── analytics/   # Recharts charts and KPI widgets
│   │   ├── ats/         # ATS compliance gauges and comparison elements
│   │   ├── career-coach/# Career roadmap timelines and learning courses cards
│   │   ├── common/      # Global ErrorBoundary fallback component
│   │   ├── layout/      # Navbar, Sidebar, Breadcrumbs structural elements
│   │   ├── rag/         # Vector document upload zones and search bars
│   │   └── ui/          # Primatives (Button, Card, Input, EmptyState, Skeletons)
│   ├── layouts/         # Base Dashboard structural view grid wrapper
│   ├── lib/             # Shared utility functions (clsx cn, toast notifies)
│   ├── pages/           # High-level lazy router page controllers
│   ├── providers/       # Theme, Auth, Toast, Query context providers
│   ├── routes/          # Guest/Protected Route controls and route mapping
│   ├── types/           # Strict TypeScript interfaces matching backend models
│   ├── App.tsx          # Router and boundary registry root
│   ├── index.css        # Tailwind v4 configuration, themes, custom scrollbars
│   └── main.tsx         # Virtual DOM mount entry point
├── package.json         # Dependency manifest and vite build commands
├── tsconfig.json        # TypeScript compile targets and alias definitions
└── vite.config.ts       # Vite build configurations and plugin resolvers
```

---

## 2. Component System Guidelines

The frontend is constructed using a decoupled, atomic design system utilizing Tailwind CSS v4 styling rules.
- **Card**: Contained within [Card.tsx](file:///c:/Scorelia%20AI/frontend/src/components/ui/Card.tsx). Renders slate border guidelines, dark card backgrounds (`--color-dark-card`), and hover shadow elevations.
- **Button**: Custom variant options (`primary`, `secondary`, `outline`, `ghost`, `danger`) with integrated loading spinner animations.
- **Input**: Strict form labels, prefix icons options, error messages, and aria-describedby accessibility markers.
- **Skeletons**: Page-specific, responsive CSS-animated elements layout to mock page sections during loading.
- **Empty States**: Standardized graphics (`FolderOpen`, `Mic`, `Sparkles`, `Map`) to guide users towards call-to-actions when records lists are empty.

---

## 3. State Management Configuration

1. **Authentication Context**:
   - Persisted via `AuthProvider` utilizing JWT authorization headers saved to LocalStorage.
   - Automatically polls `/auth/me` on bootstrap and refreshes authentication credentials.
   - Synchronizes logouts across browser tabs using custom window event triggers.

2. **Query Caching & Mutations**:
   - Managed via React Query (`@tanstack/react-query`) in `QueryProvider`.
   - Custom cache invalidation ensures that modifying resumes, generating roadmaps, or finishing mock interviews automatically triggers background refetches of dashboard widgets.
   - Recharts graphs are animated smoothly by using standard `useMemo` hooks to avoid redundant coordinates recalculation loops on render cycles.

---

## 4. Routing Registry

```mermaid
graph TD
    Root[App Startup] --> GuestCheck{Is Authenticated?}
    GuestCheck -- No --> AuthRoutes[Auth Pages /login, /register, /forgot-password]
    GuestCheck -- Yes --> DashboardLayout[DashboardLayout /]
    
    DashboardLayout --> DashboardPage[/dashboard]
    DashboardLayout --> ResumesPage[/resumes]
    DashboardLayout --> AtsPage[/ats]
    DashboardLayout --> LetterPage[/cover-letter]
    DashboardLayout --> InterviewPage[/interview]
    DashboardLayout --> RoadmapPage[/roadmap]
    DashboardLayout --> RagPage[/rag-workspace]
    DashboardLayout --> AgentsPage[/agents]
    DashboardLayout --> AnalyticsPage[/analytics]
    DashboardLayout --> GithubPage[/github-intelligence]
    DashboardLayout --> SettingsPage[/settings]
    
    NotFound[*] --> NotFoundPage[/404]
    Offline[Navigator Offline] --> OfflinePage[Offline]
```

---

## 5. API Interceptor Rules

The global API client is declared inside [api.ts](file:///c:/Scorelia%20AI/frontend/src/api/api.ts):
- **Base URL**: Defaults to environment `VITE_API_URL` or fallback prefix path `/api/v1`.
- **Request Headers**: Automatically injects standard JWT token `Authorization: Bearer <token>`.
- **Error Formatting**: Intercepts Axios responses, mapping standard FastAPI status codes to structured user-facing messages.
- **Refresh Token Rotation**: Detects expired tokens (HTTP 401) and initiates a lock-step refresh request to `/auth/refresh` before retrying the initial API call.

---

## 6. Theme Styling Specification

Configured inside [index.css](file:///c:/Scorelia%20AI/frontend/src/index.css) using Tailwind v4 `@theme` directives:
- **Fonts**: Outfit & Inter for crisp typeface display.
- **Colors**: Curated deep indigo brand shades (`--color-brand-50` to `950`), cyber accent colors (`--color-accent-blue`, `purple`), and high-contrast dark elements (`--color-dark-bg: #090d16`).
- **Glassmorphism**: `.glass-navbar` and `.glass-card` classes utilize `backdrop-filter: blur(12px)` for premium visual depth.
