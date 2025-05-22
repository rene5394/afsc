'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { FetchProfilesUseCase } from '@/modules/profile/application/FetchProfilesUseCase'
import { PatchProfilesUseCase } from '@/modules/profile/application/PatchProfileUseCase'
import { ProfileRepositoryClient } from '@/modules/profile/infrastructure/ProfileRepositoryClient'
import { ProfileResponseDTO } from '@/modules/profile/application/dtos/ProfileResponseDTO'

const TableSection: React.FC = () => {
  const [profiles, setProfiles] = useState<ProfileResponseDTO[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const maxPageButtons = 10

  const fetchProfilesUseCase = new FetchProfilesUseCase(
    new ProfileRepositoryClient()
  )
  const patchProfilesUseCase = new PatchProfilesUseCase(
    new ProfileRepositoryClient()
  )

  const handleActivateProfile = async (profile: ProfileResponseDTO) => {
    try {
      const updatedProfile = await patchProfilesUseCase.execute({
        id: profile.id,
        active: true,
      })

      if (!updatedProfile) {
        return
      }

      setProfiles((prev) =>
        prev.map((p) =>
          p.id === profile.id
            ? { ...p, active: true, updatedAt: new Date().toISOString() }
            : p
        )
      )
    } catch (err) {
      console.error('Error activating tag:', err)
    }
  }

  const handleDeactivateProfile = async (profile: ProfileResponseDTO) => {
    try {
      const updatedProfile = await patchProfilesUseCase.execute({
        id: profile.id,
        active: false,
      })

      if (!updatedProfile) {
        return
      }

      setProfiles((prev) =>
        prev.map((p) =>
          p.id === profile.id
            ? { ...p, active: false, updatedAt: new Date().toISOString() }
            : p
        )
      )
    } catch (err) {
      console.error('Error deactivating tag:', err)
    }
  }

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const { data, meta } = await fetchProfilesUseCase.execute(currentPage)
        setProfiles(data)
        setTotalPages(meta.totalPages)
      } catch (error) {
        console.error('Error fetching profiles:', error)
      }
    }

    fetchProfiles()
  }, [currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const renderPageNumbers = () => {
    const pageNumbers = []
    const halfRange = Math.floor(maxPageButtons / 2)
    let startPage = Math.max(1, currentPage - halfRange)
    let endPage = Math.min(totalPages, currentPage + halfRange)

    if (currentPage <= halfRange) {
      endPage = Math.min(maxPageButtons, totalPages)
    } else if (currentPage + halfRange >= totalPages) {
      startPage = Math.max(totalPages - maxPageButtons + 1, 1)
    }

    if (startPage > 1) {
      pageNumbers.push(
        <button
          key='first'
          onClick={() => handlePageChange(1)}
          className='border px-3 py-1 bg-gray-200'
        >
          First
        </button>
      )
      pageNumbers.push(<span key='dots-start'>...</span>)
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`border px-3 py-1 ${
            currentPage === i ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          {i}
        </button>
      )
    }

    if (endPage < totalPages) {
      pageNumbers.push(<span key='dots-end'>...</span>)
      pageNumbers.push(
        <button
          key='last'
          onClick={() => handlePageChange(totalPages)}
          className='border px-3 py-1 bg-gray-200'
        >
          Last
        </button>
      )
    }

    return pageNumbers
  }

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
                  <Link
                    className='text-blue-600 hover:underline'
                    href={`/admin/profiles/${profile.id}`}
                  >
                    {profile.name}
                  </Link>
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
                    <button
                      onClick={() => handleDeactivateProfile(profile)}
                      className='px-4 py-1 bg-red-500 text-white rounded inline-block'
                    >
                      Deactivate
                    </button>
                  ) : (
                    <button
                      onClick={() => handleActivateProfile(profile)}
                      className='px-4 py-1 bg-green-500 text-white rounded inline-block'
                    >
                      Activate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='mt-8 flex justify-center space-x-2'>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className='border px-4 py-2 bg-gray-200 disabled:opacity-50'
        >
          Previous
        </button>
        {renderPageNumbers()}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className='border px-4 py-2 bg-gray-200 disabled:opacity-50'
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default TableSection
