"use client";
import {
  APIProvider,
  Map,
   useMap, useMapsLibrary,
} from "@vis.gl/react-google-maps";
import {useLoadScript} from '@react-google-maps/api';
import usePlacesAutocomplete, {
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
import {motion} from "framer-motion";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import SaveIcon from '@mui/icons-material/Save';
import {DownloadIcon} from "lucide-react";
import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import { toast } from "sonner";
import { useUser } from "@auth0/nextjs-auth0";
import { useRouter } from 'next/navigation'
import axios from 'axios';

type TextDirection = {
  type:string;
  step:string;
  icon:string|undefined;

}
const Trip = () =>{
  const router = useRouter();
  const {user, isLoading } = useUser();
  if(!user && !isLoading){
    router.push('/auth/login')
  }
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
  const {user, isLoading } = useUser();

  const printRef = useRef(null);
  //holds starting and ending destinations
  const [start, setStart] = useState<string>();
  const [end, setEnd] = useState<string>();
  const [currentValueStart, setCurrentValueStart] = useState<AutocompletePrediction|null>(null);
  const [currentValueDestination, setCurrentValueDestination] = useState<AutocompletePrediction|null>(null);

  //google maps services
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();

  //selected routes TODO: replace with cost, transfer optimization
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);

  //state variable to hold whether directions have been fetched
  const [directionsAvailable, setDirectionsAvailable] = useState<boolean>(false);

  //state variable to hold whether the card is expanded
  const [expanded, setExpanded] = useState<boolean>(false);

  //state variable to prevent scrolling while framer-motion animation is running
  const [scroll, setScroll] = useState<boolean>(false);
  const [text, setText] = useState<TextDirection[]>([]);

  //hook that returns instance of google map
  const map = useMap();//hook returns instance of a map and renders directions

  //autocomplete hooks
  const { setValue, suggestions:{ data}} = usePlacesAutocomplete({debounce:300});

  //load routes library
  const routesLibrary = useMapsLibrary("routes");


  //starts directions services, renders polyline
  useEffect(()=>{
    if(!routesLibrary || !map){
      return;
    }
    //set state variables for service and renderer
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({map}));
  }, [routesLibrary, map]); //initialize services

  //swaps start and end destination
  const handleSwap = () =>{
    const oldStart = currentValueStart;
    const oldEnd = currentValueDestination;
    setCurrentValueStart(oldEnd);
    setCurrentValueDestination(oldStart);
    setEnd(oldStart?.description);
    setStart(oldEnd?.description);
  }

  //creates textual directions
  const fetchTextualDirections = () =>{
    return routes[0].legs[0].steps.map((step) => {
      if(step.travel_mode === "TRANSIT"){
        return {type: "TRANSIT", step:`Board the ${(step.transit?.line.name != undefined)? step.transit?.line.name:step.transit?.line.agencies![0]?.name }: ${step.transit?.headsign} for ${step.transit?.num_stops} stops until ${step.transit?.arrival_stop.name}`,
          icon:  step?.transit?.line?.vehicle.local_icon}
      }
      return {icon:undefined, type:"WALKING", step:step.instructions}
    });
  }

  //submits the start and end locations to the google maps service, renders polyline
  const handleSubmit = () =>{
    console.log("running!", start, end);
    if(!directionsRenderer || !directionsService){ //check if services are available. return if not
      return;
    }
    if(!start || !end ){ //check if start and end exist. return if not
      return;
    }
    //fetch directions then render on the map
    directionsService.route({
      origin:start,
      destination:end,
      travelMode: google.maps.TravelMode.TRANSIT,
      provideRouteAlternatives:true,
    }).then(res =>{
      directionsRenderer.setDirections(res);
      setRoutes(res.routes);
      setDirectionsAvailable(true);
    }).catch(() =>{
      toast.error("No such path exists!");
    })
  }
  //function to convert total time to mins.
  const findTime = () => Math.round(((routes[0]?.legs[0]?.duration?.value) as number) / 60);

  //function to fetch text directions when ready
  useEffect(() => {
    if (routes.length == 0) return;
    const text = fetchTextualDirections();
    // setText(text);
  }, [routes, fetchTextualDirections]);
  const makePDF = useReactToPrint({
    contentRef: printRef,
    documentTitle: "directions"
  });
  const handlePrint = () =>{
    setExpanded(true);
    makePDF();
  }

  const handleSaveTrip = async () => {
    await axios.post('/api/saveTrip', {
      username: user!.nickname,
      startLocation: start,
      endLocation: end,
      directions: fetchTextualDirections().map((item) => item.step),
    });
    return;
  }

  //framer motion icons
  const MotionSwap = motion.create(SwapVertIcon);
  const MotionUp = motion.create(KeyboardArrowUpIcon);
  const MotionDown = motion.create(KeyboardArrowDownIcon);
  return(
    <div  style={ {overflowY: expanded? "auto": 'visible'}} className="pathfindingCardWrapper" >
      <motion.div className="pathfindingCardContent" style={{overflowX: expanded? "hidden":"visible"}}>
        <motion.div layout className="iconAutocompleteContainer">
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
        </motion.div>
        <Tooltip title={"Swap Locations"} onClick={handleSwap}>
          <MotionSwap layout className="swapIcon" sx={{fontSize: "4vh", color: "darkblue"}} />

        </Tooltip>
        <motion.div layout className="iconAutocompleteContainer">
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
        </motion.div>
        <motion.div layout  className="buttonContainer">
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

        </motion.div>
        {directionsAvailable && <motion.div className="infoWindow" ref={printRef}>
          <motion.div  transition={{duration:.3}} layout className="resultsWindow">
            <motion.div layout className="statsWindow">
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
            </motion.div>
            {<motion.div layout className="expandIcon" onClick={() => setExpanded(!expanded)}>
              {expanded ? <MotionUp layout sx={{color: "black", fontSize: "4vh"}}/> :
                <MotionDown layout sx={{color: "black", fontSize: "4vh"}}/>}
            </motion.div>}
            {expanded && <motion.div layout style={{overflowX:"hidden", overflowY: scroll? "auto":"hidden"}} onAnimationStart={() => setScroll(false)} onAnimationComplete={() => setScroll(false)} className = "expandedInfo">
              <motion.div layout initial={{opacity:0}} animate={{opacity:1}} className="routeOverview">{
                fetchTextualDirections().map((item, index)=>{
                    return(

                        <motion.div layout className="routeOverview" key={index}>
                          {item.type === "WALKING" ?
                            <DirectionsWalkIcon  sx={{color: "white", fontSize: "1.5vw"}}/> : (item.icon? <motion.img layout  alt="transit" src={item.icon}/>:<DirectionsBusIcon sx={{color: "white", fontSize: "1.5vw"}}/>)}

                          {index + 1 != fetchTextualDirections().length &&
                            <DoubleArrowIcon sx={{color: "white"}}/>}
                        </motion.div>


                    )
                })}

              </motion.div>

              <div className="textDirections">
                {fetchTextualDirections().map((item, index) => {
                  if (item.type === 'WALKING') {
                    return (
                      <motion.div layout initial={{opacity: 0}} animate={{opacity: 1}} key={index}
                                  className="directionsContainer">
                        <DirectionsWalkIcon className="directionsIcon" sx={{color:"white", fontSize:"2rem"}}/>
                          <motion.h1 layout className="directionsText">{item.step}</motion.h1>
                        </motion.div>
                      )
                    } else {
                      return (
                        <motion.div layout initial={{opacity:0}} animate={{opacity:1}} key={index} className = "directionsContainer">

                          {(item.icon ? <motion.img layout className="directionsIcon" src={item.icon} alt="test"/>: <DirectionsBusIcon className="directionsIcon" sx={{color:"white", fontSize:"2rem"}}/>)}

                          <motion.h1 layout className="directionsText">{item.step}</motion.h1>
                        </motion.div>
                      )
                    }
                  }
                )
                }
              </div>

            </motion.div>}
            {expanded &&
              <motion.div layout className = "saveButtonContainer">
                   <Button   className="saveButton" variant="contained" sx={{backgroundColor: 'darkblue', marginRight:"1vw"}} onClick = {handleSaveTrip}>
                    <div className="buttonContent">
                      <SaveIcon className="buttonIcon"/>
                      <p>Save Trip </p>
                    </div>
                  </Button>
                  <Button   className="saveButton" variant="contained" sx={{backgroundColor: 'darkblue'}} onClick={handlePrint}>
                    <div className="buttonContent">
                      <DownloadIcon className="buttonIcon"/>
                      <p>Download Directions</p>
                    </div>
                  </Button>
              </motion.div>
            }
          </motion.div>
        </motion.div>}
      </motion.div>
    </div>
  )
}

export default Trip;




