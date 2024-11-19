import React from 'react'
import { Profile } from '@/modules/profile/domain/Profile'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Autoplay, Navigation } from 'swiper/modules'

interface StorySectionProps {
  profile: Profile
}

const StorySection: React.FC<StorySectionProps> = ({ profile }) => {
  const photoAssets = profile.assets.filter((asset) => asset.typeId === 1)

  return (
    <>
      <div className='container xl:max-w-[1024px] lg:max-w-[900px] md:max-w-[600px] max-w-[300px] mx-auto md:pt-4 pb-10'>
        <div className='md:flex md:items-start md:gap-6'>
          <div className='md:w-1/2 pr-4'>
            <h2 className='text-3xl'>TRAVEL STORY</h2>
            <hr className='border-t border-gray-300 mt-2 mb-4' />
            <div
              id='story-text'
              className={`overflow-y-auto ${
                profile.story?.length > 0 ? 'h-[250px]' : 'h-0'
              }`}
              dangerouslySetInnerHTML={{ __html: profile.story }}
            />
          </div>
          <div className='md:w-1/2 mt-6'>
            {photoAssets.length > 0 && (
              <Swiper
                spaceBetween={10}
                slidesPerView={1}
                loop={true}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                pagination={{ clickable: true }}
                navigation={true}
                modules={[Navigation, Autoplay]}
                className='slider-container'
              >
                {photoAssets.map((asset) => (
                  <SwiperSlide key={asset.id}>
                    <img
                      src={asset.url}
                      alt={`Travel photo ${asset.id}`}
                      className='w-full h-auto object-cover'
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default StorySection
