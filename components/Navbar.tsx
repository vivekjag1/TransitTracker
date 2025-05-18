"use client";
import './Navbar.css'
import {useState} from "react";
import "../public/icon.svg";
import notes from "../public/notes-icon.svg"
import icon from '../public/icon-better.svg';
import download from "../public/download-icon.svg"
import pathfind from "../public/pathfind-icon.svg"
import NavItem from "@/components/NavItem";
import trips from "../public/my-trips.svg";
import close from "../public/collapse.svg"
import Image from "next/image";
import expand from "../public/expand.svg";
import {motion} from 'framer-motion';
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import NavigationIcon from '@mui/icons-material/Navigation';
import CommuteIcon from '@mui/icons-material/Commute';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
const Navbar = () => {
  const [isOpen, setOpen] = useState(true);
  const MotionImage = motion.create(Image);
  const MotionAirplane = motion.create(AirplaneTicketIcon);
  const MotionDownload = motion.create(DownloadForOfflineIcon);
  const MotionPathfind = motion.create(NavigationIcon);
  const MotionTrips = motion.create(CommuteIcon);
  const MotionOpen = motion.create(KeyboardDoubleArrowRightIcon);
  const MotionClose = motion.create(KeyboardDoubleArrowLeftIcon);
  return (
    <motion.nav layout className={isOpen ? "navbarContainerOpen" : "navbarContainerClosed"}>
      <div >
        <NavItem imageAlt={"Header"} linkTo={"/"} textDescription={"Transit Tracker"} open={isOpen} isTitle={true}>
          <MotionImage layout src={icon} alt="Transit Tracker" className={isOpen? "iconOpen":"iconClose"} />
        </NavItem>
        <motion.div layout className="divider"/>
        <NavItem imageAlt={'Trip'} linkTo={'/trip'} textDescription={"Log Trips"} open={isOpen} isTitle={false}>
          <MotionAirplane layout className={isOpen? "iconOpen":"iconClose"} sx={{fontSize:"2.5vw"}}/>
        </NavItem>
        <NavItem imageAlt={'Download Expense Report'} linkTo={'/download'} textDescription={"Expense Reports"} open={isOpen} isTitle={false}>
          <MotionDownload layout className={isOpen? "iconOpen":"iconClose"}  sx={{fontSize:"2.5vw"}}/>
        </NavItem>
        <NavItem imageAlt={"Pathfind"} linkTo={"/pathfind"} textDescription={"Navigate"} open={isOpen} isTitle={false}>
          <MotionPathfind layout className={isOpen? "iconOpen":"iconClose"}  sx={{fontSize:"2.5vw"}}/>
        </NavItem>
        <NavItem imageAlt={"My Trips"} linkTo={"/myTrips"} textDescription={"My Trips"} open={isOpen} isTitle={false}>
          <MotionTrips layout className={isOpen? "iconOpen":"iconClose"}  sx={{fontSize:"2.5vw"}}/>
        </NavItem>
        <div className="navbarLayoutClose"  onClick={isOpen? () => setOpen(false):() => setOpen(true)} >
          <div className="iconAndTitleContainer">
            {isOpen? <MotionClose layout className={isOpen? "iconOpen":"iconClose"}  sx={{fontSize:"2.5vw"}}/>
              : <MotionOpen layout className={isOpen? "iconOpen":"iconClose"}  sx={{fontSize:"2.5vw"}}/>}
            {isOpen && <motion.h1 layout className="titleText">Collapse</motion.h1>}
          </div>
        </div>
      </div>


    </motion.nav>

  );
}
export default Navbar;