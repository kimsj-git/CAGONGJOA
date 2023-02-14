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
  const isLoading = useSelector((state) => state.posts.isLoading)
  const hasNext = useSelector((state) => state.posts.hasNext)
  const [lastPostRef, setLastPostRef] = useState(-1)
  // const { data: fetchedPosts, isLoading, sendRequest: getPosts } = useFetch()

  const isMounted = useRef(false)
  const [ref, inView] = useInView({
    threshold: 0.5,
    delay: 500,
    // triggerOnce: true,
  })

  const filters = Object.entries(filterState)
    .filter(([key, value]) => value === true)
    .map(([key, value]) => key)

  const refreshPosts = (postId = -1) => {
    if (JSON.parse(sessionStorage.getItem("location"))) {
      dispatch(
        getPosts({
          location: {
            lat: JSON.parse(sessionStorage.getItem("location")).lat,
            lng: JSON.parse(sessionStorage.getItem("location")).lng,
          },
          postId: postId,
          filters: filters,
        })
      )
    }
  }

  useEffect(() => {
    CafeAuthFetch()
    refreshPosts()
    console.log("포스트 새로고침")
    console.log(inView)
    console.log(lastPostRef)
  }, [filterState])

  useEffect(() => {
    if (isMounted.current && inView && lastPostRef !== -1) {
      refreshPosts(lastPostRef)
      console.log("포스트 더보기 요청")
      console.log(inView)
      console.log(lastPostRef)
    }
  }, [inView])

  useEffect(() => {
    if (isMounted.current) {
      if (posts.length) {
        setLastPostRef(posts[posts.length - 1].postId)
      }
    } else {
      isMounted.current = true
    }
  }, [posts])

  return (
    <Fragment>
      <Feed>
        {posts.map((post, index) => (
          <PostItem
            key={post.postId}
            id={post.postId}
            createdAt={post.createdAt}
            type={post.postType}
            writer={post.writerNickname}
            userType={post.userType}
            tier={post.exp}
            cafeName={post.cafeName}
            cafeBrand={post.brandType}
            content={post.content}
            images={post.imgUrlPath}
            likeCnt={post.postLikeCount}
            commentCnt={post.commentCount}
            isLoading={isLoading}
            isLiked={post.likeChecked}
          />
        ))}
        {!posts.length && <p>게시글이 없습니다.</p>}

        <div ref={hasNext ? ref : null} />
      </Feed>
    </Fragment>
  )
}
export default PostList
