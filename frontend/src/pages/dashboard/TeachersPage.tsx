import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { fetchUsers, deleteUser, type User } from '../../api/users'

export default function TeachersPage() {
  const queryClient = useQueryClient()

  const teachersQuery = useQuery({
    queryKey: ['users', 'teacher'],
    queryFn: () => fetchUsers('teacher'),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'teacher'] })
    },
  })

  const handleDelete = (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا المدرس؟')) {
      deleteMutation.mutate(id)
    }
  }

  if (teachersQuery.isLoading) {
    return <div className="text-center py-8">جاري التحميل...</div>
  }

  if (teachersQuery.isError) {
    return <div className="text-center py-8 text-rose-600">حدث خطأ في تحميل البيانات</div>
  }

  const teachers = teachersQuery.data ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">المدرسين</h1>
          <p className="text-slate-600 mt-1">إدارة حسابات المدرسين في النظام</p>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition">
          إضافة مدرس جديد
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-right px-6 py-4 text-sm font-semibold text-slate-700">الاسم</th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-slate-700">البريد الإلكتروني</th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-slate-700">الدور</th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-slate-700">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-6 py-4 text-slate-900 font-medium">{teacher.name}</td>
                <td className="px-6 py-4 text-slate-600">{teacher.email}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    {teacher.roles[0]?.name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">تعديل</button>
                    <button 
                      onClick={() => handleDelete(teacher.id)}
                      disabled={deleteMutation.isPending}
                      className="text-rose-600 hover:text-rose-700 text-sm font-medium disabled:opacity-50"
                    >
                      حذف
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {teachers.length === 0 && (
          <div className="text-center py-8 text-slate-500">لا يوجد مدرسين</div>
        )}
      </div>
    </div>
  )
}
