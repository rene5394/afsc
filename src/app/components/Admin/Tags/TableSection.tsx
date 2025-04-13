import { FetchTagsUseCase } from '@/modules/tag/application/FetchTagsUseCase'
import { TagRepository } from '@/modules/tag/infrastructure/TagRepository'

import { Tag } from '@/modules/tag/domain/Tag'

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
    <div className='container 2xl:max-w-[1200 px] max-w-full py-12 px-14'>
      <h1 className='text-5xl'>TAGS</h1>
      <button className='my-5 px-4 py-2 bg-black text-white rounded'>
        Add New Tag
      </button>
      <div className='w-full overflow-x-visible overflow-y-hidden'>
        <table
          id='table-tags'
          className='w-full min-w-full table-auto border border-gray-300 border-collapse'
        >
          <thead>
            <tr>
              <th className='text-xl text-left whitespace-nowrap px-6 py-3 bg-black text-white'>
                NAME
              </th>
              <th className='text-xl text-left whitespace-nowrap px-6 py-3 bg-black text-white'>
                STATUS
              </th>
              <th className='text-xl text-left whitespace-nowrap px-6 py-3 bg-black text-white'>
                ACTIONS
              </th>
              <th className='text-xl text-left whitespace-nowrap px-6 py-3 bg-black text-white' />
            </tr>
          </thead>
          <tbody>
            {tags.map((tag) => (
              <tr key={tag.id} className='odd:bg-white even:bg-gray-100'>
                <td className='px-6 py-4 text-sm lg:text-base whitespace-nowrap'>
                  {tag.name}
                </td>
                <td className='px-6 py-4 text-sm lg:text-base whitespace-nowrap'>
                  {tag.active ? (
                    <span className='text-green-500 font-bold'>
                      {tag.active} Active
                    </span>
                  ) : (
                    <span className='text-red-500 font-bold'>
                      {tag.active} Inactive
                    </span>
                  )}
                </td>
                <td className='w-[110px] px-6 py-4 text-sm lg:text-base whitespace-nowrap'>
                  <a
                    href={`/admin/profiles/${tag.id}`}
                    className='px-4 py-1 bg-black text-white rounded inline-block'
                  >
                    Edit
                  </a>
                </td>
                <td className='pr-6 py-4 text-sm lg:text-base whitespace-nowrap'>
                  {tag.active ? (
                    <span className='px-4 py-1 bg-red-500 text-white rounded inline-block'>
                      {tag.active} Deactivate
                    </span>
                  ) : (
                    <span className='px-4 py-1 bg-green-500 text-white rounded inline-block'>
                      {tag.active} Activate
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
