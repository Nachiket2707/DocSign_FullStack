import api from './axiosConfig'

export const uploadDocumentApi = async ({ title, fileUrl, ownerEmail }) => {
  const { data } = await api.post('/documents', { title, fileUrl, ownerEmail })
  return data
}

export const uploadDocumentFromFileApi = async ({ file, title, ownerEmail }) => {
  const formData = new FormData()
  formData.append('file', file)
  if (title) formData.append('title', title)
  formData.append('ownerEmail', ownerEmail)
  const { data } = await api.post('/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return data
}

export const getDocumentByIdApi = async (id) => {
  const { data } = await api.get(`/documents/${id}`)
  return data
}

export const signDocumentApi = async ({ documentId, signerEmail, signerName, page, x, y, status = 'SIGNED' }) => {
  const { data } = await api.post('/signatures', { documentId, signerEmail, signerName, page, x, y, status })
  return data
}

export const getAuditsApi = async () => {
  const { data } = await api.get('/audits')
  return data
}
