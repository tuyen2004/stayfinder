import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

// Set the custom marker icon
const customIcon = new L.Icon({
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  shadowSize: [41, 41],
});

const OpenStreetMap = ({ address }) => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    // Use geocoding API (e.g., Nominatim from OpenStreetMap) to get coordinates from the address
    const geocodeAddress = async () => {
      const encodedAddress = encodeURIComponent(address);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data && data[0]) {
          const { lat, lon } = data[0];
          setLocation([lat, lon]);
        } else {
          console.error("Address not found.");
        }
      } catch (error) {
        console.error("Error calling geocoding API:", error);
      }
    };

    if (address) {
      geocodeAddress();
    }
  }, [address]);

  return (
    <div style={{ width: "100%", height: "250px" }}>
      {location ? (
        <MapContainer
          center={location}
          zoom={15}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={location} icon={customIcon}>
            <Popup>{address}</Popup>
          </Marker>
        </MapContainer>
      ) : (
        <div>Loading map...</div>
      )}
    </div>
  );
};

export default OpenStreetMap;
