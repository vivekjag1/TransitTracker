import {NextRequest, NextResponse} from "next/server";

type Trip = {
  startLocation: string;
  endLocation: string;
  directions:string[];
  username: string;
  travelTime:number,
  currency:string,
  cost:number
}
import {prisma} from '@/initDB';
export async function POST(req:NextRequest){
  const data =  await req.json();
  //first check if the user exists, create if not
   await prisma.user.upsert({
    where:{
      username: data.username
    },
    create:{
      username: data.username
    },
    update:{}
  })
  //now add the trip
  const toAdd:Trip = {
    startLocation: data.startLocation,
    endLocation: data.endLocation,
    directions: data.directions,
    username: data.username,
    travelTime: data.travelTime,
    currency: data.currency,
    cost: data.cost,
  }
  console.log(toAdd);

  const newTrip = await prisma.trip.create({
    data: {
      startLocation: data.startLocation,
      endLocation: data.endLocation,
      directions: data.directions,
      username: data.username,
      travelTime: data.travelTime,
      currency: (data.currency? data.currency: 'N/A'),
      cost: (data.cost? data.cost: 0),
    }
  });
  return NextResponse.json({status: 200, tripID: newTrip.tripID})
}