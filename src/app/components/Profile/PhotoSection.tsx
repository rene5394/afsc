import React from 'react'
import { Profile } from '@/modules/profile/domain/Profile'

interface PhotoSectionProps {
  profile: Profile
}

const PhotoSection: React.FC<PhotoSectionProps> = ({ profile }) => {
  return (
    <div className='container xl:max-w-[1024px] lg:max-w-[900px] md:max-w-[600px] max-w-[300px] mx-auto pt-1 pb-2'>
      <div className='flex items-start'>
        <div className='flex-none w-[150px]'>
          <img src='/images/profile-default-photo.jpg' alt='placeholder' />
        </div>
        <div className='flex-auto ml-6'>
          <h1 className='text-4xl md:text-5xl'>{profile.name}</h1>
          <div className='md:flex'>
            {profile.tags.map((tag, index) => (
              <button
                key={tag.id}
                className={`text-xs md:text-sm text-nowrap text-white px-4 py-2 mb-2 mr-2 ${
                  index === 0 ? 'bg-red' : 'bg-black'
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PhotoSection
