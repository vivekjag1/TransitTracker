import {NextApiRequest, NextApiResponse} from "next";
import { PrismaClient } from "@/app/generated/prisma"
import {NextResponse} from "next/server";
type Trip = {
  startLocation: string;
  endLocation: string;
  directions:string[];
  username: string;
}


export async function POST(req:Request, res: Response){
  //extract  data
  console.log(req.body);
  // const prisma = new PrismaClient();
  // const user = req.body.username
  // return new NextResponse();
  //first check if the user exists
  // const userExists = await prisma.user.count({
  //   where:{
  //     username: user
  //   }
  // });
  // if(userExists!=1){ //either the user does not exist or there are multiple
  //   res.status(500).json({"message":"user not found!"});
  // }

  //build Trip
  // const toAdd:Trip = {
  //   startLocation: req.body.startLocation,
  //   endLocation: req.body.endLocation,
  //   directions: req.body.directions,
  //   username: req.body.username,
  // }
  // await prisma.trip.create({
  //   data:toAdd
  // });
}