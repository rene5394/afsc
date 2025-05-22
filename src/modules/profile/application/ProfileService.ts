import { Profile } from '@/modules/profile/domain/Profile'
import { ProfileResponseDTO } from '@/modules/profile/application/dtos/ProfileResponseDTO'
import { ApiMetaResponse } from '@/shared/types/ApiResponse'

export interface ProfileService {
  createProfile(profileData: Partial<Profile>): Promise<ProfileResponseDTO>

  readProfile(id: number): Promise<ProfileResponseDTO | null>

  updateProfile(profileData: Profile): Promise<Profile | null>

  patchProfile(profileData: Partial<Profile>): Promise<Profile | null>

  fetchProfiles(
    page: number
  ): Promise<{ data: ProfileResponseDTO[]; meta: ApiMetaResponse }>

  deleteProfile(id: number): Promise<ProfileResponseDTO | null>
}
