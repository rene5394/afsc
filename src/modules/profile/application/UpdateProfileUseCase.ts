import { Profile } from '@/modules/profile/domain/Profile'
import { ProfileService } from '@/modules/profile/application/ProfileService'

export class UpdateProfilesUseCase {
  constructor(private profileService: ProfileService) {}

  async execute(profileData: Profile): Promise<Profile | null> {
    return await this.profileService.updateProfile(profileData)
  }
}
