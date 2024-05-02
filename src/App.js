import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, DirectionsRenderer, DirectionsService } from '@react-google-maps/api';
import CurrentLocation from './CurrentLocation';
import './App.css';

const containerStyle = {
  width: '100vw',
  height: 'calc(100vh - 140px)'
};

const center = {
  lat: -1.939826787816454,
  lng: 30.0445426438232
};

const destination = {
  lat: -1.9365670876910166,
  lng: 30.13020167024439
}

const waypoints = [
  { location: { lat: -1.9355377074007851, lng: 30.060163829002217 }, name: 'Stop 1' },
  { location: { lat: -1.9358808342336546, lng: 30.08024820994666 }, name: 'Stop 2' },
  { location: { lat: -1.9489196023037583, lng: 30.092607828989397 }, name: 'Stop 3' },
  { location: { lat: -1.9592132952818164, lng: 30.106684061788073 }, name: 'Stop 4' },
  { location: { lat: -1.9487480402200394, lng: 30.126596781356923 }, name: 'Stop 5' }
];

const App = () => {
 
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [startingPointName, setStartingPointName] = useState(null);
  const [endingPointName, setEndingPointName] = useState(null);
  const [nextStopIndex, setNextStopIndex] = useState(0);
  const [nextStopName, setNextStopName] = useState(null);

  useEffect(() => {
    if (directionsResponse && directionsResponse.routes[0]?.legs?.length > 0) {
      const startAddress = directionsResponse.routes[0].legs[0]?.start_address;
      setStartingPointName(startAddress);
  
      const endAddress = directionsResponse.routes[0].legs[directionsResponse.routes[0].legs.length - 1]?.end_address;
      setEndingPointName(endAddress);
    }
  }, [directionsResponse]);  
  

  useEffect(() => {
    if (directionsResponse && nextStopIndex < waypoints?.length - 4) {
      const nextStop = waypoints[nextStopIndex];
      fetchNextStopName(nextStop.location);
      setNextStopIndex(nextStopIndex);
    }
  }, [directionsResponse, nextStopIndex]);
  
  const fetchNextStopName = async (location) => {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${process.env.REACT_APP_API_KEY}`);
    const data = await response.json();
    if (data.results && data?.results?.length > 0) {
      const formattedAddress = data.results[0].formatted_address;
      setNextStopName(formattedAddress);
    }
  };
  

  return (
    <>
      <div className="gradient-container">
        <div className="top-section">
          <div className="menu-icon">&#9776;</div>
          <div className="startup-text">Startup</div>
        </div>
        <div className="bottom-section">
          <div className="bottom-text">
            {startingPointName && endingPointName && <div>{startingPointName} - {endingPointName}</div>}
            {nextStopName && <div>Next Stop: {nextStopName}</div>}
            {directionsResponse && 
              <div>
                Distance: {(directionsResponse.routes[0]?.legs.reduce((total, leg) => total + leg.distance.value, 0) / 1000).toFixed(2)} km  
                Time: {Math.round(directionsResponse.routes[0]?.legs.reduce((total, leg) => total + leg.duration.value, 0) / 60)} minutes
              </div>
            }
          </div>
        </div>
      </div>
      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_API_KEY}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={20}
          options={{
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            zoomControl: false,
            compassControl: true
          }}
        >
         <CurrentLocation />

          <DirectionsService
            options={{
              origin: center,
              destination: destination,
              waypoints: waypoints.map(waypoint => ({ location: waypoint.location, stopover: true })),
              travelMode: 'DRIVING'
            }}
            callback={(response, status) => {
              if (status === 'OK' && !directionsResponse) {
                setDirectionsResponse(response);
              }
            }}
          />

          {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
        </GoogleMap>
      </LoadScript>
    </>
  );
};

export default App;
