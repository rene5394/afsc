import { FetchTagsUseCase } from '@/modules/tag/application/FetchTagsUseCase'
import { TagRepositoryServer } from '@/modules/tag/infrastructure/TagRepositoryServer'
import { TagStatus } from '@/modules/tag/domain/TagStatus'
import TableSection from '@/app/components/Admin/Tags/TableSection'

export default async function Tags() {
  const fetchTagsUseCase = new FetchTagsUseCase(new TagRepositoryServer())
  const tags = await fetchTagsUseCase.execute(TagStatus.ALL)

  return <TableSection existingTags={tags} />
}
