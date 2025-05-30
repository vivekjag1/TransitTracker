"use client";
import {useEffect, useState} from "react";
import {useUser} from "@auth0/nextjs-auth0";
import axios from 'axios';
import {Trip} from "@prisma/client";
import './styles.css'

const Download = () => {
  const {user} = useUser();
  const [trips, setTrips] = useState<Trip[]>([]);

  //UE to fetch user trips on load

  useEffect(() =>{
    const fetchData = async () => {
      const trips = await axios.get(`/api/getTrips/${user!.nickname}`);
      setTrips(trips.data);

    }


  })
  return (
    <div>

    </div>
  )
}
export default Download;