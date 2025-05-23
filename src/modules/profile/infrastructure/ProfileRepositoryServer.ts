import { PrismaClient } from '@prisma/client'
import { Profile } from '@/modules/profile/domain/Profile'
import { ProfileService } from '@/modules/profile/application/ProfileService'
import { ProfileResponseDTO } from '@/modules/profile/application/dtos/ProfileResponseDTO'
import { ApiMetaResponse } from '@/shared/types/ApiResponse'
import { ProfileStatus } from '@/modules/profile/domain/ProfileStatus'

const prisma = new PrismaClient()
const ITEMS_PER_PAGE = 10

export class ProfileRepositoryServer implements ProfileService {
  async createProfile(
    profileData: Partial<Profile>
  ): Promise<ProfileResponseDTO> {
    try {
      const createdProfile = await prisma.profile.create({
        data: {
          name: profileData.name || '',
          author: profileData.author || '',
          story: profileData.story || '',
          photo: profileData.photo || '',
          active: profileData.active || false,
        },
      })

      return {
        ...createdProfile,
        tags: [],
        assets: [],
        routes: [],
        links: [],
        createdAt: createdProfile.createdAt.toISOString(),
        updatedAt: createdProfile.updatedAt?.toISOString() || '',
      } as ProfileResponseDTO
    } catch (error) {
      throw new Error('Error creating profile')
    }
  }

  async readProfile(id: number): Promise<ProfileResponseDTO | null> {
    try {
      const profile = await prisma.profile.findUnique({
        where: { id },
        include: {
          ProfileTag: {
            include: {
              tag: true,
            },
          },
          ProfileAsset: true,
          ProfileRoute: true,
          ProfileLink: true,
        },
      })

      if (!profile) {
        return null
      }

      return {
        id: profile.id,
        name: profile.name,
        author: profile.author,
        story: profile.story,
        photo: profile.photo,
        tags: profile.ProfileTag.map((profileTag) => ({
          id: profileTag.tag.id,
          name: profileTag.tag.name,
        })),
        assets: profile.ProfileAsset.map((asset) => ({
          id: asset.id,
          url: asset.url,
          typeId: asset.typeId,
        })),
        routes: profile.ProfileRoute.map((route) => ({
          id: route.id,
          location: route.location,
          latitude: route.latitude,
          longitude: route.longitude,
          orderNumber: route.orderNumber,
        })),
        links: profile.ProfileLink.map((link) => ({
          id: link.id,
          title: link.title,
          url: link.url,
        })),
        active: profile.active,
        createdAt: profile.createdAt.toISOString(),
        updatedAt: profile.updatedAt?.toISOString() || '',
      } as ProfileResponseDTO
    } catch (error) {
      throw new Error('Error fetching profile')
    }
  }

  async updateProfile(profileData: Profile): Promise<Profile | null> {
    try {
      const updatedProfile = await prisma.profile.update({
        where: { id: profileData.id },
        data: {
          name: profileData.name,
        },
        include: {
          ProfileTag: {
            include: {
              tag: true,
            },
          },
          ProfileAsset: true,
          ProfileRoute: true,
          ProfileLink: true,
        },
      })
      if (!updatedProfile) {
        return null
      }
      return {
        ...updatedProfile,
        tags: updatedProfile.ProfileTag.map((profileTag) => ({
          id: profileTag.tag.id,
          name: profileTag.tag.name,
          active: profileTag.tag.active,
          createdAt: new Date(profileTag.tag.createdAt),
          updatedAt: profileTag.tag.updatedAt
            ? new Date(profileTag.tag.updatedAt)
            : null,
        })),
        assets: updatedProfile.ProfileAsset.map((asset) => ({
          id: asset.id,
          url: asset.url,
          typeId: asset.typeId,
          profileId: asset.profileId,
          createdAt: asset.createdAt.toISOString(),
          updatedAt: asset.updatedAt?.toISOString() || '',
        })),
        routes: updatedProfile.ProfileRoute.map((route) => ({
          id: route.id,
          location: route.location,
          latitude: route.latitude,
          longitude: route.longitude,
          orderNumber: route.orderNumber,
          profileId: route.profileId,
          createdAt: route.createdAt.toISOString(),
          updatedAt: route.updatedAt?.toISOString() || '',
        })),
        links: updatedProfile.ProfileLink.map((link) => ({
          id: link.id,
          title: link.title,
          url: link.url,
          profileId: link.profileId,
          createdAt: link.createdAt.toISOString(),
          updatedAt: link.updatedAt?.toISOString() || '',
        })),
        active: updatedProfile.active,
        createdAt: updatedProfile.createdAt.toISOString(),
        updatedAt: updatedProfile.updatedAt?.toISOString() || '',
      } as Profile
    } catch (error) {
      throw new Error('Error updating profile')
    }
  }

