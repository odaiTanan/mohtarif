import { Link } from 'react-router-dom'
import { BookOpen, GraduationCap, Users, TrendingUp, ArrowLeft, ClipboardList, Layers, FileCheck } from 'lucide-react'

import { useAuth } from '../hooks/useAuth'

const stats = [
  { label: 'الكورسات', value: '—', icon: BookOpen, color: 'from-academy-400 to-academy-600', bg: 'bg-academy-50', text: 'text-academy-700' },
  { label: 'الطلاب', value: '—', icon: GraduationCap, color: 'from-teal-academy-400 to-teal-academy-600', bg: 'bg-teal-academy-50', text: 'text-teal-academy-700' },
  { label: 'المدرسين', value: '—', icon: Users, color: 'from-ink-400 to-ink-600', bg: 'bg-ink-100', text: 'text-ink-700' },
  { label: 'النشاط', value: '—', icon: TrendingUp, color: 'from-academy-500 to-teal-academy-500', bg: 'bg-academy-50', text: 'text-academy-700' },
]

const quickActions = [
  { label: 'بنك الأسئلة', href: '/dashboard/questions', desc: 'إضافة الأسئلة والخيارات', icon: ClipboardList },
  { label: 'إدارة المحتوى', href: '/dashboard/academies', desc: 'إدارة الأقسام والدورات', icon: Layers },
  { label: 'الاختبارات', href: '/dashboard/assessments', desc: 'إنشاء وبدء الاختبارات', icon: FileCheck },
]

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <main className="space-y-6">
      {/* Hero section */}
      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="relative overflow-hidden rounded-3xl border border-ink-200/60 bg-gradient-to-br from-ink-900 via-ink-900 to-ink-800 p-8 shadow-2xl shadow-ink-900/20">
          {/* Decorative gradient orbs */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-academy-500/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-teal-academy-500/15 blur-3xl" />

          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-academy-400/30 bg-academy-400/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-academy-300">
              <span className="h-1.5 w-1.5 rounded-full bg-academy-400 animate-pulse-ring" />
              لوحة التحكم
            </span>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              مرحباً، {user?.name ?? 'مستخدم'}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-ink-300 sm:text-base">
              من هنا تدير المحتوى، تضيف البيانات وتتحكّم بها، وتنشئ الاختبارات وتنشرها للمستخدمين.
            </p>

            {/* Quick actions */}
            <div className="mt-7 grid gap-4 sm:grid-cols-3">
              {quickActions.map((action, i) => {
                const Icon = action.icon
                return (
                  <Link
                    key={action.label}
                    to={action.href}
                    className={`group rounded-2xl border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:border-academy-400/30 hover:bg-white/10 animate-fade-in-up stagger-${i + 1}`}
                  >
                    <div className="flex items-center gap-2 text-academy-400">
                      <Icon size={18} className="transition-transform group-hover:scale-110" />
                      <p className="text-xs font-medium text-ink-400">{action.label}</p>
                    </div>
                    <p className="mt-2.5 text-sm font-semibold text-white">{action.desc}</p>
                    <div className="mt-3 flex items-center gap-1 text-xs text-academy-400 opacity-0 transition-opacity group-hover:opacity-100">
                      افتح <ArrowLeft size={12} className="rotate-180" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* Account card */}
        <aside className="rounded-3xl border border-ink-200/60 bg-white p-6 shadow-lg shadow-ink-200/40 card-hover">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-academy-400 to-teal-academy-600 text-2xl font-bold text-white shadow-lg shadow-teal-academy-500/20">
                {user?.name?.charAt(0) ?? '؟'}
              </div>
              <span className="absolute -bottom-1 -left-1 h-5 w-5 rounded-full border-2 border-white bg-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-ink-400">الحساب</p>
              <p className="text-base font-bold text-ink-900">{user?.name}</p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-ink-100 bg-ink-50 px-4 py-3">
              <span className="text-sm text-ink-500">البريد</span>
              <span className="text-sm font-semibold text-ink-900">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-ink-100 bg-ink-50 px-4 py-3">
              <span className="text-sm text-ink-500">الأدوار</span>
              <span className="text-left text-sm font-semibold text-ink-900">
                {user?.roles?.map((role) => role.name).join(', ')}
              </span>
            </div>
          </div>
        </aside>
      </section>

      {/* Stat cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className={`group rounded-2xl border border-ink-200/60 bg-white p-5 shadow-sm card-hover animate-fade-in-up stagger-${i + 1}`}
            >
              <div className="flex items-center justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.bg} transition-transform group-hover:scale-110`}>
                  <Icon size={22} className={stat.text} />
                </div>
                <span className="text-2xl font-bold text-ink-900">{stat.value}</span>
              </div>
              <p className="mt-3 text-sm font-medium text-ink-500">{stat.label}</p>
            </div>
          )
        })}
      </section>
    </main>
  )
}
