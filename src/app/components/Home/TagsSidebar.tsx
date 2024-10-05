import React from 'react'

const TagsSidebar: React.FC = () => {
  return (
    <div className='flex-none w-[210px] mr-8'>
      <button className='w-full bg-red text-sm text-white py-2 mb-2'>
        Deportation
      </button>
      <button className='w-full bg-black text-sm text-white py-2 mb-2'>
        Detention
      </button>
      <button className='w-full bg-black text-sm text-white py-2 mb-2'>
        War Refugee
      </button>
      <button className='w-full bg-black text-sm text-white py-2 mb-2'>
        Economic Migration
      </button>
      <button className='w-full bg-black text-sm text-white py-2 mb-2'>
        Climate Migration
      </button>
      <button className='w-full bg-black text-sm text-white py-2 mb-2'>
        Families
      </button>
      <button className='w-full bg-black text-sm text-white py-2 mb-2'>
        US Wars
      </button>
      <button className='w-full bg-black text-sm text-white py-2 mb-2'>
        Civil Wars
      </button>
    </div>
  )
}

export default TagsSidebar
