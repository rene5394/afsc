import React from 'react'
import dynamic from 'next/dynamic'
import { Profile } from '@/modules/profile/domain/Profile'

const Map = dynamic(() => import('./Map'), { ssr: false })

interface MapSectionProps {
  profile: Profile
}

const MapSection: React.FC<MapSectionProps> = ({ profile }) => {
  return (
    <div className='container xl:max-w-[1024px] lg:max-w-[900px] md:max-w-[600px] max-w-[300px] mx-auto pt-4 pb-10'>
      <div className='flex items-start'>
        <div className='w-1/2'>
          <Map profileRoutes={profile.routes} />
        </div>
        <div className='w-1/2 pl-8'>
          <h1 className='text-3xl font-bold'>THE ROUTE</h1>
          <hr className='border-t border-gray-300 mt-2 mb-4' />
          <div className='flex items-start my-2'>
            <div className='flex-none w-[150px]'>
              <p className='text-sm text-green-400 font-bold'>STARTING FROM</p>
            </div>
            <div className='flex-auto'>
              <p className='text-sm'>{profile.routes[0].location}</p>
            </div>
          </div>
          <div className='flex items-start my-2'>
            <div className='flex-none w-[150px]'>
              <p className='text-sm text-red-500 font-bold'>CURRENTLY</p>
            </div>
            <div className='flex-auto'>
              <p className='text-sm'>
                {profile.routes[profile.routes.length - 1].location}
              </p>
            </div>
          </div>
          <h1 className='text-3xl font-bold mt-8'>THE TRAVEL</h1>
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
