'use client'

import React, { useEffect, useState } from 'react'
import { FetchTagsUseCase } from '@/modules/tag/application/FetchTagsUseCase'
import { TagRepository } from '@/modules/tag/infrastructure/TagRepository'
import { Tag } from '@/modules/tag/domain/Tag'

interface TagsSidebarProps {
  selectedTagId?: number
  handleTagClick: (tagId: number) => void
}

const TagsSidebar: React.FC<TagsSidebarProps> = ({
  selectedTagId,
  handleTagClick,
}) => {
  const [tags, setTags] = useState<Tag[]>([])

  const fetchTagsUseCase = new FetchTagsUseCase(new TagRepository())

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const fetchedTags = await fetchTagsUseCase.execute()
        setTags(fetchedTags)
      } catch (error) {
        console.error('Error fetching tags:', error)
      }
    }

    fetchTags()
  }, [])

  return (
    <div className='grid grid-cols-2 md:grid-cols-1 gap-2 mb-3 md:w-[165px] md:mr-8 md:mb-0'>
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
