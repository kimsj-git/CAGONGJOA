import { Divider, Grid } from "semantic-ui-react"

import MyPageItems from "../components/myPage/MyPageItems"
import Profile from "../components/myPage/Profile"

import "./MyPage.css"

const MyPage = ({ setIsAuthenticated, setIsCafeAuth }) => {
  return (
    <div className="mypage-wrapper">
      <>
        {/* <Grid divided="vertically" textAlign="center"> */}
        <Profile />
        <Divider />
        <MyPageItems
          setIsAuthenticated={setIsAuthenticated}
          setIsCafeAuth={setIsCafeAuth}
        />
        {/* </Grid> */}
      </>
    </div>
  )
}

export default MyPage
