'use client'

import React, { useEffect, useState } from 'react'
import { FetchProfilesUseCase } from '@/modules/profile/application/FetchProfilesUseCase'
import { ProfileRepository } from '@/modules/profile/infrastructure/ProfileRepository'
import { Profile } from '@/modules/profile/domain/Profile'

const TableSection: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([])

  const fetchProfilesUseCase = new FetchProfilesUseCase(new ProfileRepository())

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const fetchedProfiles = await fetchProfilesUseCase.execute()
        setProfiles(fetchedProfiles)
      } catch (error) {
        console.error('Error fetching profiles:', error)
      }
    }

    fetchProfiles()
  }, [])
  return (
    <div className='container xl:max-w-[1024px] lg:max-w-[900px] md:max-w-[600px] max-w-[300px] mx-auto py-10'>
      <h2 className='text-xl'>Cases/Personas</h2>
      <hr className='border-t border-gray-300 mt-2 mb-4' />
      <div className='flex items-start'>
        <div className='flex-1'>
          <table className='w-full mt-5'>
            <thead>
              <tr>
                <th className='text-xl text-left'>NAME</th>
                <th className='text-xl text-left'>ORIGIN</th>
                <th className='text-xl text-left'>AGE</th>
                <th className='text-xl text-left'>MIGRATION TYPE</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((profile, index) => (
                <tr key={index}>
                  <td className='pt-6'>{profile.name}</td>
                  <td className='pt-6'>
                    {profile.routes[0]?.location || 'Unknown'}
                  </td>
                  <td className='pt-6'>N/A</td>
                  <td className='pt-6'>
                    {profile.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className='border px-3 py-1 ml-3'>
                        {tag.name}
                      </span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default TableSection
