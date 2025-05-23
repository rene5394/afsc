import { Tag } from '@/modules/tag/domain/Tag'
import { TagStatus } from '@/modules/tag/domain/TagStatus'

export interface TagService {
  fetchTags(status: TagStatus): Promise<Tag[]>

  createTag(tag: Partial<Tag>): Promise<Tag | null>

  updateTag(tag: Partial<Tag>): Promise<Tag | null>
}
