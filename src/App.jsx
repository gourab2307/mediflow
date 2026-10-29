
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import AuthPage from './pages/AuthPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/patient/dashboard"
          element={<h1>Patient Dashboard — Coming Soon</h1>}
        />

        <Route
          path="/doctor/dashboard"
          element={<h1>Doctor Dashboard — Coming Soon</h1>}
        />

        <Route
          path="/admin/dashboard"
          element={<h1>Admin Dashboard — Coming Soon</h1>}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
