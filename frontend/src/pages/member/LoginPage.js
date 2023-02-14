// 로그인 페이지
import { useEffect } from "react"
import KakaoLogin from "../../components/member/login/KakaoLogin"
import { Image } from "semantic-ui-react"
import "./LoginPage.css"

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
      {/* <div style={{ display: "flex", alignItems: "center" }}> */}
      {/* <Image
          src={require("../../assets/icons/coffee_location_red.png")}
          size="small"
        /> */}
      {/* <Image
          src={require("../../assets/icons/chat_bubble.png")}
          size="tiny"
        />
        <Image src={require("../../assets/icons/bean.png")} size="tiny" />
      </div> */}
      <div className="map-box">
        <div className="circular-border" style={{ top: "-5%", left: "-10%" }} />
        <div className="circular-border" style={{ top: "30%", left: "-15%" }} />
        <div className="circular-border" style={{ top: "-10%", left: "30%" }} />
        <div className="circular-border" style={{ top: "30%", left: "30%" }} />
        <Image className="map" src={require("../../assets/map5.jpg")} />
        <Image
          src={require("../../assets/icons/coffee_location_red.png")}
          size="small"
          style={{
            position: "absolute",
            top: "10%",
            left: "10%",
          }}
        />
        <Image
          src={require("../../assets/icons/coffee_location_yellow.png")}
          size="small"
          style={{
            position: "absolute",
            top: "20%",
            left: "20%",
          }}
        />
        <Image
          src={require("../../assets/icons/coffee_location_green.png")}
          size="small"
          style={{
            position: "absolute",
            top: "30%",
            left: "30%",
          }}
        />
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
