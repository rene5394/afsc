import { User } from '@/modules/user/domain/User'
import { UserService } from '@/modules/user/application/UserService'
import { CreateUserDTO } from '@/modules/user/application/dtos/CreateUserDTO'

export class CreateUserUseCase {
  constructor(private userService: UserService) {}

  async execute(userData: CreateUserDTO): Promise<User | null> {
    return await this.userService.createUser(userData)
  }
}
