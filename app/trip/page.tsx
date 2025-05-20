"use client";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow, useMap, useMapsLibrary,
} from "@vis.gl/react-google-maps";
import {GoogleMap, useLoadScript, Marker} from '@react-google-maps/api';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import './styles.css';
import '../../components/PathfindingCard.css'
import {useEffect, useState} from "react";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AssistantNavigationIcon from '@mui/icons-material/AssistantNavigation';



import Script from "next/script";
import {string} from "prop-types";
const Trip = () =>{
  const {isLoaded} = useLoadScript({
    googleMapsApiKey:process.env.NEXT_PUBLIC_MAPS_API_KEY!,
    libraries:["places"]
  });
  if (!isLoaded) return <div>Loading...</div>;
  console.log(process.env.NEXT_PUBLIC_MAPS_API_KEY);
  return(
    <APIProvider apiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY!}>
      <div className="parentContainer">

        <div className="mapViewer">
          <PathfindingCard/>

          <Map defaultZoom={9} defaultCenter={{lat: 51.5072, lng: 0.1276}} fullscreenControl={false}/>
        <PathfindingCard/>
        </div>
      </div>

    </APIProvider>

  );
}





const PathfindingCard = () =>{
  const {ready, value, setValue, suggestions:{status, data}, clearSuggestions} = usePlacesAutocomplete({debounce:300});
  const [startLocationTemp, setStartLocationTemp] = useState<string>('');
  const [endLocationTemp, setEndLocationTemp] = useState<string>('');
  const [start, setStart] = useState<string>();
  const [end, setEnd] = useState<string>();
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
  const map = useMap();//hook returns instance of a map and renders directions
  const routesLibrary = useMapsLibrary("routes"); //loads routes
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
    if(!start || !end ){
      return;
    }
    console.log("ROUTES ARE", end);
    directionsService.route({
      origin:start,
      destination:end,
      travelMode: google.maps.TravelMode.TRANSIT,
      provideRouteAlternatives:true,
    }).then(res =>{
      directionsRenderer.setDirections(res);
      setRoutes(res.routes);
      console.log(routes);

    })
  }, [start, end, directionsService, directionsRenderer]);


  const handleSubmit = () =>{
    console.log("TESTING", startLocationTemp, endLocationTemp);
    setStart(startLocationTemp);
    setEnd(endLocationTemp);
  }


  return(
    <div className="pathfindingCardWrapper">
      <Autocomplete onChange={(event, value) => setStartLocationTemp(value!.description)} filterOptions={(x)=>x} className="placeSelector" onInputChange={(event, value) => setValue(value)} renderInput={(params) => <TextField {...params} label="Origin"  onChange={(e) => setStartLocationTemp(e.target.value)}/>} options={data} getOptionLabel={(option) => typeof option === 'string'? option:option.description} />
      <Autocomplete onChange={(event, value) => setEndLocationTemp(value!.description)} filterOptions={(x) => x} onInputChange={(event, value) => setValue(value)}  className = "placeSelector" renderInput={(params) => <TextField {...params} label="Destination" onChange={(e) => setEndLocationTemp(e.target.value)}/>} disablePortal options={data}  getOptionLabel={(option) => typeof option === 'string'? option:option.description}/>
      <div className = "buttonContainer">
        <Button className = "pathfindingButton" variant="contained" sx={{backgroundColor:'darkblue'}} onClick={handleSubmit}>
          <div className = "buttonContent">
            <AssistantNavigationIcon className = "buttonIcon"/>
            <p>Navigate</p>
          </div>

        </Button>
      </div>

    </div>
  )
}

export default Trip;




