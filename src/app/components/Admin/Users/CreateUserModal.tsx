'use client'
import { Dialog } from '@headlessui/react'
import { useState } from 'react'
import type { User } from '@/modules/user/domain/User'
import { CreateUserUseCase } from '@/modules/user/application/CreateUserUseCase'
import { UserRepositoryClient } from '@/modules/user/infrastructure/UserRepositoryClient'

export default function CreateUserModal({
  isOpen,
  onClose,
  onCreate,
}: {
  isOpen: boolean
  onClose: () => void
  onCreate: (newUser: Omit<User, 'createdAt' | 'updatedAt'>) => void
}) {
  const createUserUseCase = new CreateUserUseCase(new UserRepositoryClient())

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleCreate = async () => {
    if (!name.trim()) return

    const newUser = await createUserUseCase.execute({
      name,
      email,
      password,
      confirmPassword,
    })

    if (!newUser) {
      console.error('Failed to create tag')
      return
    }

    onCreate(newUser)
    setName('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className='relative z-50'>
      <div className='fixed inset-0 bg-black/30' aria-hidden='true' />
      <div className='fixed inset-0 flex items-center justify-center p-4'>
        <Dialog.Panel className='bg-white rounded-xl p-6 w-full max-w-md'>
          <Dialog.Title className='text-xl font-bold mb-4'>
            Create User
          </Dialog.Title>
          <input
            className='w-full border px-3 py-2 rounded mb-4'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='User name'
          />
          <input
            className='w-full border px-3 py-2 rounded mb-4'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='User email'
          />
          <input
            type='password'
            className='w-full border px-3 py-2 rounded mb-4'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='User password'
          />
          <input
            type='password'
            className='w-full border px-3 py-2 rounded mb-4'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder='Confirm password'
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
