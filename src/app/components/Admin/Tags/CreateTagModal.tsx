'use client'
import { Dialog } from '@headlessui/react'
import { useState } from 'react'
import type { Tag } from '@/modules/tag/domain/Tag'

export default function CreateTagModal({
  isOpen,
  onClose,
  onCreate,
}: {
  isOpen: boolean
  onClose: () => void
  onCreate: (newTag: Omit<Tag, 'createdAt' | 'updatedAt'>) => void
}) {
  const [name, setName] = useState('')

  const handleCreate = async () => {
    if (!name.trim()) return

    await new Promise((res) => setTimeout(res, 500))

    const newTag = {
      id: 0,
      name,
      active: true,
    }

    onCreate(newTag)
    setName('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className='relative z-50'>
      <div className='fixed inset-0 bg-black/30' aria-hidden='true' />
      <div className='fixed inset-0 flex items-center justify-center p-4'>
        <Dialog.Panel className='bg-white rounded-xl p-6 w-full max-w-md'>
          <Dialog.Title className='text-xl font-bold mb-4'>
            Create Tag
          </Dialog.Title>
          <input
            className='w-full border px-3 py-2 rounded mb-4'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Tag name'
          />
          <div className='flex justify-end gap-2'>
            <button onClick={onClose} className='text-gray-500'>
              Cancel
            </button>
            <button
              onClick={handleCreate}
              className='bg-black text-white px-4 py-2 ml-3 rounded'
            >
              Create
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
