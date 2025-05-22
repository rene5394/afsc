import { Profile } from '@/modules/profile/domain/Profile'
import { ProfileService } from '@/modules/profile/application/ProfileService'

export class PatchProfilesUseCase {
  constructor(private profileService: ProfileService) {}

  async execute(profileData: Partial<Profile>): Promise<Profile | null> {
    return await this.profileService.patchProfile(profileData)
  }
}
