import { useHistory } from "react-router-dom"
import { Button } from "semantic-ui-react"

import classes from "./MapLookFeed.module.css"

const MapLookFeed = (props) => {
  const history = useHistory()
  
  const geocorder = new window.kakao.maps.services.Geocoder()
  const coord = new window.kakao.maps.LatLng(props.lat, props.lng)
  const callback = function(result, status) {
    if (status === "OK"){
      const address = `${result[0].address.region_1depth_name} ${result[0].address.region_2depth_name} ${result[0].address.region_3depth_name}`
      sessionStorage.setItem("address", address)
      history.push('/')
    }
  }
  
  const lookFeedHandler = () => {
    geocorder.coord2Address(coord.getLng(), coord.getLat(), callback)
    const location = { lat: props.lat, lng: props.lng }
    sessionStorage.setItem("location", JSON.stringify(location))
  }
  return (
    <Button
      className={classes.btn}
      onClick={lookFeedHandler}
      color="yellow"
      circular
    >
      이 위치에서 주변 소식 보기
    </Button>
  )
}

export default MapLookFeed
