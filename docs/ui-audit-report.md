# Scorelia UI Audit Report — Phase 0

## 1. Route/Page Inventory

| Page Name | File Path | Uses Shared Layout (Y/N) |
| :--- | :--- | :--- |
| **Login Page** | `frontend/src/pages/LoginPage.tsx` | N |
| **Register Page** | `frontend/src/pages/RegisterPage.tsx` | N |
| **Forgot Password Page** | `frontend/src/pages/ForgotPasswordPage.tsx` | N |
| **Dashboard** | `frontend/src/pages/DashboardPage.tsx` | Y |
| **Resume Builder** | `frontend/src/pages/ResumesPage.tsx` | Y |
| **AI Resume Intelligence** | `frontend/src/pages/ResumeIntelligencePage.tsx` | Y |
| **ATS Analysis** | `frontend/src/pages/AtsPage.tsx` | Y |
| **AI Cover Letter** | `frontend/src/pages/CoverLetterPage.tsx` | Y |
| **AI Interview Prep** | `frontend/src/pages/InterviewPage.tsx` | Y |
| **Career Roadmap** | `frontend/src/pages/RoadmapPage.tsx` | Y |
| **RAG Workspace** | `frontend/src/pages/RAGWorkspacePage.tsx` | Y |
| **Agent Console** | `frontend/src/pages/MultiAgentWorkspacePage.tsx` | Y |
| **Analytics Center** | `frontend/src/pages/AnalyticsPage.tsx` | Y |
| **GitHub Intelligence** | `frontend/src/pages/GithubIntelligencePage.tsx` | Y |
| **Settings** | `frontend/src/pages/SettingsPage.tsx` | Y |
| **Profile** | `frontend/src/pages/ProfilePage.tsx` | Y |
| **403 Forbidden** | `frontend/src/pages/403Page.tsx` | N |
| **404 Not Found** | `frontend/src/pages/404Page.tsx` | N |
| **500 Server Error** | `frontend/src/pages/500Page.tsx` | N |
| **Offline Page** | `frontend/src/pages/OfflinePage.tsx` | N |

---

## 2. Hardcoded Color Findings

