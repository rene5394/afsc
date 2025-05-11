import { LoginUserDTO } from '@/modules/auth/application/dtos/LoginUserDTO'

export interface AuthService {
  loginUser(loginUserDTO: LoginUserDTO): Promise<void>

  logoutUser(): Promise<void>
}
