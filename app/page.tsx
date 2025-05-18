import Image from "next/image";
import tubeMap from "../public/tubeMap.png";
import train from "../public/train.jpg";
import plane from "../public/plane.jpg";
export default function Home() {
  return (
    <div className="heroParent">
      <div className="heroTextContainer">
        <h1 className="heroTextMain">Track trips on public transit, planes, and trains</h1>
        <br></br>
        <h2 className="heroTextSub">Click anywhere to get started</h2>
      </div>
      <div className="gradient">
      </div>
      <div className="heroDesign">
        <Image className="imageContainerMap" src={tubeMap} alt={"London Underground"}/>
        <Image className="imageContainerPlane" src={plane} alt={"Plane"}/>
        <Image className="imageContainerTrain" src={train} alt={"Eurostar train"}/>
      </div>
    </div>

  );
}
