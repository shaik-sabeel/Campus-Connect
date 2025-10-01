import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'; // NEW

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const navigate = useNavigate(); // NEW

  const refreshSession = async () => {
    setIsLoading(true)
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, { withCredentials: true })
      if (res.status === 200 && res.data?.user) {
        setIsAuthenticated(true)
        setUser(res.data.user)
      } else {
        setIsAuthenticated(false)
        setUser(null)
      }
    } catch (err) {
      console.error('Session refresh failed:', err);
      setIsAuthenticated(false)
      setUser(null)
      // Optionally redirect to login if refresh failed while already authenticated
      // if (err.response?.status === 401) { navigate('/login'); }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty dependency array means this runs once on mount

  const logout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`, { withCredentials: true })
    } catch (err) {
      console.error('Logout error:', err);
      // Even if backend fails, force frontend logout
    } finally {
      setIsAuthenticated(false)
      setUser(null)
      navigate('/login'); // NEW: Redirect to login after logout
    }
  }
  
  // Memoize the value to prevent unnecessary re-renders of children
  const value = useMemo(() => ({ isLoading, isAuthenticated, user, refreshSession, logout, setUser }), [isLoading, isAuthenticated, user])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)