import axios from 'axios'
import { Profile } from '@/modules/profile/domain/Profile'
import { ProfileService } from '@/modules/profile/application/ProfileService'
import {
  ApiResponse,
  ApiResponseWithMeta,
  ApiMetaResponse,
} from '@/shared/types/ApiResponse'

const apiDomainV1 = process.env.NEXT_PUBLIC_API_V1_URL

export class ProfileRepository implements ProfileService {
  async createProfile(profileData: Partial<Profile>): Promise<Profile> {
    try {
      const response = await axios.post<ApiResponse<Profile>>(
        `${apiDomainV1}/profiles`,
        profileData
      )
      return response.data.data
    } catch (error) {
      throw new Error('Error creating profile')
    }
  }

  async readProfile(id: number): Promise<Profile | null> {
    try {
      const response = await axios.get<ApiResponse<Profile>>(
        `${apiDomainV1}/profiles/${id}`
      )

      return response.data.data
    } catch (error) {
      throw new Error('Error fetching profile')
    }
  }

  async updateProfile(profileData: Profile): Promise<Profile | null> {
    try {
      const response = await axios.put<ApiResponse<Profile>>(
        `${apiDomainV1}/profiles/${profileData.id}`,
        profileData
      )

      return response.data.data
    } catch (error) {
      throw new Error('Error updating profile')
    }
  }

  async fetchProfiles(
    page: number = 1
  ): Promise<{ data: Profile[]; meta: ApiMetaResponse }> {
    try {
      const response = await axios.get<ApiResponseWithMeta<Profile[]>>(
        `${apiDomainV1}/profiles?page=${page}`
      )

      return { data: response.data.data, meta: response.data.meta }
    } catch (error) {
      throw new Error('Error fetching profiles')
    }
  }
}
