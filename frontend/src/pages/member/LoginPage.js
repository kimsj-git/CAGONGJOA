// 로그인 페이지
import { useEffect } from "react"
import { Transition, Grid } from "semantic-ui-react"
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
    <Grid id="login-wrapper" stackable columns={2} textAlign="center">
      <Grid.Column width={6}>
        <div className="map-box">
          <div className="circular-border" style={{ top: "-15%", left: "-20%" }} />
          <div
            className="circular-border"
            style={{ top: "25%", left: "-15%" }}
          />
          <div
            className="circular-border"
            style={{ top: "10%", left: "50%" }}
          />
          <div
            className="circular-border"
            style={{ top: "20%", left: "25%" }}
          />
          <Image className="map" src={require("../../assets/map5.jpg")} />
          <Image
            className="map-marker"
            src={require("../../assets/icons/coffee_location_red.png")}
            style={{
              top: "15%",
              left: "65%",
              animation: "float 4s ease-in-out infinite",
              animationDelay: "1s",
            }}
          />
          <Image
            className="map-marker"
            src={require("../../assets/icons/coffee_location_yellow.png")}
            style={{
              top: "70%",
              left: "50%",
              animation: "float 4s ease-in-out infinite",
              animationDelay: "2s",
            }}
          />
          <Image
            className="map-marker"
            src={require("../../assets/icons/coffee_location_green.png")}
            style={{
              top: "25%",
              left: "12%",
              animation: "float 4s ease-in-out infinite",
              animationDelay: "3s",
            }}
          />
          <Image
            className="map-marker"
            src={require("../../assets/icons/kagongjoa_logo.png")}
            style={{
              top: "35%",
              left: "35%",
              width: "30%",
              height: "30%",
            }}
          />
          <div class="circle"></div>
          <div class="circle" style={{ animationDelay: "0s" }}></div>
          <div class="circle" style={{ animationDelay: "1s" }}></div>
          <div class="circle" style={{ animationDelay: "2s" }}></div>
          <div class="circle" style={{ animationDelay: "3s" }}></div>
        </div>
      </Grid.Column>
      <Grid.Column
        width={6}
        textAlign="left"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "60%",
          // padding: "2rem 0 2rem 10rem ",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex" }}>
          <p class="title">카공조아</p>
          
            <Image
            className="chat-bubble"
              src={require("../../assets/icons/chat_bubble_right.png")}
              style={{
                width: "6rem",
                height: "5rem",
                // marginBottom
                // top: "-80%",
                // right: "-40%",
                display: "inline-block",
                // position: "absolute",
                // animation: "float 6s ease-in-out infinite",
              }}
            />
        </div>
        <p className="subtitle">내 주변 카페 이용객들과 소통해보세요!</p>
        <KakaoLogin style={{ fontSize: "10rem" }} />
      </Grid.Column>
    </Grid>
  )
}

export default LoginPage
