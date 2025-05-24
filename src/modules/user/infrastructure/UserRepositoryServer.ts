import { PrismaClient } from '@prisma/client'
import { User } from '@/modules/user/domain/User'
import { ApiMetaResponse } from '@/shared/types/ApiResponse'
import { UserService } from '@/modules/user/application/UserService'
import { UserStatus } from '@/modules/user/domain/UserStatus'
import { CreateUserDTO } from '@/modules/user/application/dtos/CreateUserDTO'

const ITEMS_PER_PAGE = 10

const prisma = new PrismaClient()

export class UserRepositoryServer implements UserService {
  async createUser(user: CreateUserDTO): Promise<User> {
    try {
      const newUser = await prisma.user.create({
        data: {
          name: user.name || '',
          email: user.email || '',
          password: user.password || '',
        },
      })

      return newUser
    } catch (error) {
      throw new Error('Error creating tag')
    }
  }

  async updateUser(tag: Partial<User>): Promise<User | null> {
    try {
      const updatedUser = await prisma.user.update({
        where: { id: tag.id },
        data: tag,
      })

      return updatedUser
    } catch (error) {
      throw new Error('Error updating user')
    }
  }

  async fetchUsers(
    page: number = 1,
    status: UserStatus = UserStatus.ACTIVE
  ): Promise<{ data: User[]; meta: ApiMetaResponse }> {
    try {
      const skip = (page - 1) * ITEMS_PER_PAGE

      const whereClause =
        status === UserStatus.ALL
          ? {}
          : status === UserStatus.INACTIVE
          ? { active: false }
          : { active: true }

      const totalUsers = await prisma.user.count({ where: whereClause })

      const users = await prisma.user.findMany({
        where: whereClause,
        skip,
        take: ITEMS_PER_PAGE,
        orderBy: { createdAt: 'desc' },
      })

      const transformedUsers = users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        active: user.active,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }))

      const totalPages = Math.ceil(totalUsers / ITEMS_PER_PAGE)
      const nextPage = page < totalPages ? page + 1 : null
      const prevPage = page > 1 ? page - 1 : null

      return {
        data: transformedUsers,
        meta: {
          total: totalUsers,
          totalPages,
          currentPage: page,
          nextPage,
          prevPage,
        },
      }
    } catch (error) {
      throw new Error('Error fetching tags')
    }
  }

  async deleteUser(id: number): Promise<User | null> {
    try {
      const deletedUser = await prisma.user.delete({
        where: { id },
      })

      return deletedUser
    } catch (error) {
      throw new Error('Error deleting user')
    }
  }
}
