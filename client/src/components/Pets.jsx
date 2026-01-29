import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Pets.css'

const Pets = ({ user, showToast }) => {
  const navigate = useNavigate()
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    species: 'Dog',
    breed: '',
    age: '',
    weight: ''
  })
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPets()
  }, [])

  const fetchPets = async () => {
    try {
      const response = await axios.get('/pets')
      setPets(response.data.data.pets)
    } catch (error) {
      setError('Failed to fetch pets')
      showToast('Failed to load pets', 'error')
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
      await axios.post('/pets', formData)
      setShowForm(false)
      setFormData({ name: '', species: 'Dog', breed: '', age: '', weight: '' })
      showToast('Pet added successfully!', 'success')
      fetchPets()
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create pet'
      setError(errorMsg)
      showToast(errorMsg, 'error')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this pet?')) return

    try {
      await axios.delete(`/pets/${id}`)
      showToast('Pet deleted successfully', 'success')
      fetchPets()
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete pet'
      showToast(errorMsg, 'error')
    }
  }

  const handleBookAppointment = (petId) => {
    navigate(`/appointments?pet=${petId}`)
  }

  if (loading) {
    return <div className="loading">Loading pets...</div>
  }

  return (
    <div className="container">
      <div className="pets-header">
        <h1>My Pets</h1>
        {user.role === 'client' && (
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            {showForm ? 'Cancel' : 'Add New Pet'}
          </button>
        )}
      </div>

      {showForm && user.role === 'client' && (
        <div className="card">
          <h2>Add New Pet</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Pet Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter pet name"
              />
            </div>
            <div className="form-group">
              <label>Species</label>
              <select name="species" value={formData.species} onChange={handleChange}>
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Bird">Bird</option>
                <option value="Rabbit">Rabbit</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Breed</label>
              <input
                type="text"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                placeholder="e.g., Golden Retriever"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Age (years)</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                />
              </div>
              <div className="form-group">
                <label>Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  placeholder="0.0"
                />
              </div>
            </div>
            {error && <div className="error">{error}</div>}
            <button type="submit" className="btn btn-primary">Add Pet</button>
          </form>
        </div>
      )}

      {error && !showForm && <div className="error">{error}</div>}

      <div className="pets-grid">
        {pets.length === 0 ? (
          <div className="card empty-state">
            <h3>No pets found</h3>
            {user.role === 'client' && (
              <>
                <p style={{ color: '#666', marginBottom: '16px' }}>Add your first pet to get started!</p>
                <button onClick={() => setShowForm(true)} className="btn btn-primary">
                  Add Pet
                </button>
              </>
            )}
          </div>
        ) : (
          pets.map(pet => (
            <div key={pet._id} className="pet-card">
              <div className="pet-header">
                <h3>{pet.name}</h3>
                <span className="pet-species">{pet.species}</span>
              </div>
              <div className="pet-details">
                {pet.breed && <p><strong>Breed:</strong> {pet.breed}</p>}
                {pet.age && <p><strong>Age:</strong> {pet.age} years</p>}
                {pet.weight && <p><strong>Weight:</strong> {pet.weight} kg</p>}
              </div>
              <div className="pet-actions">
                {user.role === 'client' && (
                  <button
                    onClick={() => handleBookAppointment(pet._id)}
                    className="btn btn-primary"
                  >
                    Book Appointment
                  </button>
                )}
                {user.role === 'client' && (
                  <button
                    onClick={() => handleDelete(pet._id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Pets
