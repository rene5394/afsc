'use client'

import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L, { LatLngTuple } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

import { ProfileRoute } from '@/modules/profile-route/domain/ProfileRoute'

interface MapProps {
  profileRoutes: ProfileRoute[]
}

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
})

const Map: React.FC<MapProps> = ({ profileRoutes }) => {
  return (
    <MapContainer
      center={[41.4925, -99.9018]}
      zoom={4}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {profileRoutes.map((marker, index) => (
        <Marker
          key={index}
          position={
            [marker.latitude, marker.longitude] as unknown as LatLngTuple
          }
        >
          <Popup>{marker.location}</Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

export default Map
