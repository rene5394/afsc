import { AuthService } from '@/modules/auth/application/AuthService'
import { LoginUserDTO } from '@/modules/auth/application/dtos/LoginUserDTO'

export class LoginUserUseCase {
  constructor(private authService: AuthService) {}

  async execute(loginUserDTO: LoginUserDTO): Promise<void> {
    return await this.authService.loginUser(loginUserDTO)
  }
}
