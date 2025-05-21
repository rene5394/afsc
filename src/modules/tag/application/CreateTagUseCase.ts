import { Tag } from '@/modules/tag/domain/Tag'
import { TagService } from '@/modules/tag/application/TagService'

export class CreateTagsUseCase {
  constructor(private tagService: TagService) {}

  async execute(tagData: Partial<Tag>): Promise<Tag | null> {
    return await this.tagService.createTag(tagData)
  }
}
