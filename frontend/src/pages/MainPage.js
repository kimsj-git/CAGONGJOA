import { Fragment } from "react"

import MainPageTopBar from "../components/member/mainPage/MainPageTopBar"
import PostList from "../components/member/mainPage/PostList"

const MainPage = () => {
  return <Fragment>
    <MainPageTopBar/>
    <PostList/>
  </Fragment>
}

export default MainPage