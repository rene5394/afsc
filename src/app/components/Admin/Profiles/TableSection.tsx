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
    <div className='container 2xl:max-w-[1200px] max-w-full py-12 px-14'>
      <h1 className='text-5xl'>PROFILES</h1>
      <a
        href='/admin/profiles/create'
        className='inline-block my-5 px-4 py-2 bg-black text-white rounded'
      >
        Add New Profile
      </a>
      <div className='w-full overflow-x-visible overflow-y-hidden'>
        <table
          id='table-profiles'
          className='w-full min-w-full table-auto border border-gray-300 border-collapse'
        >
          <thead>
            <tr>
              <th className='text-xl text-left whitespace-nowrap px-6 py-3 bg-black text-white'>
                NAME
              </th>
              <th className='text-xl text-left whitespace-nowrap px-6 py-3 bg-black text-white'>
                ORIGIN
              </th>
              <th className='text-xl text-left whitespace-nowrap px-6 py-3 bg-black text-white'>
                AGE
              </th>
              <th className='text-xl text-left whitespace-nowrap px-6 py-3 bg-black text-white'>
                MIGRATION TYPE
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
            {profiles.map((profile) => (
              <tr key={profile.id} className='odd:bg-white even:bg-gray-100'>
                <td className='px-6 py-4 text-sm lg:text-base whitespace-nowrap pr-4'>
                  {profile.name}
                </td>
                <td className='px-6 py-4 text-sm lg:text-base whitespace-nowrap pr-4'>
                  {profile.routes[0]?.location}
                </td>
                <td className='px-6 py-4 text-sm lg:text-base whitespace-nowrap pr-4'>
                  N/A
                </td>
                <td className='px-6 py-4 text-sm lg:text-base whitespace-nowrap'>
                  {profile.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className='border border-gray-300 px-3 py-1 ml-3'
                    >
                      {tag.name}
                    </span>
                  ))}
                </td>
                <td className='px-6 py-4 text-sm lg:text-base whitespace-nowrap'>
                  {profile.active ? (
                    <span className='text-green-500 font-bold'>
                      {profile.active} Active
                    </span>
                  ) : (
                    <span className='text-red-500 font-bold'>
                      {profile.active} Inactive
                    </span>
                  )}
                </td>
                <td className='w-[110px] px-6 py-4 text-sm lg:text-base whitespace-nowrap'>
                  <a
                    href={`/admin/profiles/${profile.id}`}
                    className='px-4 py-1 bg-black text-white rounded inline-block'
                  >
                    Edit
                  </a>
                </td>
                <td className='pr-6 py-4 text-sm lg:text-base whitespace-nowrap'>
                  {profile.active ? (
                    <span className='px-4 py-1 bg-red-500 text-white rounded inline-block'>
                      {profile.active} Deactivate
                    </span>
                  ) : (
                    <span className='px-4 py-1 bg-green-500 text-white rounded inline-block'>
                      {profile.active} Activate
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
