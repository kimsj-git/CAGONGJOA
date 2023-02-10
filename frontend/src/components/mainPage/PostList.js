import { Fragment, useState, useRef, useEffect, createRef } from "react"
import { Feed, Card } from "semantic-ui-react"

import PostItem from "./PostItem"

import { useInView } from "react-intersection-observer"

import { useDispatch, useSelector } from "react-redux"
import { postsActions } from "../../store/posts.js"
import useFetch from "../../hooks/useFetch.js"
import CafeAuthFetch from "../certificate/cafeAuth/CafeAuthFetch"
import { getPosts } from "../../store/posts.js"

const DEFAULT_REST_URL = process.env.REACT_APP_REST_DEFAULT_URL
const DIST = 0.5

const PostList = (props) => {
  const dispatch = useDispatch()
  const posts = useSelector((state) => state.posts.posts)
  const filterState = useSelector((state) => state.posts.filterState)
  const [lastPostRef, setLastPostRef] = useState(-1)
  const isLoading = useSelector((state)=>state.posts.isLoading)
  // const { data: fetchedPosts, isLoading, sendRequest: getPosts } = useFetch()
  const [ref, inView] = useInView({
    threshold: 0.5,
    // triggerOnce: true,
  })

  const filters = Object.entries(filterState)
    .filter(([key, value]) => value === true)
    .map(([key, value]) => key)

  const refreshPosts = (postId = -1) => {
    dispatch(getPosts({postId:postId, filters: filters }))
    // // console.log(filters)
    //   await getPosts({
    //     url: `${DEFAULT_REST_URL}/main/post/feed`,
    //     method: "POST",
    //     headers: {
    //       Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
    //       "Content-Type": "application/json",
    //     },
    //     body: {
    //       postId: postId,
    //       types: filters.length
    //         ? filters
    //         : ["free", "qna", "together", "tip", "recommend", "help", "lost"],
    //       latitude: JSON.parse(sessionStorage.getItem("location")).lat,
    //       longitude: JSON.parse(sessionStorage.getItem("location")).lng,
    //       dist: DIST,
    //     },
    //   })
    //   console.log(fetchedPosts)
    //   dispatch(postsActions.updatePosts({fetchedPosts: fetchedPosts, lastPostId: postId}))
    //   console.log(fetchedPosts.length)
    //   console.log(posts)
  }
  useEffect(() => {
    CafeAuthFetch()
    refreshPosts()
    console.log("포스트 새로고침")
    console.log(inView)
    console.log(lastPostRef)
  }, [filterState])

  useEffect(() => {
    if (inView) {
      refreshPosts(lastPostRef)
      console.log("포스트 더보기 요청")
      console.log(inView)
      console.log(lastPostRef)
    }
  }, [inView])

  useEffect(() => {
    if (posts.length) {
      setLastPostRef(posts[posts.length-1].postId)
    }
  }, [posts])
  console.log(posts)
  return (
    <Fragment>
      <Feed>
        {posts.map((post, index) => (
          <PostItem
            key={post.postId}
            createdAt={post.createdAt}
            type={post.postType}
            writer={post.writerNickname}
            userType={post.userType}
            tier={post.tier}
            cafeName={post.cafeName}
            cafeBrand={post.brandType}
            content={post.content}
            images={post.imgUrlPath}
            likeCnt={post.postLikeCount}
            commentCnt={post.commentCount}
            isLoading={isLoading}
          />
        ))}
        <div ref={ref} />
      </Feed>
    </Fragment>
  )
}

export default PostList
