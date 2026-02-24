import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Home = () => {
  const { isAuthenticated } = useAuth()

  const tools = [
    {
      title: 'Upload PDF',
      description: 'Create a new document record and start the signing workflow.',
      to: isAuthenticated ? '/upload' : '/login',
      cta: 'Select PDF file',
    },
    {
      title: 'Sign Document',
      description: 'Place signature coordinates on a page for legal traceability.',
      to: isAuthenticated ? '/sign' : '/login',
      cta: 'Add signature',
    },
    {
      title: 'Audit Timeline',
      description: 'Review who did what and when across the signing lifecycle.',
      to: isAuthenticated ? '/dashboard' : '/login',
      cta: 'View logs',
    },
  ]

  return (
    <main className="home">
      <section className="hero">
        <p className="eyebrow">DIGITAL DOCUMENT WORKFLOW</p>
        <h1>Every tool you need to sign PDFs faster</h1>
        <p>
          Upload, sign, and track enterprise documents using your Java backend. Built for secure approvals, auditability,
          and fast operations.
        </p>
        <div className="hero-actions">
          <Link to={isAuthenticated ? '/upload' : '/register'} className="btn btn-primary">
            {isAuthenticated ? 'Start signing now' : 'Get started free'}
          </Link>
          <Link to={isAuthenticated ? '/dashboard' : '/login'} className="btn btn-ghost-dark">
            {isAuthenticated ? 'Open dashboard' : 'I already have an account'}
          </Link>
        </div>
      </section>

      <section className="tools-grid">
        {tools.map((tool) => (
          <article className="tool-card" key={tool.title}>
            <h2>{tool.title}</h2>
            <p>{tool.description}</p>
            <Link to={tool.to} className="tool-link">
              {tool.cta}
            </Link>
          </article>
        ))}
      </section>
    </main>
  )
}

export default Home
