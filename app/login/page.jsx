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

  const disabled = loading || auth.status === "loading"

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6">
      {/* background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-72 w-[38rem] -translate-x-1/2 rounded-full bg-zinc-800/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-72 w-[34rem] rounded-full bg-zinc-700/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="rounded-3xl border border-zinc-800/80 bg-zinc-950/60 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.55)]">
          <div className="p-7">
            {/* brand */}
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl border border-zinc-800 bg-zinc-900/60 flex items-center justify-center shadow-sm">
                <span className="text-sm font-semibold tracking-wide text-zinc-200">ET</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight">Ingresar</h1>
                <p className="text-sm text-zinc-400">Ingresá con tus credenciales</p>
              </div>
            </div>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div className="space-y-2">
                <label className="block text-sm text-zinc-300">Usuario</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-2xl bg-zinc-900/60 border border-zinc-800 px-4 py-3 outline-none transition focus:border-zinc-600 focus:ring-4 focus:ring-zinc-500/15"
                  autoComplete="username"
                  placeholder="tu.usuario"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm text-zinc-300">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl bg-zinc-900/60 border border-zinc-800 px-4 py-3 outline-none transition focus:border-zinc-600 focus:ring-4 focus:ring-zinc-500/15"
                  autoComplete="current-password"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="rounded-2xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              <button
                disabled={disabled}
                className="w-full rounded-2xl bg-zinc-100 text-zinc-950 font-semibold py-3 transition hover:bg-white disabled:opacity-60 disabled:hover:bg-zinc-100 hover:cursor-pointer"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </div>

          {/* footer brand */}
          <div className="border-t border-zinc-800/80 px-7 py-4 flex items-center justify-center">
            <span className="text-xs tracking-[0.25em] text-zinc-400">
              EL TRISQUEL
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
