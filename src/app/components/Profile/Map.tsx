'use client'

import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L, { LatLngTuple } from 'leaflet'
import 'leaflet/dist/leaflet.css'

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

const Map: React.FC = () => {
  const markers = [
    { position: [40.7128, -74.0060], popupText: "New York City" },
    { position: [34.0522, -118.2437], popupText: "Los Angeles" },
    { position: [41.8781, -87.6298], popupText: "Chicago" },
    { position: [29.7604, -95.3698], popupText: "Houston" },
    { position: [39.7392, -104.9903], popupText: "Denver" },
    { position: [47.6062, -122.3321], popupText: "Seattle" },
    { position: [38.9072, -77.0369], popupText: "Washington, D.C." },
    { position: [25.7617, -80.1918], popupText: "Miami" },
    { position: [33.4484, -112.0740], popupText: "Phoenix" },
    { position: [41.4925, -99.9018], popupText: "Nebraska" }
  ]

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
      {markers.map((marker, index) => (
        <Marker key={index} position={marker.position as LatLngTuple}>
          <Popup>{marker.popupText}</Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

export default Map
