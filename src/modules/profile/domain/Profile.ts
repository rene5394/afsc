import { ProfileAsset } from '@/modules/profile-asset/domain/ProfileAsset'
import { ProfileLink } from '@/modules/profile-link/domain/ProfileLink'
import { ProfileRoute } from '@/modules/profile-route/domain/ProfileRoute'
import { Tag } from '@/modules/tag/domain/Tag'

export interface Profile {
  id: number
  name: string
  story: string
  photo: string
  createdAt: string
  updatedAt: string
  tags: Tag[]
  assets: ProfileAsset[]
  routes: ProfileRoute[]
  links: ProfileLink[]
}
