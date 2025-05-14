export async function GET(req:Request){
  const data = {"message":"Backend Healthy"};
  return new Response(JSON.stringify(data), {
    status:200,
    headers:{'Content-Type': 'application/json'}
  })
}