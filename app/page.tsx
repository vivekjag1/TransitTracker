"use client";

import Image from "next/image";
import tubeMap from "../public/tubeMap.png";
import train from "../public/train.jpg";
import plane from "../public/plane.jpg";

import { TypeAnimation } from 'react-type-animation';
import {useEffect, useState} from "react";
import {motion} from "framer-motion";


export default function Home() {
  const imageArr = [plane, tubeMap, train ]
  const [currIndex, setCurrIndex] = useState<number>(0);
  return (
    <a href="/test">
      <div className = "heroParent">
        <div className = "leftTextPane">
          <h1 className = "title"> Transit Tracker</h1>
          <h1 className="subtitle">
            <div className="typographyContainer">
              <TypeAnimation preRenderFirstString={true} repeat={Number.POSITIVE_INFINITY} sequence={[()=>setCurrIndex(0), "Keep Track of Your Trips on Planes", 3500, () => setCurrIndex(1), 'Keep Track of Your Trips on Public Transit', 3500, () => setCurrIndex(2),'Keep Track of Your Trips on Trains', 3500]} />
            </div>
          </h1>
        </div>
        <div className="rightPaneHero">
          {imageArr.map((image, index) => {
            return (
                <Image
                  key={index}
                  src={image}
                  alt={"hero image"}
                  className={`${currIndex === index ? 'photo visible' : 'photo'}`}
                />
            )
          })}
          <div className="gradient"/>
        </div>
      </div>
    </a>
  );
}
