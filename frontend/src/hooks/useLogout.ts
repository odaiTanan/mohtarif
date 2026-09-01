import { useMutation } from '@tanstack/react-query'

import { logoutRequest } from '../api/auth'
import { useAuth } from './useAuth'
import { queryClient } from '../lib/queryClient'

export function useLogout() {
  const { clearSession } = useAuth()

  return useMutation({
    mutationFn: () => logoutRequest(),
    onSettled: () => {
      clearSession()
      queryClient.removeQueries({ queryKey: ['auth'] })
    },
  })
}