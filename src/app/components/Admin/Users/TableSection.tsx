'use client'

import React, { useEffect, useState } from 'react'
import { User } from '@/modules/user/domain/User'
import { UserStatus } from '@/modules/user/domain/UserStatus'
import { FetchUsersUseCase } from '@/modules/user/application/FetchUsersUseCase'
import { UserRepositoryClient } from '@/modules/user/infrastructure/UserRepositoryClient'
import { UpdateUserUseCase } from '@/modules/user/application/UpdateUserUseCase'

const TableSection: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const maxPageButtons = 10
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [creatingUser, setCreatingUser] = useState(false)

  const fetchUsersUseCase = new FetchUsersUseCase(new UserRepositoryClient())
  const updateUserUseCase = new UpdateUserUseCase(new UserRepositoryClient())

  const handleActivateUser = async (user: User) => {
    try {
      const updatedUser = await updateUserUseCase.execute({
        id: user.id,
        active: true,
      })
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, active: true, updatedAt: new Date() } : u
        )
      )
    } catch (err) {
      console.error('Error activating user:', err)
    }
  }

  const handleDeactivateUser = async (user: User) => {
    try {
      const updatedUser = await updateUserUseCase.execute({
        id: user.id,
        active: false,
      })
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, active: false, updatedAt: new Date() } : u
        )
      )
    } catch (err) {
      console.error('Error deactivating user:', err)
    }
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, meta } = await fetchUsersUseCase.execute(
          currentPage,
          UserStatus.ALL
        )
        setUsers(data)
        setTotalPages(meta.totalPages)
      } catch (error) {
        console.error('Error fetching profiles:', error)
      }
    }

    fetchUsers()
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
      <h1 className='text-5xl'>USERS</h1>
      <button
        className='my-5 px-4 py-2 bg-black text-white rounded'
        onClick={() => setCreatingUser(true)}
      >
        Add New User
      </button>
      <div className='w-full overflow-x-visible overflow-y-hidden'>
        <table
          id='table-users'
          className='w-full min-w-full table-auto border border-gray-300 border-collapse'
        >
          <thead>
            <tr>
              <th className='text-xl text-left whitespace-nowrap px-6 py-3 bg-black text-white'>
                NAME
              </th>
              <th className='text-xl text-left whitespace-nowrap px-6 py-3 bg-black text-white'>
                EMAIL
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
            {users.map((user) => (
              <tr key={user.id} className='odd:bg-white even:bg-gray-100'>
                <td className='px-6 py-4 text-sm lg:text-base whitespace-nowrap'>
                  {user.name}
                </td>
                <td className='px-6 py-4 text-sm lg:text-base whitespace-nowrap'>
                  {user.email}
                </td>
                <td className='px-6 py-4 text-sm lg:text-base whitespace-nowrap'>
                  {user.active ? (
                    <span className='text-green-500 font-bold'>Active</span>
                  ) : (
                    <span className='text-red-500 font-bold'>Inactive</span>
                  )}
                </td>
                <td className='w-[110px] px-6 py-4 text-sm lg:text-base whitespace-nowrap'>
                  <button
                    onClick={() => setEditingUser(user)}
                    className='px-4 py-1 bg-black text-white rounded inline-block'
                  >
                    Edit
                  </button>
                </td>
                <td className='pr-6 py-4 text-sm lg:text-base whitespace-nowrap'>
                  {user.active ? (
                    <button
                      onClick={() => handleDeactivateUser(user)}
                      className='px-4 py-1 bg-red-500 text-white rounded inline-block'
                    >
                      Deactivate
                    </button>
                  ) : (
                    <button
                      onClick={() => handleActivateUser(user)}
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
