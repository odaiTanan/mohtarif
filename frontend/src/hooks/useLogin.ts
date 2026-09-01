import { useMutation } from '@tanstack/react-query'

import { loginRequest, type LoginPayload } from '../api/auth'
import { useAuth } from './useAuth'
import { queryClient } from '../lib/queryClient'

export function useLogin() {
  const { setSession } = useAuth()

  return useMutation({
    mutationFn: (payload: LoginPayload) => loginRequest(payload),
    onSuccess: (session) => {
      setSession(session)
      queryClient.setQueryData(['auth', 'session'], session.user)
    },
  })
}