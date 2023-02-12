import { Grid } from "semantic-ui-react"

import MyPageItems from "../components/myPage/MyPageItems"
import Profile from "../components/myPage/Profile"
import Logout from "../components/member/logout/Logout"

import classes from "./MyPage.module.css"

const MyPage = ({setIsAuthenticated, setIsCafeAuth}) => {
  return (
    <div className={classes.wrapper}>
        <>
          <Grid divided="vertically" textAlign="center">
            <Profile />
            <MyPageItems />
            <Logout setIsAuthenticated={setIsAuthenticated} setIsCafeAuth={setIsCafeAuth}/>
          </Grid>
        </>
    </div>
  )
}

export default MyPage
