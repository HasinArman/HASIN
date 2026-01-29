import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import './Appointments.css'

const Appointments = ({ user, showToast }) => {
  const [searchParams] = useSearchParams()
  const selectedPetId = searchParams.get('pet')
  
  const [appointments, setAppointments] = useState([])
  const [pets, setPets] = useState([])
  const [veterinarians, setVeterinarians] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    pet: selectedPetId || '',
    veterinarian: '',
    date: '',
    time: '',
    reason: ''
  })
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
    if (selectedPetId) {
      setShowForm(true)
    }
  }, [selectedPetId])

  const fetchData = async () => {
    try {
      const promises = [axios.get('/appointments')]
      
      if (user.role === 'client') {
        promises.push(axios.get('/pets'))
        promises.push(axios.get('/users/veterinarians'))
      }

      const results = await Promise.all(promises)
      setAppointments(results[0].data.data.appointments)

      if (user.role === 'client') {
        setPets(results[1].data.data.pets)
        setVeterinarians(results[2].data.data.veterinarians)
      }
    } catch (error) {
      setError('Failed to fetch data')
      showToast('Failed to load data', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = await axios.post('/appointments', formData)
      setShowForm(false)
      setFormData({ pet: '', veterinarian: '', date: '', time: '', reason: '' })
      showToast('Appointment booked successfully! 🎉', 'success')
      fetchData()
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create appointment'
      setError(errorMsg)
      showToast(errorMsg, 'error')
    }
  }

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.put(`/appointments/${id}`, { status: newStatus })
      showToast(`Appointment ${newStatus} successfully`, 'success')
      fetchData()
    } catch (err) {
      showToast('Failed to update appointment', 'error')
    }
  }

  if (loading) {
    return <div className="loading">Loading appointments...</div>
  }

  return (
    <div className="container">
      <div className="appointments-header">
        <h1>
          {user.role === 'admin' ? 'All Appointments' : 
           user.role === 'veterinarian' ? 'My Appointments' : 
           'My Appointments'}
        </h1>
        {user.role === 'client' && (
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            {showForm ? 'Cancel' : 'Book Appointment'}
          </button>
        )}
      </div>

      {showForm && user.role === 'client' && (
        <div className="card">
          <h2>Book New Appointment</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Select Pet *</label>
              <select name="pet" value={formData.pet} onChange={handleChange} required>
                <option value="">Choose a pet</option>
                {pets.map(pet => (
                  <option key={pet._id} value={pet._id}>
                    {pet.name} ({pet.species})
                  </option>
                ))}
              </select>
              {pets.length === 0 && (
                <p className="help-text">No pets found. <a href="/pets">Add a pet first</a></p>
              )}
            </div>
            <div className="form-group">
              <label>Select Veterinarian *</label>
              <select name="veterinarian" value={formData.veterinarian} onChange={handleChange} required>
                <option value="">Choose a veterinarian</option>
                {veterinarians.map(vet => (
                  <option key={vet._id} value={vet._id}>
                    Dr. {vet.name} {vet.email && `(${vet.email})`}
                  </option>
                ))}
              </select>
              {veterinarians.length === 0 && (
                <p className="help-text">No veterinarians available</p>
              )}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="form-group">
                <label>Time *</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Reason for Visit *</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Describe the reason for the appointment..."
              />
            </div>
            {error && <div className="error">{error}</div>}
            <button type="submit" className="btn btn-primary" disabled={pets.length === 0 || veterinarians.length === 0}>
              Book Appointment
            </button>
          </form>
        </div>
      )}

      {error && !showForm && <div className="error">{error}</div>}

      <div className="appointments-list">
        {appointments.length === 0 ? (
          <div className="card empty-state">
            <h3>No appointments found</h3>
            {user.role === 'client' && (
              <p style={{ color: '#666' }}>Book your first appointment to get started!</p>
            )}
          </div>
        ) : (
          appointments.map(appointment => (
            <div key={appointment._id} className="appointment-card">
              <div className="appointment-header">
                <div>
                  <h3>{appointment.pet?.name || 'Unknown Pet'}</h3>
                  {user.role === 'admin' && appointment.owner && (
                    <p className="appointment-owner">
                      <strong>Client:</strong> {appointment.owner.name} ({appointment.owner.email})
                    </p>
                  )}
                </div>
                <span className={`status-badge status-${appointment.status}`}>
                  {appointment.status}
                </span>
              </div>
              <div className="appointment-details">
                <div className="detail-item">
                  <span className="detail-label">Date:</span>
                  <span>{new Date(appointment.date).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Time:</span>
                  <span>{appointment.time}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Veterinarian:</span>
                  <span>{appointment.veterinarian?.name || 'Not assigned'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Reason:</span>
                  <span>{appointment.reason}</span>
                </div>
                {appointment.notes && (
                  <div className="detail-item">
                    <span className="detail-label">Notes:</span>
                    <span>{appointment.notes}</span>
                  </div>
                )}
              </div>
              {(user.role === 'veterinarian' || user.role === 'admin') && (
                <div className="appointment-actions">
                  {appointment.status === 'scheduled' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(appointment._id, 'completed')}
                        className="btn btn-success"
                      >
                        Mark Complete
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(appointment._id, 'cancelled')}
                        className="btn btn-danger"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Appointments
