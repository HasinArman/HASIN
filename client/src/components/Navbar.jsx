import { Link } from 'react-router-dom'
import './Navbar.css'

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-content">
          <Link to="/dashboard" className="nav-brand">
            Pet Healthcare
          </Link>
          <div className="nav-links">
            <Link to="/dashboard">Dashboard</Link>
            {user.role === 'client' && <Link to="/pets">My Pets</Link>}
            <Link to="/appointments">
              {user.role === 'admin' ? 'All Appointments' : 
               user.role === 'veterinarian' ? 'My Appointments' : 
               'Appointments'}
            </Link>
            <span className="nav-user">
              {user.name}
            </span>
            <button onClick={onLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
