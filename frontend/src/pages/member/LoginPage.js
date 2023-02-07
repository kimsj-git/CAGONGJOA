// 로그인 페이지
import { useEffect } from "react"
import KakaoLogin from "../../components/member/login/KakaoLogin"

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
      <h1>카공조아</h1>
      <KakaoLogin />
    </div>
  )
}

export default LoginPage
