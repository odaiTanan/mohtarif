import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, Pencil, Trash2, BookOpen, Layers, X } from 'lucide-react'

import { createCourse, createCourseCategory, deleteCourse, deleteCourseCategory, fetchCourseCategories, fetchCourseInstructors, fetchCourses, updateCourse, updateCourseCategory, type CourseRecord } from '../../api/management'

type CourseForm = {
  title: string
  description: string
  category_id: string
  instructor_id: string
  status: CourseRecord['status']
  level: CourseRecord['level']
  max_students: string
  price: string
  thumbnail_url: string
  course_type: CourseRecord['course_type']
}

const emptyForm: CourseForm = {
  title: '',
  description: '',
  category_id: '',
  instructor_id: '',
  status: 'draft',
  level: 'beginner',
  max_students: '',
  price: '0',
  thumbnail_url: '',
  course_type: 'technical',
}

const statusLabels: Record<string, string> = { draft: 'مسودة', published: 'منشور', archived: 'مؤرشف' }
const levelLabels: Record<string, string> = { beginner: 'مبتدئ', intermediate: 'متوسط', advanced: 'متقدم' }

const statusStyles: Record<string, string> = {
  published: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  archived: 'bg-ink-100 text-ink-500 border-ink-200',
  draft: 'bg-academy-50 text-academy-700 border-academy-200',
}

