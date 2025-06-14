import {NextRequest, NextResponse} from "next/server";
import {prisma} from '@/initDB'

export async function GET(req:NextRequest, {params}:{params:Promise<{user:string}>}){
  try{
    const user = (await params).user;
    const trips = await prisma.trip.findMany({
      where:{
        username:  user
      }
    });
    return NextResponse.json({status:200, trips: trips});
  }
  catch (e){
    return NextResponse.json({status:500, error:e});
  }
}