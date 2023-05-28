import React, { useState } from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import SearchBar from './SearchBar.js'
const API_KEY = "AIzaSyDI4HgUw9Aw8eMrXx5jcAXvimyJLB4CS9g"


const containerStyle = {
  width: '100%',
  height: '100vh'
};

const center = {
  lat: 33.56,
  lng: -117.72
};

const onLoad = marker => {
  console.log('marker: ', marker)
}

function MapContainer() {
  const [selected, setSelected] = useState(null);
  return (
    <LoadScript
      googleMapsApiKey={API_KEY}
      libraries={["places"]}
    >
      <div className="search-bar-container">
        <SearchBar setSelected={setSelected} />
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
      >
        {selected && <Marker position={selected} onLoad={onLoad}  />}
      </GoogleMap>
    </LoadScript>
  )
}

export default MapContainer;