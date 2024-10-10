import { Tag } from '@/modules/tag/domain/Tag'

export interface TagService {
  fetchTags(): Promise<Tag[]>
}
