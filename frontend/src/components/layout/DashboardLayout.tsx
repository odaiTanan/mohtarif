import { useState, type ReactNode } from 'react'
import { Outlet } from 'react-router-dom'

import { useAuth } from '../../hooks/useAuth'
import AdminSidebar from './AdminSidebar'

interface DashboardLayoutProps {
  children?: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl" lang="ar">
      <div className="flex min-h-screen">
        <AdminSidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
            <div className="flex items-center justify-between px-6 py-4">
              <h1 className="text-xl font-semibold text-slate-900">لوحة التحكم</h1>
              <div className="text-sm text-slate-600">
                <p className="font-semibold text-slate-900">{user?.name ?? 'زائر'}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
            </div>
          </header>

          <main className="flex-1 px-6 py-6">
            {children ?? <Outlet />}
          </main>
        </div>
      </div>
    </div>
  )
}
