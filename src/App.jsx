import { Routes, Route } from 'react-router-dom'

import HomePage from './pages/HomePage'
import ProviderDashboard from './pages/PetProvider/ProviderDashboard'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/provider-dashboard" element={<ProviderDashboard />} />
    </Routes>
  )
}