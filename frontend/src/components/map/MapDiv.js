import { useEffect, useState } from "react"
import { Map, MapMarker } from "react-kakao-maps-sdk"
import { Button, Popup } from "semantic-ui-react"
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom"

import "./MapDiv.css"
import MapCafeMarker from "./MapCafeMarker"
import MapCircle from "./MapCircle"
import { cafeActions, findMapCafeList } from "../../store/cafe"
import MapSpinner from "./MapSpinner"
import MapGoToPosition from "./MapGoToPosition"
import MapCafeFilterCarousel from "./MapCafeFilterCarousel"
import MapLookFeed from "./MapLookFeed"
import { MdOutlineMyLocation } from "react-icons/md"

const MapDiv = (props) => {
  const history = useHistory()
  const dispatch = useDispatch()
  const [center, setCenter] = useState({
    lat: JSON.parse(sessionStorage.getItem("location")).lat,
    lng: JSON.parse(sessionStorage.getItem("location")).lng,
  })
  const cafeList = useSelector((state) => state.cafe.mapCafeList)
  const cafeFilterList = useSelector((state) => state.cafe.mapCafeFilterList)
  const isFiltered = useSelector((state) => state.cafe.isFiltered)
  const [isMoved, setIsMoved] = useState(false)
  const [isFinded, setIsFinded] = useState(true)

  useEffect(() => {
    dispatch(
      findMapCafeList({
        lat: JSON.parse(sessionStorage.getItem("location")).lat,
        lng: JSON.parse(sessionStorage.getItem("location")).lng,
        distance: 0.5,
      })
    )
  }, [dispatch])

  const findCafeList = async () => {
    dispatch(
      findMapCafeList({ lat: center.lat, lng: center.lng, distance: 0.5 })
    )
    dispatch(cafeActions.findCafeList())
    setIsFinded(true)
  }

  const dragHandler = () => {
    setIsMoved(true)
    setIsFinded(false)
  }

  const goToMyPosition = async () => {
    const response = await MapGoToPosition()
    if (response === "UNAUTHORIZED CAFE") {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          sessionStorage.setItem("location", JSON.stringify(location))
          setCenter({
            lat: location.lat,
            lng: location.lng,
          })
        })
      } else {
        window.location.href = "/error"
      }
    } else if (response === "AUTHORIZED CAFE") {
      const location = {
        lat: JSON.parse(sessionStorage.getItem("myCafe")).lat,
        lng: JSON.parse(sessionStorage.getItem("myCafe")).lng,
      }
      sessionStorage.setItem("location", JSON.stringify(location))
      setCenter({
        lat: location.lat,
        lng: location.lng,
      })
    } else if (response === "SESSION FINISH") {
      history.push("/login")
    }
    setIsMoved(false)
    setIsFinded(false)
  }

  return (
    <div>
      <Map
        center={{ lat: center.lat, lng: center.lng }}
        level={4}
        onCenterChanged={(map) =>
          setCenter({
            lat: map.getCenter().getLat(),
            lng: map.getCenter().getLng(),
          })
        }
        onDragEnd={dragHandler}
        className="map"
      >
        <MapMarker
          position={{ lat: center.lat, lng: center.lng }}
          image={{
            src: require("../../assets/icons/mylocation.png"),
            size: { width: 40, height: 50 },
            options: {
              offset: {
                x: 10,
                y: 40,
              },
            },
          }}
        />
        {isFiltered &&
          cafeFilterList &&
          cafeFilterList.length > 0 &&
          cafeFilterList.map((cafe, index) => {
            return (
              <MapCafeMarker
                key={cafe.id}
                lat={cafe.latitude}
                lng={cafe.longitude}
                name={cafe.name}
                crowdLevel={cafe.crowdLevel}
                address={cafe.address}
              />
            )
          })}
        {!isFiltered &&
          cafeList &&
          cafeList.length > 0 &&
          cafeList.map((cafe, index) => {
            return (
              <MapCafeMarker
                key={index}
                lat={cafe.latitude}
                lng={cafe.longitude}
                name={cafe.name}
                crowdLevel={cafe.crowdLevel}
                address={cafe.address}
              />
            )
          })}
        <MapCircle lat={center.lat} lng={center.lng} />
        <Popup
          trigger={
            <MdOutlineMyLocation
              size="40"
              circular
              color="red"
              onClick={goToMyPosition}
              className="myLocationBtn"
            />
          }
          content="내 위치로 이동하기"
          position="bottom right"
          inverted
        />

        <div id="map-btns-box">
          <Button
            className="findCafeBtn"
            // circular
            onClick={findCafeList}
            // size="huge"
            fluid
            content="이 근처 카페 찾기"
            disabled={isFinded}
          />

          <MapLookFeed lat={center.lat} lng={center.lng} />
        </div>

        <MapCafeFilterCarousel className="filterCorousel" />
        <MapSpinner />
      </Map>
    </div>
  )
}

export default MapDiv
