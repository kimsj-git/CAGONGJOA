import { useEffect, useState } from "react"
import { Map, MapMarker } from "react-kakao-maps-sdk"
import { Button, Image } from "semantic-ui-react"
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom"

import classes from "./MapDiv.module.css"
import MapCafeMarker from "./MapCafeMarker"
import MapCircle from "./MapCircle"
import { cafeActions, findMapCafeList } from "../../store/cafe"
import MapSpinner from "./MapSpinner"
import MapGoToPosition from "./MapGoToPosition"
import MapCafeFilterCarousel from "./MapCafeFilterCarousel"
import MapLookFeed from "./MapLookFeed"

const MapDiv = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const [center, setCenter] = useState({
    lat: JSON.parse(sessionStorage.getItem("location")).lat,
    lng: JSON.parse(sessionStorage.getItem("location")).lng,
  })
  const cafeList = useSelector((state) => state.cafe.mapCafeList)
  const cafeFilterList = useSelector((state) => state.cafe.mapCafeFilterList)
  const isFiltered = useSelector((state) => state.cafe.isFiltered)
  console.log(cafeFilterList)
  const [isMoved, setIsMoved] = useState(false)
  const [isFinded, setIsFinded] = useState(true)

  useEffect(() => {
    dispatch(
      findMapCafeList({
        lat: JSON.parse(sessionStorage.getItem("location")).lat,
        lng: JSON.parse(sessionStorage.getItem("location")).lng,
        distance: 0.3,
      })
    )
  }, [dispatch])

  const findCafeList = async () => {
    dispatch(
      findMapCafeList({ lat: center.lat, lng: center.lng, distance: 0.3 })
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
        console.log("X")
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
        <Button
          className={classes.myLocationBtn}
          icon
          circular
          onClick={goToMyPosition}
        >
          <Image src={require("../../assets/icons/kagongjoa_logo.png")} />
        </Button>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
            position: "absolute",
            top: "2rem",
            left: "0",
          }}
        >
          {!isFinded && (
            <Button
              className={classes.findCafeBtn}
              circular
              onClick={findCafeList}
              size="huge"
              content="현재 위치에서 카페 찾기"
            />
          )}
          <MapLookFeed lat={center.lat} lng={center.lng} />
        </div>
        <MapCafeFilterCarousel className={classes.filterCorousel} />
        <MapSpinner />
      </Map>
    </>
  )
}

export default MapDiv
