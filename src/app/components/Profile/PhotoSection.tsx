import React from 'react'
import { Profile } from '@/modules/profile/domain/Profile'

interface PhotoSectionProps {
  profile: Profile
}

const PhotoSection: React.FC<PhotoSectionProps> = ({ profile }) => {
  const photoSrc = profile.photo || '/images/profile-default-photo.jpg'

  return (
    <div className='container xl:max-w-[1024px] lg:max-w-[900px] md:max-w-[600px] max-w-[300px] mx-auto pt-1 pb-2'>
      <div className='md:flex items-start'>
        <div className='flex-none md:w-[150px] w-full'>
          <h1
            aria-hidden='true'
            role='presentation'
            className='text-4xl md:text-5xl md:hidden'
          >
            {profile.name}
          </h1>
          <img src={photoSrc} alt='placeholder' />
        </div>
        <div className='flex-auto md:ml-6 md:mt-0 mt-4'>
          <h1 className='text-4xl md:text-5xl hidden md:block'>
            {profile.name}
          </h1>
          <h3 className='text-l acta mb-3'>
            <span className='acta-bold'>Author: </span>
            {profile.author ? profile.author : 'Unknown'}
          </h3>
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
