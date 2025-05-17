interface NavItemProps{
  imageSrc:string;
  imageAlt:string;
  linkTo: string;
  textDescription: string;
  open:boolean;

}

import Image from "next/image";

const NavItem = (props:NavItemProps) =>{
  return (
    <a className="navbarLayout" href={props.linkTo}>
      <div className="iconAndTitleContainer">
        <Image className={props.open? "iconOpen":"iconClose"} src={props.imageSrc} alt={props.imageAlt}/>
        {props.open && <h1 className="titleText">{props.textDescription}</h1>}
      </div>
    </a>
  );
}

export default NavItem;
