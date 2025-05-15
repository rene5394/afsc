import { ProfileService } from '@/modules/profile/application/ProfileService'
import { ProfileResponseDTO } from '@/modules/profile/application/dtos/ProfileResponseDTO'
import { ApiMetaResponse } from '@/shared/types/ApiResponse'

export class FetchProfilesUseCase {
  constructor(private profileService: ProfileService) {}

  async execute(
    page: number
  ): Promise<{ data: ProfileResponseDTO[]; meta: ApiMetaResponse }> {
    return await this.profileService.fetchProfiles(page)
  }
}
