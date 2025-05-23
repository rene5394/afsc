import axios from 'axios'
import { Tag } from '@/modules/tag/domain/Tag'
import { TagService } from '@/modules/tag/application/TagService'
import { ApiResponse } from '@/shared/types/ApiResponse'
import { TagStatus } from '@/modules/tag/domain/TagStatus'

const apiDomainV1 = process.env.NEXT_PUBLIC_API_V1_URL

export class TagRepositoryClient implements TagService {
  async fetchTags(status: TagStatus = TagStatus.ACTIVE): Promise<Tag[]> {
    try {
      const response = await axios.get<ApiResponse<Tag[]>>(
        `${apiDomainV1}/tags?status=${status}`
      )

      return response.data.data
    } catch (error) {
      throw new Error('Error fetching tags')
    }
  }

  async createTag(tag: Partial<Tag>): Promise<Tag | null> {
    try {
      const response = await axios.post<ApiResponse<Tag>>(
        `${apiDomainV1}/tags`,
        tag
      )

      return response.data.data
    } catch (error) {
      throw new Error('Error creating tag')
    }
  }

  async updateTag(tag: Partial<Tag>): Promise<Tag | null> {
    try {
      const response = await axios.put<ApiResponse<Tag>>(
        `${apiDomainV1}/tags/${tag.id}`,
        tag
      )

      return response.data.data
    } catch (error) {
      throw new Error('Error updating tag')
    }
  }
}
