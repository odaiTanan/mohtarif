import { axiosInstance } from './axios'

export interface User {
  id: number
  name: string
  email: string
  phone: string | null
  avatar_url: string | null
  bio: string | null
  specialty: string | null
  academic_id: string | null
  teaching_category_id: number | null
  status: 'active' | 'inactive'
  roles: { id: number; name: string }[]
  permissions: string[]
  created_at: string
  updated_at: string
}

export interface CreateUserPayload {
  name: string
  email: string
  password: string
  password_confirmation: string
  role: 'admin' | 'teacher' | 'student'
  phone?: string
  bio?: string
  specialty?: string
  academic_id?: string
    teaching_category_id?: number
  status?: 'active' | 'inactive'
}

export interface UpdateUserPayload {
  name?: string
  email?: string
  password?: string
  password_confirmation?: string
  role?: 'admin' | 'teacher' | 'student'
  phone?: string
  bio?: string
  specialty?: string
  academic_id?: string
    teaching_category_id?: number
  status?: 'active' | 'inactive'
}

export async function fetchUsers(role?: 'admin' | 'teacher' | 'student'): Promise<User[]> {
  const params = role ? { role } : {}
  const response = await axiosInstance.get<{ data: User[] }>('/users', { params })
  return response.data.data
}

export async function fetchUser(id: number): Promise<User> {
  const response = await axiosInstance.get<{ data: User }>(`/users/${id}`)
  return response.data.data
}

export async function createUser(payload: CreateUserPayload): Promise<User> {
  const response = await axiosInstance.post<{ data: User }>('/users', payload)
  return response.data.data
}

export async function updateUser(id: number, payload: UpdateUserPayload): Promise<User> {
  const response = await axiosInstance.put<{ data: User }>(`/users/${id}`, payload)
  return response.data.data
}

export async function deleteUser(id: number): Promise<void> {
  await axiosInstance.delete(`/users/${id}`)
}

export async function uploadUserAvatar(id: number, file: File): Promise<User> {
  const formData = new FormData()
  formData.append('file', file)
  const response = await axiosInstance.post<{ data: User }>(`/users/${id}/avatar`, formData)
  return response.data.data
}
