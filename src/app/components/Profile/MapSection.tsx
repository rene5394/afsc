import React from 'react'
import dynamic from 'next/dynamic'
import { Profile } from '@/modules/profile/domain/Profile'

const Map = dynamic(() => import('./Map'), { ssr: false })

interface MapSectionProps {
  profile: Profile
}

const MapSection: React.FC<MapSectionProps> = ({ profile }) => {
  return (
    <div className='container xl:max-w-[1024px] lg:max-w-[900px] md:max-w-[600px] max-w-[300px] mx-auto pt-6 md:pt-4 pb-10'>
      <div className='md:flex md:items-start'>
        <div className='md:w-1/2 mb-8 md:mb-0'>
          <Map profileRoutes={profile.routes} />
        </div>
        <div className='md:w-1/2 md:pl-8'>
          <h2 className='text-3xl'>THE ROUTE</h2>
          <hr className='border-t border-gray-300 mt-2 mb-4' />
          <div className='flex items-start my-2'>
            <div className='flex-none w-[105px]'>
              <h3 className='text-lg text-green-400 font-bold'>
                STARTING FROM
              </h3>
            </div>
            <div className='flex-auto'>
              <p className='text-sm'>{profile.routes[0].location}</p>
            </div>
          </div>
          <div className='flex items-start my-2'>
            <div className='flex-none w-[105px]'>
              <h3 className='text-lg text-red-500 font-bold'>CURRENTLY</h3>
            </div>
            <div className='flex-auto'>
              <p className='text-sm'>
                {profile.routes[profile.routes.length - 1].location}
              </p>
            </div>
          </div>
          <h2 className='text-3xl mt-8'>THE TRAVEL</h2>
          <hr className='border-t border-gray-300 mt-2 mb-4' />
          <ul className='list-disc list-inside'>
            {profile.routes.map((route) => (
              <li key={route.id} className='text-sm'>
                {route.location}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default MapSection
