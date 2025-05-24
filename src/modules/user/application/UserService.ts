import { User } from '@/modules/user/domain/User'
import { ApiMetaResponse } from '@/shared/types/ApiResponse'
import { UserStatus } from '@/modules/user/domain/UserStatus'
import { CreateUserDTO } from '@/modules/user/application/dtos/CreateUserDTO'

export interface UserService {
  createUser(userData: CreateUserDTO): Promise<User>

  updateUser(userData: Partial<User>): Promise<User | null>

  fetchUsers(
    page: number,
    status: UserStatus
  ): Promise<{ data: User[]; meta: ApiMetaResponse }>

  deleteUser(id: number): Promise<User | null>
}
