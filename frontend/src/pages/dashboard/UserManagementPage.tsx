import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, Pencil, Trash2, X, GraduationCap, Users } from 'lucide-react'

import { createUser, deleteUser, fetchUsers, updateUser, uploadUserAvatar, type User } from '../../api/users'
import { fetchCourseCategories } from '../../api/management'

type ManagedRole = 'teacher' | 'student'
type FormState = {
  name: string
  email: string
  password: string
  password_confirmation: string
  phone: string
  avatar_file: File | null
  bio: string
  specialty: string
  academic_id: string
  teaching_category_id: string
  status: 'active' | 'inactive'
}

const emptyForm: FormState = {
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  phone: '',
  avatar_file: null,
  bio: '',
  specialty: '',
  academic_id: '',
  teaching_category_id: '',
  status: 'active',
}

const formFields: ReadonlyArray<{ field: keyof FormState; label: string; isPassword?: boolean; required?: boolean }> = [
  { field: 'name', label: 'الاسم الكامل', required: true },
  { field: 'email', label: 'البريد الإلكتروني', required: true },
  { field: 'phone', label: 'رقم الهاتف' },
  { field: 'academic_id', label: 'الرقم الأكاديمي' },
  { field: 'specialty', label: 'التخصص' },
  { field: 'password', label: 'كلمة المرور', isPassword: true },
  { field: 'password_confirmation', label: 'تأكيد كلمة المرور', isPassword: true },
]

