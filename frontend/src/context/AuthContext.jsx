/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'
import { loginApi, registerApi } from '../api/authApi'

const AuthContext = createContext(null)
const TOKEN_KEY = 'docsign_token'

const decodeEmailFromToken = (token) => {
  try {
    const payload = token.split('.')[1]
    if (!payload) return ''
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
    const parsed = JSON.parse(atob(padded))
    return parsed.sub || ''
  } catch {
    return ''
  }
}

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '')
  const [userEmail, setUserEmail] = useState(() => decodeEmailFromToken(localStorage.getItem(TOKEN_KEY) || ''))

  const applyToken = (nextToken) => {
    localStorage.setItem(TOKEN_KEY, nextToken)
    setToken(nextToken)
    setUserEmail(decodeEmailFromToken(nextToken))
  }

  const login = async (email, password) => {
    const response = await loginApi(email, password)
    applyToken(response.token)
  }

  const register = async (email, password) => {
    const response = await registerApi(email, password)
    applyToken(response.token)
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    setToken('')
    setUserEmail('')
  }

  const value = {
    token,
    userEmail,
    isAuthenticated: Boolean(token),
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
