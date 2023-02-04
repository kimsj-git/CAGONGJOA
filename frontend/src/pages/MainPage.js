import { useState, useCallback, Fragment, useEffect } from "react"
import { Route, useLocation,useHistory } from "react-router"
import MainPageTopBar from "../components/mainPage/MainPageTopBar"
import PostList from "../components/mainPage/PostList"
import MapDiv from "../components/map/MapDiv"
import useFetch from "../hooks/useFetch.js"
import CafeAuthFetch from "../components/certificate/cafeAuth/CafeAuthFetch"
import { Grid } from "semantic-ui-react"
const DEFAULT_REST_URL = process.env.REACT_APP_REST_DEFAULT_URL

// API 연결 후 DUMMY_POSTS 삭제
const DUMMY_POSTS = [
  {
    id: "p1",
    author: "서정",
    content:
      "이름을 하나에 별빛이 아직 동경과 아이들의 시와 했던 봅니다. 이름과, 사랑과 무엇인지 이름을 그러나 내일 버리었습니다. 피어나듯이 보고, 어머니, 별 이름을 마리아 내일 별 봅니다.\n\n비둘기, 피어나듯이 나는 이네들은 걱정도 가득 까닭입니다. 별 이제 같이 있습니다. 프랑시스 다하지 남은 이름과, 있습니다.",
    post_likes: 4,
    comments_cnt: 1,
  },
  {
    id: "p2",
    author: "경희",
    content: "게시물222",
    post_likes: 6,
    comments_cnt: 10,
  },
  {
    id: "p3",
    author: "현철",
    content: "게시물333",
    post_likes: 99,
    comments_cnt: 25,
  },
  {
    id: "p4",
    author: "종섭",
    content: "게시물444",
    post_likes: 99,
    comments_cnt: 25,
  },
  {
    id: "p5",
    author: "준모",
    content: "게시물555",
    post_likes: 99,
    comments_cnt: 25,
  },
  {
    id: "p6",
    author: "현철",
    content: "게시물666",
    post_likes: 99,
    comments_cnt: 25,
  },
]

const MainPage = () => {
  const history = useHistory()
  const location = useLocation()
  const [posts, setPosts] = useState([])
  const [error, setError] = useState(null)
  const isMap = location.pathname === "/map"
  const { data: postsList, isLoading, sendRequest: getPosts } = useFetch()
  const isAuthenticated = sessionStorage.getItem("cafeAuth")

  useEffect(() => {
    CafeAuthFetch()
    getPosts({
      url: `${DEFAULT_REST_URL}/post/main`,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
      body: {
        type: ["free", "qna", "together", "tip", "recommend", "help", "lost"],
      },
    })
  }, [])

  const fetchPostsHandler = useCallback(async () => {
    try {
      const response = await fetch(`${DEFAULT_REST_URL}/post/main/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
        body: {},
      })
      if (!response.ok) {
        throw new Error("error")
      }

      const data = await response.json()
      const loadedPosts = []

      for (const key in data) {
        loadedPosts.push({
          id: key,
          author: data[key].member,
          content: data[key].content,
          post_likes_cnt: data[key].postLikeCount,
          comments_cnt: data[key].commentCount,
          created_at: data[key].createdAt,
          images: data[key].imagPathUrl,
          is_authorized: data[key].isAuthorized,
        })
      }
      setPosts(loadedPosts)
    } catch (error) {
      setError(error.message)
    }
  }, [])

  // API 연결 후 활성화
  // useEffect(() => {
  //   fetchPostsHandler()
  // }, [fetchPostsHandler])

  let content_feed = (
    <div>
      <p>주변 카페 게시물을 찾지 못했습니다...</p>
      <p>위치를 변경해보세요.</p>
    </div>
  )

  // API 연결 후 DUMMY_POSTS를 posts로 변경
  if (DUMMY_POSTS.length > 0) {
    content_feed = <PostList isLoading={isLoading} posts={DUMMY_POSTS} />
  }

  if (error) {
    content_feed = <p>{error}</p>
  }

  // 엑세스 토큰이 없을 때 login화면으로 이동
  if (!sessionStorage.getItem('accessToken')){
    history.push('/login')
  }

  return (
    <Fragment>
      <Grid>
        <Grid.Row only="mobile">
          <MainPageTopBar isAuthenticated={isAuthenticated} />
        </Grid.Row>
        {isMap && (
          <Route path="/map">
            <MapDiv />
          </Route>
        )}
        {!isMap && <Grid.Column width={16}>{content_feed}</Grid.Column>}
      </Grid>
      {/* <section> */}

      {/* </section> */}
    </Fragment>
  )
}

export default MainPage
