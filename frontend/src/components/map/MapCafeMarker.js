import { useState } from "react"
import { MapMarker } from "react-kakao-maps-sdk"

import MapCafeDetial from "./MapCafeDetail"

const JAMLIST = {"H":"coffee_location_red", "M":"coffee_location_yellow", "L":"coffee_location_green"}
const MapCafeMarker = (props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const hoverOpenHandler = () => {
    setIsOpen(true)
  }
  const hoverCloseHandler = () => {
    setIsOpen(false)
  }

  const cafeDetailOpenHandler = () => {
    setIsModalOpen(true)
  }
  const cafeDetailCloseHandler = () => {
    setIsModalOpen(false)
  }
  return (
    <>
      <MapMarker
        position={{ lat: props.lat, lng: props.lng }}
        clickable={true}
        onClick={cafeDetailOpenHandler}
        onMouseOver={hoverOpenHandler}
        onMouseOut={hoverCloseHandler}
        image={{
          src: props.crowdLevel !== null ? require(`../../assets/icons/${JAMLIST[props.crowdLevel]}.png`) : require(`../../assets/icons/coffee_location_grey.png`),
          size: { width: 25, height: 30 },
          options:{
            offset:{
              x:12,
              y:25,
            }
          }
        }}
      >
        {isOpen && (
          <div className="info" style={{ padding:"5px", fontSize:"10px" }}>{props.name}</div>
        )}
      </MapMarker>

      <MapCafeDetial
        open={isModalOpen}
        closeHandler = {cafeDetailCloseHandler}
        name={props.name}
        crowdLevel={props.crowdLevel}
        address={props.address}
      />
    </>
  )
}

export default MapCafeMarker
