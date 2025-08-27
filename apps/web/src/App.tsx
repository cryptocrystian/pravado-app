import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { Dashboard } from './pages/Dashboard'
import { ContentStudio } from './pages/ContentStudio'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="campaigns" element={<div className="text-white">Campaigns (Coming Soon)</div>} />
          <Route path="media" element={<div className="text-white">Media DB (Coming Soon)</div>} />
          <Route path="content" element={<ContentStudio />} />
          <Route path="seo" element={<div className="text-white">SEO/GEO (Coming Soon)</div>} />
          <Route path="analytics" element={<div className="text-white">Analytics (Coming Soon)</div>} />
          <Route path="copilot" element={<div className="text-white">Copilot (Coming Soon)</div>} />
          <Route path="settings" element={<div className="text-white">Settings (Coming Soon)</div>} />
          <Route path="settings/brand" element={<div className="text-white">Brand Settings (Coming Soon)</div>} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App