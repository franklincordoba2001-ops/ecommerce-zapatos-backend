import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../lib/api'

const AuthContext = createContext(null)

function decodeToken(token) {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const raw = atob(base64)
    const bytes = Uint8Array.from(raw, (c) => c.charCodeAt(0))
    const json = new TextDecoder().decode(bytes)
    const parsed = JSON.parse(json)
    if (parsed.exp && parsed.exp * 1000 < Date.now()) {
      return null
    }
    return parsed
  } catch (e) {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const payload = decodeToken(token)
      if (payload) {
        setUser({ token, ...payload })
      } else {
        localStorage.removeItem('token')
      }
    }

    const resInterceptor = api.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token')
          setUser(null)
        }
        return Promise.reject(err)
      }
    )

    return () => {
      api.interceptors.response.eject(resInterceptor)
    }
  }, [])

  async function login(email, password) {
    const res = await api.post('/auth/login', { email, password })
    const token = res.data?.access_token
    if (!token) throw new Error('No token received')
    localStorage.setItem('token', token)
    const payload = decodeToken(token)
    setUser(payload ? { token, ...payload } : { token })
    return true
  }

  function logout() {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
