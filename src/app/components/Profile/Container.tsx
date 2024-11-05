import React from 'react'
import Breadcrumb from '@/app/components/Profile/Breadcrumb'
import PhotoSection from '@/app/components/Profile/PhotoSection'
import MapSection from '@/app/components/Profile/MapSection'
import StorySection from '@/app/components/Profile/StorySection'
import { Profile } from '@/modules/profile/domain/Profile'
import LinkSection from './LinkSection'
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
      <VideoSection profile={profile} />
      <LinkSection profile={profile} />
    </>
  )
}

export default Container
