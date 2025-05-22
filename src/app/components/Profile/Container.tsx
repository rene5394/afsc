import React from 'react'
import { Profile } from '@/modules/profile/domain/Profile'
import Breadcrumb from '@/app/components/Profile/Breadcrumb'
import PhotoSection from '@/app/components/Profile/PhotoSection'
import MapSection from '@/app/components/Profile/MapSection'
import StorySection from '@/app/components/Profile/StorySection'
import VideoSection from './VideosSection'

interface ContainerProps {
  profile: Profile
}

const Container: React.FC<ContainerProps> = ({ profile }) => {
  return (
    <>
      <Breadcrumb />
      <PhotoSection profile={profile} />
      <MapSection profile={profile} />
      <StorySection profile={profile} />
      <VideoSection profileAssets={profile.assets} />
    </>
  )
}

export default Container
