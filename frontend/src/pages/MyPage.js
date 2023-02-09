import { Grid } from "semantic-ui-react"

import MyPageItems from "../components/myPage/MyPageItems"
import Profile from "../components/myPage/Profile"
import Logout from "../components/member/logout/Logout"

import classes from "./MyPage.module.css"

const MyPage = () => {
  return (
    <div className={classes.wrapper}>
        <>
          <Grid divided="vertically" textAlign="center">
            <Profile />
            <MyPageItems />
            <Logout />
          </Grid>
        </>
    </div>
  )
}

export default MyPage
