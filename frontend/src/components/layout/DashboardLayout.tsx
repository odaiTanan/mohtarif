import { useState, type ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

import { useAuth } from '../../hooks/useAuth'
import AdminSidebar from './AdminSidebar'

interface DashboardLayoutProps {
  children?: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-ink-50" dir="rtl" lang="ar">
      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <AdminSidebar />
        </div>

        {/* Mobile sidebar overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm animate-fade-in"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute right-0 top-0 h-full animate-scale-in">
              <AdminSidebar />
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute left-4 top-4 rounded-xl bg-white/10 p-2 text-white"
            >
              <X size={20} />
            </button>
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Header */}
          <header className="sticky top-0 z-30 glass border-b border-ink-200/60">
            <div className="flex items-center justify-between px-5 py-4 sm:px-8">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileOpen(true)}
                  className="rounded-xl border border-ink-200 p-2 text-ink-600 transition hover:bg-ink-100 lg:hidden"
                >
                  <Menu size={20} />
                </button>
                <div>
                  <h1 className="text-lg font-bold tracking-tight text-ink-900 sm:text-xl">لوحة التحكم</h1>
                  <p className="hidden text-xs text-ink-400 sm:block">إدارة النظام والمحتوى التعليمي</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden text-left sm:block">
                  <p className="text-sm font-semibold text-ink-900">{user?.name ?? 'زائر'}</p>
                  <p className="text-xs text-ink-400">{user?.email}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-academy-400 to-academy-600 text-sm font-bold text-white shadow-lg shadow-academy-500/20">
                  {user?.name?.charAt(0) ?? '؟'}
                </div>
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 px-5 py-6 sm:px-8 sm:py-8">
            <div className="animate-fade-in-up">
              {children ?? <Outlet />}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
