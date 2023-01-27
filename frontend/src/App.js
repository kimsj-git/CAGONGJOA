import { Route, Switch, Redirect } from "react-router-dom"
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
  return (
    <Layout>
      <Switch>
        {/* Navigation 관련 ROUTE*/}
        <Route path="/" exact>
          <MainPage />
          {/* <Redirect to="/login" /> */}
        </Route>
        <Route path="/chat" exact>
          <ChatPage />
        </Route>
        <Route path="/today-cafe" exact>
          <TodayCafe />
        </Route>
        <Route path="/mypage" exact>
          <MyPage />
        </Route>

        {/* Login 관련 ROUTE */}
        <Route path="/login" exact>
          <LoginPage />
        </Route>
        <Route path="/oauth/kakao/callback">
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

        {/* NotFound 페이지*/}
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Layout>
  )
}

export default App
