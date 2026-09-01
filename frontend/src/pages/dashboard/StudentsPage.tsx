import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { fetchUsers, deleteUser, type User } from '../../api/users'

export default function StudentsPage() {
  const queryClient = useQueryClient()

  const studentsQuery = useQuery({
    queryKey: ['users', 'student'],
    queryFn: () => fetchUsers('student'),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'student'] })
    },
  })

  const handleDelete = (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا الطالب؟')) {
      deleteMutation.mutate(id)
    }
  }

  if (studentsQuery.isLoading) {
    return <div className="text-center py-8">جاري التحميل...</div>
  }

  if (studentsQuery.isError) {
    return <div className="text-center py-8 text-rose-600">حدث خطأ في تحميل البيانات</div>
  }

  const students = studentsQuery.data ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">الطلاب</h1>
          <p className="text-slate-600 mt-1">إدارة حسابات الطلاب في النظام</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition">
          إضافة طالب جديد
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
            {students.map((student) => (
              <tr key={student.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-6 py-4 text-slate-900 font-medium">{student.name}</td>
                <td className="px-6 py-4 text-slate-600">{student.email}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {student.roles[0]?.name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">تعديل</button>
                    <button 
                      onClick={() => handleDelete(student.id)}
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
        {students.length === 0 && (
          <div className="text-center py-8 text-slate-500">لا يوجد طلاب</div>
        )}
      </div>
    </div>
  )
}
