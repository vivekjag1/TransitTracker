"use client";
import {useEffect, useState} from "react";
import {useUser} from "@auth0/nextjs-auth0";
import axios from 'axios';
import {Trip} from "@prisma/client";
import './styles.css'
import {useRouter} from "next/navigation";

const Download = () => {
  const router = useRouter();

  const {user, isLoading} = useUser();
  const [trips, setTrips] = useState<Trip[]>([]);
  const  [fetched, setFetched] = useState<boolean>(false);

  //UE to fetch user trips on load
  const fetchData = async () => {
    const trips = await axios.get(`/api/getTrips/${user!.nickname}`);
    setTrips(trips.data.trips);
    setFetched(true);
  }
  if(!user && !isLoading){
    router.push('/auth/login')
  }
  else if (!fetched  &&  user && !isLoading){
    fetchData().then();
  }

  useEffect(() => console.log(trips),  [trips])


  return (
    <div>

    </div>
  )
}
export default Download;