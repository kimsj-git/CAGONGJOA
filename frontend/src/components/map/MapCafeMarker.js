import { useState } from "react"
import { MapMarker } from "react-kakao-maps-sdk"

import MapCafeDetial from "./MapCafeDetail"

const MapCafeMarker = (props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const hoverOpenHandler = (e) => {
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
      >
        {isOpen && (
          <div className="info" style={{ padding:"5px", fontSize:"10px" }}>{props.name}</div>
        )}
      </MapMarker>

      <MapCafeDetial
        open={isModalOpen}
        closeHandler = {cafeDetailCloseHandler}
        name={props.name}
        crowdValue={props.crowdValue}
        address={props.address}
      />
    </>
  )
}

export default MapCafeMarker
