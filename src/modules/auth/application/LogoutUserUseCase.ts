import { AuthService } from '@/modules/auth/application/AuthService'

export class LogoutUserUseCase {
  constructor(private authService: AuthService) {}

  async execute(): Promise<void> {
    return await this.authService.logoutUser()
  }
}
