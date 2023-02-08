// 로그인 페이지
import { useEffect } from "react"
import KakaoLogin from "../../components/member/login/KakaoLogin"
import { Image } from "semantic-ui-react"

const LoginPage = () => {
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        sessionStorage.setItem("location", JSON.stringify(location))

        const geocorder = new window.kakao.maps.services.Geocoder()
        const coord = new window.kakao.maps.LatLng(location.lat, location.lng)
        const callback = function (result, status) {
          if (status === "OK") {
            const address = `${result[0].address.region_1depth_name} ${result[0].address.region_2depth_name} ${result[0].address.region_3depth_name}`
            sessionStorage.setItem("address", address)
          }
        }

        geocorder.coord2Address(coord.getLng(), coord.getLat(), callback)
      })
    } else {
      console.log("X")
    }
  }, [])

  return (
    <div id="login-wrapper">
      <div style={{ display: "flex", alignItems: "center" }}>
        {/* <Image
          src={require("../../assets/icons/coffee_location_red.png")}
          size="small"
        /> */}
        <Image
          src={require("../../assets/icons/chat_bubble.png")}
          size="tiny"
        />
        <Image src={require("../../assets/icons/bean.png")} size="tiny" />
      </div>

      <Image
        src={require("../../assets/icons/kagongjoa_logo.png")}
        size="medium"
      />
      <h1 id="title">카공조아</h1>

      <KakaoLogin />
    </div>
  )
}

export default LoginPage
