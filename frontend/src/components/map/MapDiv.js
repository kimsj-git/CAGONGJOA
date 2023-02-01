import { useState } from "react"

import { Map,MapMarker } from "react-kakao-maps-sdk"
import MapCircle from "./MapCircle"

const MapDiv = () => {
  const [center, setCenter] = useState({lat: sessionStorage.getItem('lat'), lng: sessionStorage.getItem('lng')})
  return (
    <Map
      center={{ lat: center.lat, lng: center.lng }}
      style={{ width: "100%", height: "600px" }}
      level={3}
      onCenterChanged={(map) => setCenter({
          lat: map.getCenter().getLat(),
          lng: map.getCenter().getLng(),
      })}
    >
      <MapMarker position={{ lat: center.lat, lng: center.lng }}/>
      <MapCircle lat={center.lat} lng={center.lng}/>
    </Map>
  )
}

export default MapDiv
