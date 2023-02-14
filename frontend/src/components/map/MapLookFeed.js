import { useDispatch } from "react-redux"
import { useHistory } from "react-router-dom"
import { Button } from "semantic-ui-react"

import { cafeActions } from "../../store/cafe"
import classes from "./MapLookFeed.module.css"

const MapLookFeed = (props) => {
  const history = useHistory()
  const dispatch = useDispatch()
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
    if (sessionStorage.getItem('cafeAuth') === "1"){
      if (JSON.parse(sessionStorage.getItem('myCafe')).lat === props.lat && JSON.parse(sessionStorage.getItem('myCafe')).lng === props.lng){
        dispatch(cafeActions.findFeedMyLocation())
      }else{
        dispatch(cafeActions.findFeed())
      }
    }
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
