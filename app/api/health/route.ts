import {db} from "@/config/firebase";
import {addDoc, collection} from 'firebase/firestore';

export async function GET(req:Request){
  const data = {"message":"Backend Healthy"};
  const addItem = async() =>{
    const myCollection = collection(db, 'test');
    await addDoc(myCollection, {
      test: "Works from API"
    });
    return;
  }
  await addItem();
  return new Response(JSON.stringify(data), {
    status:200,
    headers:{'Content-Type': 'application/json'}
  })
}