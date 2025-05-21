'use client'

import { useState } from 'react'
import { Tag } from '@/modules/tag/domain/Tag'
import { TagRepositoryClient } from '@/modules/tag/infrastructure/TagRepositoryClient'
import { UpdateTagsUseCase } from '@/modules/tag/application/UpdateTagUseCase'
import CreateTagModal from '@/app/components/Admin/Tags/CreateTagModal'
import UpdateTagModal from '@/app/components/Admin/Tags/UpdateTagModal'

export default function TableSection({
  existingTags,
}: {
  existingTags: Tag[]
}) {
  const [tags, setTags] = useState<Tag[]>(existingTags)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [creatingTag, setCreatingTag] = useState(false)

  const updateTagUseCase = new UpdateTagsUseCase(new TagRepositoryClient())

  const handleActivateTag = async (tag: Tag) => {
    try {
      const updatedTag = await updateTagUseCase.execute({
        id: tag.id,
        active: true,
      })
      setTags((prev) =>
        prev.map((t) =>
          t.id === tag.id ? { ...t, active: true, updatedAt: new Date() } : t
        )
      )
    } catch (err) {
      console.error('Error activating tag:', err)
    }
  }

  const handleDeactivateTag = async (tag: Tag) => {
    try {
      const updatedTag = await updateTagUseCase.execute({
        id: tag.id,
        active: false,
      })
      setTags((prev) =>
        prev.map((t) =>
          t.id === tag.id ? { ...t, active: false, updatedAt: new Date() } : t
        )
      )
    } catch (err) {
      console.error('Error deactivating tag:', err)
    }
  }

  return (
    <div className='container 2xl:max-w-[1200px] max-w-full py-12 px-14'>
      <h1 className='text-5xl'>TAGS</h1>
      <button
        className='my-5 px-4 py-2 bg-black text-white rounded'
        onClick={() => setCreatingTag(true)}
      >
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
                    <span className='text-green-500 font-bold'>Active</span>
                  ) : (
                    <span className='text-red-500 font-bold'>Inactive</span>
                  )}
                </td>
                <td className='w-[110px] px-6 py-4 text-sm lg:text-base whitespace-nowrap'>
                  <button
                    onClick={() => setEditingTag(tag)}
                    className='px-4 py-1 bg-black text-white rounded inline-block'
                  >
                    Edit
                  </button>
                </td>
                <td className='pr-6 py-4 text-sm lg:text-base whitespace-nowrap'>
                  {tag.active ? (
                    <button
                      onClick={() => handleDeactivateTag(tag)}
                      className='px-4 py-1 bg-red-500 text-white rounded inline-block'
                    >
                      Deactivate
                    </button>
                  ) : (
                    <button
                      onClick={() => handleActivateTag(tag)}
                      className='px-4 py-1 bg-green-500 text-white rounded inline-block'
                    >
                      Deactivate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editingTag && (
        <UpdateTagModal
          isOpen={true}
          onClose={() => setEditingTag(null)}
          tag={{ id: editingTag.id, name: editingTag.name }}
          onUpdate={(updated) =>
            setTags((prev) =>
              prev.map((tag) =>
                tag.id === updated.id
                  ? {
                      ...tag,
                      name: updated.name,
                      updatedAt: new Date(),
                    }
                  : tag
              )
            )
          }
        />
      )}
      {creatingTag && (
        <CreateTagModal
          isOpen={true}
          onClose={() => setCreatingTag(false)}
          onCreate={(newTag) =>
            setTags((prev) => [
              ...prev,
              {
                ...newTag,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            ])
          }
        />
      )}
    </div>
  )
}
