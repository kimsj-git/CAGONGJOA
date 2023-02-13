import { useState } from "react"
import { MapMarker } from "react-kakao-maps-sdk"
import { useHistory } from "react-router-dom"
import MapCafeDetial from "./MapCafeDetail"
import GetCafeDetail from "./GetCafeDetail"

const JAMLIST = {
  H: "coffee_location_red",
  M: "coffee_location_yellow",
  L: "coffee_location_green",
}

const MapCafeMarker = (props) => {
  
  const [isOpen, setIsOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [cafeDetail, setCafeDetail] = useState({})

  // 지도 마커 올렸을 때 이름 hover 생성
  const hoverOpenHandler = () => {
    setIsOpen(true)
  }
  const hoverCloseHandler = () => {
    setIsOpen(false)
  }

  const cafeDetailOpenHandler = async () => {
    setIsModalOpen(true)
    setIsLoading(true)
    const cafeDetail = await GetCafeDetail({lat:props.lat, lng:props.lng})
    setCafeDetail(cafeDetail)
    setIsLoading(false)
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
          src:
            props.crowdLevel !== null
              ? require(`../../assets/icons/${JAMLIST[props.crowdLevel]}.png`)
              : require(`../../assets/icons/coffee_location_grey.png`),
          size: { width: 25, height: 30 },
          options: {
            offset: {
              x: 12,
              y: 25,
            },
          },
        }}
      >
        {isOpen && (
          <div className="info" style={{ padding: "5px", fontSize: "10px" }}>
            {props.name}
          </div>
        )}
      </MapMarker>

      <MapCafeDetial
        open={isModalOpen}
        closeHandler={cafeDetailCloseHandler}
        name={props.name}
        crowdLevel={props.crowdLevel}
        address={props.address}
        cafeDetail = {cafeDetail}
      />
    </>
  )
}

export default MapCafeMarker
