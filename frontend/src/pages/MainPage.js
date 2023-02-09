import { useState, useCallback, Fragment, useEffect } from "react"
import MainPageTopBar from "../components/mainPage/MainPageTopBar"
import PostList from "../components/mainPage/PostList"
import useFetch from "../hooks/useFetch.js"
import CafeAuthFetch from "../components/certificate/cafeAuth/CafeAuthFetch"
import { useDispatch, useSelector } from "react-redux"
import { postsActions } from "../store/posts"

import { Grid } from "semantic-ui-react"
import JamSurvey from "../components/mainPage/JamSurvey"
const DEFAULT_REST_URL = process.env.REACT_APP_REST_DEFAULT_URL
const DIST = 0.5

const MainPage = () => {
  const dispatch = useDispatch()
  const posts = useSelector((state) => state.posts.posts)
  const filterState = useSelector((state) => state.posts.filterState)
  const { data: fetchedPosts, isLoading, sendRequest: getPosts } = useFetch()
  const isAuthenticated = sessionStorage.getItem("cafeAuth")
  let feed = (
    <div>
      <p>주변 카페 게시물을 찾지 못했습니다...</p>
      <p>위치를 변경해보세요.</p>
    </div>
  )

  useEffect(() => {
    CafeAuthFetch()
    const filters = Object.entries(filterState)
      .filter(([key, value]) => value === true)
      .map(([key, value]) => key)
    async function refreshPosts() {
      if (!sessionStorage.getItem("location")) {
        await getPosts({
          url: `${DEFAULT_REST_URL}/main/post/feed`,
          method: "POST",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
          body: {
            postId: -1,
            types: filters
              ? filters
              : ["free", "qna", "together", "tip", "recommend", "help", "lost"],
            latitude: JSON.parse(sessionStorage.getItem("location")).lat,
            longitude: JSON.parse(sessionStorage.getItem("location")).lng,
            dist: DIST,
          },
        })
        await dispatch(postsActions.updatePosts(fetchedPosts))
        console.log(fetchedPosts)
      }
    }
    refreshPosts()
  }, [filterState])

  // API 연결 후 DUMMY_POSTS를 posts로 변경
  if (posts.length > 0) {
    feed = <PostList isLoading={isLoading} posts={posts} />
  }

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
        <Grid.Column width={16}>{feed}</Grid.Column>
      </Grid>
    </Fragment>
  )
}

export default MainPage