export default function UserManagementPage({ role }: { role: ManagedRole }) {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<User | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const isTeacher = role === 'teacher'
  const label = isTeacher ? 'المعلمين' : 'الطلاب'

  const usersQuery = useQuery({ queryKey: ['users', role], queryFn: () => fetchUsers(role) })
  const categoriesQuery = useQuery({ queryKey: ['course-categories'], queryFn: fetchCourseCategories, enabled: isTeacher })

  const closeForm = () => { setEditing(null); setForm(emptyForm); setIsFormOpen(false) }

  const saveMutation = useMutation({
    mutationFn: async () => {
      const { avatar_file, ...fields } = form
      const payload = {
        ...fields,
        teaching_category_id: form.teaching_category_id ? Number(form.teaching_category_id) : undefined,
        password: form.password || undefined,
        password_confirmation: form.password_confirmation || undefined,
        role,
      }
      const savedUser = editing ? await updateUser(editing.id, payload) : await createUser(payload)
      return avatar_file ? uploadUserAvatar(savedUser.id, avatar_file) : savedUser
    },
    onSuccess: () => { closeForm(); queryClient.invalidateQueries({ queryKey: ['users', role] }) },
  })

  const deleteMutation = useMutation({ mutationFn: deleteUser, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users', role] }) })

  const openEdit = (user: User) => {
    setEditing(user)
    setIsFormOpen(true)
    setForm({
      name: user.name,
      email: user.email,
      password: '',
      password_confirmation: '',
      phone: user.phone ?? '',
      avatar_file: null,
      bio: user.bio ?? '',
      specialty: user.specialty ?? '',
      academic_id: user.academic_id ?? '',
      teaching_category_id: user.teaching_category_id ? String(user.teaching_category_id) : '',
      status: user.status,
    })
  }

  const filteredUsers = (usersQuery.data ?? []).filter((user) =>
    `${user.name} ${user.email} ${user.academic_id ?? ''} ${user.specialty ?? ''}`.toLowerCase().includes(search.toLowerCase()),
  )
  const categories = categoriesQuery.data ?? []
  const updateField = (field: keyof FormState, value: string | File | null) => setForm((current) => ({ ...current, [field]: value }))

  if (usersQuery.isLoading || (isTeacher && categoriesQuery.isLoading))
    return <div className="py-20 text-center text-ink-400">جاري تحميل {label}...</div>
  if (usersQuery.isError || (isTeacher && categoriesQuery.isError))
    return <div className="py-20 text-center text-rose-600">تعذر تحميل بيانات {label}</div>

  const Icon = isTeacher ? Users : GraduationCap
  const accentColor = isTeacher ? 'teal-academy' : 'academy'

  return (
    <div className="space-y-6">
      {/* Page header */}
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end animate-fade-in-up">
        <div>
          <div className="flex items-center gap-2">
            <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${isTeacher ? 'bg-teal-academy-50 text-teal-academy-600' : 'bg-academy-50 text-academy-600'}`}>
              <Icon size={20} />
            </div>
            <p className={`text-sm font-semibold ${isTeacher ? 'text-teal-academy-600' : 'text-academy-600'}`}>إدارة المستخدمين</p>
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink-900">{label}</h1>
          <p className="mt-2 text-sm text-ink-500">ملفات كاملة وحسابات قابلة للإدارة</p>
        </div>
        <button
          type="button"
          onClick={() => { setEditing(null); setForm({ ...emptyForm }); setIsFormOpen(true) }}
          className={`flex items-center gap-2 rounded-2xl bg-gradient-to-l px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-105 ${
            isTeacher
              ? 'from-teal-academy-500 to-teal-academy-600 shadow-teal-academy-500/25'
              : 'from-academy-500 to-academy-600 shadow-academy-500/25'
          }`}
        >
          <Plus size={18} />
          إضافة {isTeacher ? 'معلم' : 'طالب'}
        </button>
      </header>

      {/* Search bar */}
      <section className="flex flex-col gap-3 rounded-2xl border border-ink-200/60 bg-white p-4 shadow-sm animate-fade-in-up stagger-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:max-w-md">
          <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="ابحث بالاسم أو البريد أو الرقم الأكاديمي"
            className="w-full rounded-xl border border-ink-200 bg-ink-50 py-3 pr-11 pl-4 text-sm text-ink-900 outline-none transition focus-ring"
          />
        </div>
        <span className="text-sm font-medium text-ink-400">{filteredUsers.length} مستخدم</span>
      </section>

      {/* Create/Edit form */}
      {isFormOpen && (
        <form
          onSubmit={(event) => { event.preventDefault(); saveMutation.mutate() }}
          className="grid gap-4 rounded-3xl border border-ink-200/60 bg-white p-6 shadow-lg shadow-ink-200/30 animate-scale-in md:grid-cols-2"
        >
          <div className="flex items-center justify-between md:col-span-2">
            <h2 className="text-lg font-bold text-ink-900">{editing ? 'تعديل الملف' : `إضافة ${isTeacher ? 'معلم' : 'طالب'}`}</h2>
            <button type="button" onClick={closeForm} className="rounded-xl p-2 text-ink-400 transition hover:bg-ink-100">
              <X size={18} />
            </button>
          </div>

          {formFields.map(({ field, label: fieldLabel, isPassword, required }) => (
            <input
              key={field}
              required={required || (!editing && Boolean(isPassword))}
              type={isPassword ? 'password' : 'text'}
              value={form[field]}
              onChange={(event) => updateField(field, event.target.value)}
              placeholder={fieldLabel}
              className="rounded-xl border border-ink-200 bg-ink-50 px-4 py-3 text-sm text-ink-900 outline-none transition focus-ring"
            />
          ))}

          <label className="flex cursor-pointer items-center justify-between rounded-xl border border-dashed border-ink-300 bg-ink-50 px-4 py-3 text-sm text-ink-600 md:col-span-2">
            <span>{form.avatar_file?.name ?? (editing?.avatar_url ? 'تغيير صورة الملف الشخصي' : 'رفع صورة الملف الشخصي')}</span>
            <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(event) => updateField('avatar_file', event.target.files?.[0] ?? null)} />
          </label>

          {isTeacher && (
            <select
              required
              value={form.teaching_category_id}
              onChange={(event) => updateField('teaching_category_id', event.target.value)}
              className="rounded-xl border border-ink-200 bg-ink-50 px-4 py-3 text-sm outline-none focus-ring"
            >
              <option value="">تصنيف تدريس المعلم</option>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
          )}

          <textarea
            value={form.bio}
            onChange={(event) => updateField('bio', event.target.value)}
            placeholder="نبذة تعريفية"
            className="min-h-24 rounded-xl border border-ink-200 bg-ink-50 px-4 py-3 text-sm text-ink-900 outline-none transition focus-ring md:col-span-2"
          />

          <select
            value={form.status}
            onChange={(event) => updateField('status', event.target.value)}
            className="rounded-xl border border-ink-200 bg-ink-50 px-4 py-3 text-sm outline-none focus-ring"
          >
            <option value="active">نشط</option>
            <option value="inactive">غير نشط</option>
          </select>

          <div className="flex gap-3 md:col-span-2">
            <button
              disabled={saveMutation.isPending}
              className={`rounded-xl bg-gradient-to-l px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-105 disabled:opacity-50 ${
                isTeacher ? 'from-teal-academy-500 to-teal-academy-600 shadow-teal-academy-500/25' : 'from-academy-500 to-academy-600 shadow-academy-500/25'
              }`}
            >
              {saveMutation.isPending ? 'جاري الحفظ...' : 'حفظ البيانات'}
            </button>
            <button type="button" onClick={closeForm} className="rounded-xl border border-ink-200 px-5 py-3 text-sm font-medium text-ink-600 transition hover:bg-ink-100">إلغاء</button>
          </div>
          {saveMutation.isError && <p className="text-sm text-rose-600 md:col-span-2">تعذر حفظ البيانات، تحقق من الحقول.</p>}
        </form>
      )}

      {/* Users table */}
      <section className="overflow-hidden rounded-3xl border border-ink-200/60 bg-white shadow-sm animate-fade-in-up stagger-2">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-right">
            <thead className="bg-ink-50 text-xs uppercase tracking-[0.15em] text-ink-400">
              <tr>
                {['المستخدم', 'التواصل', 'التخصص', 'النبذة', 'الحالة', 'الإجراءات'].map((heading) => (
                  <th key={heading} className="px-5 py-4 font-semibold">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="transition hover:bg-ink-50/60">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar_url ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=e2e8f0&color=334155`}
                        alt=""
                        className="h-11 w-11 rounded-full object-cover ring-2 ring-ink-100"
                      />
                      <div>
                        <p className="font-semibold text-ink-900">{user.name}</p>
                        <p className="text-xs text-ink-400">{user.academic_id ?? 'بدون رقم أكاديمي'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-ink-700">{user.email}</p>
                    <p className="text-xs text-ink-400">{user.phone ?? 'بدون هاتف'}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-ink-600">{user.specialty ?? 'غير محدد'}</td>
                  <td className="max-w-xs px-5 py-4 text-sm text-ink-400">{user.bio ?? 'لا توجد نبذة'}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold ${
                      user.status === 'active'
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : 'border-ink-200 bg-ink-100 text-ink-500'
                    }`}>
                      {user.status === 'active' ? 'نشط' : 'غير نشط'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(user)} className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-blue-600 transition hover:bg-blue-50">
                        <Pencil size={14} /> تعديل
                      </button>
                      <button
                        disabled={deleteMutation.isPending}
                        onClick={() => confirm(`حذف ${user.name}؟`) && deleteMutation.mutate(user.id)}
                        className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
                      >
                        <Trash2 size={14} /> حذف
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && <p className="p-12 text-center text-ink-400">لا توجد نتائج مطابقة</p>}
      </section>
    </div>
  )
}
