import { useMemo } from 'react'
import Cookies from 'js-cookie'

import type { AuthUser } from '../types/auth'

const COOKIE_ACCESS_TOKEN = 'access_token'
const COOKIE_USER = 'user'

export function useAuth() {
  const accessToken = Cookies.get(COOKIE_ACCESS_TOKEN) || null
  const userCookie = Cookies.get(COOKIE_USER)
  const user: AuthUser | null = userCookie ? JSON.parse(userCookie) : null

  const isAuthenticated = useMemo(() => !!accessToken && !!user, [accessToken, user])

  const setSession = (session: { accessToken: string; user: AuthUser }) => {
    Cookies.set(COOKIE_ACCESS_TOKEN, session.accessToken, { expires: 7, secure: true, sameSite: 'strict' })
    Cookies.set(COOKIE_USER, JSON.stringify(session.user), { expires: 7, secure: true, sameSite: 'strict' })
  }

  const clearSession = () => {
    Cookies.remove(COOKIE_ACCESS_TOKEN)
    Cookies.remove(COOKIE_USER)
  }

  return {
    user,
    accessToken,
    isAuthenticated,
    setSession,
    clearSession,
  }
}
