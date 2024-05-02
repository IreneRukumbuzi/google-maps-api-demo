import React, { useState, useEffect } from 'react';
import { Marker } from '@react-google-maps/api';

const CurrentLocation = () => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    const geoId = navigator.geolocation.watchPosition(
      position => {
        const newPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setCurrentPosition(newPos);
        setError(null); // Clear any previous errors
      },
      err => {
        setError(`Error getting current location: ${err.message}`);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );

    return () => navigator.geolocation.clearWatch(geoId);
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    currentPosition && (
      <Marker position={currentPosition} icon={"http://maps.google.com/mapfiles/ms/icons/blue-dot.png"} />
    )
  );
};

export default CurrentLocation;
