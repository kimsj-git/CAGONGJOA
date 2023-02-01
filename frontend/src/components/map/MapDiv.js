import { useState } from "react"
import { Map, MapMarker } from "react-kakao-maps-sdk"
import { Button, Icon } from "semantic-ui-react"

import classes from './MapDiv.module.css'
import MapCafeMarker from "./MapCafeMarker"
import MapCircle from "./MapCircle"

const MapDiv = () => {
  const [center, setCenter] = useState({
    lat: sessionStorage.getItem("lat"),
    lng: sessionStorage.getItem("lng"),
  })

  const [isMoved, setIsMoved] = useState(false)
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
  // 드래그 했을 때 새로운 카페 정보를 가져오기
  const DUMMY_DATA = [
    {
      lat: center.lat - 0.0003,
      lng: center.lng + 0.001,
      name: "스타벅스",
      crowdValue: "원활",
      address: "서울시 강남구 역삼역..",
    },
    {
      lat: center.lat - 0.0007,
      lng: center.lng - 0.0009,
      name: "할리스",
      crowdValue: "혼잡",
      address: "서울시 강남구 테헤란로..",
    },
    {
      lat: center.lat + 0.001,
      lng: center.lng - 0.003,
      name: "파스쿠찌",
      crowdValue: "보통",
      address: "서울시 강남구 역삼역 1번출구",
    },
  ]
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

        {DUMMY_DATA.map((cafe, index) => {
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
        <Button className={classes.myLocationBtn} icon circular onClick={goToMyPosition}>
          <Icon name="map marker alternate" color="red" />
        </Button>
      )}
      </Map>
    </>
  )
}

export default MapDiv
