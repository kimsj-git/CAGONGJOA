import { useState } from "react"
import { Map, MapMarker } from "react-kakao-maps-sdk"
import { Button, Icon } from "semantic-ui-react"
import { useDispatch, useSelector } from "react-redux"

import classes from "./MapDiv.module.css"
import MapCafeMarker from "./MapCafeMarker"
import MapCircle from "./MapCircle"
import { findMapCafeList } from "../../store/cafe"
import MapSpinner from "./MapSpinner"

const MapDiv = () => {
  const dispatch = useDispatch()
  const [center, setCenter] = useState({
    lat: sessionStorage.getItem("lat"),
    lng: sessionStorage.getItem("lng"),
  })
  const cafeList = useSelector((state) => state.cafe.mapCafeList)
  const [isMoved, setIsMoved] = useState(false)

  const findCafeList = () => {
    dispatch(findMapCafeList({ lat: center.lat, lng: center.lng, distance: 0.3 }))
  }

  const dragHandler = () => {
    setIsMoved(true)
  }

  const goToMyPosition = () => {
    setCenter({
      lat: sessionStorage.getItem("lat"),
      lng: sessionStorage.getItem("lng"),
    })
    setIsMoved(false)
  }

  return (
    <>
      <Map
        center={{ lat: center.lat, lng: center.lng }}
        level={3}
        onCenterChanged={(map) =>
          setCenter({
            lat: map.getCenter().getLat(),
            lng: map.getCenter().getLng(),
          })
        }
        onDragEnd={dragHandler}
        className={classes.map}
      >
        <MapMarker position={{ lat: center.lat, lng: center.lng }} />

        {cafeList.map((cafe, index) => {
          return (
            <MapCafeMarker
              key={index}
              lat={cafe.lat}
              lng={cafe.lng}
              name={cafe.name}
              crowdValue={cafe.crowdValue}
              address={cafe.address}
            />
          )
        })}
        <MapCircle lat={center.lat} lng={center.lng} />
        {isMoved && (
          <>
            <Button
              className={classes.myLocationBtn}
              icon
              circular
              onClick={goToMyPosition}
            >
              <Icon name="map marker alternate" color="red" />
            </Button>
            <Button
              className={classes.findCafeBtn}
              icon
              circular
              onClick={findCafeList}
            >
              현재 위치에서 카페 찾기
            </Button>
          </>
        )}
      <MapSpinner/>
      </Map>
    </>
  )
}

export default MapDiv
