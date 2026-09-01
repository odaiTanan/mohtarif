import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'

interface AuthorizeProps {
  allowedRoles?: string[]
  allowedPermissions?: string[]
  children: ReactNode
}

export function Authorize({ allowedRoles = [], allowedPermissions = [], children }: AuthorizeProps) {
  const { user } = useAuth()

  if (!allowedRoles.length && !allowedPermissions.length) {
    return children
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const userRoles = new Set(user.roles.map((role) => role.name))
  const userPermissions = new Set(user.permissions)

  const allowedByRole = allowedRoles.some((role) => userRoles.has(role))
  const allowedByPermission = allowedPermissions.some((permission) => userPermissions.has(permission))

  if (!allowedByRole && !allowedByPermission) {
    return <Navigate to="/403" replace />
  }

  return children
}