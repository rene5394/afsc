import { PrismaClient } from '@prisma/client'
import { Tag } from '@/modules/tag/domain/Tag'
import { TagService } from '@/modules/tag/application/TagService'

const prisma = new PrismaClient()

export class TagRepositoryServer implements TagService {
  async fetchTags(): Promise<Tag[]> {
    try {
      const tags = await prisma.tag.findMany()

      return tags
    } catch (error) {
      throw new Error('Error fetching tags')
    }
  }
}
