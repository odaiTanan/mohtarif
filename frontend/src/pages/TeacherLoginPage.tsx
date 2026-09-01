import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useLogin } from '../hooks/useLogin'

export default function TeacherLoginPage() {
  const navigate = useNavigate()
  const loginMutation = useLogin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    await loginMutation.mutateAsync({ email, password, role: 'teacher' })
    navigate('/dashboard', { replace: true })
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-10 lg:px-10" dir="rtl" lang="ar">
      <div className="grid w-full gap-8 lg:grid-cols-2">
        <section className="space-y-5">
          <span className="inline-flex rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm text-green-600">
            دخول المدرسين
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            سجّل الدخول كمدرس
          </h1>
          <p className="max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
            أدخل بياناتك للوصول إلى لوحة تحكم المدرسين وإدارة المحتوى
          </p>
        </section>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50"
        >
          <div className="space-y-4">
            <label className="block space-y-2">
              <span className="text-sm text-slate-700">البريد الإلكتروني</span>
              <input
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-500/50"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm text-slate-700">كلمة المرور</span>
              <input
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-500/50"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
          </div>

          <button
            className="mt-6 w-full rounded-2xl bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'جاري الدخول...' : 'تسجيل الدخول'}
          </button>

          {loginMutation.isError ? (
            <p className="mt-4 rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              بيانات الدخول غير صحيحة أو حدث خطأ في الخادم.
            </p>
          ) : null}
        </form>
      </div>
    </main>
  )
}
