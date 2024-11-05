'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { FetchProfilesUseCase } from '@/modules/profile/application/FetchProfilesUseCase'
import { ProfileRepository } from '@/modules/profile/infrastructure/ProfileRepository'
import { Profile } from '@/modules/profile/domain/Profile'

const TableSection: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const maxPageButtons = 10

  const fetchProfilesUseCase = new FetchProfilesUseCase(new ProfileRepository())

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
    <div className='container xl:max-w-[1024px] lg:max-w-[900px] md:max-w-[600px] max-w-[300px] mx-auto py-10'>
      <h2 className='bebas-neue text-4xl'>CASES/PERSONAS</h2>
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
              <tr>
                <th colSpan={4}>
                  <hr className='border-t border-gray-300 mt-2' />
                </th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((profile, index) => (
                <tr key={index}>
                  <td className='pt-6'>
                    <Link href={`/profile/${profile.id}`}>{profile.name}</Link>
                  </td>
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
      </div>
    </div>
  )
}

export default TableSection
