import { Profile } from '@/modules/profile/domain/Profile'
import { ProfileService } from '@/modules/profile/application/ProfileService'

export class FetchProfilesUseCase {
  constructor(private profileService: ProfileService) {}

  async execute(): Promise<Profile[]> {
    return await this.profileService.fetchProfiles()
  }
}
