'use client'

import React from 'react'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import Select from 'react-select'
import type { Profile } from '@/modules/profile/domain/Profile'
import type { Tag } from '@/modules/tag/domain/Tag'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

interface ProfileSectionProps {
  profile: Profile
  tags: Tag[]
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ profile, tags }) => {
  const router = useRouter()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<Profile>({
    defaultValues: profile,
  })

  const {
    fields: routeFields,
    append: appendRoute,
    remove: removeRoute,
    move: moveRoute,
  } = useFieldArray({
    control,
    name: 'routes',
  })

  const tagOptions = tags.map((tag) => ({
    value: tag.id,
    label: tag.name,
  }))

  const selectedTags = profile.tags.map((tag) => ({
    value: tag.id,
    label: tag.name,
  }))

  const onSubmit = async (data: Profile) => {
    try {
      const res = await fetch(`/api/profiles/${profile.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to update profile')
      router.push(`/admin/profiles/${profile.id}`)
    } catch (err) {
      console.error('Error updating profile:', err)
    }
  }

  return (
    <div className='container 2xl:max-w-[1200px] max-w-full py-12 px-6'>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6 mb-12'>
        <div>
          <label className='block font-medium'>Name</label>
          <input
            type='text'
            {...register('name', { required: 'Name is required' })}
            className='w-full border p-2 rounded'
          />
          {errors.name && (
            <p className='text-red-500 text-sm'>{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className='block font-medium'>Author</label>
          <input
            type='text'
            {...register('author')}
            className='w-full border p-2 rounded'
          />
        </div>

        <div>
          <label className='block font-medium'>Story</label>
          <Controller
            name='story'
            control={control}
            render={({ field }) => (
              <ReactQuill
                theme='snow'
                value={field.value || ''}
                onChange={field.onChange}
                className='bg-white'
              />
            )}
          />
        </div>

        <div className='flex items-center gap-2'>
          <input type='checkbox' {...register('active')} />
          <label className='font-medium'>Active</label>
        </div>

        <div>
          <h3 className='text-2xl font-semibold'>Tags</h3>
          <Controller
            control={control}
            name='tags'
            render={({ field }) => (
              <Select<{ value: number; label: string }, true>
                isMulti
                options={tags.map((tag) => ({
                  value: tag.id,
                  label: tag.name,
                }))}
                value={(field.value || []).map((tag) => ({
                  value: tag.id,
                  label: tag.name,
                }))}
                onChange={(selected) => {
                  const mapped = (selected || []).map((option) => ({
                    id: option.value,
                    name: option.label,
                    active: true,
                    createdAt: '',
                    updatedAt: '',
                  }))
                  field.onChange(mapped)
                }}
                className='basic-multi-select'
                classNamePrefix='select'
              />
            )}
          />
        </div>

        <div>
          <h3 className='text-2xl font-semibold'>Routes</h3>
          {routeFields.map((route, index) => (
            <div key={route.id} className='flex flex-col gap-2 mb-4'>
              <input
                placeholder='Location'
                {...register(`routes.${index}.location`)}
                className='border p-2 rounded'
              />
              <input
                placeholder='Latitude'
                {...register(`routes.${index}.latitude`)}
                className='border p-2 rounded'
              />
              <input
                placeholder='Longitude'
                {...register(`routes.${index}.longitude`)}
                className='border p-2 rounded'
              />
              <input
                type='number'
                placeholder='Order'
                {...register(`routes.${index}.orderNumber`)}
                className='border p-2 rounded'
              />
              <button
                type='button'
                onClick={() => removeRoute(index)}
                className='text-red-500'
              >
                Remove Route
              </button>
            </div>
          ))}
          <button
            type='button'
            onClick={() =>
              appendRoute({
                id: 0,
                location: '',
                latitude: '',
                longitude: '',
                orderNumber: routeFields.length,
                profileId: profile.id,
                createdAt: '',
                updatedAt: '',
              })
            }
            className='text-blue-500 mt-2'
          >
            + Add Route
          </button>
        </div>

        <button
          type='submit'
          disabled={isSubmitting}
          className='bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50'
        >
          Save Changes
        </button>
      </form>
    </div>
  )
}

export default ProfileSection
