import axios from 'axios'
import { User } from '@/modules/user/domain/User'
import { UserService } from '@/modules/user/application/UserService'
import { ApiResponse, ApiResponseWithMeta } from '@/shared/types/ApiResponse'
import { ApiMetaResponse } from '@/shared/types/ApiResponse'
import { UserStatus } from '@/modules/user/domain/UserStatus'

const apiDomainV1 = process.env.NEXT_PUBLIC_API_V1_URL

export class UserRepositoryClient implements UserService {
  async createUser(userData: Partial<User>): Promise<User> {
    try {
      const response = await axios.post<ApiResponse<User>>(
        `${apiDomainV1}/users`,
        userData
      )

      return response.data.data
    } catch (error) {
      throw new Error('Error creating user')
    }
  }

  async updateUser(user: Partial<User>): Promise<User | null> {
    try {
      const response = await axios.put<ApiResponse<User>>(
        `${apiDomainV1}/users/${user.id}`,
        user
      )

      return response.data.data
    } catch (error) {
      throw new Error('Error updating user')
    }
  }

  async fetchUsers(
    page: number = 1,
    status: UserStatus = UserStatus.ACTIVE
  ): Promise<{ data: User[]; meta: ApiMetaResponse }> {
    try {
      const response = await axios.get<ApiResponseWithMeta<User[]>>(
        `${apiDomainV1}/users?page=${page}&status=${status}`
      )

      return { data: response.data.data, meta: response.data.meta }
    } catch (error) {
      throw new Error('Error fetching users')
    }
  }

  async deleteUser(id: number): Promise<User | null> {
    try {
      const response = await axios.delete<ApiResponse<User>>(
        `${apiDomainV1}/users/${id}`
      )

      return response.data.data
    } catch (error) {
      throw new Error('Error deleting user')
    }
  }
}
