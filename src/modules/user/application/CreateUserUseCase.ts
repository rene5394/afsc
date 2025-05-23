import { User } from '@/modules/user/domain/User'
import { UserService } from '@/modules/user/application/UserService'

export class CreateUserUseCase {
  constructor(private userService: UserService) {}

  async execute(userData: Partial<User>): Promise<User | null> {
    return await this.userService.createUser(userData)
  }
}
