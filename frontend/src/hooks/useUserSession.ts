import { useQuery } from '@tanstack/react-query'
import Cookies from 'js-cookie'

import { fetchSessionRequest } from '../api/auth'

const COOKIE_USER = 'user'

export function useUserSession(enabled = true) {
  return useQuery({
    queryKey: ['auth', 'session'],
    queryFn: async () => {
      const user = await fetchSessionRequest()
      Cookies.set(COOKIE_USER, JSON.stringify(user), { expires: 7, secure: true, sameSite: 'strict' })

      return user
    },
    enabled,
    staleTime: 60_000,
  })
}