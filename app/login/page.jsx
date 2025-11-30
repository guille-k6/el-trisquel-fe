"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth/auth-context"

export default function LoginPage() {
  const { login, auth } = useAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(username, password)
    } catch (err) {
      setError(err?.message || "Login failed")
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900 text-zinc-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 shadow-xl">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="text-sm text-zinc-400 mt-1">Use your Spring Boot credentials.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm text-zinc-300 mb-1">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-500"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-500"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-900 bg-red-950/40 px-3 py-2 text-sm text-red-200">
              {error}
            </div>
          )}

          <button
            disabled={loading || auth.status === "loading"}
            className="w-full rounded-xl bg-zinc-100 text-zinc-900 font-medium py-2 hover:bg-white disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-4 text-xs text-zinc-500">
          Token is stored as an <span className="text-zinc-300">HttpOnly cookie</span>.
        </div>
      </div>
    </div>
  )
}