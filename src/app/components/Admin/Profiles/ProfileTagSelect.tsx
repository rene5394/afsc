'use client'

import React from 'react'
import Select from 'react-select'
import { Controller } from 'react-hook-form'
import type { Control } from 'react-hook-form'
import type { Profile } from '@/modules/profile/domain/Profile'
import type { Tag } from '@/modules/tag/domain/Tag'

interface ProfileTagsSelectProps {
  control: Control<Profile>
  tags: Tag[]
}

const ProfileTagsSelect: React.FC<ProfileTagsSelectProps> = ({
  control,
  tags,
}) => {
  return (
    <Controller
      control={control}
      name='tags'
      render={({ field }) => (
        <Select<{ value: number; label: string }, true>
          isMulti
          options={tags.map((tag) => ({ value: tag.id, label: tag.name }))}
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
  )
}

export default ProfileTagsSelect
