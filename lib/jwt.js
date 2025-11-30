function base64UrlDecode(input) {
    const pad = "=".repeat((4 - (input.length % 4)) % 4)
    const base64 = (input + pad).replace(/-/g, "+").replace(/_/g, "/")
    return Buffer.from(base64, "base64").toString("utf8")
  }
  
  export function decodeJwtPayload(token) {
    try {
      const parts = token.split(".")
      if (parts.length !== 3) return null
      return JSON.parse(base64UrlDecode(parts[1]))
    } catch {
      return null
    }
  }
  
  export function isExpired(payload) {
    if (!payload || !payload.exp) return false
    const nowSec = Math.floor(Date.now() / 1000)
    return payload.exp <= nowSec
  }
  