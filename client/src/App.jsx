import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import axios from 'axios'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import Pets from './components/Pets'
import Appointments from './components/Appointments'
import Navbar from './components/Navbar'
import ToastContainer from './components/ToastContainer'
import './App.css'

// Configure axios defaults
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
axios.defaults.withCredentials = true

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toasts, setToasts] = useState([])

  const showToast = (message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type, duration }])
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        const response = await axios.get('/auth/profile')
        setUser(response.data.data.user)
      }
    } catch (error) {
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (userData, token) => {
    setUser(userData)
    localStorage.setItem('token', token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  const handleLogout = async () => {
    try {
      await axios.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    }
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <Router>
      <div className="App">
        {user && <Navbar user={user} onLogout={handleLogout} />}
        <ToastContainer toasts={toasts} removeToast={removeToast} />
        <Routes>
          <Route 
            path="/login" 
            element={!user ? <Login onLogin={handleLogin} showToast={showToast} /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/register" 
            element={!user ? <Register onLogin={handleLogin} showToast={showToast} /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard user={user} showToast={showToast} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/pets" 
            element={user ? <Pets user={user} showToast={showToast} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/appointments" 
            element={user ? <Appointments user={user} showToast={showToast} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/" 
            element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
