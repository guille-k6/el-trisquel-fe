import { cookies } from "next/headers"
import NavbarClient from "./NavbarClient"
import { AUTH_COOKIE } from "@/lib/auth/constants"

export default async function Navbar() {
  const cookieStore = await cookies()

  const token = cookieStore.get(AUTH_COOKIE)?.value

  if (!token) return null

  return <NavbarClient />
}
