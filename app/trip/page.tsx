"use client";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow, useMap, useMapsLibrary,
} from "@vis.gl/react-google-maps";
import './styles.css';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import {useEffect, useState} from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {GoogleMap, useLoadScript, Marker} from "@react-google-maps/api"
const Trip = () =>{
  console.log(process.env.NEXT_PUBLIC_MAPS_API_KEY);
  return(
    <APIProvider apiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY!}>
      <div className="parentContainer">
        {/*<div className = "leftPane">*/}
        {/*  <div className="saveTripWindow">*/}
        {/*    <h1 className="saveTripText">Log New Trip</h1>*/}
        {/*  </div>*/}
        {/*</div>*/}
        <div className="mapViewer">
        <Map defaultZoom={9} defaultCenter={{lat: 51.5072, lng: 0.1276}} fullscreenControl={false}/>
        <Directions/>
        </div>
      </div>

    </APIProvider>

  );
}

const Directions = () =>{
  const map = useMap();//hook returns instance of a map and renders directions
  const routesLibrary = useMapsLibrary("routes"); //loads routes
  //state to store directions service
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
  useEffect(()=>{
    if(!routesLibrary || !map){
      return;
    }
    //set state variables for service and renderer
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({map}));
    console.log("directions service set");
  }, [routesLibrary, map]); //initialize services

  useEffect(() =>{
    if(!directionsRenderer || !directionsService){
      return;
    }
    directionsService.route({
      origin:"19 Bedford Pl, London WC1B 5JA, UK",
      destination:"Ground floor Plimsoll Building, Handyside St, London N1C 4BQ, UK",
      travelMode: google.maps.TravelMode.TRANSIT,
      provideRouteAlternatives:true,
    }).then(res =>{
      directionsRenderer.setDirections(res);
      setRoutes(res.routes);
      console.log(routes);

    })
  }, [directionsService, directionsRenderer]);
  console.log(routes);
  return null;
}


export default Trip;