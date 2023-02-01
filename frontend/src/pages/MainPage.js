import { useState, useCallback, Fragment } from "react"
import { Route } from "react-router"

import MainPageTopBar from "../components/mainPage/MainPageTopBar"
import PostList from "../components/mainPage/PostList"
import MapDiv from "../components/map/MapDiv"

// API 연결 후 DUMMY_POSTS 삭제
const DUMMY_POSTS = [
  {
    id: "p1",
    author: "서정",
    content: "게시물111",
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
  const [posts, setPosts] = useState([])
  const [error, setError] = useState(null)

  const fetchPostsHandler = useCallback(async () => {
    try {
      const response = await fetch("api주소")
      if (!response.ok) {
        throw new Error("error")
      }

      const data = await response.json()
      const loadedPosts = []

      for (const key in data) {
        loadedPosts.push({
          id: key,
          author: data[key].member_id,
          content: data[key].content,
          post_likes: data[key].post_likes,
          comments_cnt: data[key].comments_cnt,
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
    content_feed = <PostList posts={DUMMY_POSTS} />
  }

  if (error) {
    content_feed = <p>{error}</p>
  }

  return (
    <Fragment>
      <section>
        <MainPageTopBar />
      </section>
      <Route path="/map">
        <MapDiv/>
      </Route>
      <section>{content_feed}</section>
    </Fragment>
  )
}

export default MainPage
