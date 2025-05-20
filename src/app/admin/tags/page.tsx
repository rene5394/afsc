import { FetchTagsUseCase } from '@/modules/tag/application/FetchTagsUseCase'
import { TagRepositoryServer } from '@/modules/tag/infrastructure/TagRepositoryServer'
import TableSection from '@/app/components/Admin/Tags/TableSection'

export default async function Tags() {
  const fetchTagsUseCase = new FetchTagsUseCase(new TagRepositoryServer())
  const tags = await fetchTagsUseCase.execute()

  return <TableSection existingTags={tags} />
}
