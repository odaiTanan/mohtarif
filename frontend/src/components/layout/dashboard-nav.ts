export type NavItem = {
  label: string
  href: string
  roles?: string[]
  permissions?: string[]
}

export const dashboardNavigation: NavItem[] = [
  { label: 'الرئيسية', href: '/dashboard', roles: ['Admin', 'Teacher', 'Student'] },
  { label: 'الطلاب', href: '/dashboard/students', roles: ['Admin'] },
  { label: 'المدرسين', href: '/dashboard/teachers', roles: ['Admin'] },
]
