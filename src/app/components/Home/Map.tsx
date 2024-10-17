'use client'

import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L, { LatLngTuple } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { FetchProfilesUseCase } from '@/modules/profile/application/FetchProfilesUseCase'
import { ProfileRepository } from '@/modules/profile/infrastructure/ProfileRepository'
import { Profile } from '@/modules/profile/domain/Profile'

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
})

const Map: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [shouldFetch, setShouldFetch] = useState(true)

  const fetchProfilesUseCase = new FetchProfilesUseCase(new ProfileRepository())

  const fetchProfiles = async (page: number) => {
    try {
      const { data, meta } = await fetchProfilesUseCase.execute(page)
      setProfiles((prevProfiles) => [...prevProfiles, ...data])
      setShouldFetch(meta.nextPage !== null)
    } catch (error) {
      console.error('Error fetching profiles:', error)
    }
  }

  useEffect(() => {
    const loadProfiles = async () => {
      if (shouldFetch) {
        await fetchProfiles(currentPage)
        setCurrentPage((prevPage) => prevPage + 1)
      }
    }

    loadProfiles()
  }, [currentPage, shouldFetch])

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
      {profiles.map((marker, index) => (
        <Marker
          key={index}
          position={
            [
              marker.routes[0].latitude,
              marker.routes[0].longitude,
            ] as unknown as LatLngTuple
          }
        >
          <Popup>{marker.routes[0].location}</Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

export default Map
