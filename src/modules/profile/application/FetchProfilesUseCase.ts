import { Profile } from '@/modules/profile/domain/Profile'
import { ProfileService } from '@/modules/profile/application/ProfileService'
import { ApiMetaResponse } from '@/shared/types/ApiResponse'

export class FetchProfilesUseCase {
  constructor(private profileService: ProfileService) {}

  async execute(
    page: number
  ): Promise<{ data: Profile[]; meta: ApiMetaResponse }> {
    return await this.profileService.fetchProfiles(page)
  }
}
