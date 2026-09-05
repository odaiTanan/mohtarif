import { createBrowserRouter, Navigate } from 'react-router-dom'

import AppLayout from '../components/AppLayout'
import DashboardLayout from '../components/layout/DashboardLayout'
import DashboardPage from '../pages/DashboardPage'
import ForbiddenPage from '../pages/ForbiddenPage'
import LoginPage from '../pages/LoginPage'
import AdminLoginPage from '../pages/AdminLoginPage'
import TeacherLoginPage from '../pages/TeacherLoginPage'
import StudentLoginPage from '../pages/StudentLoginPage'
import StudentsPage from '../pages/dashboard/StudentsPage'
import TeachersPage from '../pages/dashboard/TeachersPage'
import CoursesPage from '../pages/dashboard/CoursesPage'
import TeacherCoursesPage from '../pages/dashboard/TeacherCoursesPage'
import { Authorize } from './Authorize'
import { ProtectedRoute } from './ProtectedRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'login/admin',
        element: <AdminLoginPage />,
      },
      {
        path: 'login/teacher',
        element: <TeacherLoginPage />,
      },
      {
        path: 'login/student',
        element: <StudentLoginPage />,
      },
      {
        path: '403',
        element: <ForbiddenPage />,
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <DashboardLayout>
              <Authorize allowedRoles={['Admin', 'Teacher', 'Student']} allowedPermissions={['view-dashboard']}>
                <DashboardPage />
              </Authorize>
            </DashboardLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: 'dashboard/students',
        element: (
          <ProtectedRoute>
            <DashboardLayout>
              <Authorize allowedRoles={['Admin']} allowedPermissions={['manage-users']}>
                <StudentsPage />
              </Authorize>
            </DashboardLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: 'dashboard/teachers',
        element: (
          <ProtectedRoute>
            <DashboardLayout>
              <Authorize allowedRoles={['Admin']} allowedPermissions={['manage-users']}>
                <TeachersPage />
              </Authorize>
            </DashboardLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: 'dashboard/courses',
        element: (
          <ProtectedRoute>
            <DashboardLayout>
              <Authorize allowedRoles={['Admin']} allowedPermissions={['manage-content']}>
                <CoursesPage />
              </Authorize>
            </DashboardLayout>
          </ProtectedRoute>
        ),
      },
      {
        path: 'dashboard/my-courses',
        element: (
          <ProtectedRoute>
            <DashboardLayout>
              <Authorize allowedRoles={['Teacher']}>
                <TeacherCoursesPage />
              </Authorize>
            </DashboardLayout>
          </ProtectedRoute>
        ),
      },
    ],
  },
])