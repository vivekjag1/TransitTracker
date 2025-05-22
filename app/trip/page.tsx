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
import SwapVertIcon from '@mui/icons-material/SwapVert';
import AutocompletePrediction = google.maps.places.AutocompletePrediction;
import Tooltip from '@mui/material/Tooltip';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import {white} from "next/dist/lib/picocolors";
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
  const [directionsAvailable, setDirectionsAvailable] = useState<boolean>(false);

  const [expanded, setExpanded] = useState<boolean>(false);
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

  const handleSwap = () =>{
    const oldStart = currentValueStart;
    const oldEnd = currentValueDestination;
    setCurrentValueStart(oldEnd);
    setCurrentValueDestination(oldStart);

  }

  //creates textual directions
  const fetchTextualDirections = () =>{
    return routes[0].legs[0].steps.map((step) => {
      if(step.travel_mode === "TRANSIT"){
        return {type: "TRANSIT", step:`Board the ${step.transit?.line.name} via ${step.transit?.headsign} for ${step.transit?.num_stops} stops until ${step.transit?.arrival_stop.name}`, icon:routes[0]?.legs[0]?.steps[1]?.transit?.line?.vehicle.local_icon}
      }
      return {type:"WALKING", step:step.instructions}
    });





    //chosen route (for now)

    // const icons = routes[0].legs[0].steps.map((step) => {
    //   if (step.travel_mode === "TRANSIT") {
    //     return step.transit?.line.icon
    //   } else if (step.travel_mode === 'WALKING') {
    //     return DirectionsWalkIcon;
    //   }
    // });
    // return {directions:textDirections, icons:icons};



  }

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
      console.log("RES IS", routes);
      fetchTextualDirections();
      setDirectionsAvailable(true);

    }).catch((e:google.maps.MapsRequestError) =>{
      console.log("EXCEPTION", e);
      alert("No such path exists!");
    })
  }

  const findTime = () => Math.round(((routes[0]?.legs[0]?.duration?.value) as number) / 60)


  useEffect(() => console.log(routes), [routes]);

  return(
    <div className="pathfindingCardWrapper">
      <div className="pathfindingCardContent">
        <div className="iconAutocompleteContainer">
          <ShareLocationIcon sx={{fontSize: "4vh", color: "darkblue"}}/>
          <Autocomplete
            value={currentValueStart}
            onChange={(event, value) => {
              setCurrentValueStart(value ? value : null);
              setStart(value ? value!.description : '');
            }}
            filterOptions={(x) => x}
            onInputChange={(event, value) => setValue(value)}
            className="placeSelector"
            renderInput={(params) => <TextField  {...params} label="Origin"
                                                 onChange={(e) => setStart(e.target.value)}/>} disablePortal
            options={data}
            getOptionLabel={(option) => typeof option === 'string' ? option : option.description}
          />
        </div>
        <Tooltip title={"Swap Locations"} onClick={handleSwap}>
          <SwapVertIcon className="swapIcon" sx={{fontSize: "4vh", color: "darkblue"}} />

        </Tooltip>
        <div className="iconAutocompleteContainer">
          <FlagIcon sx={{fontSize: "4vh", color: "darkblue"}}/>
          <Autocomplete
            value={currentValueDestination}
            onChange={(event, value) => {
              setCurrentValueDestination(value ? value : null);
              setEnd(value ? value!.description : '');
            }}
            filterOptions={(x) => x}
            onInputChange={(event, value) => setValue(value)}
            className="placeSelector"
            renderInput={(params) => <TextField  {...params} label="Destination"
                                                 onChange={(e) => setEnd(e.target.value)}/>} disablePortal
            options={data}
            getOptionLabel={(option) => typeof option === 'string' ? option : option.description}
          />
        </div>
        <div className="buttonContainer">
          <Button className="clearButton" variant="contained" sx={{backgroundColor: 'darkblue'}} onClick={() => {
            setCurrentValueDestination(null);
            setCurrentValueStart(null);
          }}>
            <div className="buttonContent">
              <ClearIcon className="buttonIcon"/>
              <p>Clear</p>
            </div>
          </Button>
          <Button className="pathfindingButton" variant="contained" sx={{backgroundColor: 'darkblue'}}
                  onClick={handleSubmit}>
            <div className="buttonContent">
              <AssistantNavigationIcon className="buttonIcon"/>
              <p>Navigate</p>
            </div>
          </Button>

        </div>
        {directionsAvailable && <div className="infoWindow">
          <div className="resultsWindow">
            <div className="statsWindow">
              <div className="statContainer">
                <h1 className="statText">{findTime()}</h1>
                <h2 className="statSubtext">Minutes</h2>
              </div>
              <div className="statContainer">
                <h1 className="statText">{routes[0]?.fare?.value}</h1>
                <h2 className="statSubtext">{routes[0]?.fare?.currency}</h2>
              </div>
              <div className="statContainer">
                <h1 className="statText">{routes[0]?.legs[0]?.arrival_time?.text}</h1>
                <h2 className="statSubtext">{routes[0]?.legs[0]?.arrival_time?.time_zone.replace('_', ' ')}</h2>
              </div>
            </div>
            { <div className = "expandIcon" onClick={() => setExpanded(!expanded)}>
              <KeyboardArrowDownIcon sx={{color:"black", fontSize:"4vh"}}/>
            </div>}

            {expanded && <div className = "expandedInfo">
              <div className="routeOverview">{
                fetchTextualDirections().map((item, index)=>{
                    return(
                      <div className="routeOverview" key={index}>
                        {item.type === "WALKING"? <DirectionsWalkIcon sx={{color: "white"}}/> :
                          <img alt="transit"  src={item.icon}/>}
                        {index + 1 != fetchTextualDirections().length &&
                        <DoubleArrowIcon  sx={{color:"white", marginLeft:".5vw", marginRight:".5vw"}}/>}
                      </div >
                    )
                  })}
            </div>
              {/*{fetchTextualDirections().map((item, index) => {*/}
              {/*  if (item.type === 'WALKING') {*/}
              {/*    return (*/}
              {/*      <div key={index} className = "directionsContainer">*/}
              {/*        <DirectionsWalkIcon sx={{color:"white"}}/>*/}
              {/*        <h1>{item.step}</h1>*/}
              {/*      </div>*/}
              {/*    )*/}
              {/*  } else {*/}
              {/*    return (*/}
              {/*      <div key={index} className = "directionsContainer">*/}
              {/*        <img src={item.icon} alt="test"/>*/}
              {/*        <h1>{item.step}</h1>*/}
              {/*      </div>*/}
              {/*    )*/}
              {/*  }*/}
              {/*}*/}
              {/*  )*/}
              {/*}*/}



            </div>}

          </div>

        </div>}
      </div>
    </div>


  )
}

export default Trip;




