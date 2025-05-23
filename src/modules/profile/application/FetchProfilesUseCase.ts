import { ProfileService } from '@/modules/profile/application/ProfileService'
import { ProfileResponseDTO } from '@/modules/profile/application/dtos/ProfileResponseDTO'
import { ApiMetaResponse } from '@/shared/types/ApiResponse'
import { ProfileStatus } from '@/modules/profile/domain/ProfileStatus'

export class FetchProfilesUseCase {
  constructor(private profileService: ProfileService) {}

  async execute(
    page: number,
    status: ProfileStatus
  ): Promise<{ data: ProfileResponseDTO[]; meta: ApiMetaResponse }> {
    return await this.profileService.fetchProfiles(page, status)
  }
}
