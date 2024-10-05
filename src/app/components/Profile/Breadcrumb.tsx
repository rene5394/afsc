import React from 'react'

const Breadcrumb: React.FC = () => {
  return (
    <div className='container xl:max-w-[1024px] lg:max-w-[900px] md:max-w-[600px] max-w-[300px] mx-auto pt-10 pb-1'>
      <h2 className='text-sm'>Deportation &gt; Alex &gt; Profile</h2>
      <hr className='border-t border-gray-300 mt-2 mb-4' />
    </div>
  )
}

export default Breadcrumb