import { useState, useMemo, useRef, useEffect } from "react"
import { useHistory } from "react-router-dom"
import { Route, Switch } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { timerActions } from "./store/timer"
import { Grid } from "semantic-ui-react"

import AuthRoute from "./AuthRoute"
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
import useFetch from "./hooks/useFetch"
const DEFAULT_REST_URL = process.env.REACT_APP_REST_DEFAULT_URL

function App() {
  // 바로 로그인 화면으로
  const history = useHistory()
  const Authenticated = sessionStorage.getItem("accessToken")
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem("accessToken")
  )
  const [isCafeAuth, setIsCafeAuth] = useState(
    sessionStorage.getItem("cafeAuth")
  )
  const [isJamSurvey, setIsJamSurvey] = useState(
    JSON.parse(sessionStorage.getItem("todayCafe")) ? JSON.parse(sessionStorage.getItem("todayCafe")).isCrowdSubmitted : false
  )

  useEffect(() => {
    if (!Authenticated || Authenticated === undefined) {
      history.push("/login")
    }
  }, [Authenticated])

  // 위치 인증되면 최초 1회 누적시간 가져오기
  const { sendRequest: getAccTime } = useFetch()
  const time = useRef(0)
  useEffect(() => {
    if (isCafeAuth === 1) {
      const fetchData = async () => {
        const { data } = await getAccTime({
          url: `${DEFAULT_REST_URL}/cafe/auth/data`,
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        })
        time.current = data.accTime
      }
      fetchData()
    }
  }, [isCafeAuth])

  // 1분마다 시간경과 요청 보내기
  const { sendRequest: sendTime } = useFetch()
  useEffect(() => {
    if (isCafeAuth === 1) {
      const intervalId = setInterval(async () => {
        const { data } = await sendTime({
          url: `${DEFAULT_REST_URL}/todaycafe/main/addtime`,
          method: "PUT",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        })
        time.current = data.accTime
      }, 60000) // 1 minute
      return () => clearInterval(intervalId)
    }
  }, [isCafeAuth, time.current])

  return (
    <Layout
      isCafeAuth={isCafeAuth}
      setIsCafeAuth={setIsCafeAuth}
      setIsJamSurvey={setIsJamSurvey}
    >
      <Switch>
        {/* Navigation 관련 ROUTE*/}
        <AuthRoute component={ChatPage} path="/chat" exact/>
        <AuthRoute component={TodayCafe} path="/today-cafe" exact/>
        <Route path="/mypage" component={MyPage} exact>
          <MyPage
            setIsAuthenticated={setIsAuthenticated}
            setIsCafeAuth={setIsCafeAuth}
            isCafeAuth={isCafeAuth}
          />
        </Route>
        <AuthRoute path="/search" component={SearchPage} exact/>

        {/* Login 관련 ROUTE */}
        <Route path="/login" component={LoginPage} exact/>
        <Route path="/oauth/kakao">
          <KakaoLoginGetCode setIsAuthenticated={setIsAuthenticated} />
        </Route>
        <Route path="/signup" exact>
          <SignupPage setIsAuthenticated={setIsAuthenticated} />
        </Route>

        {/* TodayCafe 관련 ROUTE */}
        <AuthRoute path="/today-cafe/make-coffee" component={MakeCoffee} exact/>
        <AuthRoute path="/today-cafe/fortune" component={Fortune} exact/>

        {/* MyPage 관련 ROUTE */}
        <AuthRoute path="/mypage/study" component={StudyHistory} exact/>
        <AuthRoute path="/mypage/cafebadge" component={MyCafeBadge} exact/>
        <AuthRoute path="/mypage/feed" component={MyFeedPage} exact/>
        <AuthRoute path="/mypage/setting" exact>
          <Grid divided="vertically" textAlign="center">
            <Settings />
          </Grid>
        </AuthRoute>

        {/* Error 페이지 */}
        <AuthRoute path="/error" component={ErrorPage} exact/>

        {/* MainPage Route */}
        <Route path="/" exact>
          <MainPage
            isAuthenticated={isAuthenticated}
            isCafeAuth={isCafeAuth}
            isJamSurvey={isJamSurvey}
            setIsJamSurvey={setIsJamSurvey}
          />
        </Route>
        <AuthRoute path="/map" component={MapPage} exact/>

        {/* NotFound 페이지*/}
        <Route path="*" component={NotFound}/>
      </Switch>
    </Layout>
  )
}

export default App
