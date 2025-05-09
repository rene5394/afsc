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
import { CreateProfileSchema } from '@/modules/profile/application/dtos/CreateProfileDTO'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

interface ProfileSectionProps {
  tags: Tag[]
}

enum AssetType {
  IMAGE = 'image',
  AUDIO = 'audio',
  VIDEO = 'video',
}
const AssetTypeIdMap = {
  [AssetType.IMAGE]: 1,
  [AssetType.AUDIO]: 2,
  [AssetType.VIDEO]: 3,
} as const

const CreateProfileSection: React.FC<ProfileSectionProps> = ({ tags }) => {
  const router = useRouter()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<Profile>({
    defaultValues: {
      name: '',
      author: '',
      story: '',
      photo: '',
      tags: [],
      routes: [],
      assets: [],
    },
  })

  const {
    fields: routeFields,
    append,
    remove,
    move,
  } = useFieldArray({
    control,
    name: 'routes',
  })

  const {
    fields: assetFields,
    append: appendAsset,
    remove: removeAsset,
  } = useFieldArray({
    control,
    name: 'assets',
  })

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  )

  const onSubmit = async (data: Profile) => {
    try {
      const formData = new FormData()

      formData.append('name', data.name)
      formData.append('author', data.author)
      formData.append('story', data.story)
      formData.append('photo', data.photo)

      data.tags.forEach((tag, index) => {
        formData.append(`tagIds[${index}]`, tag.id.toString())
      })

      data.routes.forEach((route, index) => {
        formData.append(`routes[${index}][location]`, route.location)
        formData.append(`routes[${index}][latitude]`, route.latitude)
        formData.append(`routes[${index}][longitude]`, route.longitude)
        formData.append(
          `routes[${index}][orderNumber]`,
          route.orderNumber.toString()
        )
      })

      data.assets.forEach((asset, index) => {
        const assetTypeName = Object.keys(AssetTypeIdMap).find(
          (key) =>
            AssetTypeIdMap[key as keyof typeof AssetTypeIdMap] ===
            Number(asset.typeId)
        )
        formData.append(`assets[${index}][type]`, assetTypeName || 'image')

        if (asset.file) {
          formData.append(`assets[${index}][file]`, asset.file)
        } else {
          formData.append(`assets[${index}][url]`, asset.url)
        }
      })

      const res = await fetch('/api/v1/profiles', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error('Failed to create profile')

      const newProfile = await res.json()
      router.push(`/admin/profiles/${newProfile.data.id}`)
    } catch (err) {
      console.error('Error creating profile:', err)
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
          <h3 className='text-2xl font-semibold mb-2'>Profile photo</h3>
          <Controller
            name='photo'
            control={control}
            defaultValue={undefined}
            render={({ field }) => (
              <input
                type='file'
                accept='image/*'
                onChange={(e) => field.onChange(e.target.files?.[0] || null)}
              />
            )}
          />
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
                profileId: 0,
                createdAt: '',
                updatedAt: '',
              })
            }
            className='text-blue-500 mt-4'
          >
            + Add Route
          </button>
        </div>

        <div>
          <h3 className='text-2xl font-semibold mb-2'>Assets</h3>

          {assetFields.map((field, index) => {
            const assetType = Number(watch(`assets.${index}.typeId` as any))
            const assetTypeName = Object.keys(AssetTypeIdMap).find(
              (key) =>
                AssetTypeIdMap[key as keyof typeof AssetTypeIdMap] === assetType
            )

            return (
              <div key={field.id} className='mb-4 border p-4 rounded space-y-2'>
                <select
                  {...register(`assets.${index}.typeId`)}
                  className='border p-1 rounded'
                >
                  <option value={AssetTypeIdMap['image']}>Image</option>
                  <option value={AssetTypeIdMap['audio']}>Audio</option>
                  <option value={AssetTypeIdMap['video']}>Video</option>
                </select>

                {assetType === AssetTypeIdMap['image'] ||
                assetType === AssetTypeIdMap['audio'] ? (
                  <Controller
                    name={`assets.${index}.file`}
                    control={control}
                    defaultValue={undefined}
                    render={({ field }) => (
                      <input
                        type='file'
                        accept='image/*'
                        className='block'
                        onChange={(e) =>
                          field.onChange(e.target.files?.[0] || null)
                        }
                      />
                    )}
                  />
                ) : (
                  <input
                    type='text'
                    placeholder={`Paste ${assetTypeName} URL`}
                    {...register(`assets.${index}.url`)}
                    className='w-full border p-2 rounded'
                  />
                )}

                <button
                  type='button'
                  className='text-red-500 text-sm'
                  onClick={() => removeAsset(index)}
                >
                  Remove
                </button>
              </div>
            )
          })}

          <button
            type='button'
            className='text-blue-500 mt-2'
            onClick={() =>
              appendAsset({
                id: 0,
                url: '',
                file: undefined,
                profileId: 0,
                typeId: AssetTypeIdMap['image'],
                createdAt: '',
                updatedAt: '',
              })
            }
          >
            + Add Asset
          </button>
        </div>

        <button
          type='submit'
          disabled={isSubmitting}
          className='bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50'
        >
          Create Profile
        </button>
      </form>
    </div>
  )
}

export default CreateProfileSection
