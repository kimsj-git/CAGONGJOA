import { useCallback, useEffect } from "react"
import { Route, Switch } from "react-router-dom"
import KakaoLoginGetCode from "./components/member/login/KakakLoginGetCode"
import Layout from "./layout/Layout"

import LoginPage from "./pages/member/LoginPage"
import SignupPage from "./pages/member/SignupPage"
import MainPage from "./pages/MainPage"
import ChatPage from "./pages/ChatPage"
import TodayCafe from "./components/todayCafe/TodayCafe"
import MakeCoffee from "./components/todayCafe/MakeCoffee"
import Fortune from "./components/todayCafe/Fortune"
import MyPage from "./pages/MyPage"
import NotFound from "./pages/NotFound"

function App() {

  const getLocation = useCallback(() => {
    if (navigator.geolocation) {
      // GeoLocation을 이용해서 접속 위치를 얻어옵니다
      navigator.geolocation.getCurrentPosition(
        (position) => {
              sessionStorage.setItem('lat', position.coords.latitude) // 위도
              sessionStorage.setItem('lng', position.coords.longitude) // 경도
        })}
    else {
      // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
      console.log("X")
      }
    }, [])

  useEffect(() => {
    getLocation()
  }, [getLocation])

  return (
    <Layout>
      <Switch>
        {/* Navigation 관련 ROUTE*/}
        <Route path="/chat" exact>
          <ChatPage />
        </Route>
        <Route path="/today-cafe" exact>
          <TodayCafe />
        </Route>
        <Route path="/mypage">
          <MyPage />
        </Route>

        {/* Login 관련 ROUTE */}
        <Route path="/login" exact>
          <LoginPage />
        </Route>
        <Route path="/oauth/kakao">
          <KakaoLoginGetCode />
        </Route>
        <Route path="/signup">
          <SignupPage />
        </Route>

        {/* TodayCafe 관련 ROUTE */}
        <Route path="/today-cafe/make-coffee" exact>
          <MakeCoffee />
        </Route>
        <Route path="/today-cafe/fortune" exact>
          <Fortune />
        </Route>

        {/* MainPage Route */}
        <Route path="/">
          <MainPage />
        </Route>

        {/* NotFound 페이지*/}
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Layout>
  )
}

export default App
