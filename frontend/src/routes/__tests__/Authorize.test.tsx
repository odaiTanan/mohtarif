import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Cookies from 'js-cookie'

import { Authorize } from '../Authorize'

describe('Authorize', () => {
  beforeEach(() => {
    Cookies.remove('access_token')
    Cookies.remove('user')
  })

  it('renders children when the user has the required role', () => {
    Cookies.set('access_token', 'token')
    Cookies.set('user', JSON.stringify({
      id: 1,
      name: 'Admin',
      email: 'admin@example.com',
      roles: [{ id: 1, name: 'System Administrator', permissions: ['view-dashboard'] }],
      permissions: ['view-dashboard'],
    }))

    render(
      <MemoryRouter>
        <Authorize allowedRoles={['System Administrator']}>
          <div>Authorized</div>
        </Authorize>
      </MemoryRouter>,
    )

    expect(screen.getByText('Authorized')).toBeInTheDocument()
  })

  it('redirects unauthorized users to the forbidden page', () => {
    Cookies.set('access_token', 'token')
    Cookies.set('user', JSON.stringify({
      id: 2,
      name: 'User',
      email: 'user@example.com',
      roles: [{ id: 2, name: 'viewer', permissions: ['view-dashboard'] }],
      permissions: ['view-dashboard'],
    }))

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Authorize allowedPermissions={['manage-users']}>
          <div>Denied</div>
        </Authorize>
      </MemoryRouter>,
    )

    expect(screen.queryByText('Denied')).not.toBeInTheDocument()
  })
})