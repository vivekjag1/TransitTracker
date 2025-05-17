"use client";
import './Navbar.css'
import {useState} from "react";
import "../public/icon.svg";
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
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
const Navbar = () => {
  const [isOpen, setOpen] = useState(true);
  const MotionImage = motion(Image);
  return (
    <motion.nav layout className={isOpen ? "navbarContainerOpen" : "navbarContainerClosed"}>
      <div >
        <NavItem imageSrc={icon} imageAlt={"Header"} linkTo={"/"} textDescription={"Transit Tracker"} open={isOpen}/>
        <motion.div layout className="divider"/>
        <NavItem imageSrc={notes} imageAlt={"logTrip"} linkTo={"/trip"} textDescription={"Log Trip"} open={isOpen}/>
        <NavItem imageSrc={download} imageAlt={"download"} linkTo={"/download"} textDescription={"Expense Reports"} open={isOpen}/>
        <NavItem imageSrc={pathfind} imageAlt={"pathfinder"} linkTo={"/pathfind"} textDescription={"Navigate"} open={isOpen}/>
        <NavItem imageSrc={trips} imageAlt={"my trips"} linkTo={"/myTrips"} textDescription={"My Trips"} open={isOpen}/>
        <div className="navbarLayoutClose"  onClick={isOpen? () => setOpen(false):() => setOpen(true)} >
          <div className="iconAndTitleContainer">
            {isOpen? <MotionImage layout className="iconOpen" src={close} alt={"close"}/>: <MotionImage layout className="iconClose" src={expand} alt={"close"}/>}
            {isOpen && <motion.h1 layout className="titleText">Collapse</motion.h1>}
          </div>
        </div>
      </div>


    </motion.nav>

  );
}
export default Navbar;