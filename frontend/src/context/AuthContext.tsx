"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  role: "Administrateur" | "Utilisateur"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Mock login - in a real app, this would call an API
    setLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock users
    const adminUser: User = {
      id: "1",
      name: "Admin User",
      email: "admin@example.com",
      role: "Administrateur",
    }

    const regularUser: User = {
      id: "2",
      name: "Regular User",
      email: "user@example.com",
      role: "Utilisateur",
    }

    let loggedInUser: User | null = null

    if (email === "admin@example.com" && password === "admin") {
      loggedInUser = adminUser
    } else if (email === "user@example.com" && password === "user") {
      loggedInUser = regularUser
    } else {
      setLoading(false)
      throw new Error("Invalid credentials")
    }

    setUser(loggedInUser)
    localStorage.setItem("user", JSON.stringify(loggedInUser))
    setLoading(false)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>
}

