'use client'

import React, { useState } from 'react'
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

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

interface ProfileSectionProps {
  profile: Profile
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

function convertToEmbedUrl(url: string): string {
  try {
    const parsed = new URL(url)

    if (parsed.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`
    }

    if (parsed.hostname.includes('youtube.com')) {
      const v = parsed.searchParams.get('v')
      if (v) return `https://www.youtube.com/embed/${v}`
    }

    return url
  } catch {
    return url
  }
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ profile, tags }) => {
  const router = useRouter()
  const photoSrc = profile.photo || '/images/profile-default-photo.jpg'
  const [removePhoto, setRemovePhoto] = useState(false)
  const [removedAssetIds, setRemovedAssetIds] = useState<number[]>([])

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
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
        formData.append(`routes[${index}][id]`, route.id.toString())
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
        formData.append(`assets[${index}][id]`, asset.id.toString())
        formData.append(`assets[${index}][type]`, assetTypeName || 'image')

        if (asset.file) {
          formData.append(`assets[${index}][file]`, asset.file)
        } else {
          formData.append(`assets[${index}][url]`, asset.url)
        }
      })

      const res = await fetch(`/api/v1/profiles/${profile.id}`, {
        method: 'PUT',
        body: formData,
      })
      if (!res.ok) throw new Error('Failed to update profile')

      router.refresh()
    } catch (err) {
      console.error('Error updating profile:', err)
    }
  }

  return (
    <div className='container 2xl:max-w-[1200px] max-w-full py-12 px-6'>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6 mb-12'>
        <div className='flex-none w-[150px] relative'>
          {!removePhoto ? (
            <>
              <img
                src={photoSrc}
                alt='Profile'
                className='w-[150px] h-[150px] object-cover border rounded'
              />
              <button
                type='button'
                onClick={() => {
                  setRemovePhoto(true)
                  setValue('photo', '')
                }}
                className='absolute top-0 right-0 bg-white text-red-500 rounded-full py-[3px] px-[10px] shadow'
              >
                ✕
              </button>
            </>
          ) : (
            <Controller
              name='photo'
              control={control}
              defaultValue={undefined}
              render={({ field }) => (
                <input
                  type='file'
                  accept='image/*'
                  onChange={(e) => field.onChange(e.target.files?.[0] || null)}
                  className='w-full'
                />
              )}
            />
          )}
        </div>

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

        <div>
          <h3 className='text-2xl font-semibold mb-2'>Assets</h3>

          {assetFields.map((field, index) => {
            const typeId = Number(watch(`assets.${index}.typeId`))
            const assetId = Number(watch(`assets.${index}.id`))
            const isImage = typeId === AssetTypeIdMap.image
            const isAudio = typeId === AssetTypeIdMap.audio
            const isVideo = typeId === AssetTypeIdMap.video
            const isNew = assetId === 0

            const fileName = watch(`assets.${index}.file`)?.name
            const urlValue = watch(`assets.${index}.url`)

            return (
              <div
                key={field.id}
                className='mb-4 border p-4 rounded space-y-2 relative'
              >
                <select
                  {...register(`assets.${index}.typeId`)}
                  className='border p-1 rounded'
                  disabled={!isNew}
                >
                  <option value={AssetTypeIdMap.image}>Image</option>
                  <option value={AssetTypeIdMap.audio}>Audio</option>
                  <option value={AssetTypeIdMap.video}>Video</option>
                </select>

                {!isNew && field.url && (
                  <div className='relative'>
                    {isImage && (
                      <img
                        src={field.url}
                        alt='Asset'
                        className='w-[150px] h-[150px] object-cover border rounded'
                      />
                    )}
                    {isAudio && (
                      <audio controls className='w-full'>
                        <source src={field.url} />
                      </audio>
                    )}
                    {isVideo && (
                      <>
                        {field.url.includes('youtube.com') ||
                        field.url.includes('youtu.be') ? (
                          <iframe
                            width='100%'
                            height='400'
                            src={convertToEmbedUrl(field.url)}
                            title='YouTube Video'
                            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                            allowFullScreen
                            className='rounded border'
                          />
                        ) : (
                          <video controls className='w-full max-h-[200px]'>
                            <source src={field.url} />
                            Your browser does not support the video tag.
                          </video>
                        )}
                      </>
                    )}

                    <button
                      type='button'
                      className='absolute top-0 right-0 bg-white text-red-500 rounded-full py-[3px] px-[10px] shadow'
                      onClick={() => {
                        if (field.id !== 0)
                          setRemovedAssetIds((prev) => [...prev, field.id])
                        removeAsset(index)
                      }}
                    >
                      ✕
                    </button>
                  </div>
                )}

                {isNew && (isImage || isAudio) ? (
                  <>
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
                  </>
                ) : null}

                {isNew && isVideo ? (
                  <input
                    type='text'
                    placeholder='Paste URL'
                    {...register(`assets.${index}.url`, {
                      required: 'URL is required',
                    })}
                    className='w-full border p-2 rounded'
                  />
                ) : null}
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
                profileId: profile.id,
                typeId: AssetTypeIdMap.image,
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
          Save Changes
        </button>
      </form>
    </div>
  )
}

export default ProfileSection