| File Path | Line/Location | Value Found | Context (e.g., "card background", "badge color") |
| :--- | :--- | :--- | :--- |
| `frontend/src/lib/toast.ts` | 18 | `#eab308` | Border color for warning toast alerts |
| `frontend/src/lib/toast.ts` | 26 | `#3b82f6` | Border color for info toast alerts |
| `frontend/src/components/ui/ResumeViewer.tsx` | 183 | `#1e293b` | Print stylesheet body text color override |
| `frontend/src/components/ui/ResumeViewer.tsx` | 184 | `#0f172a` | Print stylesheet h1 color override |
| `frontend/src/components/ui/ResumeViewer.tsx` | 184 | `#e2e8f0` | Print stylesheet h1 border-bottom color override |
| `frontend/src/components/ui/ResumeViewer.tsx` | 185 | `#1e3a8a` | Print stylesheet h2 color override |
| `frontend/src/components/ui/ResumeViewer.tsx` | 185 | `#e2e8f0` | Print stylesheet h2 border-bottom color override |
| `frontend/src/components/ui/ResumeViewer.tsx` | 186 | `#0f172a` | Print stylesheet h3 color override |
| `frontend/src/components/ui/ResumeViewer.tsx` | 190 | `#64748b` | Print stylesheet metadata text color override |
| `frontend/src/components/ui/ResumeViewer.tsx` | 191 | `#475569` | Print stylesheet item-metadata text color override |
| `frontend/src/components/resume-intelligence/ExportDialog.tsx` | 206 | `#1e293b` | Print stylesheet resume page body text color |
| `frontend/src/components/resume-intelligence/ExportDialog.tsx` | 207 | `#4f46e5` | Print stylesheet resume page h1 color override |
| `frontend/src/components/resume-intelligence/ExportDialog.tsx` | 207 | `#e2e8f0` | Print stylesheet resume page h1 border-bottom color |
| `frontend/src/components/resume-intelligence/ExportDialog.tsx` | 208 | `#0f172a` | Print stylesheet resume page h2 color override |
| `frontend/src/components/resume-intelligence/ExportDialog.tsx` | 208 | `#f1f5f9` | Print stylesheet resume page h2 border-bottom color |
| `frontend/src/components/resume-intelligence/ExportDialog.tsx` | 209 | `#475569` | Print stylesheet resume page h3 color override |
| `frontend/src/components/resume-intelligence/ExportDialog.tsx` | 210 | `#334155` | Print stylesheet paragraphs/lists text color override |
| `frontend/src/components/resume-intelligence/ExportDialog.tsx` | 212 | `#f8fafc` | Print stylesheet inline code block background color |
| `frontend/src/components/resume-intelligence/ExportDialog.tsx` | 213 | `#e2e8f0` | Print stylesheet divider line color override |
| `frontend/src/components/resume-intelligence/ExportDialog.tsx` | 214 | `#64748b` | Print stylesheet metadata text color override |
| `frontend/src/components/common/Logo.tsx` | 14 | `#0F9D9A` | Logo icon brand teal color when not monochrome |
| `frontend/src/components/analytics/RadarAnalytics.tsx` | 105 | `#fff` | Chart active dot fill color in radar analytics |
| `frontend/src/components/analytics/TrendChart.tsx` | 131 | `#fff` | Chart active dot fill color in line trend chart |
| `frontend/src/components/analytics/TrendChart.tsx` | 161 | `#fff` | Chart dot fill color in line trend chart |
| `frontend/src/components/analytics/TrendChart.tsx` | 186 | `rgba(148, 163, 184, 0.05)` | Chart tooltip cursor hover shadow color override |
| `frontend/src/components/analytics/ReportExportDialog.tsx` | 194 | `#1e293b` | Print stylesheet report body text color |
| `frontend/src/components/analytics/ReportExportDialog.tsx` | 195 | `#0F9D9A` | Print stylesheet report header border color |
| `frontend/src/components/analytics/ReportExportDialog.tsx` | 196 | `#0F9D9A` | Print stylesheet report title color |
| `frontend/src/components/analytics/ReportExportDialog.tsx` | 197 | `#64748b` | Print stylesheet report meta text color |
| `frontend/src/components/analytics/ReportExportDialog.tsx` | 199 | `#0f172a` | Print stylesheet report section-title text color |
| `frontend/src/components/analytics/ReportExportDialog.tsx` | 199 | `#e2e8f0` | Print stylesheet report section-title border color |
| `frontend/src/components/analytics/ReportExportDialog.tsx` | 201 | `#e2e8f0` | Print stylesheet report table cells border color |
| `frontend/src/components/analytics/ReportExportDialog.tsx` | 202 | `#f8fafc` | Print stylesheet table header cell background color |
| `frontend/src/components/analytics/ReportExportDialog.tsx` | 202 | `#475569` | Print stylesheet table header cell text color |
| `frontend/src/components/analytics/ReportExportDialog.tsx` | 203 | `#0F9D9A` | Print stylesheet print badge background color |
| `frontend/src/components/analytics/ReportExportDialog.tsx` | 204 | `#e2e8f0` | Print stylesheet print footer border color |
| `frontend/src/components/analytics/ReportExportDialog.tsx` | 204 | `#94a3b8` | Print stylesheet print footer text color |
| `frontend/src/components/analytics/ReportExportDialog.tsx` | 205 | `#f8fafc` | Print stylesheet scorecard background color |
| `frontend/src/components/analytics/ReportExportDialog.tsx` | 205 | `#e2e8f0` | Print stylesheet scorecard border color |
| `frontend/src/components/analytics/ReportExportDialog.tsx` | 206 | `#0F9D9A` | Print stylesheet scorecard score value color |
| `frontend/src/components/analytics/DeveloperScoreCard.tsx` | 80 | `#0F9D9A` | SVG gradient start color (Teal) |
| `frontend/src/components/analytics/DeveloperScoreCard.tsx` | 81 | `#00D2FF` | SVG gradient middle color (Cyan) |
| `frontend/src/components/analytics/DeveloperScoreCard.tsx` | 82 | `#10b981` | SVG gradient end color (Emerald) |
| `frontend/src/pages/InterviewPage.tsx` | 538 | `bg-amber-500` | Tailwind color class override for mock statistic bar color mapping |
| `frontend/src/pages/InterviewPage.tsx` | 539 | `bg-accent-purple` | Tailwind color class override for mock statistic bar color mapping |
| `frontend/src/pages/InterviewPage.tsx` | 540 | `bg-blue-500` | Tailwind color class override for mock statistic bar color mapping |
| `frontend/src/pages/InterviewPage.tsx` | 541 | `bg-rose-500` | Tailwind color class override for mock statistic bar color mapping |
| `frontend/src/pages/InterviewPage.tsx` | 542 | `bg-emerald-500` | Tailwind color class override for mock statistic bar color mapping |

