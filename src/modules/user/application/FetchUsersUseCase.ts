import { User } from '@/modules/user/domain/User'
import { UserService } from '@/modules/user/application/UserService'
import { ApiMetaResponse } from '@/shared/types/ApiResponse'
import { UserStatus } from '@/modules/user/domain/UserStatus'

export class FetchUsersUseCase {
  constructor(private userService: UserService) {}

  async execute(
    page: number,
    status: UserStatus
  ): Promise<{ data: User[]; meta: ApiMetaResponse }> {
    return await this.userService.fetchUsers(page, status)
  }
}
