'use client'

import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

interface UpdateMapZoomProps {
  zoom: number
}

const UpdateMapZoom: React.FC<UpdateMapZoomProps> = ({ zoom }) => {
  const map = useMap()

  useEffect(() => {
    map.setZoom(zoom)
  }, [zoom, map])

  return null
}

export default UpdateMapZoom
