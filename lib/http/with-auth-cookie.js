const API_BASE_URL = "/api/backend"

function joinUrl(base, path) {
  const b = base.endsWith("/") ? base.slice(0, -1) : base
  const p = path.startsWith("/") ? path : `/${path}`
  return `${b}${p}`
}

async function getRequestOriginOnServer() {
  // Solo se ejecuta en server
  const { headers } = await import("next/headers")
  const h = await headers()
  const proto = h.get("x-forwarded-proto") ?? "http"
  const host = h.get("x-forwarded-host") ?? h.get("host")
  return `${proto}://${host}`
}

function normalizeHeaders(input) {
  return new Headers(input || {})
}

export async function authedFetch(path, init = {}) {
  const isServer = typeof window === "undefined"

  // Si te pasan una URL absoluta, la respetamos; sino usamos el proxy local
  const isAbsolute = typeof path === "string" && /^https?:\/\//i.test(path)

  let url = isAbsolute ? path : joinUrl(API_BASE_URL, path)

  if (isServer && !isAbsolute) {
    const origin = await getRequestOriginOnServer()
    url = `${origin}${url}`
  }

  const headers = normalizeHeaders(init.headers)

  if (isServer) {
    // reenviar cookies del request entrante al fetch interno
    const { headers: nextHeaders } = await import("next/headers")
    const h = await nextHeaders()
    const cookie = h.get("cookie")
    if (cookie && !headers.has("cookie")) headers.set("cookie", cookie)
  }

  // defaults sanos para apps con auth/cookies
  const finalInit = {
    cache: init.cache ?? "no-store",
    credentials: init.credentials ?? "include",
    ...init,
    headers,
  }

  return fetch(url, finalInit)
}