  async patchProfile(profileData: Partial<Profile>): Promise<Profile | null> {
    try {
      const updatedProfile = await prisma.profile.update({
        where: { id: profileData.id },
        data: {
          active: profileData.active,
        },
        include: {
          ProfileTag: {
            include: {
              tag: true,
            },
          },
          ProfileAsset: true,
          ProfileRoute: true,
          ProfileLink: true,
        },
      })

      if (!updatedProfile) {
        return null
      }

      return {
        ...updatedProfile,
        tags: updatedProfile.ProfileTag.map((profileTag) => ({
          id: profileTag.tag.id,
          name: profileTag.tag.name,
          active: profileTag.tag.active,
          createdAt: new Date(profileTag.tag.createdAt),
          updatedAt: profileTag.tag.updatedAt
            ? new Date(profileTag.tag.updatedAt)
            : null,
        })),
        assets: updatedProfile.ProfileAsset.map((asset) => ({
          id: asset.id,
          url: asset.url,
          typeId: asset.typeId,
          profileId: asset.profileId,
          createdAt: asset.createdAt.toISOString(),
          updatedAt: asset.updatedAt?.toISOString() || '',
        })),
        routes: updatedProfile.ProfileRoute.map((route) => ({
          id: route.id,
          location: route.location,
          latitude: route.latitude,
          longitude: route.longitude,
          orderNumber: route.orderNumber,
          profileId: route.profileId,
          createdAt: route.createdAt.toISOString(),
          updatedAt: route.updatedAt?.toISOString() || '',
        })),
        links: updatedProfile.ProfileLink.map((link) => ({
          id: link.id,
          title: link.title,
          url: link.url,
          profileId: link.profileId,
          createdAt: link.createdAt.toISOString(),
          updatedAt: link.updatedAt?.toISOString() || '',
        })),
        active: updatedProfile.active,
        createdAt: updatedProfile.createdAt.toISOString(),
        updatedAt: updatedProfile.updatedAt?.toISOString() || '',
      } as Profile
    } catch (error) {
      throw new Error('Error patching profile')
    }
  }

  async fetchProfiles(
    page: number = 1,
    status: ProfileStatus = ProfileStatus.ACTIVE
  ): Promise<{ data: ProfileResponseDTO[]; meta: ApiMetaResponse }> {
    try {
      const skip = (page - 1) * ITEMS_PER_PAGE

      const totalProfiles = await prisma.profile.count()

      const profiles = await prisma.profile.findMany({
        skip: skip,
        take: ITEMS_PER_PAGE,
        include: {
          ProfileTag: {
            include: {
              tag: true,
            },
          },
          ProfileAsset: true,
          ProfileRoute: true,
          ProfileLink: true,
        },
      })

      const transformedProfiles = profiles.map((profile) => ({
        id: profile.id,
        name: profile.name,
        author: profile.author,
        story: profile.story,
        photo: profile.photo,
        tags: profile.ProfileTag.map((profileTag) => ({
          id: profileTag.tag.id,
          name: profileTag.tag.name,
        })),
        assets: profile.ProfileAsset.map((asset) => ({
          id: asset.id,
          url: asset.url,
          typeId: asset.typeId,
        })),
        routes: profile.ProfileRoute.map((route) => ({
          id: route.id,
          location: route.location,
          latitude: route.latitude,
          longitude: route.longitude,
          orderNumber: route.orderNumber,
        })),
        links: profile.ProfileLink.map((link) => ({
          id: link.id,
          title: link.title,
          url: link.url,
        })),
        active: profile.active,
        createdAt: profile.createdAt.toISOString(),
        updatedAt: profile.updatedAt?.toISOString() || '',
      })) as ProfileResponseDTO[]

      const totalPages = Math.ceil(totalProfiles / ITEMS_PER_PAGE)
      const nextPage = page < totalPages ? page + 1 : null
      const prevPage = page > 1 ? page - 1 : null

      const response = {
        data: transformedProfiles,
        meta: {
          total: totalProfiles,
          totalPages: totalPages,
          currentPage: page,
          nextPage: nextPage,
          prevPage: prevPage,
        },
      }

      return response
    } catch (error) {
      throw new Error('Error fetching profiles')
    }
  }

  async deleteProfile(id: number): Promise<ProfileResponseDTO | null> {
    try {
      const profile = await prisma.profile.findUnique({
        where: { id },
        include: {
          ProfileTag: {
            include: { tag: true },
          },
          ProfileAsset: true,
          ProfileRoute: true,
          ProfileLink: true,
        },
      })

      if (!profile) {
        return null
      }

      await prisma.profile.delete({
        where: { id },
      })

      return {
        id: profile.id,
        name: profile.name,
        author: profile.author,
        story: profile.story,
        photo: profile.photo,
        tags: profile.ProfileTag.map((profileTag) => ({
          id: profileTag.tag.id,
          name: profileTag.tag.name,
        })),
        assets: profile.ProfileAsset.map((asset) => ({
          id: asset.id,
          url: asset.url,
          typeId: asset.typeId,
        })),
        routes: profile.ProfileRoute.map((route) => ({
          id: route.id,
          location: route.location,
          latitude: route.latitude,
          longitude: route.longitude,
          orderNumber: route.orderNumber,
        })),
        links: profile.ProfileLink.map((link) => ({
          id: link.id,
          title: link.title,
          url: link.url,
        })),
        active: profile.active,
        createdAt: profile.createdAt.toISOString(),
        updatedAt: profile.updatedAt?.toISOString() || '',
      } as ProfileResponseDTO
    } catch (error) {
      throw new Error('Error deleting profile')
    }
  }
}
