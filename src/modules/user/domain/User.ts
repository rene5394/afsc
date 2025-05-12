export interface User {
  id: number
  name: string
  email: string
  createdAt: Date
  updatedAt: Date | null
  active: boolean
}

export interface UserWithPassword extends User {
  password: string
}
