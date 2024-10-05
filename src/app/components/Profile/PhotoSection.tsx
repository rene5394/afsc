import React from 'react'

const PhotoSection: React.FC = () => {
  return (
    <div className='container xl:max-w-[1024px] lg:max-w-[900px] md:max-w-[600px] max-w-[300px] mx-auto pt-1 pb-2'>
      <div className='flex items-start'>
        <div className='flex-none w-[150px]'>
          <img src='https://via.placeholder.com/150' alt='placeholder' />
        </div>
        <div className='flex-auto ml-6'>
          <h1 className='text-5xl'>Alex</h1>
          <div className='flex'>
            <button className='bg-red text-sm text-white px-4 py-2 mb-2 mr-2'>
              Deportation
            </button>
            <button className='bg-black text-sm text-white px-4 py-2 mb-2 mx-2'>
              Detention
            </button>
            <button className='bg-black text-sm text-white px-4 py-2 mb-2 ml-2'>
              War Refugee
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PhotoSection
