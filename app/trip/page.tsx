"use client";
import{
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,    
} from "@vis.gl/react-google-maps";
import './styles.css';

const Trip = () =>{
  console.log(process.env.NEXT_PUBLIC_MAPS_API_KEY);
  return(
    <APIProvider apiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY!}>
      <div className="mapViewer">
        <Map zoom={9} center={{lat:51.5072, lng:0.1276}}/>
      </div>
    </APIProvider>

  );
}
export default Trip;