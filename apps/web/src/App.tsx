import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { MarketingDirectorDashboard } from './pages/MarketingDirectorDashboard'

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MarketingDirectorDashboard />} />
        <Route path="/director" element={<MarketingDirectorDashboard />} />
      </Routes>
    </Router>
  )
}