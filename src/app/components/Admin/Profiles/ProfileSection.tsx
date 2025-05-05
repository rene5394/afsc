'use client'

import React from 'react'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import SortableRoute from '@/app/components/Admin/Profiles/SortableRoute'
import ProfileTagsSelect from '@/app/components/Admin/Profiles/ProfileTagSelect'
import type { Profile } from '@/modules/profile/domain/Profile'
import type { Tag } from '@/modules/tag/domain/Tag'
import { UpdateProfileSchema } from '@/modules/profile/application/dtos/UpdateProfileDTO'

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
  } = useForm<Profile>({ defaultValues: profile })

  const {
    fields: routeFields,
    append,
    remove,
    move,
  } = useFieldArray({
    control,
    name: 'routes',
  })

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  )

  const onSubmit = async (data: Profile) => {
    const dto = {
      name: data.name,
      author: data.author,
      story: data.story,
      photo: data.photo,
      tagIds: data.tags.map((tag) => tag.id),
      routes: data.routes,
    }

    try {
      const validatedData = UpdateProfileSchema.parse(dto)
      console.log('Data', data)

      const res = await fetch(`/api/v1/profiles/${profile.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedData),
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
          <h3 className='text-2xl font-semibold mb-2'>Name</h3>
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
          <h3 className='text-2xl font-semibold mb-2'>Author</h3>
          <input
            type='text'
            {...register('author')}
            className='w-full border p-2 rounded'
          />
        </div>

        <div>
          <h3 className='text-2xl font-semibold mb-4'>Story</h3>
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

        <div>
          <h3 className='text-2xl font-semibold mb-2'>Tags</h3>
          <ProfileTagsSelect control={control} tags={tags} />
        </div>

        <div>
          <h3 className='text-2xl font-semibold mb-2'>Routes (Drag & Drop)</h3>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(event) => {
              const { active, over } = event
              if (active.id !== over?.id) {
                const oldIndex = routeFields.findIndex(
                  (route) => route.id === active.id
                )
                const newIndex = routeFields.findIndex(
                  (route) => route.id === over?.id
                )
                move(oldIndex, newIndex)

                const reordered = arrayMove(routeFields, oldIndex, newIndex)
                reordered.forEach((_, idx) => {
                  setValue(`routes.${idx}.orderNumber`, idx + 1)
                })
              }
            }}
          >
            <SortableContext
              items={routeFields.map((route) => route.id)}
              strategy={verticalListSortingStrategy}
            >
              {routeFields.map((route, index) => (
                <SortableRoute
                  key={route.id}
                  id={route.id}
                  index={index}
                  register={register}
                  remove={() => remove(index)}
                />
              ))}
            </SortableContext>
          </DndContext>

          <button
            type='button'
            onClick={() =>
              append({
                id: 0,
                location: '',
                latitude: '',
                longitude: '',
                orderNumber: routeFields.length + 1,
                profileId: profile.id,
                createdAt: '',
                updatedAt: '',
              })
            }
            className='text-blue-500 mt-4'
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
