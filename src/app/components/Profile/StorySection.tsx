import React from 'react'
import { Profile } from '@/modules/profile/domain/Profile'

interface StorySectionProps {
  profile: Profile
}

const StorySection: React.FC<StorySectionProps> = ({ profile }) => {
  return (
    <>
      <div className='container xl:max-w-[1024px] lg:max-w-[900px] md:max-w-[600px] max-w-[300px] mx-auto pt-4 pb-10'>
        <div className='flex items-start'>
          <div className='w-2/3'>
            <h2 className='text-3xl'>TRAVEL STORY</h2>
            <hr className='border-t border-gray-300 mt-2 mb-4' />
            <div
              id='story-text'
              dangerouslySetInnerHTML={{ __html: profile.story }}
            />
          </div>
          <div className='w-1/3'></div>
        </div>
      </div>
    </>
  )
}

export default StorySection
