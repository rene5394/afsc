import { Tag } from '@/modules/tag/domain/Tag'
import { TagService } from '@/modules/tag/application/TagService'

export class FetchTagsUseCase {
  constructor(private tagService: TagService) {}

  async execute(): Promise<Tag[]> {
    return await this.tagService.fetchTags()
  }
}
