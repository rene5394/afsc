import { ProfileResponseDTO } from '@/modules/profile/application/dtos/ProfileResponseDTO'
import { ProfileService } from '@/modules/profile/application/ProfileService'

export class ReadProfilesUseCase {
  constructor(private profileService: ProfileService) {}

  async execute(id: number): Promise<ProfileResponseDTO | null> {
    return await this.profileService.readProfile(id)
  }
}
