import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Dashboard.css'

const Dashboard = ({ user, showToast }) => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    pets: 0,
    appointments: 0,
    veterinarians: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      if (user.role === 'client') {
        const [petsRes, appointmentsRes] = await Promise.all([
          axios.get('/pets'),
          axios.get('/appointments')
        ])
        setStats({
          pets: petsRes.data.data.pets.length,
          appointments: appointmentsRes.data.data.appointments.length,
          veterinarians: 0
        })
      } else if (user.role === 'veterinarian') {
        const appointmentsRes = await axios.get('/appointments')
        setStats({
          pets: 0,
          appointments: appointmentsRes.data.data.appointments.length,
          veterinarians: 0
        })
      } else if (user.role === 'admin') {
        const [petsRes, appointmentsRes, usersRes] = await Promise.all([
          axios.get('/pets'),
          axios.get('/appointments'),
          axios.get('/users')
        ])
        const veterinarians = usersRes.data.data.users.filter(u => u.role === 'veterinarian')
        setStats({
          pets: petsRes.data.data.pets.length,
          appointments: appointmentsRes.data.data.appointments.length,
          veterinarians: veterinarians.length
        })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading dashboard...</div>
  }

  return (
    <div className="container">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {user.name}!</h1>
          <p>Role: <span className={`role-badge role-${user.role}`}>{user.role}</span></p>
        </div>
        {user.role === 'veterinarian' && (
          <button className="btn btn-primary" onClick={() => navigate('/appointments')}>
            View Appointments
          </button>
        )}
      </div>

      <div className="stats-grid">
        {user.role === 'client' && (
          <>
                <div className="stat-card" onClick={() => navigate('/pets')}>
                  <h3>My Pets</h3>
                  <p className="stat-number">{stats.pets}</p>
                </div>
                <div className="stat-card" onClick={() => navigate('/appointments')}>
                  <h3>Appointments</h3>
                  <p className="stat-number">{stats.appointments}</p>
                </div>
          </>
        )}

        {user.role === 'veterinarian' && (
          <div className="stat-card" onClick={() => navigate('/appointments')}>
            <h3>My Appointments</h3>
            <p className="stat-number">{stats.appointments}</p>
          </div>
        )}

        {user.role === 'admin' && (
          <>
            <div className="stat-card">
              <h3>Total Pets</h3>
              <p className="stat-number">{stats.pets}</p>
            </div>
            <div className="stat-card" onClick={() => navigate('/appointments')}>
              <h3>Appointments</h3>
              <p className="stat-number">{stats.appointments}</p>
            </div>
            <div className="stat-card">
              <h3>Veterinarians</h3>
              <p className="stat-number">{stats.veterinarians}</p>
            </div>
          </>
        )}
      </div>

      <div className="dashboard-content">
        {user.role === 'client' && (
          <div className="card">
            <h2>Quick Actions</h2>
            <div className="quick-actions">
              <button className="action-btn" onClick={() => navigate('/pets')}>
                Add New Pet
              </button>
              <button className="action-btn" onClick={() => navigate('/appointments')}>
                Book Appointment
              </button>
            </div>
          </div>
        )}

        {user.role === 'veterinarian' && (
          <div className="card">
            <h2>Welcome, Dr. {user.name}</h2>
            <p style={{ color: '#666', marginBottom: '16px' }}>View and manage your appointments from the Appointments page.</p>
            <button className="btn btn-primary" onClick={() => navigate('/appointments')}>
              View Appointments
            </button>
          </div>
        )}

        {user.role === 'admin' && (
          <div className="card">
            <h2>Admin Dashboard</h2>
            <p style={{ color: '#666', marginBottom: '16px' }}>View all appointments, manage users, and monitor system activity.</p>
            <div className="quick-actions">
              <button className="action-btn" onClick={() => navigate('/appointments')}>
                View All Appointments
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
