import { NavLink } from 'react-router-dom'

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-white border-l border-slate-200 min-h-screen">
      <div className="p-6">
        <h2 className="text-xl font-bold text-slate-900">لوحة الإدارة</h2>
        <p className="text-sm text-slate-600 mt-1">إدارة النظام والمستخدمين</p>
      </div>

      <nav className="mt-6 px-4">
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/dashboard/courses"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                  isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
                }`
              }
            >
              <span className="text-lg">📚</span>
              <span className="font-medium">الكورسات</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
                }`
              }
            >
              <span className="text-lg">🏠</span>
              <span className="font-medium">الرئيسية</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/students"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
                }`
              }
            >
              <span className="text-lg">👨‍🎓</span>
              <span className="font-medium">الطلاب</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/teachers"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
                }`
              }
            >
              <span className="text-lg">👨‍🏫</span>
              <span className="font-medium">المدرسين</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  )
}
