import { FetchProfilesUseCase } from '@/modules/profile/application/FetchProfilesUseCase'
import { ProfileRepository } from '@/modules/profile/infrastructure/ProfileRepository'
import { FetchTagsUseCase } from '@/modules/tag/application/FetchTagsUseCase'
import { TagRepository } from '@/modules/tag/infrastructure/TagRepository'

import { Tag } from '@/modules/tag/domain/Tag'

const fetchProfilesUseCase = new FetchProfilesUseCase(new ProfileRepository())
const fetchTagsUseCase = new FetchTagsUseCase(new TagRepository())

const fetchTags = async () => {
  try {
    const fetchedTags = await fetchTagsUseCase.execute()

    return fetchedTags
  } catch (error) {
    console.error('Error fetching profiles:', error)
  }
}

export default async function TableSection() {
  const tags: Tag[] = (await fetchTags()) || []

  return (
    <div className='container xl:max-w-[1024px] max-w-full py-12 px-14'>
      <h2 className='text-4xl'>TAGS</h2>
      <hr className='border-t border-gray-300 mt-2 mb-4' />
      <div className='w-full overflow-x-visible overflow-y-hidden'>
        <table className='w-full md:min-w-full table-auto md:mt-5'>
          <thead>
            <tr>
              <th className='text-xl text-left whitespace-nowrap pr-4'>NAME</th>
              <th colSpan={3} className='text-xl text-left whitespace-nowrap'>
                <span className='ml-4'>ACTIONS</span>
              </th>
            </tr>
            <tr>
              <th colSpan={3}>
                <hr className='border-t border-gray-300 mt-2' />
              </th>
            </tr>
          </thead>
          <tbody>
            {tags.map((tag) => (
              <tr key={tag.id}>
                <td className='pt-6 text-sm lg:text-base whitespace-nowrap pr-4'>
                  {tag.name}
                </td>
                <td className='pt-6 text-sm lg:text-base whitespace-nowrap'>
                  <a
                    href={`/admin/profiles/${tag.id}`}
                    className='ml-4 px-4 py-1 bg-black text-white rounded inline-block'
                  >
                    Edit
                  </a>
                </td>
                <td className='pt-6 text-sm lg:text-base whitespace-nowrap'>
                  <a
                    href={`/admin/tags/${tag.id}`}
                    className='ml-4 px-4 py-1 bg-red-500 text-white rounded inline-block'
                  >
                    Delete
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
