'use client'

import React, { useEffect, useState } from 'react'
import { FetchTagsUseCase } from '@/modules/tag/application/FetchTagsUseCase'
import { TagRepositoryClient } from '@/modules/tag/infrastructure/TagRepositoryClient'
import { Tag } from '@/modules/tag/domain/Tag'
import { TagStatus } from '@/modules/tag/domain/TagStatus'

interface TagsSidebarProps {
  selectedTagId?: number
  handleTagClick: (tagId: number) => void
}

const TagsSidebar: React.FC<TagsSidebarProps> = ({
  selectedTagId,
  handleTagClick,
}) => {
  const [tags, setTags] = useState<Tag[]>([])

  const fetchTagsUseCase = new FetchTagsUseCase(new TagRepositoryClient())

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const fetchedTags = await fetchTagsUseCase.execute(TagStatus.ACTIVE)
        setTags(fetchedTags)
      } catch (error) {
        console.error('Error fetching tags:', error)
      }
    }

    fetchTags()
  }, [])

  return (
    <div
      id='tag-sidebar'
      className='grid grid-cols-2 md:grid-cols-1 gap-2 md:overflow-y-auto mb-3 md:w-[185px] md:h-[425px] md:pr-1 md:mr-4 md:mb-0'
    >
      {tags.map((tag) => (
        <button
          key={tag.id}
          className={`w-full text-xs md:text-sm text-white py-2 mb-2 ${
            selectedTagId === tag.id ? 'bg-red' : 'bg-black'
          }`}
          onClick={() => handleTagClick(tag.id)}
        >
          {tag.name}
        </button>
      ))}
    </div>
  )
}

export default TagsSidebar
