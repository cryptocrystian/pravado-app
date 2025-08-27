import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useThemeRouting } from './hooks/useThemeRouting'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { ContentStudio } from './pages/ContentStudio'
import './styles/globals.css'

function AppContent() {
  useThemeRouting()
  
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/content" element={<ContentStudio />} />
        <Route path="/editor" element={<ContentStudio />} />
        <Route path="/analytics" element={<div>Analytics (Coming Soon)</div>} />
        <Route path="/seo" element={<div>SEO/GEO (Coming Soon)</div>} />
        <Route path="/copilot" element={<div>Copilot (Coming Soon)</div>} />
        <Route path="/security" element={<div>Security (Coming Soon)</div>} />
        <Route path="/brand" element={<div>Brand Settings (Coming Soon)</div>} />
      </Routes>
    </Layout>
  )
}

export function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}