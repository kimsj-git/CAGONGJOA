import { Circle } from "react-kakao-maps-sdk"
const MapCircle = (props) => {
    return (
        <Circle
        center={{
          lat: props.lat,
          lng: props.lng,
        }}
        radius={500}
        strokeWeight={1} // 선의 두께입니다
        strokeColor={"#FF0000"} // 선의 색깔입니다
        strokeOpacity={1} // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
        strokeStyle={"basic"} // 선의 스타일 입니다
        fillColor={"#D12424"} // 채우기 색깔입니다
        fillOpacity={0.1} // 채우기 불투명도 입니다
      />
    )
}

export default MapCircle