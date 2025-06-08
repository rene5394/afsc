import { Profile } from '@/modules/profile/domain/Profile'
import { ProfileResponseDTO } from '@/modules/profile/application/dtos/ProfileResponseDTO'
import { ApiMetaResponse } from '@/shared/types/ApiResponse'
import { ProfileStatus } from '@/modules/profile/domain/ProfileStatus'

export interface ProfileService {
  createProfile(profileData: Partial<Profile>): Promise<ProfileResponseDTO>

  readProfile(id: number): Promise<ProfileResponseDTO | null>

  updateProfile(profileData: Profile): Promise<Profile | null>

  patchProfile(profileData: Partial<Profile>): Promise<Profile | null>

  fetchProfiles(
    page: number,
    status: ProfileStatus,
    tagId?: number
  ): Promise<{ data: ProfileResponseDTO[]; meta: ApiMetaResponse }>

  deleteProfile(id: number): Promise<ProfileResponseDTO | null>
}
