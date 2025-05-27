'use client'

import React from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L, { LatLngTuple } from 'leaflet'
import 'leaflet/dist/leaflet.css'

import { ProfileRoute } from '@/modules/profile-route/domain/ProfileRoute'

interface MapProps {
  profileRoutes: ProfileRoute[]
}

const greenIcon = L.divIcon({
  className: 'custom-green-marker',
  html: '<div style="background-color: green; border: 2px solid green; border-radius: 50%; width: 15px; height: 15px;"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
})

const redIcon = L.divIcon({
  className: 'custom-red-marker',
  html: '<div style="background-color: red; border: 2px solid red; border-radius: 50%; width: 15px; height: 15px;"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
})

const blackIcon = L.divIcon({
  className: 'custom-black-marker',
  html: '<div style="background-color: black; border: 2px solid black; border-radius: 50%; width: 10px; height: 10px;"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
})

const Map: React.FC<MapProps> = ({ profileRoutes }) => {
  const polylinePositions: LatLngTuple[] = profileRoutes.map((route) => [
    parseFloat(route.latitude),
    parseFloat(route.longitude),
  ])

  const baseHeight = 400
  const extraHeight = Math.max(0, profileRoutes.length - 9) * 20
  const totalHeight = baseHeight + extraHeight

  return (
    <MapContainer
      center={[25.5, -35.5]}
      zoom={2}
      className={`h-[250px] md:h-[${totalHeight}px] w-full`}
    >
      <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {profileRoutes.length > 0 && (
        <>
          {profileRoutes.map((route, index) => {
            let icon = blackIcon

            if (index === 0) {
              icon = greenIcon
            } else if (index === profileRoutes.length - 1) {
              icon = redIcon
            }

            return (
              <Marker
                key={route.id}
                position={[
                  parseFloat(route.latitude),
                  parseFloat(route.longitude),
                ]}
                icon={icon}
              >
                <Popup>{route.location}</Popup>
              </Marker>
            )
          })}

          {profileRoutes.length > 1 && (
            <Polyline positions={polylinePositions} color='#1e8dd3' />
          )}
        </>
      )}
    </MapContainer>
  )
}

export default Map
