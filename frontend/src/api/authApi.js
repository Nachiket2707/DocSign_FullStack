import api from './axiosConfig'

export const registerApi = async (email, password) => {
  const { data } = await api.post('/auth/register', { email, password })
  return data
}

export const loginApi = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password })
  return data
}
