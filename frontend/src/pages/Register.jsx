import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  const onSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(email, password)
      navigate('/dashboard')
    } catch {
      setError('Register failed. Try another email or check backend logs.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-card">
      <h1>Register</h1>
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
          {loading ? 'Please wait...' : 'Create account'}
        </button>
      </form>
      {error && <p className="status error">{error}</p>}
      <p>
        Have an account? <Link to="/login">Login</Link>
      </p>
    </section>
  )
}

export default Register
