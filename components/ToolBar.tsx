import "./ToolBar.css";
import SaveIcon from '@mui/icons-material/Save';
import Tooltip from '@mui/material/Tooltip';
import NavigationIcon from '@mui/icons-material/Navigation';
import CommuteIcon from '@mui/icons-material/Commute';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
const ToolBar = () =>{
  return(
    <div className="toolbarWrapper">
      <div className = "iconContainer">
        <Tooltip title={"Save New Trip"} onClick={() => console.log("Save trip!")}>
          <SaveIcon className = "toolbarIcon"/>
        </Tooltip>
        <Tooltip title={"Navigate"}>
          <NavigationIcon className = "toolbarIcon"/>
        </Tooltip>
        <Tooltip title={"Show my Trips"}>
          <CommuteIcon className = "toolbarIcon"/>
        </Tooltip>
        <Tooltip title={"Add Important Place"}>
          <AddLocationAltIcon className = "toolbarIcon"/>
        </Tooltip>

      </div>

    </div>
  )
}

export default ToolBar;