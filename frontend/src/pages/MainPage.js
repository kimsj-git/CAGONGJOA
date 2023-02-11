import { Fragment, useEffect } from "react"

import useFetch from "../hooks/useFetch.js"
import CafeAuthFetch from "../components/certificate/cafeAuth/CafeAuthFetch"

import { useDispatch, useSelector } from "react-redux"
import { postsActions } from "../store/posts"

import { Grid } from "semantic-ui-react"

import MainPageTopBar from "../components/mainPage/MainPageTopBar"
import PostList from "../components/mainPage/PostList"
import JamSurvey from "../components/mainPage/JamSurvey"

const MainPage = () => {
  const isAuthenticated = sessionStorage.getItem("cafeAuth")

  // 엑세스 토큰이 없을 때 login화면으로 이동
  // if (!sessionStorage.getItem('accessToken')){
  //   history.push('/login')
  // }

  return (
    <Fragment>
      <Grid>
        <Grid.Column width={16}>
          <MainPageTopBar isAuthenticated={isAuthenticated} />
        </Grid.Column>
        <Grid.Column width={16}>
          <JamSurvey />
        </Grid.Column>
        {/* <Grid.Column width={16}>
          <PostTypeCarousel />
        </Grid.Column> */}
        <Grid.Column width={16}>
          <div>
            <PostList />
          </div>
        </Grid.Column>
      </Grid>
    </Fragment>
  )
}

export default MainPage
