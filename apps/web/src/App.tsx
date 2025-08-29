import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { useThemeRouting } from './hooks/useThemeRouting'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { MarketingDirectorDashboard } from './pages/MarketingDirectorDashboard'
import { ContentStudio } from './pages/ContentStudio'
import { ThemeProvider } from './contexts/ThemeContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import { queryClient } from './lib/query-client'
import './styles/globals.css'

function AppContent() {
  useThemeRouting()
  
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/director" element={<MarketingDirectorDashboard />} />
        <Route path="/content" element={<ContentStudio />} />
        <Route path="/editor" element={<ContentStudio />} />
        <Route path="/analytics" element={<div>Analytics (Coming Soon)</div>} />
        <Route path="/seo" element={<div>SEO/GEO (Coming Soon)</div>} />
        <Route path="/copilot" element={<div>Copilot (Coming Soon)</div>} />
        <Route path="/security" element={<div>Security (Coming Soon)</div>} />
        <Route path="/brand" element={<div>Brand Settings (Coming Soon)</div>} />
        <Route path="/campaigns" element={<div>Campaigns (Coming Soon)</div>} />
        <Route path="/media" element={<div>Media DB (Coming Soon)</div>} />
        <Route path="/settings" element={<div>Settings (Coming Soon)</div>} />
      </Routes>
    </Layout>
  )
}

export function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Router>
            <AppContent />
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}