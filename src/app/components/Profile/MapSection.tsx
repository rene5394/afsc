import React from 'react'
import dynamic from 'next/dynamic'

const Map = dynamic(() => import('./Map'), { ssr: false })

const MapSection: React.FC = () => {
  return (
    <div className='container xl:max-w-[1024px] lg:max-w-[900px] md:max-w-[600px] max-w-[300px] mx-auto pt-4 pb-10'>
      <div className='flex items-start'>
        <div className='w-1/2'>
          <Map />
        </div>
        <div className='w-1/2 pl-8'>
          <h1 className='text-3xl font-bold'>THE ROUTE</h1>
          <hr className='border-t border-gray-300 mt-2 mb-4' />
          <div className='flex items-start my-2'>
            <div className='flex-none w-[150px]'>
              <p className='text-sm text-green-400 font-bold'>STARTING FROM</p>
            </div>
            <div className='flex-auto'>
              <p className='text-sm'>Germany+ Sierra Leone(Born)</p>
            </div>
          </div>
          <div className='flex items-start my-2'>
            <div className='flex-none w-[150px]'>
              <p className='text-sm text-red-500 font-bold'>CURRENTLY</p>
            </div>
            <div className='flex-auto'>
              <p className='text-sm'>Released in Montreal waiting for status</p>
            </div>
          </div>
          <h1 className='text-3xl font-bold mt-8'>THE TRAVEL</h1>
          <hr className='border-t border-gray-300 mt-2 mb-4' />
          <ul className='list-disc list-inside'>
            <li className='text-sm'>Germany Sierra Leone(Born)</li>
            <li className='text-sm'>Civil War</li>
            <li className='text-sm'>Refugee in the US </li>
            <li className='text-sm'>arrested and prison in South NJ</li>
            <li className='text-sm'>ICE detention in Essex and Bergen NJ</li>
            <li className='text-sm'>Transferred to Arizona for Deportation</li>
            <li className='text-sm'>Transferred to Ice KROME Florida</li>
            <li className='text-sm'>Transferred to XYZ for deportation</li>
            <li className='text-sm'>Deported to Sierra Leone</li>
            <li className='text-sm'>Escaped to Guinea</li>
            <li className='text-sm'>
              Travelled to Canada with a layover in Paris Detained in Montreal
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default MapSection
