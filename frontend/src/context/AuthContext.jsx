import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

  const refreshSession = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, { withCredentials: true })
      if (res.status === 200) {
        setIsAuthenticated(true)
        setUser(res.data?.user || null)
      } else {
        setIsAuthenticated(false)
        setUser(null)
      }
    } catch (err) {
      setIsAuthenticated(false)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const logout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`, { withCredentials: true })
    } catch (_) {
      // ignore
    } finally {
      setIsAuthenticated(false)
      setUser(null)
    }
  }

  const value = useMemo(() => ({ isLoading, isAuthenticated, user, refreshSession, logout }), [isLoading, isAuthenticated, user])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)


