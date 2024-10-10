import React from 'react'
import TagsSidebar from '@/app/components/Home/TagsSidebar'
import dynamic from 'next/dynamic'

const Map = dynamic(() => import('./Map'), { ssr: false })

const MapSection: React.FC = () => {
  return (
    <div className='container xl:max-w-[1024px] lg:max-w-[900px] md:max-w-[600px] max-w-[300px] mx-auto py-10'>
      <h2 className='text-xl'>Filters/Routes</h2>
      <hr className='border-t border-gray-300 mt-2 mb-4' />
      <div className='flex items-start'>
        <TagsSidebar />
        <Map />
      </div>
    </div>
  )
}

export default MapSection
