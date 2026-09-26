import { useEffect, useRef, useState } from 'react'
import { authContext } from './authContext.js'
import { getCurrentUser, login as loginRequest, logout as logoutRequest, signup as signupRequest } from '../services/authService.js'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const authRequestVersion = useRef(0)

  useEffect(() => {
    let active = true
    const requestVersion = authRequestVersion.current
    getCurrentUser()
      .then((currentUser) => {
        if (active && requestVersion === authRequestVersion.current) setUser(currentUser)
      })
      .catch(() => {
        if (active && requestVersion === authRequestVersion.current) setUser(null)
      })
      .finally(() => {
        if (active && requestVersion === authRequestVersion.current) setLoading(false)
      })

    return () => { active = false }
  }, [])

  async function login(credentials) {
    authRequestVersion.current += 1
    try {
      const result = await loginRequest(credentials)
      setUser(result.user)
      return result
    } finally {
      setLoading(false)
    }
  }

  async function signup(details) {
    return signupRequest(details)
  }

  async function logout() {
    authRequestVersion.current += 1
    try {
      await logoutRequest()
    } finally {
      setUser(null)
      setLoading(false)
    }
  }

  return (
    <authContext.Provider value={{ user, login, signup, logout, loading, authenticated: Boolean(user) }}>
      {children}
    </authContext.Provider>
  )
}