---

## 3. Flat Card / Heavy Shadow Findings

| File Path | Component | Description |
| :--- | :--- | :--- |
| `frontend/src/pages/DashboardPage.tsx` | `CustomTooltip` | Uses `shadow-lg` inline override with flat `bg-surface` background for chart tooltips. |
| `frontend/src/pages/ResumesPage.tsx` | `CustomTooltip` | Uses `shadow-xl` inline override with flat `bg-[var(--surface)]/95` background for Recharts tooltips. |
| `frontend/src/pages/CoverLetterPage.tsx` | `CustomTooltip` | Uses `shadow-xl` inline override with flat `bg-[var(--surface)]/95` background for Recharts tooltips. |
| `frontend/src/pages/AtsPage.tsx` | `CustomTooltip` | Uses `shadow-xl` inline override with flat `bg-[var(--surface)]/95` background for Recharts tooltips. |
| `frontend/src/pages/LoginPage.tsx` | Auth Card | Uses `shadow-md` with solid flat `bg-surface` on the central auth `<Card>`. |
| `frontend/src/pages/RegisterPage.tsx` | Auth Card | Uses `shadow-md` with solid flat `bg-surface` on the central auth `<Card>`. |
| `frontend/src/pages/ForgotPasswordPage.tsx` | Auth Card | Uses `shadow-md` with solid flat `bg-surface` on the central auth `<Card>`. |
| `frontend/src/pages/MultiAgentWorkspacePage.tsx` | Main Workspace Panel | Standardizes layout on a flat raw container `div` using `bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-sm`. |
| `frontend/src/pages/SettingsPage.tsx` | Card-like Container | Standardizes sub-block (line 211) on a raw container `div` using `bg-[var(--surface)]/70 shadow-[var(--shadow-sm)]`. |
| `frontend/src/pages/AnalyticsPage.tsx` | Container Panels | Custom card blocks (lines 167, 185) define their own shadows `shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]` on raw `div` elements. |
| `frontend/src/pages/GithubIntelligencePage.tsx` | Error Panel | Container at line 94 uses solid `bg-[var(--surface)]/70 shadow-[var(--shadow-sm)] border border-[var(--border)]`. |

---

## 4. Empty State Findings

| File Path | Component | Current Empty State Text/Behavior |
| :--- | :--- | :--- |
| `frontend/src/components/interview/InterviewAnalyticsChart.tsx` | Analytics Area/Line Charts | Shows `Not enough session logs. Complete interviews to track trends.` as centered plain italic text within cards when data is missing. No CTA button or guidance is provided. |
| `frontend/src/components/analytics/AnalyticsCard.tsx` | Chart wrapper component | Renders standard plain text fallback `No data available for the selected filter.` without guidance. |
| `frontend/src/pages/AtsPage.tsx` | Recommendations Panel | Shows a raw placeholder block `No recommendations recorded.` using border-dashed borders when recommendations are empty. |
| `frontend/src/pages/CoverLetterPage.tsx` | History & Logs widgets | Shows raw static text overlays `No documents generated yet.` and `No recent generations logs.` inside the sidebar layout. |
| `frontend/src/components/ui/ResumeEditor.tsx` | Form sections (Skills, Experience, Education, Projects) | Renders simple text fields `No skills added yet.`, `No experience records found.`, etc. when records are empty. |
| `frontend/src/components/ui/ResumeViewer.tsx` | Resume preview sectors | Shows static gray text `No social or web links found.`, `No technical skills detected.`, etc. |
| `frontend/src/pages/DashboardPage.tsx` | Dashboard sub-charts | Uses a local `LocalEmptyState` defined inline in the file to render custom fallback blocks for empty charts. Bypasses the shared `EmptyState` component. |

---

## 5. Shared Component Inventory

