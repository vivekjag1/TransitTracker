// import "./PathfindingCard.css";
// import Autocomplete from '@mui/material/Autocomplete';
// import TextField from '@mui/material/TextField';
// import FlagCircleIcon from '@mui/icons-material/FlagCircle';
// import Button from '@mui/material/Button';
// import {string} from "prop-types";
// import {useEffect, useState} from "react";
// import AssistantNavigationIcon from '@mui/icons-material/AssistantNavigation';
//
// interface PathfindingCardProps{
//   inputData:string[];
// }
//
// const PathfindingCard = (props:PathfindingCardProps) =>{
//
//   const handleSubmit = () => {return};
//   const [startLocation, setStartLocation] = useState<string>('');
//   const [endLocation, setEndLocation] = useState<string>('');
//
//   useEffect(() =>{
//     console.log(startLocation);
//   }, [startLocation]);
//   return(
//     <div className="pathfindingCardWrapper">
//       <Autocomplete onChange={(event, value) => setStartLocation(value!)} className = "placeSelector" renderInput={(params) => <TextField {...params} label="Origin" />} disablePortal options={props.inputData} sx={{width:300}}/>
//       <Autocomplete onChange={(event, value) => setEndLocation(value!)} className = "placeSelector" renderInput={(params) => <TextField {...params} label="Destination" />} disablePortal options={props.inputData} sx={{width:300}}/>
//       <div className = "buttonContainer">
//         <Button className = "pathfindingButton" variant="contained" sx={{backgroundColor:'darkblue'}}>
//           <div className = "buttonContent">
//             <AssistantNavigationIcon className = "buttonIcon"/>
//             <p>Navigate</p>
//           </div>
//
//         </Button>
//       </div>
//
//     </div>
//   )
// }
//
// export default PathfindingCard;