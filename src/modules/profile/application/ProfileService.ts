import { Profile } from '@/modules/profile/domain/Profile'

export interface ProfileService {
  createProfile(profileData: Partial<Profile>): Promise<Profile>

  readProfile(id: number): Promise<Profile | null>

  updateProfile(profileData: Profile): Promise<Profile | null>

  fetchProfiles(): Promise<Profile[]>
}
