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
  const [startLocationTemp, setStartLocationTemp] = useState<string>('');
  const [endLocationTemp, setEndLocationTemp] = useState<string>('');
  const [start, setStart] = useState<string>();
  const [end, setEnd] = useState<string>();
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
  const [routeIndex, setRouteIndex] = useState<number>(0);
  const selected = routes[routeIndex];
  const leg = selected?.legs;


  const map = useMap();//hook returns instance of a map and renders directions
  const routesLibrary = useMapsLibrary("routes"); //loads routes
  useEffect(()=>{
    if(!routesLibrary || !map){
      return;
    }
    //set state variables for service and renderer
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({map}));
  }, [routesLibrary, map]); //initialize services
  useEffect(() =>{
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
  }, [start, end, directionsService, directionsRenderer]);

  useEffect(() => console.log(routes), [routes]);


  const handleSubmit = () =>{
    if(!startLocationTemp || !endLocationTemp){
      return;
    }
    setStart(startLocationTemp);
    setEnd(endLocationTemp);

  }

  return(
    <div className="pathfindingCardWrapper">
      <div className = "iconAutocompleteContainer">
        <ShareLocationIcon sx={{fontSize:"4vh",  color:"darkblue"}}/>
        <Autocomplete  onChange={(event, value) => setStartLocationTemp(value?value!.description:'')} filterOptions={(x)=>x} className="placeSelector" onInputChange={(event, value) => setValue(value)} renderInput={(params) => <TextField {...params} label="Origin"  onChange={(e) => setStartLocationTemp(e.target.value)}/>} options={data} getOptionLabel={(option) => typeof option === 'string'? option:option.description} />
      </div>
      <div className="iconAutocompleteContainer">
        <FlagIcon sx={{fontSize:"4vh", color:"darkblue"}}/>
        <Autocomplete onChange={(event, value) => setEndLocationTemp(value?value!.description:'')} filterOptions={(x) => x} onInputChange={(event, value) => setValue(value)}  className = "placeSelector" renderInput={(params) => <TextField {...params} label="Destination" onChange={(e) => setEndLocationTemp(e.target.value)}/>} disablePortal options={data}  getOptionLabel={(option) => typeof option === 'string'? option:option.description}/>

      </div>

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