| Component Name | File Path | Used By (list of pages) | Bypassed By (list of pages with inline alternatives) |
| :--- | :--- | :--- | :--- |
| **Card** | `frontend/src/components/ui/Card.tsx` | `DashboardPage`, `ResumesPage`, `ResumeIntelligencePage`, `AtsPage`, `CoverLetterPage`, `InterviewPage`, `RoadmapPage`, `RAGWorkspacePage`, `SettingsPage` (via `SettingsCard`), `ProfilePage`, `LoginPage`, `RegisterPage`, `ForgotPasswordPage` | `MultiAgentWorkspacePage`, `AnalyticsPage`, `GithubIntelligencePage` (use custom styled container `div` blocks with inline CSS and Tailwind utilities) |
| **Button** | `frontend/src/components/ui/Button.tsx` | `DashboardPage`, `ResumesPage`, `ResumeIntelligencePage`, `AtsPage`, `CoverLetterPage`, `InterviewPage`, `RoadmapPage`, `RAGWorkspacePage`, `SettingsPage`, `ProfilePage`, `LoginPage`, `RegisterPage`, `ForgotPasswordPage`, `403Page`, `404Page`, `500Page`, `OfflinePage` | `MultiAgentWorkspacePage`, `GithubIntelligencePage` (use raw `<button` element styled with Tailwind), `AnalyticsPage` (does not require any button actions) |
| **Badge** | `frontend/src/components/ui/Badge.tsx` | `DashboardPage`, `ResumesPage`, `ResumeIntelligencePage`, `CoverLetterPage`, `InterviewPage` | `AtsPage`, `RAGWorkspacePage`, `MultiAgentWorkspacePage`, `AnalyticsPage`, `GithubIntelligencePage`, `SettingsPage`, `ProfilePage` (uses local pill markup or custom `SkillBadge`) |
| **EmptyState** | `frontend/src/components/ui/EmptyState.tsx` | `ResumesPage`, `ResumeIntelligencePage`, `AtsPage`, `CoverLetterPage`, `InterviewPage`, `RoadmapPage`, `RAGWorkspacePage`, `MultiAgentWorkspacePage`, `GithubIntelligencePage` | `DashboardPage` (declares local `LocalEmptyState` inside the file, bypassing `EmptyState` completely) |

---

## 6. Current Theme Mechanism

1. **Context & Theme State**: Theme state (`'dark' | 'light' | 'system'`) is initialized and managed inside `ThemeProvider.tsx` using a standard React context (`ThemeProviderContext`). It exposes the current theme and a `setTheme` trigger.
2. **Local Storage Persistence**: The chosen theme option is persisted across page reloads via a local storage property `scorelia-theme`.
3. **HTML Class Toggle**: A `useEffect` hook inside the `ThemeProvider` automatically removes any existing `'light'` or `'dark'` classes from `window.document.documentElement` and applies the class string corresponding to the active mode (or evaluates system preference via media query `(prefers-color-scheme: dark)` if theme is set to `'system'`).
4. **Tailwind Mapping (v4)**:
   - In `index.css`, standard Design System properties (tokens) are bound to raw CSS variables inside `:root` (Light mode) and `.dark` (Dark mode) blocks (e.g. `--background`, `--surface`, `--primary`, `--border`, `--divider`).
   - Tailwind v4 `@theme` block maps utility colors (e.g., `--color-background`, `--color-surface`, `--color-primary`, `--color-border`) and shapes/shadows (e.g., `--radius-card`, `--shadow-sm`) to hook into these CSS variables.
   - Any class utility like `bg-background` or `border-border` automatically updates its colors dynamically when the root class shifts between light and dark modes.

---

## 7. Summary

- **Total files with hardcoded colors**: `9`
- **Total pages with flat/heavy-shadow cards**: `11`
- **Total empty-state instances needing fixes**: `21`
- **Pages NOT using shared layout/card components**:
  - **Pages Bypassing Shared Layout**: `LoginPage.tsx`, `RegisterPage.tsx`, `ForgotPasswordPage.tsx`, `403Page.tsx`, `404Page.tsx`, `500Page.tsx`, `OfflinePage.tsx`
  - **Pages Bypassing Shared Cards**: `MultiAgentWorkspacePage.tsx`, `AnalyticsPage.tsx`, `GithubIntelligencePage.tsx`
