import react from 'react';
interface NavItemProps{
  children: react.ReactNode;
  imageAlt:string;
  linkTo: string;
  textDescription: string;
  open:boolean;
  isTitle:boolean;

}

import test from "../public/expand.svg";

import Image from "next/image";
import {motion} from "framer-motion";
const NavItem = (props:NavItemProps) =>{
  const AnimateImage = motion.create(Image);
  return (
    <motion.a layout className="navbarLayout" href={props.linkTo}>
      <motion.div layout className="iconAndTitleContainer">
        {props.children}
        {/*<AnimateImage layout className={props.open? "iconOpen":"iconClose"} src={props.imageSrc} alt={props.imageAlt}/>*/}
        {props.open && <motion.h1  layout className={props.isTitle? "titleText":"navText"}>{props.textDescription}</motion.h1>}
      </motion.div>
    </motion.a>
  );
}

export default NavItem;
