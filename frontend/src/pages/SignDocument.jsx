import { useEffect, useState } from 'react'
import { getDocumentByIdApi, signDocumentApi } from '../api/documentApi'
import { useAuth } from '../context/AuthContext'

const SignDocument = () => {
  const { userEmail, token } = useAuth()
  const [documentId, setDocumentId] = useState('')
  const [page, setPage] = useState('1')
  const [x, setX] = useState('120')
  const [y, setY] = useState('180')
  const [fullName, setFullName] = useState('')
  const [initials, setInitials] = useState('')
  const [signerEmail, setSignerEmail] = useState(userEmail || '')
  const [activeTab, setActiveTab] = useState('signature')
  const [selectedStyle, setSelectedStyle] = useState(0)
  const [selectedColor, setSelectedColor] = useState('#111111')

  const [document, setDocument] = useState(null)
  const [signature, setSignature] = useState(null)
  const [pdfBlobUrl, setPdfBlobUrl] = useState('')
  const [placedSignature, setPlacedSignature] = useState(null)
  const [isDropActive, setIsDropActive] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let objectUrl = ''

    const loadPdf = async () => {
      if (!document?.fileUrl || !token) {
        setPdfBlobUrl('')
        return
      }

      try {
        const baseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim()
        const requestUrl = document.fileUrl.startsWith('http')
          ? document.fileUrl
          : baseUrl
            ? `${baseUrl}${document.fileUrl}`
            : document.fileUrl

        const response = await fetch(requestUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Could not load PDF preview')
        }

        const blob = await response.blob()
        objectUrl = URL.createObjectURL(blob)
        setPdfBlobUrl(objectUrl)
      } catch {
        setPdfBlobUrl('')
      }
    }

    loadPdf()

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [document?.fileUrl, token])

  const loadDocument = async () => {
    if (!documentId) return
    setLoading(true)
    setError('')
    try {
      const data = await getDocumentByIdApi(Number(documentId))
      setDocument(data)
    } catch {
      setError('Failed to load document.')
    } finally {
      setLoading(false)
    }
  }

  const signatureStyles = [
    `${fullName || 'Signature'}`,
    `${fullName || 'Signature'}`,
    `${fullName || 'Signature'}`,
    `${fullName || 'Signature'}`,
  ]

  const styleClasses = ['sig-style-1', 'sig-style-2', 'sig-style-3', 'sig-style-4']
  const previewInitials = initials || 'IN'
  const dragText = activeTab === 'initials' ? previewInitials : signatureStyles[selectedStyle]

  const placeSignatureAtPoint = (clientX, clientY, targetElement) => {
    const rect = targetElement.getBoundingClientRect()
    const relativeX = Math.min(Math.max(clientX - rect.left, 0), rect.width)
    const relativeY = Math.min(Math.max(clientY - rect.top, 0), rect.height)
    const normalizedX = Number(relativeX.toFixed(1))
    const normalizedY = Number(relativeY.toFixed(1))

    setX(String(normalizedX))
    setY(String(normalizedY))

    setPlacedSignature({
      leftPercent: Number(((relativeX / rect.width) * 100).toFixed(2)),
      topPercent: Number(((relativeY / rect.height) * 100).toFixed(2)),
      text: dragText,
    })
  }

  const onPdfDrop = (event) => {
    event.preventDefault()
    setIsDropActive(false)
    placeSignatureAtPoint(event.clientX, event.clientY, event.currentTarget)
  }

  const onPdfClick = (event) => {
    placeSignatureAtPoint(event.clientX, event.clientY, event.currentTarget)
  }

  const onSign = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setSignature(null)
    try {
      const data = await signDocumentApi({
        documentId: Number(documentId),
        signerEmail,
        signerName: fullName || null,
        page: Number(page),
        x: Number(x),
        y: Number(y),
        status: 'SIGNED',
      })
      setSignature(data)
      const updatedDocument = await getDocumentByIdApi(Number(documentId))
      setDocument(updatedDocument)
    } catch (err) {
      setError(err?.response?.data?.error || 'Signature request failed.')
    } finally {
      setLoading(false)
    }
  }

  const downloadSignedPdf = async () => {
    const docMeta = document

    if (!docMeta?.fileUrl || !token) {
      setError('No signed PDF available to download.')
      return
    }

    try {
      const baseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim()
      const requestUrl = docMeta.fileUrl.startsWith('http')
        ? docMeta.fileUrl
        : baseUrl
          ? `${baseUrl}${docMeta.fileUrl}`
          : docMeta.fileUrl

      const response = await fetch(requestUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Download failed')
      }

      const blob = await response.blob()
      const downloadUrl = URL.createObjectURL(blob)
      const link = window.document.createElement('a')
      link.href = downloadUrl
      link.download = `${(docMeta.title || 'document').replace(/\\s+/g, '-')}-signed.pdf`
      link.click()
      URL.revokeObjectURL(downloadUrl)
    } catch {
      setError('Could not download signed PDF.')
    }
  }

  return (
    <section className="sign-editor">
      <div className="sign-top">
        <div>
          <h1>Set your signature details</h1>
          <p className="muted">Select style and place your signature fields on the document.</p>
        </div>
      </div>

      <div className="sign-layout">
        <div className="pdf-workspace">
          <div className="pdf-toolbar">
            <div className="toolbar-group">
              <button className="icon-btn">^</button>
              <button className="icon-btn">v</button>
            </div>
            <div className="toolbar-group">
              <input
                type="number"
                min="1"
                value={page}
                onChange={(e) => setPage(e.target.value)}
                className="page-input"
              />
              <span>/ 1</span>
            </div>
            <div className="toolbar-group file-pill">
              {document?.title || 'Select document file'}
            </div>
          </div>

          <div className="pdf-canvas-wrap">
            <aside className="pdf-thumbs">
              <div className="thumb">1</div>
            </aside>
            <div className="pdf-canvas">
              <div className="pdf-placeholder">
                {document ? (
                  <>
                    {pdfBlobUrl ? (
                      <div
                        className={isDropActive ? 'pdf-drop-layer active' : 'pdf-drop-layer'}
                        onDragOver={(event) => {
                          event.preventDefault()
                          setIsDropActive(true)
                        }}
                        onDragLeave={() => setIsDropActive(false)}
                        onDrop={onPdfDrop}
                        onClick={onPdfClick}
                      >
                        <iframe title="PDF Preview" src={pdfBlobUrl} className="pdf-preview-frame" />
                        <div className="drop-hint">Drop signature here or click to place</div>
                        {placedSignature && (
                          <div
                            className="signature-marker"
                            style={{
                              left: `${placedSignature.leftPercent}%`,
                              top: `${placedSignature.topPercent}%`,
                              color: selectedColor,
                            }}
                          >
                            {placedSignature.text}
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <h3>{document.title}</h3>
                        <p>Document ID: {document.id}</p>
                        <p>File URL: {document.fileUrl}</p>
                        <p>Owner: {document.ownerEmail}</p>
                        <p>Status: {document.status}</p>
                        <p>PDF preview unavailable. Check file URL/auth.</p>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <h3>No document loaded</h3>
                    <p>Enter document ID on the right and click Load document.</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <aside className="sign-panel">
          <h2>Signing options</h2>

          <div className="stack">
            <label>
              Document ID
              <div className="inline-actions">
                <input
                  type="number"
                  min="1"
                  value={documentId}
                  onChange={(e) => setDocumentId(e.target.value)}
                  required
                />
                <button type="button" className="btn btn-ghost" onClick={loadDocument} disabled={loading || !documentId}>
                  Load
                </button>
              </div>
            </label>
          </div>

          <div className="panel-type-grid">
            <button className="type-card active">Simple Signature</button>
            <button className="type-card" disabled>
              Digital Signature
            </button>
          </div>

          <div className="name-grid">
            <label>
              Full name
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" />
            </label>
            <label>
              Initials
              <input value={initials} onChange={(e) => setInitials(e.target.value)} placeholder="IN" />
            </label>
          </div>

          <div className="stack" style={{ marginTop: '0.8rem' }}>
            <label>
              Signer email
              <input
                type="email"
                value={signerEmail}
                onChange={(e) => setSignerEmail(e.target.value)}
                placeholder="signer@company.com"
                required
              />
            </label>
          </div>

          <form onSubmit={onSign} className="stack sign-actions">
            <div className="xy-grid">
              <label>
                X
                <input type="number" step="0.1" value={x} onChange={(e) => setX(e.target.value)} required />
              </label>
              <label>
                Y
                <input type="number" step="0.1" value={y} onChange={(e) => setY(e.target.value)} required />
              </label>
            </div>
            <button className="btn btn-sign" disabled={loading || !documentId || !signerEmail}>
              {loading ? 'Applying...' : 'Apply Signature'}
            </button>
          </form>

          <div className="tabs">
            <button
              className={activeTab === 'signature' ? 'tab active' : 'tab'}
              type="button"
              onClick={() => setActiveTab('signature')}
            >
              Signature
            </button>
            <button
              className={activeTab === 'initials' ? 'tab active' : 'tab'}
              type="button"
              onClick={() => setActiveTab('initials')}
            >
              Initials
            </button>
            <button
              className={activeTab === 'stamp' ? 'tab active' : 'tab'}
              type="button"
              onClick={() => setActiveTab('stamp')}
            >
              Company Stamp
            </button>
          </div>

          <div className="signature-list">
            {signatureStyles.map((item, index) => (
              <button
                key={`${item}-${index}`}
                type="button"
                className={selectedStyle === index ? 'signature-row selected' : 'signature-row'}
                onClick={() => setSelectedStyle(index)}
                draggable
                onDragStart={(event) => {
                  event.dataTransfer.setData('text/plain', 'signature')
                }}
              >
                <span className="radio-dot">{selectedStyle === index ? '●' : '○'}</span>
                <span className={`${styleClasses[index]} signature-preview`} style={{ color: selectedColor }}>
                  {activeTab === 'initials' ? previewInitials : item}
                </span>
              </button>
            ))}
          </div>

          <div className="color-row">
            <span>Color:</span>
            {['#444444', '#ef233c', '#2563eb', '#16a34a'].map((color) => (
              <button
                key={color}
                type="button"
                className={selectedColor === color ? 'color-dot active' : 'color-dot'}
                style={{ background: color }}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>

          {error && <p className="status error">{error}</p>}
          {signature && (
            <div className="detail">
              <p>Signature ID: {signature.id}</p>
              <p>Document ID: {signature.documentId}</p>
              <p>Signer: {signature.signerEmail}</p>
              <p>Name: {signature.signerName || 'N/A'}</p>
              <p>Status: {signature.status}</p>
              <p>
                Position: Page {signature.page} at ({signature.x}, {signature.y})
              </p>
              <button type="button" className="btn" onClick={downloadSignedPdf}>
                Download Signed PDF
              </button>
            </div>
          )}
        </aside>
      </div>
    </section>
  )
}

export default SignDocument
