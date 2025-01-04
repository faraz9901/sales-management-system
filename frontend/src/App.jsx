import './App.css'

import salesService from './services/sales.service'
import { useToaster } from './services/toaster.service'
import { useEffect, useState } from 'react'
import Records from './pages/Records'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NotFound from './pages/NotFound'
import ToasterContainer from './components/Toaster'
import AddSales from './pages/AddSales'
import EditSales from './pages/EditSales'
import { useAuth } from './services/auth.service'
import Login from './pages/Login'
import { LogOut } from 'lucide-react'
function App() {

  const fetchUser = useAuth(state => state.fetchUser)
  const logout = useAuth(state => state.logOut)
  const user = useAuth(state => state.user)


  useEffect(() => {
    if (localStorage.getItem("isAuthenticated")) {
      fetchUser()
    }
  }, [])


  return (
    <>
      <div className='p-3'>

        <div className='flex justify-between'>
          <h1 className='text-3xl font-bold'>Sales Tracker</h1>


          {user &&
            <div className="tooltip tooltip-bottom" data-tip="Logout">
              <button type='button' className='btn'>
                <LogOut onClick={() => {
                  logout()
                  window.location.reload()
                }} />
              </button>
            </div>
          }
        </div>
        <Router>
          <Routes>
            <Route path="/" element={user ? <Records /> : <Navigate to="/login" />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/add" element={user ? <AddSales /> : <Navigate to="/login" />} />
            <Route path="/edit/:id" element={user ? <EditSales /> : <Navigate to="/login" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </div>
      <ToasterContainer />
    </>
  )
}

export default App
