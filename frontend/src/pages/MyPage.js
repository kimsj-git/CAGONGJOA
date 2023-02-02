import { Grid } from "semantic-ui-react"
import { Route, useLocation } from "react-router-dom"

import CafeAuth from "../components/certificate/cafeAuth/CafeAuth"
import MainPageItems from "../components/myPage/MainPageItems"
import Profile from "../components/myPage/Profile"
import StudyHistory from "../components/myPage/studyHistory/StudyHistory"
import MyBadge from "../components/myPage/myBadge/MyBadge"
import MyCafeBadge from "../components/myPage/myCafeBadge/MyCafeBadge"
import MyPost from "../components/myPage/myPost/MyPost"
import Settings from "../components/myPage/settingsPage/Settings"

const MyPage = () => {
  const location = useLocation()
  const isMyPage = location.pathname === "/mypage"

  return (
    <>
      {isMyPage && (
        <>
          <h1>My Page</h1>
          <Grid divided="vertically" textAlign="center">
            <Profile />
            <MainPageItems />
            <CafeAuth />
          </Grid>
        </>
      )}
      {!isMyPage &&
      <>
          <Route path="/mypage/study">
            <StudyHistory/>
          </Route>
          <Route path="/mypage/badge">
            <MyBadge />
          </Route>
          <Route path="/mypage/cafebadge">
            <MyCafeBadge/>
          </Route>
          <Route path="/mypage/mypost">
            <MyPost/>
          </Route>
          <Route path="/mypage/setting">
            <Settings/>
          </Route>
      </>
      
      }
    </>
  )
}

export default MyPage
