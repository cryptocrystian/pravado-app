import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { Dashboard } from './pages/Dashboard'
import { Campaigns } from './pages/Campaigns'
import { MediaDB } from './pages/MediaDB'
import { ContentStudio } from './pages/ContentStudio'
import { SEO } from './pages/SEO'
import { PR } from './pages/PR'
import { Analytics } from './pages/Analytics'
import { Copilot } from './pages/Copilot'
import { Settings } from './pages/Settings'
import './styles/globals.css'

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/media" element={<MediaDB />} />
          <Route path="/content" element={<ContentStudio />} />
          <Route path="/seo" element={<SEO />} />
          <Route path="/pr" element={<PR />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/copilot" element={<Copilot />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </AppLayout>
    </Router>
  )
}

export default App
