import { NextResponse } from "next/server"
import { AUTH_COOKIE } from "@/lib/auth/constants"

function normalizeBaseUrl(url) {
  return url.replace(/\/+$/, "")
}

function filterResponseHeaders(upstreamHeaders) {
  const headers = new Headers(upstreamHeaders)
  headers.delete("connection")
  headers.delete("keep-alive")
  headers.delete("proxy-authenticate")
  headers.delete("proxy-authorization")
  headers.delete("te")
  headers.delete("trailers")
  headers.delete("transfer-encoding")
  headers.delete("upgrade")
  headers.delete("content-length")
  return headers
}

async function handler(req, ctx) {
  const backendUrlRaw = process.env.BACKEND_URL
  if (!backendUrlRaw) {
    return NextResponse.json({ error: "BACKEND_URL not configured" }, { status: 500 })
  }
  const backendUrl = normalizeBaseUrl(backendUrlRaw)

  const token = req.cookies.get(AUTH_COOKIE)?.value

  const url = new URL(req.url)

  const { path = [] } = (await ctx.params) ?? {}
  const targetUrl = `${backendUrl}/${path.join("/")}${url.search}`

  const headers = new Headers(req.headers)
  headers.delete("host")
  headers.delete("cookie")
  headers.delete("content-length")

  if (token) headers.set("authorization", `Bearer ${token}`)

  const method = req.method.toUpperCase()
  const hasBody = !["GET", "HEAD"].includes(method)

  const upstream = await fetch(targetUrl, {
    method,
    headers,
    body: hasBody ? await req.arrayBuffer() : undefined,
    cache: "no-store",
    redirect: "manual",
  })

  const responseHeaders = filterResponseHeaders(upstream.headers)

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  })
}

export const GET = handler
export const POST = handler
export const PUT = handler
export const PATCH = handler
export const DELETE = handler
export const OPTIONS = handler
