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
import Logout from "../components/member/logout/Logout"

import classes from "./MyPage.module.css"
import BlockList from "../components/myPage/settingsPage/BlockList"

const MyPage = () => {
  const location = useLocation()
  const isMyPage = location.pathname === "/mypage"

  return (
    <div className={classes.wrapper}>
      {isMyPage && (
        <>
          <Grid divided="vertically" textAlign="center">
            <Profile />
            <Logout/>
            <MainPageItems />
            <CafeAuth />
          </Grid>
        </>
      )}
      {!isMyPage && (
        <>
          <Route path="/mypage/study">
            <StudyHistory />
          </Route>
          <Route path="/mypage/badge">
            <MyBadge />
          </Route>
          <Route path="/mypage/cafebadge">
            <MyCafeBadge />
          </Route>
          <Route path="/mypage/mypost">
            <MyPost />
          </Route>
          <Route path="/mypage/setting" exact>
            <Grid divided="vertically" textAlign="center">
              <Settings />
            </Grid>
          </Route>
          <Route path="/mypage/setting/blocklist">
            <Grid divided="vertically" textAlign="center">
              <BlockList />
            </Grid>
          </Route>
        </>
      )}
    </div>
  )
}

export default MyPage
