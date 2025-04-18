import { ReadProfilesUseCase } from '@/modules/profile/application/ReadProfileUseCase'
import { FetchTagsUseCase } from '@/modules/tag/application/FetchTagsUseCase'
import { ProfileRepository } from '@/modules/profile/infrastructure/ProfileRepository'
import { TagRepository } from '@/modules/tag/infrastructure/TagRepository'
import { Profile } from '@/modules/profile/domain/Profile'
import ProfileSection from '@/app/components/Admin/Profiles/ProfileSection'
import { Tag } from '@/modules/tag/domain/Tag'

type ProfilePageParams = {
  id: number
}

export default async function ProfilePage({
  params,
}: {
  params: ProfilePageParams
}) {
  const { id } = params

  const readProfilesUseCase = new ReadProfilesUseCase(new ProfileRepository())
  const readTagsUseCase = new FetchTagsUseCase(new TagRepository())

  try {
    const profile: Profile | null = await readProfilesUseCase.execute(id)
    const tags: Tag[] = await readTagsUseCase.execute()

    if (!profile) {
      throw new Error('Profile not found')
    }

    if (!tags) {
      throw new Error('Tags not found')
    }

    return profile && <ProfileSection profile={profile} tags={tags} />
  } catch (error) {
    return <h1 className='text-2xl mx-12 my-12'>Profile or tags not found</h1>
  }
}
