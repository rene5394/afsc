import { ProfileService } from '@/modules/profile/application/ProfileService'
import { ProfileResponseDTO } from '@/modules/profile/application/dtos/ProfileResponseDTO'

export class DeleteProfileUseCase {
  constructor(private profileService: ProfileService) {}

  async execute(id: number): Promise<ProfileResponseDTO | null> {
    return await this.profileService.deleteProfile(id)
  }
}
