import { NextResponse } from "next/server"
import { decodeJwtPayload, isExpired } from "@/lib/jwt"
import { AUTH_COOKIE } from "@/lib/auth/constants"

export async function POST(req) {
  const backendUrl = process.env.BACKEND_URL
  if (!backendUrl) {
    return NextResponse.json({ error: "BACKEND_URL not configured" }, { status: 500 })
  }

  const body = await req.json()

  const upstream = await fetch(`${backendUrl.replace(/\/$/, "")}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  })

  const data = await upstream.json().catch(() => null)

  if (!upstream.ok) {
    return NextResponse.json(data || { error: "Login failed" }, { status: upstream.status })
  }

  const token = data?.token
  if (!token) {
    return NextResponse.json({ error: "No token in login response" }, { status: 500 })
  }

  const payload = decodeJwtPayload(token)
  if (!payload || isExpired(payload)) {
    return NextResponse.json({ error: "Invalid/expired token received" }, { status: 500 })
  }

  const res = NextResponse.json({
    username: data?.username ?? payload.sub ?? null,
    role: data?.role ?? payload.role ?? null,
    type: data?.type ?? "Bearer",
  })

  res.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // opcional: que siga la exp del JWT si exp viene en segundos (epoch)
    // maxAge: payload.exp ? Math.max(0, payload.exp - Math.floor(Date.now() / 1000)) : undefined,
  })

  return res
}
