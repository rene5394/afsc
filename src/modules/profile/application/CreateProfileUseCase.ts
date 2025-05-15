import { Profile } from '@/modules/profile/domain/Profile'
import { ProfileService } from '@/modules/profile/application/ProfileService'
import { ProfileResponseDTO } from '@/modules/profile/application/dtos/ProfileResponseDTO'

export class CreateProfilesUseCase {
  constructor(private profileService: ProfileService) {}

  async execute(
    profileData: Partial<Profile>
  ): Promise<ProfileResponseDTO | null> {
    return await this.profileService.createProfile(profileData)
  }
}
