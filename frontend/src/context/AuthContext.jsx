import { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const savedToken = localStorage.getItem("token")
  const [token, setToken] = useState(
    savedToken && savedToken !== "undefined" ? savedToken : null
  )

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // 🔥 FIX: Run whenever token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      fetchUser()
    } else {
      delete axios.defaults.headers.common["Authorization"]
      setLoading(false)
    }
  }, [token])

  const fetchUser = async () => {
    try {
      const res = await axios.get("/api/auth/me")
      setUser(res.data.user)
    } catch (err) {
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const res = await axios.post("/api/auth/login", { email, password })

      const newToken = res.data.token
      const userData = res.data.user

      localStorage.setItem("token", newToken)
      setToken(newToken)
      setUser(userData)

      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Login failed" }
    }
  }

  const register = async (username, email, password) => {
    try {
      const res = await axios.post("/api/auth/register", { username, email, password })

      const newToken = res.data.token
      const userData = res.data.user

      localStorage.setItem("token", newToken)
      setToken(newToken)
      setUser(userData)

      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Registration failed" }
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
