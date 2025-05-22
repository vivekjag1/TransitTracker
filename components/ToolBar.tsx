import "./ToolBar.css";
import SaveIcon from '@mui/icons-material/Save';
import Tooltip from '@mui/material/Tooltip';
import NavigationIcon from '@mui/icons-material/Navigation';
import CommuteIcon from '@mui/icons-material/Commute';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import PathfindModal from "@/components/PathfindModal";
import {useState} from "react";
const ToolBar = () =>{
  const [pathfindingModalOpen, setPathfindingModalOpen] = useState<boolean>(false);
  return(
    <div className="toolbarWrapper">
      <PathfindModal open={pathfindingModalOpen} startLocation={null} setOpen={(state:boolean) => setPathfindingModalOpen(state)}/>
      <div className = "iconContainer">
        <Tooltip title={"Save New Trip"} onClick={() => setPathfindingModalOpen(true)}>
          <SaveIcon className = "toolbarIcon"/>
        </Tooltip>
        <Tooltip title={"Navigate"} onClick={() => setPathfindingModalOpen(true)}>
          <NavigationIcon className = "toolbarIcon"/>
        </Tooltip>
        <Tooltip title={"Show my Trips"}>
          <CommuteIcon className = "toolbarIcon"/>
        </Tooltip>
        <Tooltip title={"Add Landmark"}>
          <AddLocationAltIcon className = "toolbarIcon"/>
        </Tooltip>

      </div>

    </div>
  )
}

export default ToolBar;