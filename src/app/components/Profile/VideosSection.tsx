import React from 'react'
import { ProfileAsset } from '@/modules/profile-asset/domain/ProfileAsset'

interface VideoSectionProps {
  profileAssets: ProfileAsset[]
}

function convertToEmbedUrl(url: string): string {
  try {
    const parsed = new URL(url)

    if (parsed.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`
    }

    if (parsed.hostname.includes('youtube.com')) {
      const v = parsed.searchParams.get('v')
      if (v) return `https://www.youtube.com/embed/${v}`
    }

    return url
  } catch {
    return url
  }
}

const VideoSection: React.FC<VideoSectionProps> = ({ profileAssets }) => {
  const videoAsset = profileAssets.find((asset) => asset.typeId === 3)
  const audioAsset = profileAssets.find((asset) => asset.typeId === 2)

  if (videoAsset) {
    videoAsset.url = convertToEmbedUrl(videoAsset.url)
  }

  return (
    <>
      <div className='container xl:max-w-[1024px] lg:max-w-[900px] md:max-w-[600px] max-w-[300px] mx-auto pt-4 pb-10'>
        <div className='flex items-start'>
          <div className='w-full'>
            <h2 className='text-3xl text-center'>VIDEO OR INTERVIEW</h2>
            <hr className='border-t border-gray-300 mt-2 mb-6' />
            <div className='flex justify-center'>
              {videoAsset ? (
                <iframe
                  className='h-[200px] w-full md:h-[315px] md:w-[560px]'
                  src={videoAsset.url}
                  title='Story'
                  frameBorder='0'
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                  referrerPolicy='strict-origin-when-cross-origin'
                  allowFullScreen
                ></iframe>
              ) : audioAsset ? (
                <audio controls>
                  <source src={audioAsset.url} type='audio/mpeg' />
                  Your browser does not support the audio element.
                </audio>
              ) : (
                <p>No video or audio available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default VideoSection
