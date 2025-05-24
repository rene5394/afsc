'use client'
import { Dialog } from '@headlessui/react'
import { useState } from 'react'
import type { User } from '@/modules/user/domain/User'
import { UpdateUserUseCase } from '@/modules/user/application/UpdateUserUseCase'
import { UserRepositoryClient } from '@/modules/user/infrastructure/UserRepositoryClient'

export default function UpdateUserModal({
  isOpen,
  onClose,
  user,
  onUpdate,
}: {
  isOpen: boolean
  onClose: () => void
  user: Pick<User, 'id' | 'name' | 'email'>
  onUpdate: (updated: Pick<User, 'id' | 'name' | 'email'>) => void
}) {
  const updateUserUseCase = new UpdateUserUseCase(new UserRepositoryClient())

  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)

  const handleSave = async () => {
    const updatedUser = await updateUserUseCase.execute({
      id: user.id,
      name,
      email,
    })

    if (!updatedUser) {
      console.error('Failed to update user')
      return
    }

    onUpdate({ ...user, name, email })
    onClose()
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className='relative z-50'>
      <div className='fixed inset-0 bg-black/30' aria-hidden='true' />
      <div className='fixed inset-0 flex items-center justify-center p-4'>
        <Dialog.Panel className='bg-white rounded-xl p-6 w-full max-w-md'>
          <Dialog.Title className='text-xl font-bold mb-4'>
            Update User
          </Dialog.Title>
          <input
            className='w-full border px-3 py-2 rounded mb-4'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className='w-full border px-3 py-2 rounded mb-4'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
