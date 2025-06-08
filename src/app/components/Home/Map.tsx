'use client'

import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L, { LatLngTuple } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Profile } from '@/modules/profile/domain/Profile'
import UpdateMapZoom from '@/app/components/Home/UpdateMapZoom'

interface MapProps {
  profiles: Profile[]
  selectedTagId?: number
}

const redIcon = L.divIcon({
  className: 'custom-red-marker',
  html: '<div style="background-color: red; border: 2px solid red; border-radius: 50%; width: 10px; height: 10px;"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
})

const blackIcon = L.divIcon({
  className: 'custom-black-marker',
  html: '<div style="background-color: black; border: 2px solid black; border-radius: 50%; width: 10px; height: 10px;"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
})

const Map: React.FC<MapProps> = ({ profiles, selectedTagId }) => {
  const [zoom, setZoom] = useState(1)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)')

    const handleResize = () => {
      setZoom(mediaQuery.matches ? 2 : 1)
    }

    handleResize()
    mediaQuery.addEventListener('change', handleResize)

    return () => {
      mediaQuery.removeEventListener('change', handleResize)
    }
  }, [])

  return (
    <MapContainer
      center={[25.5, -25.5]}
      zoom={zoom}
      className='h-[250px] md:h-[425px] w-full'
    >
      <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {profiles.map((profile, index) => {
        if (profile.routes.length === 0) return null

        const hasMatchingTag = profile.tags.some(
          (tag) => tag.id === selectedTagId
        )
        const icon = hasMatchingTag ? redIcon : blackIcon

        return (
          <Marker
            key={index}
            position={
              [
                profile.routes[0]?.latitude,
                profile.routes[0]?.longitude,
              ] as unknown as LatLngTuple
            }
            icon={icon}
          >
            <Popup>{profile.routes[0].location}</Popup>
          </Marker>
        )
      })}
      <UpdateMapZoom zoom={zoom} />
    </MapContainer>
  )
}

export default Map
