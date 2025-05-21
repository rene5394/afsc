import { Tag } from '@/modules/tag/domain/Tag'

export interface TagService {
  fetchTags(): Promise<Tag[]>

  createTag(tag: Partial<Tag>): Promise<Tag | null>

  updateTag(tag: Partial<Tag>): Promise<Tag | null>
}
