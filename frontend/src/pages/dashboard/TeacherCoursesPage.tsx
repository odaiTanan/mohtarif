import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { BookOpen, ExternalLink, FileVideo, ImagePlus, Layers, Plus, Trash2, Video, X } from 'lucide-react'

import { createCourseContent, deleteCourseContent, fetchTeacherCourse, fetchTeacherCourses, uploadCourseContentMedia, uploadCourseMedia, type CourseRecord } from '../../api/management'

type ContentType = 'lessons' | 'workshops' | 'lectures'

const contentLabels: Record<ContentType, string> = { lessons: 'الدروس', workshops: 'الورش', lectures: 'المحاضرات المباشرة' }

export default function TeacherCoursesPage() {
  const queryClient = useQueryClient()
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [contentType, setContentType] = useState<ContentType>('lessons')
  const [title, setTitle] = useState('')
  const [contentFile, setContentFile] = useState<File | null>(null)
  const [mediaError, setMediaError] = useState('')

  const coursesQuery = useQuery({ queryKey: ['teacher-courses'], queryFn: fetchTeacherCourses })
  const detailQuery = useQuery({ queryKey: ['teacher-course', selectedId], queryFn: () => fetchTeacherCourse(selectedId as number), enabled: selectedId !== null })
  const selectedCourse = detailQuery.data

  const contentMutation = useMutation({
    mutationFn: async () => {
      const response = await createCourseContent(selectedId as number, contentType, { title })
      return contentFile ? uploadCourseContentMedia(selectedId as number, contentType, response.data.data.id, contentFile) : response
    },
    onSuccess: () => { setTitle(''); setContentFile(null); queryClient.invalidateQueries({ queryKey: ['teacher-course', selectedId] }); queryClient.invalidateQueries({ queryKey: ['teacher-courses'] }) },
  })
  const deleteMutation = useMutation({
    mutationFn: ({ type, id }: { type: ContentType; id: number }) => deleteCourseContent(selectedId as number, type, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['teacher-course', selectedId] }),
  })
  const mediaMutation = useMutation({
    mutationFn: (file: File) => uploadCourseMedia(selectedId as number, file),
    onSuccess: (course) => { setMediaError(''); queryClient.setQueryData(['teacher-course', selectedId], (current: CourseRecord | undefined) => current ? { ...current, ...course } : course); queryClient.invalidateQueries({ queryKey: ['teacher-courses'] }) },
    onError: () => setMediaError('تعذر رفع الصورة. تأكد من نوع الملف وحجمه.'),
  })

  if (coursesQuery.isLoading) return <div className="py-20 text-center text-ink-400">جاري تحميل كورساتك...</div>
  if (coursesQuery.isError) return <div className="py-20 text-center text-rose-600">تعذر تحميل كورساتك</div>

  const courses = coursesQuery.data?.data ?? []

  if (selectedCourse) {
    const contents = selectedCourse[contentType] ?? []
    return (
      <div className="space-y-6">
        <button type="button" onClick={() => setSelectedId(null)} className="flex items-center gap-2 text-sm font-semibold text-ink-500 transition hover:text-academy-600"><X size={16} /> العودة إلى كورساتي</button>
        <header className="flex flex-col gap-5 rounded-3xl border border-ink-200/60 bg-white p-6 shadow-sm md:flex-row md:items-center">
          {selectedCourse.thumbnail_url ? <img src={selectedCourse.thumbnail_url} alt="" className="h-32 w-full rounded-2xl object-cover md:w-52" /> : <div className="flex h-32 w-full items-center justify-center rounded-2xl bg-academy-50 text-academy-500 md:w-52"><BookOpen size={34} /></div>}
          <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-academy-600">إدارة محتوى الكورس</p><h1 className="mt-1 text-2xl font-bold text-ink-900">{selectedCourse.title}</h1><p className="mt-2 text-sm text-ink-500">{selectedCourse.description || 'أضف الدروس والورش والمحاضرات لبدء بناء المحتوى.'}</p></div>
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-ink-200 px-4 py-3 text-sm font-semibold text-ink-700 transition hover:bg-ink-50"><ImagePlus size={17} /> تغيير الصورة<input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) mediaMutation.mutate(file) }} /></label>
        </header>
        {mediaError && <p className="text-sm text-rose-600">{mediaError}</p>}
        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <nav className="flex gap-2 overflow-x-auto lg:block lg:space-y-2">
            {(Object.keys(contentLabels) as ContentType[]).map((type) => <button key={type} type="button" onClick={() => setContentType(type)} className={`flex min-w-max items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition lg:w-full ${contentType === type ? 'bg-academy-600 text-white shadow-lg shadow-academy-500/20' : 'bg-white text-ink-600 hover:bg-ink-100'}`}><ContentIcon type={type} />{contentLabels[type]}</button>)}
          </nav>
          <section className="space-y-4">
            <form onSubmit={(event) => { event.preventDefault(); contentMutation.mutate() }} className="grid gap-3 rounded-2xl border border-ink-200/60 bg-white p-4 sm:grid-cols-[1fr_1fr_auto]"><input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder={`عنوان ${contentLabels[contentType]}`} className="rounded-xl border border-ink-200 bg-ink-50 px-4 py-3 text-sm outline-none focus-ring" /><label className="flex cursor-pointer items-center rounded-xl border border-dashed border-ink-300 bg-ink-50 px-4 py-3 text-sm text-ink-600"><span className="truncate">{contentFile?.name ?? (contentType === 'lessons' ? 'رفع فيديو الدرس' : contentType === 'workshops' ? 'رفع صورة الورشة' : 'رفع تسجيل المحاضرة')}</span><input type="file" accept={contentType === 'workshops' ? 'image/jpeg,image/png,image/webp' : 'video/mp4,video/webm,video/quicktime'} className="hidden" onChange={(event) => setContentFile(event.target.files?.[0] ?? null)} /></label><button disabled={contentMutation.isPending} className="flex items-center justify-center gap-2 rounded-xl bg-ink-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"><Plus size={16} /> إضافة</button></form>
            <div className="space-y-3">{contents.map((item) => <article key={item.id} className="flex items-center gap-4 rounded-2xl border border-ink-200/60 bg-white p-4"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-academy-50 text-academy-600"><ContentIcon type={contentType} /></div><div className="min-w-0 flex-1"><h2 className="truncate font-semibold text-ink-900">{item.title}</h2>{'video_url' in item && item.video_url && <a href={item.video_url} target="_blank" rel="noreferrer" className="mt-1 flex items-center gap-1 truncate text-xs text-academy-600"><ExternalLink size={12} /> مشاهدة الفيديو</a>}{'meeting_url' in item && item.meeting_url && <a href={item.meeting_url} target="_blank" rel="noreferrer" className="mt-1 flex items-center gap-1 truncate text-xs text-academy-600"><ExternalLink size={12} /> فتح رابط الاجتماع</a>}</div><button type="button" aria-label={`حذف ${item.title}`} onClick={() => deleteMutation.mutate({ type: contentType, id: item.id })} className="rounded-lg p-2 text-rose-600 transition hover:bg-rose-50"><Trash2 size={17} /></button></article>)}{contents.length === 0 && <p className="rounded-2xl border border-dashed border-ink-200 bg-white p-10 text-center text-sm text-ink-400">لا يوجد محتوى بعد</p>}</div>
          </section>
        </div>
      </div>
    )
  }

  return <div className="space-y-6"><header><p className="text-sm font-semibold text-academy-600">لوحة المدرس</p><h1 className="mt-2 text-3xl font-bold text-ink-900">كورساتي</h1><p className="mt-2 text-sm text-ink-500">اختر كورسًا لإدارة دروسه وورش العمل ومحاضراته المباشرة.</p></header><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{courses.map((course) => <button type="button" key={course.id} onClick={() => setSelectedId(course.id)} className="group overflow-hidden rounded-3xl border border-ink-200/60 bg-white text-right shadow-sm transition hover:-translate-y-1 hover:shadow-xl">{course.thumbnail_url ? <img src={course.thumbnail_url} alt="" className="h-44 w-full object-cover transition group-hover:scale-105" /> : <div className="flex h-44 items-center justify-center bg-gradient-to-br from-academy-50 to-teal-academy-50 text-academy-500"><BookOpen size={42} /></div>}<div className="p-5"><div className="flex items-center justify-between gap-3"><h2 className="truncate text-lg font-bold text-ink-900">{course.title}</h2><span className="shrink-0 rounded-full bg-ink-100 px-2.5 py-1 text-xs font-semibold text-ink-600">{course.status === 'published' ? 'منشور' : 'مسودة'}</span></div><p className="mt-2 line-clamp-2 text-sm text-ink-500">{course.description || 'لا يوجد وصف للكورس'}</p><div className="mt-5 grid grid-cols-3 gap-2 border-t border-ink-100 pt-4 text-center text-xs text-ink-500"><span><b className="block text-base text-ink-900">{course.lessons_count ?? 0}</b>دروس</span><span><b className="block text-base text-ink-900">{course.workshops_count ?? 0}</b>ورش</span><span><b className="block text-base text-ink-900">{course.lectures_count ?? 0}</b>محاضرات</span></div></div></button>)}{courses.length === 0 && <div className="rounded-3xl border border-dashed border-ink-200 bg-white p-12 text-center text-ink-400 md:col-span-2 xl:col-span-3">لم يتم إسناد أي كورس إلى حسابك بعد.</div>}</div></div>
}

function ContentIcon({ type }: { type: ContentType }) {
  if (type === 'workshops') return <Layers size={18} />
  if (type === 'lectures') return <Video size={18} />
  return <FileVideo size={18} />
}
