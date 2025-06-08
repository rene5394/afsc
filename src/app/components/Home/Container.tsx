'use client'

import React, { useState } from 'react'
import MapSection from '@/app/components/Home/MapSection'
import TableSection from '@/app/components/Home/TableSection'

const Container: React.FC = () => {
  const [selectedTagId, setSelectedTagId] = useState<number | undefined>()

  return (
    <>
      <MapSection
        selectedTagId={selectedTagId}
        setSelectedTagId={setSelectedTagId}
      />
      <TableSection selectedTagId={selectedTagId} />
    </>
  )
}

export default Container
