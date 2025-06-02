import {prisma} from '@/initDB'
import {NextRequest, NextResponse} from "next/server";
export  async function POST(req:NextRequest){
  const {tripIDs} = await  req.json();
  //perform the deletion
  console.log(tripIDs);
  const record = await prisma.trip.deleteMany({
    where:{
      tripID:{
        in:tripIDs
      }
    }
  });
  const newTrips = await prisma.trip.findMany({});
  return NextResponse.json({status:200, trips: newTrips});
}