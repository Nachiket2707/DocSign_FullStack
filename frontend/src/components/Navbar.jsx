import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { isAuthenticated, userEmail, logout } = useAuth()
  const navigate = useNavigate()

  const onLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="nav">
      <div className="nav-left">
        <Link to="/" className="brand">
          DOCSIGN
        </Link>
        <Link to="/upload">Upload PDF</Link>
        <Link to="/sign">Sign PDF</Link>
        <Link to="/dashboard">Audit</Link>
      </div>

      <div className="nav-right">
        {isAuthenticated ? (
          <>
            <span className="user-pill">{userEmail || 'User'}</span>
            <button className="btn btn-ghost" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary">
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
