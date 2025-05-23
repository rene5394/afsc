'use client'

import React, { useEffect, useState } from 'react'
import TagsSidebar from '@/app/components/Home/TagsSidebar'
import dynamic from 'next/dynamic'
import { FetchProfilesUseCase } from '@/modules/profile/application/FetchProfilesUseCase'
import { ProfileRepositoryClient } from '@/modules/profile/infrastructure/ProfileRepositoryClient'
import { Profile } from '@/modules/profile/domain/Profile'
import { ProfileStatus } from '@/modules/profile/domain/ProfileStatus'

const Map = dynamic(() => import('./Map'), { ssr: false })

const MapSection: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [shouldFetch, setShouldFetch] = useState(true)
  const [selectedTagId, setSelectedTagId] = useState<number>()

  const fetchProfilesUseCase = new FetchProfilesUseCase(
    new ProfileRepositoryClient()
  )

  const fetchProfiles = async (page: number): Promise<boolean> => {
    try {
      const { data, meta } = await fetchProfilesUseCase.execute(
        page,
        ProfileStatus.ACTIVE
      )
      const profilesData = data.map((item) => ({
        id: item.id,
        name: item.name,
        author: item.author,
        story: item.story,
        photo: item.photo,
        tags: item.tags,
        assets: item.assets,
        routes: item.routes,
        links: item.links,
        active: item.active,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })) as Profile[]

      setProfiles((prevProfiles) => [...prevProfiles, ...profilesData])
      setShouldFetch(meta.nextPage !== null)

      return true
    } catch (error) {
      console.error('Error fetching profiles:', error)

      return false
    }
  }

  useEffect(() => {
    const loadProfiles = async () => {
      if (!shouldFetch) return

      const success = await fetchProfiles(currentPage)

      if (success) {
        setCurrentPage((prevPage) => prevPage + 1)
      } else {
        setShouldFetch(false)
      }
    }

    loadProfiles()
  }, [currentPage, shouldFetch])

  const handleTagClick = (tagId: number) => {
    setSelectedTagId(tagId)
  }

  return (
    <div className='container xl:max-w-[1024px] lg:max-w-[900px] md:max-w-[600px] max-w-[300px] mx-auto md:py-10 pt-10 pb-0'>
      <h2 className='text-4xl'>Filters/Routes</h2>
      <hr className='border-t border-gray-300 mt-2 mb-4' />
      <div className='md:flex md:items-start'>
        <TagsSidebar
          selectedTagId={selectedTagId}
          handleTagClick={handleTagClick}
        />
        <Map profiles={profiles} selectedTagId={selectedTagId} />
      </div>
    </div>
  )
}

export default MapSection
