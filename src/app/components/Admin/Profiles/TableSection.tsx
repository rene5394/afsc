import { FetchProfilesUseCase } from '@/modules/profile/application/FetchProfilesUseCase'
import { ProfileRepository } from '@/modules/profile/infrastructure/ProfileRepository'
import { Profile } from '@/modules/profile/domain/Profile'

const fetchProfilesUseCase = new FetchProfilesUseCase(new ProfileRepository())

const fetchProfiles = async () => {
  try {
    const fetchedProfiles = await fetchProfilesUseCase.execute(1)

    return [fetchedProfiles.data, fetchedProfiles.meta]
  } catch (error) {
    console.error('Error fetching profiles:', error)
  }
}

export default async function TableSection() {
  const [data, meta] = (await fetchProfiles()) || []
  const profiles: Profile[] = Array.isArray(data) ? data : []
  const profilesMeta = meta || { total: 0 }

  return (
    <div className='container xl:max-w-[1024px] max-w-full py-12 px-14'>
      <h2 className='text-4xl'>PROFILES</h2>
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
            {profiles.map((profile) => (
              <tr key={profile.id}>
                <td className='pt-6 text-sm lg:text-base whitespace-nowrap pr-4'>
                  {profile.name}
                </td>
                <td className='pt-6 text-sm lg:text-base whitespace-nowrap'>
                  <a
                    href={`/admin/profiles/${profile.id}`}
                    className='ml-4 px-4 py-1 bg-black text-white rounded inline-block'
                  >
                    Edit
                  </a>
                </td>
                <td className='pt-6 text-sm lg:text-base whitespace-nowrap'>
                  <a
                    href={`/admin/tags/${profile.id}`}
                    className='ml-4 px-4 py-1 bg-red-500 text-white rounded inline-block'
                  >
                    Delete
                  </a>
                </td>
              </tr>
            ))}
            {profiles.map((profile) => (
              <tr key={profile.id}>
                <td className='pt-6 text-sm lg:text-base whitespace-nowrap pr-4'>
                  {profile.name}
                </td>
                <td className='pt-6 text-sm lg:text-base whitespace-nowrap'>
                  <a
                    href={`/admin/profiles/${profile.id}`}
                    className='ml-4 px-4 py-1 bg-black text-white rounded inline-block'
                  >
                    Edit
                  </a>
                </td>
                <td className='pt-6 text-sm lg:text-base whitespace-nowrap'>
                  <a
                    href={`/admin/tags/${profile.id}`}
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
