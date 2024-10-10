import axios from 'axios'
import { Tag } from '@/modules/tag/domain/Tag'
import { TagService } from '@/modules/tag/application/TagService'
import { ApiResponse } from '@/shared/types/ApiResponse'

const apiDomainV1 = process.env.NEXT_PUBLIC_API_V1_URL

export class TagRepository implements TagService {
  async fetchTags(): Promise<Tag[]> {
    try {
      const response = await axios.get<ApiResponse<Tag[]>>(
        `${apiDomainV1}/tags`
      )

      return response.data.data
    } catch (error) {
      throw new Error('Error fetching tags')
    }
  }
}
