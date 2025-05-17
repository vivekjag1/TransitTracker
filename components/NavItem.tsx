interface NavItemProps{
  imageSrc:string;
  imageAlt:string;
  linkTo: string;
  textDescription: string;
  open:boolean;

}

import test from "../public/expand.svg";

import Image from "next/image";
import {motion} from "framer-motion";
const NavItem = (props:NavItemProps) =>{
  const AnimateImage = motion(Image);
  return (
    <motion.a layout className="navbarLayout" href={props.linkTo}>
      <motion.div layout className="iconAndTitleContainer">
        <AnimateImage layout className={props.open? "iconOpen":"iconClose"} src={props.imageSrc} alt={props.imageAlt}/>
        {props.open && <motion.h1  layout className="titleText">{props.textDescription}</motion.h1>}
      </motion.div>
    </motion.a>
  );
}

export default NavItem;
