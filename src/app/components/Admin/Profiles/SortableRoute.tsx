'use client'

import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'

interface SortableRouteProps {
  id: string | number
  index: number
  register: any
  remove: () => void
}

const SortableRoute: React.FC<SortableRouteProps> = ({
  id,
  index,
  register,
  remove,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className='border rounded p-4 mb-2 bg-white flex flex-col gap-2'
    >
      <div className='flex items-center justify-between'>
        <div className='text-gray-600 font-bold'>#{index + 1}</div>
        <div
          {...attributes}
          {...listeners}
          className='p-2 cursor-grab text-gray-400 hover:text-gray-600'
        >
          <GripVertical size={20} />
        </div>
      </div>

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
      <button type='button' onClick={remove} className='text-red-500 mt-2'>
        Remove Route
      </button>
    </div>
  )
}

export default SortableRoute
