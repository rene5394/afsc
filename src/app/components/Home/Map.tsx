'use client'

import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L, { LatLngTuple } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Profile } from '@/modules/profile/domain/Profile'

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
  return (
    <MapContainer
      center={[25.5, -25.5]}
      zoom={2}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {profiles.map((marker, index) => {
        const hasMatchingTag = marker.tags.some(
          (tag) => tag.id === selectedTagId
        )
        const icon = hasMatchingTag ? redIcon : blackIcon

        return (
          <Marker
            key={index}
            position={
              [
                marker.routes[0].latitude,
                marker.routes[0].longitude,
              ] as unknown as LatLngTuple
            }
            icon={icon}
          >
            <Popup>{marker.routes[0].location}</Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}

export default Map
