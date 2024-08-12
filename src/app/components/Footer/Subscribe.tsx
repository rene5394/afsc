import React from 'react'

const Subscribe: React.FC = () => {
  return (
    <div className='bg-black px-[30px] pt-[40px] pb-[40px]'>
      <div className='flex flex-wrap text-white'>
        <div className='md:w-1/2'>
          <img className='w-[150px]' src='https://afsc.org/sites/default/files/2022-08/AFSC-Logo-full-white.svg' />
        </div>
        <div className='md:w-1/2'>
          <p className='max-w-[550px] lg:text-xl text-l'>The AFSC newsletter connects activism to the issues that matter. Join us today.</p>
        </div>
      </div>
    </div>
  )
}

export default Subscribe