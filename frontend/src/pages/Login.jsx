import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const onSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch {
      setError('Login failed. Check credentials and backend status.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-card">
      <h1>Login</h1>
      <form onSubmit={onSubmit} className="stack">
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button className="btn" disabled={loading}>
          {loading ? 'Please wait...' : 'Login'}
        </button>
      </form>
      {error && <p className="status error">{error}</p>}
      <p>
        No account? <Link to="/register">Register</Link>
      </p>
    </section>
  )
}

export default Login
