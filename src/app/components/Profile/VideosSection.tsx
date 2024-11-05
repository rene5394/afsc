import React from 'react'
import { Profile } from '@/modules/profile/domain/Profile'

interface VideoSectionProps {
  profile: Profile
}

const VideoSection: React.FC<VideoSectionProps> = ({ profile }) => {
  return (
    <>
      <div className='container xl:max-w-[1024px] lg:max-w-[900px] md:max-w-[600px] max-w-[300px] mx-auto pt-4 pb-10'>
        <div className='flex items-start'>
          <div className='w-full'>
            <h2 className='text-3xl text-center'>VIDEO OR INTERVIEW</h2>
            <hr className='border-t border-gray-300 mt-2 mb-6' />
            <div className='flex justify-center'>
              <iframe
                width='560'
                height='315'
                src='https://www.youtube.com/embed/fioNgQ9TsoM?si=GEf_OzcBwfJNBJEh'
                title='YouTube video player'
                frameBorder='0'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                referrerPolicy='strict-origin-when-cross-origin'
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default VideoSection
