import { Profile } from '@/modules/profile/domain/Profile'
import { ProfileService } from '@/modules/profile/application/ProfileService'

export class ReadProfilesUseCase {
  constructor(private profileService: ProfileService) {}

  async execute(id: number): Promise<Profile | null> {
    return await this.profileService.readProfile(id)
  }
}
