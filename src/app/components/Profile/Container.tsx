import React from 'react'
import PhotoSection from '@/app/components/Profile/PhotoSection'
import MapSection from '@/app/components/Profile/MapSection'
import Breadcrumb from '@/app/components/Profile/Breadcrumb'

const Container: React.FC = () => {
  return (
    <>
      <Breadcrumb />
      <PhotoSection />
      <MapSection />
    </>
  )
}

export default Container
