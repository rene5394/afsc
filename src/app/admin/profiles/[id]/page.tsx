import { ReadProfilesUseCase } from '@/modules/profile/application/ReadProfileUseCase'
import { FetchTagsUseCase } from '@/modules/tag/application/FetchTagsUseCase'
import { ProfileRepositoryClient } from '@/modules/profile/infrastructure/ProfileRepositoryClient'
import { TagRepositoryServer } from '@/modules/tag/infrastructure/TagRepositoryServer'
import { Profile } from '@/modules/profile/domain/Profile'
import { Tag } from '@/modules/tag/domain/Tag'
import { ProfileResponseDTO } from '@/modules/profile/application/dtos/ProfileResponseDTO'
import ProfileSection from '@/app/components/Admin/Profiles/ProfileSection'

type ProfilePageParams = {
  id: number
}

export default async function ProfilePage({
  params,
}: {
  params: ProfilePageParams
}) {
  const { id } = params

  const readProfilesUseCase = new ReadProfilesUseCase(
    new ProfileRepositoryClient()
  )
  const readTagsUseCase = new FetchTagsUseCase(new TagRepositoryServer())

  try {
    const ProfileResponseDTO: ProfileResponseDTO | null =
      await readProfilesUseCase.execute(id)
    const tags: Tag[] = await readTagsUseCase.execute()

    if (!ProfileResponseDTO) {
      throw new Error('Profile not found')
    }

    if (!tags) {
      throw new Error('Tags not found')
    }

    const profile = {
      id: ProfileResponseDTO.id,
      name: ProfileResponseDTO.name,
      author: ProfileResponseDTO.author,
      story: ProfileResponseDTO.story,
      photo: ProfileResponseDTO.photo,
      tags: ProfileResponseDTO.tags,
      assets: ProfileResponseDTO.assets,
      routes: ProfileResponseDTO.routes,
      links: ProfileResponseDTO.links,
      active: ProfileResponseDTO.active,
      createdAt: ProfileResponseDTO.createdAt,
      updatedAt: ProfileResponseDTO.updatedAt,
    } as Profile

    return (
      profile && (
        <ProfileSection key={profile.updatedAt} profile={profile} tags={tags} />
      )
    )
  } catch (error) {
    return <h1 className='text-2xl mx-12 my-12'>Profile or tags not found</h1>
  }
}
