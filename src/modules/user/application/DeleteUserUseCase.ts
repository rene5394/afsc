import { User } from '@/modules/user/domain/User'
import { UserService } from '@/modules/user/application/UserService'

export class ReadUserUseCase {
  constructor(private userService: UserService) {}

  async execute(id: number): Promise<User | null> {
    return await this.userService.deleteUser(id)
  }
}
