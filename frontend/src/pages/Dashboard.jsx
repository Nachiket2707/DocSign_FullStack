import { useState } from 'react'
import { getAuditsApi } from '../api/documentApi'

const Dashboard = () => {
  const [audits, setAudits] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadAudits = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getAuditsApi()
      setAudits(Array.isArray(data) ? data : [])
    } catch {
      setError('Could not load audit logs.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="card page-card">
      <h1>Dashboard</h1>
      <p>Use the navigation to upload and sign documents.</p>
      <button className="btn" onClick={loadAudits} disabled={loading}>
        {loading ? 'Loading...' : 'Load Audit Logs'}
      </button>
      {error && <p className="status error">{error}</p>}
      <div className="audit-list">
        {audits.map((item) => (
          <article key={item.id} className="audit-item">
            <p>
              <strong>{item.actor}</strong> {item.action}
            </p>
            <p className="muted">{new Date(item.createdAt).toLocaleString()}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Dashboard
