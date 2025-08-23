import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Dashboard from './pages/Dashboard'
import Analytics from './pages/Analytics'
import { trackEvent } from './lib/analytics'
import { useEffect } from 'react'

function App() {
  useEffect(() => {
    // Track app initialization
    trackEvent('app_initialized', {
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
    })
  }, [])

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  )
}

export default App