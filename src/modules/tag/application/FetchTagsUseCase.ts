import { Tag } from '@/modules/tag/domain/Tag'
import { TagService } from '@/modules/tag/application/TagService'
import { TagStatus } from '@/modules/tag/domain/TagStatus'

export class FetchTagsUseCase {
  constructor(private tagService: TagService) {}

  async execute(status: TagStatus): Promise<Tag[]> {
    return await this.tagService.fetchTags(status)
  }
}
