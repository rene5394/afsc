import React from 'react'
import { Profile } from '@/modules/profile/domain/Profile'

interface LinkSectionProps {
  profile: Profile
}

const LinkSection: React.FC<LinkSectionProps> = ({ profile }) => {
  return (
    <>
      <div className='container xl:max-w-[1024px] lg:max-w-[900px] md:max-w-[600px] max-w-[300px] mx-auto border border-gray-300 px-10 py-8 mb-4'>
        <div className='flex items-start'>
          <div className='w-full'>
            <h2 className='text-3xl'>LINKS</h2>
            <hr className='border-t border-gray-300 mt-2 mb-4' />
            <div
              id='story-text'
              dangerouslySetInnerHTML={{ __html: profile.story }}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default LinkSection
