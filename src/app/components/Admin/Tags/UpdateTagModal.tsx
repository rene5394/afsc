'use client'
import { Dialog } from '@headlessui/react'
import { useState } from 'react'
import type { Tag } from '@/modules/tag/domain/Tag'
import { UpdateTagsUseCase } from '@/modules/tag/application/UpdateTagUseCase'
import { TagRepositoryClient } from '@/modules/tag/infrastructure/TagRepositoryClient'

export default function UpdateTagModal({
  isOpen,
  onClose,
  tag,
  onUpdate,
}: {
  isOpen: boolean
  onClose: () => void
  tag: Pick<Tag, 'id' | 'name'>
  onUpdate: (updated: Pick<Tag, 'id' | 'name'>) => void
}) {
  const updateTagsUseCase = new UpdateTagsUseCase(new TagRepositoryClient())

  const [name, setName] = useState(tag.name)

  const handleSave = async () => {
    const updatedTag = await updateTagsUseCase.execute({
      id: tag.id,
      name,
    })

    if (!updatedTag) {
      console.error('Failed to update tag')
      return
    }

    onUpdate({ ...tag, name })
    onClose()
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className='relative z-50'>
      <div className='fixed inset-0 bg-black/30' aria-hidden='true' />
      <div className='fixed inset-0 flex items-center justify-center p-4'>
        <Dialog.Panel className='bg-white rounded-xl p-6 w-full max-w-md'>
          <Dialog.Title className='text-xl font-bold mb-4'>
            Update Tag
          </Dialog.Title>
          <input
            className='w-full border px-3 py-2 rounded mb-4'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className='flex justify-end gap-2'>
            <button onClick={onClose} className='text-gray-500'>
              Cancel
            </button>
            <button
              onClick={handleSave}
              className='bg-black text-white px-4 py-2 ml-3 rounded'
            >
              Save
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
