import { useState, useMemo, useRef, useEffect } from "react"
import { useHistory } from "react-router-dom"
import { Route, Switch } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { timerActions } from "./store/timer"
import { Grid } from "semantic-ui-react"

import MapPage from "./pages/MapPage"
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
import SearchPage from "./pages/SearchPage"
import NotFound from "./pages/NotFound"
import ErrorPage from "./pages/ErrorPage"
import StudyHistory from "./components/myPage/studyHistory/StudyHistory"
import MyCafeBadge from "./components/myPage/myCafeBadge/MyCafeBadge"
import MyFeedPage from "./components/myPage/myPost/MyFeedPage"
import Settings from "./components/myPage/settingsPage/Settings"
import BlockList from "./components/myPage/settingsPage/BlockList"

function App() {
  // 바로 로그인 화면으로
  const history = useHistory()
  const Authenticated = sessionStorage.getItem("accessToken")
  
  useEffect(()=>{
    if (!Authenticated || Authenticated === undefined){
      history.push('/login')
    }
  }, [])


  // 위치인증 되면 오늘의 카페 타이머 시작
  const cafeAuth = sessionStorage.getItem("cafeAuth")
  const dispatch = useDispatch()
  const accTime = useSelector((state) => state.timer.accTime)
  const addTimeHandler = () => {
    dispatch(timerActions.update(1))
  }

  const time = useRef(0)
  useEffect(() => {
    if (cafeAuth === 1) {
      const intervalId = setInterval(() => {
        time.current += 1
        if (time.current % 60 === 0) {
          // 1분마다 시간 업데이트..
          addTimeHandler()
        }
      }, 1000)
      return () => clearInterval(intervalId)
    }
  }, [time, cafeAuth])

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
        <Route path="/mypage" exact>
          <MyPage />
        </Route>
        <Route path="/search" exact>
          <SearchPage />
        </Route>

        {/* Login 관련 ROUTE */}
        <Route path="/login" exact>
          <LoginPage />
        </Route>
        <Route path="/oauth/kakao">
          <KakaoLoginGetCode />
        </Route>
        <Route path="/signup" exact>
          <SignupPage />
        </Route>

        {/* TodayCafe 관련 ROUTE */}
        <Route path="/today-cafe/make-coffee" exact>
          <MakeCoffee />
        </Route>
        <Route path="/today-cafe/fortune" exact>
          <Fortune />
        </Route>

        {/* MyPage 관련 ROUTE */}
        <Route path="/mypage/study" exact>
          <StudyHistory />
        </Route>
        <Route path="/mypage/cafebadge" exact>
          <MyCafeBadge />
        </Route>
        <Route path="/mypage/feed" exact>
          <MyFeedPage />
        </Route>
        <Route path="/mypage/setting" exact>
          <Grid divided="vertically" textAlign="center">
            <Settings />
          </Grid>
        </Route>
        <Route path="/mypage/setting/blocklist" exact>
          <BlockList />
        </Route>

        {/* Error 페이지 */}
        <Route path="/error" exact>
          <ErrorPage />
        </Route>

        {/* MainPage Route */}
        <Route path="/" exact>
          <MainPage />
        </Route>
        <Route path="/map" exact>
          <MapPage/>
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