export default function CoursesPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<CourseRecord | null>(null)
  const [form, setForm] = useState<CourseForm>(emptyForm)
  const [categoryName, setCategoryName] = useState('')
  const [categoryDescription, setCategoryDescription] = useState('')
  const [editingCategory, setEditingCategory] = useState<number | null>(null)

  const coursesQuery = useQuery({ queryKey: ['courses'], queryFn: fetchCourses })
  const categoriesQuery = useQuery({ queryKey: ['course-categories'], queryFn: fetchCourseCategories })
  const instructorsQuery = useQuery({
    queryKey: ['course-instructors', form.category_id],
    queryFn: () => fetchCourseInstructors(Number(form.category_id)),
    enabled: Boolean(form.category_id),
  })

  const closeForm = () => { setFormOpen(false); setEditing(null); setForm(emptyForm) }

  const saveMutation = useMutation({
    mutationFn: () =>
      editing
        ? updateCourse(editing.id, {
            ...form,
            category_id: Number(form.category_id),
            instructor_id: Number(form.instructor_id),
            max_students: form.max_students ? Number(form.max_students) : null,
            price: Number(form.price),
          })
        : createCourse({
            ...form,
            category_id: Number(form.category_id),
            instructor_id: Number(form.instructor_id),
            max_students: form.max_students ? Number(form.max_students) : null,
            price: Number(form.price),
          }),
    onSuccess: () => { closeForm(); queryClient.invalidateQueries({ queryKey: ['courses'] }) },
  })

  const deleteMutation = useMutation({ mutationFn: deleteCourse, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['courses'] }) })
  const categoryMutation = useMutation({
    mutationFn: () =>
      editingCategory
        ? updateCourseCategory(editingCategory, { name: categoryName, description: categoryDescription })
        : createCourseCategory({ name: categoryName, description: categoryDescription }),
    onSuccess: () => {
      setCategoryName(''); setCategoryDescription(''); setEditingCategory(null)
      queryClient.invalidateQueries({ queryKey: ['course-categories'] })
    },
  })
  const deleteCategoryMutation = useMutation({ mutationFn: deleteCourseCategory, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['course-categories'] }) })

  const updateField = (field: keyof CourseForm, value: string) => setForm((current) => ({ ...current, [field]: value }))
  const openCreate = () => { setEditing(null); setForm(emptyForm); setFormOpen(true) }
  const openEdit = (course: CourseRecord) => {
    setEditing(course)
    setForm({
      title: course.title,
      description: course.description ?? '',
      category_id: String(course.category_id),
      instructor_id: String(course.instructor_id),
      status: course.status,
      level: course.level,
      max_students: course.max_students ? String(course.max_students) : '',
      price: String(course.price),
      thumbnail_url: course.thumbnail_url ?? '',
      course_type: course.course_type,
    })
    setFormOpen(true)
  }

  const courses = (coursesQuery.data?.data ?? []).filter((course) =>
    `${course.title} ${course.category?.name ?? ''} ${course.instructor?.name ?? ''}`.toLowerCase().includes(search.toLowerCase()),
  )
  const categories = categoriesQuery.data ?? []
  const instructors = instructorsQuery.data ?? []

  if (coursesQuery.isLoading || categoriesQuery.isLoading || (formOpen && Boolean(form.category_id) && instructorsQuery.isLoading))
    return <div className="py-20 text-center text-ink-400">جاري تحميل الكورسات...</div>
  if (coursesQuery.isError || categoriesQuery.isError || instructorsQuery.isError)
    return <div className="py-20 text-center text-rose-600">تعذر تحميل بيانات الكورسات</div>

  return (
    <div className="space-y-6">
      {/* Page header */}
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end animate-fade-in-up">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-academy-50 text-academy-600">
              <BookOpen size={20} />
            </div>
            <p className="text-sm font-semibold text-academy-600">إدارة المحتوى</p>
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink-900">الكورسات</h1>
          <p className="mt-2 text-sm text-ink-500">أنشئ برامج تعليمية، حدّد المدرسين وتابع التسجيلات</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-l from-academy-500 to-academy-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-academy-500/25 transition hover:shadow-xl hover:shadow-academy-500/30 hover:brightness-105"
        >
          <Plus size={18} />
          كورس جديد
        </button>
      </header>

      {/* Search bar */}
      <section className="flex flex-col gap-3 rounded-2xl border border-ink-200/60 bg-white p-4 shadow-sm animate-fade-in-up stagger-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:max-w-md">
          <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="ابحث باسم الكورس أو الفئة أو المدرس"
            className="w-full rounded-xl border border-ink-200 bg-ink-50 py-3 pr-11 pl-4 text-sm text-ink-900 outline-none transition focus-ring"
          />
        </div>
        <span className="text-sm font-medium text-ink-400">{courses.length} كورس</span>
      </section>

      {/* Create/Edit form */}
      {formOpen && (
        <form
          onSubmit={(event) => { event.preventDefault(); saveMutation.mutate() }}
          className="grid gap-4 rounded-3xl border border-ink-200/60 bg-white p-6 shadow-lg shadow-ink-200/30 animate-scale-in md:grid-cols-2"
        >
          <div className="flex items-center justify-between md:col-span-2">
            <h2 className="text-lg font-bold text-ink-900">{editing ? 'تعديل الكورس' : 'إنشاء كورس جديد'}</h2>
            <button type="button" onClick={closeForm} className="rounded-xl p-2 text-ink-400 transition hover:bg-ink-100">
              <X size={18} />
            </button>
          </div>

          <input required value={form.title} onChange={(event) => updateField('title', event.target.value)} placeholder="اسم الكورس" className="rounded-xl border border-ink-200 bg-ink-50 px-4 py-3 text-sm outline-none focus-ring md:col-span-2" />
          <textarea value={form.description} onChange={(event) => updateField('description', event.target.value)} placeholder="وصف الكورس" className="min-h-28 rounded-xl border border-ink-200 bg-ink-50 px-4 py-3 text-sm outline-none focus-ring md:col-span-2" />

          <select required value={form.category_id} onChange={(event) => { updateField('category_id', event.target.value); updateField('instructor_id', '') }} className="rounded-xl border border-ink-200 bg-ink-50 px-4 py-3 text-sm outline-none focus-ring">
            <option value="">اختر الفئة</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
          <select required value={form.instructor_id} onChange={(event) => updateField('instructor_id', event.target.value)} disabled={!form.category_id} className="rounded-xl border border-ink-200 bg-ink-50 px-4 py-3 text-sm outline-none focus-ring disabled:bg-ink-100">
            <option value="">{form.category_id ? 'اختر المدرس المطابق للفئة' : 'اختر الفئة أولاً'}</option>
            {instructors.map((instructor) => <option key={instructor.id} value={instructor.id}>{instructor.name}</option>)}
          </select>

          <select value={form.course_type} onChange={(event) => updateField('course_type', event.target.value)} className="rounded-xl border border-ink-200 bg-ink-50 px-4 py-3 text-sm outline-none focus-ring">
            <option value="technical">تقني</option>
            <option value="craft">حرف</option>
          </select>
          <select value={form.level} onChange={(event) => updateField('level', event.target.value)} className="rounded-xl border border-ink-200 bg-ink-50 px-4 py-3 text-sm outline-none focus-ring">
            <option value="beginner">مبتدئ</option>
            <option value="intermediate">متوسط</option>
            <option value="advanced">متقدم</option>
          </select>

          <input type="number" min="1" value={form.max_students} onChange={(event) => updateField('max_students', event.target.value)} placeholder="الحد الأقصى للطلاب" className="rounded-xl border border-ink-200 bg-ink-50 px-4 py-3 text-sm outline-none focus-ring" />
          <input type="number" min="0" step="0.01" value={form.price} onChange={(event) => updateField('price', event.target.value)} placeholder="السعر" className="rounded-xl border border-ink-200 bg-ink-50 px-4 py-3 text-sm outline-none focus-ring" />
          <input type="url" value={form.thumbnail_url} onChange={(event) => updateField('thumbnail_url', event.target.value)} placeholder="رابط الصورة المصغرة" className="rounded-xl border border-ink-200 bg-ink-50 px-4 py-3 text-sm outline-none focus-ring md:col-span-2" />

          {editing && (
            <select value={form.status} onChange={(event) => updateField('status', event.target.value)} className="rounded-xl border border-ink-200 bg-ink-50 px-4 py-3 text-sm outline-none focus-ring">
              <option value="draft">مسودة</option>
              <option value="published">منشور</option>
              <option value="archived">مؤرشف</option>
            </select>
          )}

          <div className="flex gap-3 md:col-span-2">
            <button disabled={saveMutation.isPending} className="rounded-xl bg-gradient-to-l from-academy-500 to-academy-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-academy-500/25 transition hover:brightness-105 disabled:opacity-50">
              {saveMutation.isPending ? 'جاري الحفظ...' : 'حفظ الكورس'}
            </button>
            <button type="button" onClick={closeForm} className="rounded-xl border border-ink-200 px-5 py-3 text-sm font-medium text-ink-600 transition hover:bg-ink-100">إلغاء</button>
          </div>
          {saveMutation.isError && <p className="text-sm text-rose-600 md:col-span-2">تعذر حفظ الكورس، تحقق من البيانات.</p>}
        </form>
      )}

      {/* Courses table */}
      <section className="overflow-hidden rounded-3xl border border-ink-200/60 bg-white shadow-sm animate-fade-in-up stagger-2">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-right">
            <thead className="bg-ink-50 text-xs uppercase tracking-[0.15em] text-ink-400">
              <tr>
                {['الكورس', 'الفئة والنوع', 'المدرس', 'الحالة', 'التسجيلات', 'السعر', 'الإجراءات'].map((heading) => (
                  <th key={heading} className="px-5 py-4 font-semibold">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {courses.map((course) => (
                <tr key={course.id} className="transition hover:bg-ink-50/60">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {course.thumbnail_url ? (
                        <img src={course.thumbnail_url} alt="" className="h-12 w-16 rounded-xl object-cover" />
                      ) : (
                        <div className="flex h-12 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-academy-100 to-academy-200">
                          <BookOpen size={18} className="text-academy-500" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-ink-900">{course.title}</p>
                        <p className="text-xs text-ink-400">{levelLabels[course.level]}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-ink-700">{course.category?.name}</p>
                    <p className="text-xs text-ink-400">{course.course_type === 'technical' ? 'تقني' : 'حرف'}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-ink-700">{course.instructor?.name ?? 'غير محدد'}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[course.status]}`}>
                      {statusLabels[course.status]}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-ink-700">
                    {course.enrollments_count ?? 0}{course.max_students ? ` / ${course.max_students}` : ''}
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-ink-800">{Number(course.price).toFixed(2)} ر.س</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(course)} className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-blue-600 transition hover:bg-blue-50">
                        <Pencil size={14} /> تعديل
                      </button>
                      <button
                        disabled={deleteMutation.isPending}
                        onClick={() => confirm(`حذف ${course.title}؟`) && deleteMutation.mutate(course.id)}
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
        {courses.length === 0 && <p className="p-12 text-center text-ink-400">لا توجد كورسات</p>}
      </section>

      {/* Categories section */}
      <section className="rounded-3xl border border-ink-200/60 bg-white p-6 shadow-sm animate-fade-in-up stagger-3">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-academy-50 text-teal-academy-600">
              <Layers size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-ink-900">تصنيفات الكورسات</h2>
              <p className="text-sm text-ink-400">تستخدم لتحديد المدرسين المتاحين لكل كورس</p>
            </div>
          </div>
          <span className="text-sm font-medium text-ink-400">{categories.length} تصنيف</span>
        </div>

        <form onSubmit={(event) => { event.preventDefault(); categoryMutation.mutate() }} className="mb-6 grid gap-3 md:grid-cols-[1fr_2fr_auto]">
          <input required value={categoryName} onChange={(event) => setCategoryName(event.target.value)} placeholder="اسم التصنيف" className="rounded-xl border border-ink-200 bg-ink-50 px-4 py-3 text-sm outline-none focus-ring" />
          <input value={categoryDescription} onChange={(event) => setCategoryDescription(event.target.value)} placeholder="وصف التصنيف" className="rounded-xl border border-ink-200 bg-ink-50 px-4 py-3 text-sm outline-none focus-ring" />
          <button disabled={categoryMutation.isPending} className="rounded-xl bg-ink-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink-800 disabled:opacity-50">
            {editingCategory ? 'تحديث' : 'إضافة'}
          </button>
        </form>

        <div className="grid gap-3 md:grid-cols-3">
          {categories.map((category) => (
            <div key={category.id} className="rounded-2xl border border-ink-100 bg-ink-50/60 p-4 transition hover:border-academy-200 hover:bg-white card-hover">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-ink-900">{category.name}</p>
                  <p className="mt-1 text-xs text-ink-400">{category.courses_count} كورس</p>
                </div>
                <div className="flex gap-2 text-sm">
                  <button onClick={() => { setEditingCategory(category.id); setCategoryName(category.name); setCategoryDescription(category.description ?? '') }} className="text-blue-600 transition hover:opacity-70">تعديل</button>
                  <button onClick={() => confirm(`حذف تصنيف ${category.name}؟`) && deleteCategoryMutation.mutate(category.id)} className="text-rose-600 transition hover:opacity-70">حذف</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
