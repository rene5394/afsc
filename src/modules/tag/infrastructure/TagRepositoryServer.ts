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

  async createTag(tag: Partial<Tag>): Promise<Tag | null> {
    try {
      const newTag = await prisma.tag.create({
        data: {
          name: tag.name || '',
        },
      })

      return newTag
    } catch (error) {
      throw new Error('Error creating tag')
    }
  }

  async updateTag(tag: Partial<Tag>): Promise<Tag | null> {
    try {
      const updatedTag = await prisma.tag.update({
        where: { id: tag.id },
        data: tag,
      })

      return updatedTag
    } catch (error) {
      throw new Error('Error updating tag')
    }
  }
}
