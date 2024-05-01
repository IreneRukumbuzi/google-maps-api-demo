import React, { useState, useEffect } from 'react';
import { useJsApiLoader, GoogleMap, Marker, DirectionsService, DirectionsRenderer } from "@react-google-maps/api";

const mapContainerStyle = {
  width: '100vw',
  height: '100vh'
};

const libraries = ['geometry', 'places'];



const startingPoint = { lat: -1.939826787816454, lng: 30.0445426438232 };
const endingPoint = { lat: -1.9365670876910166, lng: 30.13020167024439 };
const intermediateStops = [
  { lat: -1.9355377074007851, lng: 30.060163829002217 },
  { lat: -1.9358808342336546, lng: 30.08024820994666 },
  { lat: -1.9489196023037583, lng: 30.092607828989397 },
  { lat: -1.9592132952818164, lng: 30.106684061788073 },
  { lat: -1.9487480402200394, lng: 30.126596781356923 }
];

const averageSpeed = 30; // km/h
const metersPerSecond = averageSpeed * 1000 / 3600;

function App() {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_API_KEY,
    libraries: libraries
  });

  const [response, setResponse] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [nextStopIndex, setNextStopIndex] = useState(0);
  const [startingPointName, setStartingPointName] = useState(null);
  const [endingPointName, setEndingPointName] = useState(null);

  useEffect(() => {
    if (isLoaded) {
      const directionsService = new window.google.maps.DirectionsService();

      const request = {
        origin: startingPoint,
        destination: endingPoint,
        waypoints: intermediateStops.map(stop => ({ location: stop })),
        travelMode: 'DRIVING'
      };

      directionsService.route(request, (result, status) => {
        if (status === 'OK') {
          setResponse(result);
          
          const startAddress = result.routes[0].legs[0].start_address;
          setStartingPointName(startAddress);
          
          const endAddress = result.routes[0].legs[result.routes[0].legs.length - 1].end_address;
          setEndingPointName(endAddress);
        } else {
          console.error('Directions request failed due to ' + status);
        }
      });
    }
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      const watchId = navigator.geolocation.watchPosition(
        position => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        error => {
          console.error('Error getting current location:', error);
        }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    }
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      
      const intervalId = setInterval(() => {
        if (currentLocation && nextStopIndex < intermediateStops.length) {
          const distanceToNextStop = window.google.maps.geometry.spherical.computeDistanceBetween(
            new window.google.maps.LatLng(currentLocation.lat, currentLocation.lng),
            new window.google.maps.LatLng(intermediateStops[nextStopIndex].lat, intermediateStops[nextStopIndex].lng)
          );
          const etaSeconds = distanceToNextStop / metersPerSecond;
          
          if (etaSeconds < 1) {
            setNextStopIndex(nextStopIndex + 1);
          }
        }
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [isLoaded, currentLocation, nextStopIndex]);

  const handleOnLoad = (map) => {
    
    setCurrentLocation(startingPoint);
  };

  if (loadError) {
    return <div>Error loading Google Maps API: {loadError.message}</div>;
  }

  return isLoaded ? (
    <>
      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '10px', position: 'absolute', top: '0', left: '0', width: '100%', zIndex: '999', textAlign: 'center' }}>
        {startingPointName && endingPointName && <div>{startingPointName} - {endingPointName}</div>}
        {response && <div>Duration: {response.routes[0].legs[0].duration.text}</div>}
      </div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={startingPoint}
        zoom={12}
        onLoad={handleOnLoad}
      >
        <DirectionsService
          options={{
            destination: endingPoint,
            origin: startingPoint,
            waypoints: intermediateStops.map(stop => ({ location: stop })),
            travelMode: 'DRIVING'
          }}
          callback={(result, status) => {
            if (status === 'OK') {
              setResponse(result);
            } else {
              console.error('Directions request failed due to ' + status);
            }
          }}
        />
        {response && <DirectionsRenderer options={{ directions: response }} />}
        {currentLocation && (
          <Marker
            position={currentLocation}
            draggable={true}
            onDragEnd={event => {
              setCurrentLocation({ lat: event.latLng.lat(), lng: event.latLng.lng() });
            }}
          />
        )}
        {intermediateStops.map((stop, index) => (
          <Marker
            key={index}
            position={stop}
            label={(index + 1).toString()}
          />
        ))}
        <Marker position={endingPoint} label="End" />
      </GoogleMap>
    </>
  ) : <div>Loading...</div>;
}

export default App;
