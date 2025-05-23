import { ReadProfilesUseCase } from '@/modules/profile/application/ReadProfileUseCase'
import { FetchTagsUseCase } from '@/modules/tag/application/FetchTagsUseCase'
import { ProfileRepositoryServer } from '@/modules/profile/infrastructure/ProfileRepositoryServer'
import { TagRepositoryServer } from '@/modules/tag/infrastructure/TagRepositoryServer'
import { Tag } from '@/modules/tag/domain/Tag'
import { TagStatus } from '@/modules/tag/domain/TagStatus'
import NewProfileSection from '@/app/components/Admin/Profiles/NewProfileSection'

export default async function CreateProfilePage() {
  const readProfilesUseCase = new ReadProfilesUseCase(
    new ProfileRepositoryServer()
  )
  const readTagsUseCase = new FetchTagsUseCase(new TagRepositoryServer())

  try {
    const tags: Tag[] = await readTagsUseCase.execute(TagStatus.ACTIVE)

    if (!tags) {
      throw new Error('Tags not found')
    }

    return tags && <NewProfileSection tags={tags} />
  } catch (error) {
    return <h1 className='text-2xl mx-12 my-12'>Profile or tags not found</h1>
  }
}
