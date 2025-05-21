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
import ShareLocationIcon from '@mui/icons-material/ShareLocation';
import FlagIcon from '@mui/icons-material/Flag';
import ClearIcon from '@mui/icons-material/Clear';
import {set} from "@firebase/database";
import AutocompletePrediction = google.maps.places.AutocompletePrediction;
const Trip = () =>{
  const {isLoaded} = useLoadScript({
    googleMapsApiKey:process.env.NEXT_PUBLIC_MAPS_API_KEY!,
    libraries:["places"]
  });
  if (!isLoaded) return <div>Loading...</div>;
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

  //holds starting and ending destinations
  const [start, setStart] = useState<string>();
  const [end, setEnd] = useState<string>();
  const [currentValueStart, setCurrentValueStart] = useState<AutocompletePrediction|null>(null);
  const[currentValueDestination, setCurrentValueDestination] = useState<AutocompletePrediction|null>(null);

  //google maps services
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();

  //selected routes TODO: replace with cost, transfer optimization
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
  const [cleared, setCleared] = useState<boolean>(false);
  const [routeIndex, setRouteIndex] = useState<number>(0);

  //google maps hooks
  const map = useMap();//hook returns instance of a map and renders directions
  const routesLibrary = useMapsLibrary("routes"); //loads routes

  //starts directions services, renders polyline
  useEffect(()=>{
    if(!routesLibrary || !map){
      return;
    }
    //set state variables for service and renderer
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({map}));
  }, [routesLibrary, map]); //initialize services


  //updates state
  const handleSubmit = () =>{
    if(!directionsRenderer || !directionsService){
      return;
    }
    if(!start || !end ){
      return;
    }
    directionsService.route({
      origin:start,
      destination:end,
      travelMode: google.maps.TravelMode.TRANSIT,
      provideRouteAlternatives:true,
    }).then(res =>{
      directionsRenderer.setDirections(res);
      setRoutes(res.routes);

    }).catch((e:google.maps.MapsRequestError) =>{
      console.log("No such path exists!"); //will eventually be a toast ;()
    })
  }

  return(
    <div className="pathfindingCardWrapper">
      <div className = "iconAutocompleteContainer">
        <ShareLocationIcon sx={{fontSize:"4vh",  color:"darkblue"}}/>
        <Autocomplete
          value={currentValueStart}
          onChange={(event, value) => {
            setCurrentValueStart(value?value:null);
            setStart(value?value!.description:'');
          }}
          filterOptions={(x) => x}
          onInputChange={(event, value) => setValue(value)}
          className = "placeSelector"
          renderInput={(params) => <TextField  {...params} label="Origin"
                                               onChange={(e) => setStart(e.target.value)}/>} disablePortal options={data}
          getOptionLabel={(option) => typeof option === 'string'? option:option.description}
        />
      </div>
      <div className="iconAutocompleteContainer">
        <FlagIcon sx={{fontSize:"4vh", color:"darkblue"}}/>
        <Autocomplete
          value={currentValueDestination}
          onChange={(event, value) => {
            setCurrentValueDestination(value?value:null);
            setEnd(value?value!.description:'');
          }}
          filterOptions={(x) => x}
          onInputChange={(event, value) => setValue(value)}
          className = "placeSelector"
          renderInput={(params) => <TextField  {...params} label="Destination"
                                               onChange={(e) => setEnd(e.target.value)}/>} disablePortal options={data}
          getOptionLabel={(option) => typeof option === 'string'? option:option.description}
        />
      </div>
      <div className = "buttonContainer">
        <Button className = "clearButton" variant="contained" sx={{backgroundColor:'darkblue'}} onClick={() =>{
          setCurrentValueDestination(null);
          setCurrentValueStart(null);
        }}>
          <div className = "buttonContent">
            <ClearIcon className = "buttonIcon"/>
            <p>Clear</p>
          </div>
        </Button>
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




