import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { GuestRoute } from '@/routes/GuestRoute'
import DashboardLayout from '@/layouts/DashboardLayout'

// Lazy loaded page views for code splitting
import React, { Suspense, useState, useEffect } from 'react'
import { Loader } from '@/components/ui/Loader'

const LoginPage = React.lazy(() => import('@/pages/LoginPage'))
const RegisterPage = React.lazy(() => import('@/pages/RegisterPage'))
const ForgotPasswordPage = React.lazy(() => import('@/pages/ForgotPasswordPage'))
const DashboardPage = React.lazy(() => import('@/pages/DashboardPage'))
const ResumesPage = React.lazy(() => import('@/pages/ResumesPage'))
const AtsPage = React.lazy(() => import('@/pages/AtsPage'))
const InterviewPage = React.lazy(() => import('@/pages/InterviewPage'))
const RoadmapPage = React.lazy(() => import('@/pages/RoadmapPage'))
const SettingsPage = React.lazy(() => import('@/pages/SettingsPage'))
const ProfilePage = React.lazy(() => import('@/pages/ProfilePage'))
const ResumeIntelligencePage = React.lazy(() => import('@/pages/ResumeIntelligencePage'))
const CoverLetterPage = React.lazy(() => import('@/pages/CoverLetterPage'))
const RAGWorkspacePage = React.lazy(() => import('@/pages/RAGWorkspacePage'))
const MultiAgentWorkspacePage = React.lazy(() => import('@/pages/MultiAgentWorkspacePage'))
const AnalyticsPage = React.lazy(() => import('@/pages/AnalyticsPage'))
const GithubIntelligencePage = React.lazy(() => import('@/pages/GithubIntelligencePage'))
const NotFoundPage = React.lazy(() => import('@/pages/404Page'))
const ForbiddenPage = React.lazy(() => import('@/pages/403Page'))
const ServerErrorPage = React.lazy(() => import('@/pages/500Page'))
const OfflinePage = React.lazy(() => import('@/pages/OfflinePage'))

export function AppRoutes() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine)

  useEffect(() => {
    const handleOffline = () => setIsOffline(true)
    const handleOnline = () => setIsOffline(false)

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)

    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [])

  if (isOffline) {
    return (
      <Suspense fallback={<Loader fullScreen label="Offline. Establishing reconnection..." />}>
        <OfflinePage />
      </Suspense>
    )
  }

  return (
    <Suspense fallback={<Loader fullScreen label="Loading application..." />}>
      <Routes>
        {/* Public Routes with Guest Restrictions */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <RegisterPage />
            </GuestRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <GuestRoute>
              <ForgotPasswordPage />
            </GuestRoute>
          }
        />

        {/* Protected Dashboard Workspace Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Default Root Redirects to Dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="resumes" element={<ResumesPage />} />
          <Route path="resume-intelligence" element={<ResumeIntelligencePage />} />
          <Route path="ats" element={<AtsPage />} />
          <Route path="cover-letter" element={<CoverLetterPage />} />
          <Route path="interview" element={<InterviewPage />} />
          <Route path="roadmap" element={<RoadmapPage />} />
          <Route path="rag-workspace" element={<RAGWorkspacePage />} />
          <Route path="agents" element={<MultiAgentWorkspacePage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="github-intelligence" element={<GithubIntelligencePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Error Pages */}
        <Route path="/403" element={<ForbiddenPage />} />
        <Route path="/500" element={<ServerErrorPage />} />
        <Route path="/404" element={<NotFoundPage />} />

        {/* Fallback Catch-all Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
export default AppRoutes
