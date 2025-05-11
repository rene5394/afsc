'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  LoginUserSchema,
  LoginUserDTO,
} from '@/modules/auth/application/dtos/LoginUserDTO'
import { LoginUserUseCase } from '@/modules/auth/application/LoginUserUseCase'
import Input from '@/app/components/Login/Input'
import Button from '@/app/components/Login/Button'
import { AuthRepository } from '@/modules/auth/infrastructure/AuthRepository'
import { useState } from 'react'

const loginUserUseCase = new LoginUserUseCase(new AuthRepository())

export default function Form() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginUserDTO>({
    resolver: zodResolver(LoginUserSchema),
  })

  const [error, setError] = useState('')

  const onSubmit = async (data: LoginUserDTO) => {
    setError('')
    try {
      await loginUserUseCase.execute(data)

      router.push('admin/dashboard')
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || 'Login failed')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <Input label='Email' type='email' {...register('email')} />
      {errors.email && (
        <p className='text-red-500 text-sm'>{errors.email.message}</p>
      )}

      <Input label='Password' type='password' {...register('password')} />
      {errors.password && (
        <p className='text-red-500 text-sm'>{errors.password.message}</p>
      )}

      {error && <p className='text-red-500 text-sm'>{error}</p>}

      <Button type='submit'>Login</Button>
    </form>
  )
}
