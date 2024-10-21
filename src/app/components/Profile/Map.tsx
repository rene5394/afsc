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

const Map: React.FC<MapProps> = ({ profileRoutes }) => {
  const polylinePositions: LatLngTuple[] = profileRoutes.map((route) => [
    parseFloat(route.latitude),
    parseFloat(route.longitude),
  ])

  return (
    <MapContainer
      center={[25.5, -35.5]}
      zoom={2}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {profileRoutes.length > 0 && (
        <>
          <Marker position={polylinePositions[0]} icon={greenIcon}>
            <Popup>{profileRoutes[0].location}</Popup>
          </Marker>

          {profileRoutes.length > 1 && (
            <>
              <Marker
                position={polylinePositions[polylinePositions.length - 1]}
                icon={redIcon}
              >
                <Popup>
                  {profileRoutes[profileRoutes.length - 1].location}
                </Popup>
              </Marker>

              <Polyline positions={polylinePositions} color='#1e8dd3' />
            </>
          )}
        </>
      )}
    </MapContainer>
  )
}

export default Map
