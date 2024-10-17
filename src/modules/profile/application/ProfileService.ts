import { Profile } from '@/modules/profile/domain/Profile'
import { ApiMetaResponse } from '@/shared/types/ApiResponse'

export interface ProfileService {
  createProfile(profileData: Partial<Profile>): Promise<Profile>

  readProfile(id: number): Promise<Profile | null>

  updateProfile(profileData: Profile): Promise<Profile | null>

  fetchProfiles(
    page: number
  ): Promise<{ data: Profile[]; meta: ApiMetaResponse }>
}
