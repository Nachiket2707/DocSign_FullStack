import { useState } from 'react'
import { uploadDocumentApi, uploadDocumentFromFileApi } from '../api/documentApi'
import { useAuth } from '../context/AuthContext'

const UploadDocument = () => {
  const { userEmail } = useAuth()
  const [uploadMode, setUploadMode] = useState('file')
  const [title, setTitle] = useState('')
  const [fileUrl, setFileUrl] = useState('')
  const [file, setFile] = useState(null)
  const [ownerEmail, setOwnerEmail] = useState(userEmail || '')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const data =
        uploadMode === 'file'
          ? await uploadDocumentFromFileApi({ file, title, ownerEmail })
          : await uploadDocumentApi({ title, fileUrl, ownerEmail })
      setResult(data)
      setTitle('')
      setFileUrl('')
      setFile(null)
    } catch (err) {
      setError(err?.response?.data?.error || 'Upload failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="card page-card">
      <h1>Upload Document</h1>
      <div className="tabs">
        <button
          type="button"
          className={uploadMode === 'file' ? 'tab active' : 'tab'}
          onClick={() => setUploadMode('file')}
        >
          Upload from PC
        </button>
        <button
          type="button"
          className={uploadMode === 'url' ? 'tab active' : 'tab'}
          onClick={() => setUploadMode('url')}
        >
          Upload by URL
        </button>
      </div>
      <form onSubmit={onSubmit} className="stack">
        <label>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        {uploadMode === 'file' ? (
          <label>
            PDF file
            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
          </label>
        ) : (
          <label>
            File URL
            <input value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} placeholder="https://..." required />
          </label>
        )}
        <label>
          Owner email
          <input type="email" value={ownerEmail} onChange={(e) => setOwnerEmail(e.target.value)} required />
        </label>
        <button className="btn" disabled={loading || (uploadMode === 'file' && !file)}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {error && <p className="status error">{error}</p>}
      {result && (
        <div className="detail">
          <p>ID: {result.id}</p>
          <p>Title: {result.title}</p>
          <p>File URL: {result.fileUrl}</p>
          <p>Owner: {result.ownerEmail}</p>
          <p>Status: {result.status}</p>
        </div>
      )}
    </section>
  )
}

export default UploadDocument
