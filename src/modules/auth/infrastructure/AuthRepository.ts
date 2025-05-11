import axios from 'axios'
import { AuthService } from '@/modules/auth/application/AuthService'
import { LoginUserDTO } from '../application/dtos/LoginUserDTO'

const apiDomainV1 = process.env.NEXT_PUBLIC_API_V1_URL

export class AuthRepository implements AuthService {
  async loginUser(loginUserDTO: LoginUserDTO): Promise<void> {
    try {
      await axios.post(`${apiDomainV1}/auth/login`, loginUserDTO)
    } catch (error: any) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.message || 'Login failed')
      } else {
        throw new Error('Login failed')
      }
    }
  }

  async logoutUser(): Promise<void> {
    try {
      await axios.post(`${apiDomainV1}/auth/logout`)
    } catch (error) {
      throw new Error('Error logout user')
    }
  }
}
