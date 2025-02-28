import './App.css'

import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ToasterContainer from './components/Toaster'
import { useAuth } from './services/auth.service'
import Login from './pages/Login'
import MainLayout from './pages/MainLayout';

function App() {
  const fetchUser = useAuth(state => state.fetchUser)
  const token = localStorage.getItem("token")

  useEffect(() => {
    if (localStorage.getItem("isAuthenticated")) {
      fetchUser()
    }
  }, [])

  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
          <Route path="*" element={token ? <MainLayout /> : <Navigate to="/login" />} />
        </Routes>
      </Router>
      <ToasterContainer />
    </>
  )
}

export default App
