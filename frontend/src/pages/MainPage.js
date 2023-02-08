import { useState, useCallback, Fragment, useEffect } from "react"
import { Route, useLocation, useHistory } from "react-router"
import MainPageTopBar from "../components/mainPage/MainPageTopBar"
import PostList from "../components/mainPage/PostList"
import MapDiv from "../components/map/MapDiv"
import useFetch from "../hooks/useFetch.js"
import CafeAuthFetch from "../components/certificate/cafeAuth/CafeAuthFetch"
import { Grid } from "semantic-ui-react"
import JamSurvey from "../components/mainPage/JamSurvey"
const DEFAULT_REST_URL = process.env.REACT_APP_REST_DEFAULT_URL
const DIST = 0.5
// API 연결 후 DUMMY_POSTS 삭제
const DUMMY_POSTS = [
  {
    key: 1,
    id: 1,
    author: "서정",
    createdAt: "2023-02-06T01:31:06",
    type: "free",
    content:
      "이름을 하나에 별빛이 아직 동경과 아이들의 시와 했던 봅니다. 이름과, 사랑과 무엇인지 이름을 그러나 내일 버리었습니다. 피어나듯이 보고, 어머니, 별 이름을 마리아 내일 별 봅니다.\n\n비둘기, 피어나듯이 나는 이네들은 걱정도 가득 까닭입니다. 별 이제 같이 있습니다. 프랑시스 다하지 남은 이름과, 있습니다.",
    images:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1178&q=80",
    likeCnt: 4,
    commentCnt: 1,
    isLoading: false,
  },
  {
    key: 2,
    id: 2,
    author: "경희",
    content: "게시물222",
    createdAt: "2023-02-06T01:31:06",
    type: "together",
    images:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1178&q=80",
    likeCnt: 6,
    commentCnt: 10,
    isLoading: false,
  },
  {
    id: "p3",
    author: "현철",
    content: "게시물333",
    createdAt: "2023-02-06T01:31:06",
    type: "qna",
    images:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1178&q=80",
    likeCnt: 99,
    commentCnt: 25,
    isLoading: false,
  },
  {
    id: "p4",
    author: "종섭",
    content: "게시물444",
    createdAt: "2023-02-06T01:31:06",
    type: "lost",
    images:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1178&q=80",
    likeCnt: 99,
    commentCnt: 25,
    isLoading: true,
  },
  {
    id: "p5",
    author: "준모",
    content: "게시물555",
    createdAt: "2023-02-06T01:31:06",
    type: "tip",
    images:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1178&q=80",
    likeCnt: 99,
    commentCnt: 25,
    isLoading: true,
  },
  {
    id: "p6",
    author: "현철",
    content: "게시물666",
    createdAt: "2023-02-06T01:31:06",
    type: "recommend",
    likeCnt: 99,
    images:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1178&q=80",
    commentCnt: 25,
    isLoading: true,
  },
]

const MainPage = () => {
  const history = useHistory()
  const location = useLocation()
  const isMap = location.pathname === "/map"
  const { data: posts, isLoading, sendRequest: getPosts } = useFetch()
  const isAuthenticated = sessionStorage.getItem("cafeAuth")
  let feed = (
    <div>
      <p>주변 카페 게시물을 찾지 못했습니다...</p>
      <p>위치를 변경해보세요.</p>
    </div>
  )

  useEffect(() => {
    CafeAuthFetch()
    getPosts({
      url: `${DEFAULT_REST_URL}/main/post/feed`,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
      body: {
        postId: -1,
        type: ["free", "qna", "together", "tip", "recommend", "help", "lost"],
        latitude: JSON.parse(sessionStorage.getItem("location")).lat,
        longitude: JSON.parse(sessionStorage.getItem("location")).lng,
        dist: DIST,
      },
    })
  }, [])

  // API 연결 후 활성화
  // useEffect(() => {
  //   fetchPostsHandler()
  // }, [fetchPostsHandler])

  // API 연결 후 DUMMY_POSTS를 posts로 변경
  if (DUMMY_POSTS.length > 0) {
    feed = <PostList isLoading={isLoading} posts={DUMMY_POSTS} />
    // if (posts.length) {
    // feed = ;
  }

  // feed = posts.length ? <PostList isLoading={isLoading} posts={posts.data} /> : <div>
  //     <p>주변 카페 게시물을 찾지 못했습니다...</p>
  //     <p>위치를 변경해보세요.</p>
  //   </div>

  // 엑세스 토큰이 없을 때 login화면으로 이동
  // if (!sessionStorage.getItem('accessToken')){
  //   history.push('/login')
  // }

  return (
    <Fragment>
      <Grid>
        <Grid.Row>
          <MainPageTopBar isAuthenticated={isAuthenticated} />
        </Grid.Row>
        <Grid.Column width={16}>
          <JamSurvey />
          {/* <PostTypeCarousel /> */}
        </Grid.Column>
        {isMap && (
          <Route path="/map">
            <MapDiv />
          </Route>
        )}
        {!isMap && <Grid.Column width={16}>{feed}</Grid.Column>}
      </Grid>
    </Fragment>
  )
}

export default MainPage
