"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const router = useRouter()
  const [auth, setAuth] = useState({ status: "loading" })

  async function refreshMe() {
    const res = await fetch("/api/auth/me", { cache: "no-store" })
    if (!res.ok) {
      setAuth({ status: "unauthenticated" })
      return
    }
    const me = await res.json()
    setAuth({
      status: "authenticated",
      username: me.username || "unknown",
      role: me.role,
    })
  }

  useEffect(() => {
    refreshMe()
  }, [])

  async function login(username, password) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })

    if (!res.ok) {
      const msg = await res.text().catch(() => "Login failed")
      throw new Error(msg)
    }

    await refreshMe()
    router.replace("/")
    router.refresh()
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" })
    setAuth({ status: "unauthenticated" })
    router.replace("/login")
    router.refresh()
  }

  const value = useMemo(() => ({ auth, login, logout }), [auth])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>")
  return ctx
}
