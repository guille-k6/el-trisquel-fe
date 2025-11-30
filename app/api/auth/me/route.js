import { NextResponse } from "next/server"
import { AUTH_COOKIE } from "@/lib/auth/constants"
import { decodeJwtPayload, isExpired } from "@/lib/jwt"

export async function GET(req) {
  const token = req.cookies.get(AUTH_COOKIE)?.value
  if (!token) return NextResponse.json({ authenticated: false }, { status: 401 })

  const payload = decodeJwtPayload(token)
  if (!payload || isExpired(payload)) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  return NextResponse.json({
    authenticated: true,
    username: payload.sub || null,
    role: payload.role || null,
    exp: payload.exp || null,
  })
}