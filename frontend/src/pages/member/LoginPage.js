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
    <Grid id="login-wrapper" centered>
      <Grid.Column mobile={16} tablet={14} computer={14}>
        <Grid columns={2} stackable>

          <Grid.Column mobile={10} tablet={7} computer={8} textAlign="center">
          <div className="map-box">

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
           <div className="circle"></div>
          <div className="circle" style={{ animationDelay: "0s" }}></div>

          <div className="circle" style={{ animationDelay: "1s" }}></div>

          <div className="circle" style={{ animationDelay: "2s" }}></div>
          <div className="circle" style={{ animationDelay: "3s" }}></div>

         </div>
          </Grid.Column>
          <Grid.Column id="mobile-only" only="mobile" mobile={8} verticalAlign="middle" textAlign="center">
            <Grid verticalAlign="middle">

            <Grid.Row>
              <div style={{ display: "flex" }}>
                <p className="title">카공조아</p>
                <Image
                  className="chat-bubble"
                  src={require("../../assets/icons/chat_bubble_right.png")}
                  style={{
                    width: "6rem",
                    height: "5rem",
                    display: "inline-block",
                  }}
                />
              </div>
            </Grid.Row>
            <Grid.Row><p className="subtitle">내 주변 카페 이용객들과 소통해보세요!</p></Grid.Row>
            <Grid.Row><KakaoLogin style={{ fontSize: "10rem" }} /></Grid.Row>
            </Grid>
          
        
        
          </Grid.Column>

          <Grid.Column id="computer-only" only="computer tablet" tablet={8} computer={8} verticalAlign="middle" textAlign="left">
            <Grid verticalAlign="middle">

            <Grid.Row>
              <div style={{ display: "flex" }}>
                <p className="title">카공조아</p>
                <Image
                  className="chat-bubble"
                  src={require("../../assets/icons/chat_bubble_right.png")}
                  style={{
                    width: "6rem",
                    height: "5rem",
                    display: "inline-block",
                  }}
                />
              </div>
            </Grid.Row>
            <Grid.Row><p className="subtitle">내 주변 카페 이용객들과 소통해보세요!</p></Grid.Row>
            <Grid.Row><KakaoLogin style={{ fontSize: "10rem" }} /></Grid.Row>
            </Grid>
          
        
        
          </Grid.Column>
        </Grid>


      </Grid.Column>
    </Grid>
  )
}

export default LoginPage
