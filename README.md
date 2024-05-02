# React Google Maps React App

This is a React application that utilizes the Google Maps JavaScript API to display directions from \
a starting point to a destination, with multiple waypoints along the route.


### features

[x] Displays a Google Map with directions from a starting point to a destination.
[x] Supports multiple waypoints along the route.
[x] Automatically fetches and displays the next stop address during navigation.
[x] Provides information about the distance and estimated time for the journey.

### Prerequisites

Before running the application, you need to obtain a Google Maps API key. \
You can get it by following the instructions provided by Google.

### Installation

1. Clone the [repository](https://github.com/IreneRukumbuzi/google-maps-api-demo.git) to your local machine 
2. Navigate to the project directory
3. Install the dependencies `npm install`
4. Create a `.env` file in the project and the Google Maps API key as `REACT_APP_API_KEY=KEY`

### Usage

Run this command `npm start` \

This will run the application in development mode and open it in your default web browser \
on [localhost](http://localhost:3000/)


### Logic

#### App.js

[x] The App component is the main component of the application.
[x] It initializes the state variables to store the directions response, starting point name, ending point name, next stop index, and next stop name.
[x] The useEffect hook is used to update the starting point name and ending point name when the directions response is available.
[x] Another useEffect hook is used to fetch and display the next stop name when the directions response or next stop index changes.
[x] The fetchNextStopName function fetches the address of the next stop using the Google Geocoding API.
[x] The distance covered along the route is calculated and updated every 10 seconds using a separate useEffect hook.
[x] The Google Map is displayed using the GoogleMap component from the @react-google-maps/api package.
[x] Options are provided to customize the map, including disabling certain controls and enabling the compass control.
[x] The DirectionsService component is used to fetch the directions from the Google Maps Directions API.
[x] The directions response is stored in the state and displayed using the DirectionsRenderer component.


#### CurrentLocation.js

[x] This component is responsible for displaying the current location marker on the map.
[x] It receives the current location as props and renders a marker at that location on the map.

#### App.css

[x] This file contains the styles for the application components.
