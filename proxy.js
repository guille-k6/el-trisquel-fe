import { NextResponse } from "next/server"
import { decodeJwtPayload, isExpired } from "@/lib/jwt"
import { AUTH_COOKIE } from "@/lib/auth/constants"

const PUBLIC_PATHS = ["/login"]

function isPublicPath(pathname) {
  if (PUBLIC_PATHS.includes(pathname)) return true
  if (pathname.startsWith("/api/auth")) return true
  if (pathname.startsWith("/_next")) return true
  if (pathname === "/favicon.ico") return true
  return false
}

export function proxy(req) {
  const { pathname } = req.nextUrl

  if (isPublicPath(pathname)) return NextResponse.next()

  const token = req.cookies.get(AUTH_COOKIE)?.value
  if (!token) {
    const url = req.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("next", pathname)
    return NextResponse.redirect(url)
  }

  const payload = decodeJwtPayload(token)
  if (!payload || isExpired(payload)) {
    const url = req.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("next", pathname)
    return NextResponse.redirect(url)
  }

  const role = String(payload.role || "")

  // Example: /admin requires ADMIN
  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    const url = req.nextUrl.clone()
    url.pathname = "/" // or "/403"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api/backend).*)"],
}