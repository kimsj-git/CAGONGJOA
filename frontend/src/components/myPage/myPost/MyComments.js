import { Header, Grid, Comment, Form, Divider } from "semantic-ui-react"
import { ScrollPanel } from "primereact/scrollpanel"
import MyCommentsItem from "./MyCommentsItem"
import { useInView } from "react-intersection-observer"
import { useDispatch, useSelector } from "react-redux"
import { commentsActions } from "../../../store/comments.js"
import { useEffect, useRef, useState } from "react"
import useFetch from "../../../hooks/useFetch.js"
const DEFAULT_REST_URL = process.env.REACT_APP_REST_DEFAULT_URL

const MyComments = (props) => {
  console.log(props.post)
  const {
    data: fetchedComments,
    isLoading,
    sendRequest: getComments,
  } = useFetch()
  const dispatch = useDispatch()
  const isMounted = useRef(false)
  const comments = useSelector((state) => state.comments.comments)
  const lastCommentId = useSelector((state) => state.comments.lastCommentId)
  const [ref, inView] = useInView({
    threshold: 0.5,
    delay: 500,
  })
  const [newComment, setNewComment] = useState("")

  const refreshComments = async (id=-1) => {
    const response = await getComments({
      url: `${DEFAULT_REST_URL}/main/postDetail/comment/feed`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
      body: {
        postId: props.post.postId,
        commentId: id,
      },
    })
    console.log(response)
    const responseData = await response.json()
  }

  const addNewComment = async (text, id) => {
    console.log(props.post.postId)
    const response = await fetch(`${DEFAULT_REST_URL}/main/postDetail/comment/write`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: props.post.postId,
        content: text,
        commentId: id,
      }),
    })
    const responseData = await response.json()
    console.log(responseData)
    refreshComments(lastCommentId)
  }

  useEffect(
    () => {
      console.log("인뷰 이펙트 실행")
      console.log(inView)
      if (isMounted && inView) {
        console.log("인뷰 이펙트, 마운티드 통과")
        console.log("인뷰 이펙트, 인뷰 통과")
        console.log(lastCommentId)
        refreshComments(lastCommentId)
      }
    },
    [inView]
  )
  useEffect(() => {
    console.log("댓글 이펙트 실행")
    // if (isMounted.current) {
      console.log("댓글 이펙트, 마운티드 통과")
      dispatch(
        commentsActions.updateComments({
          fetchedComments: fetchedComments,
          lastCommentId: lastCommentId,
        })
      )
    // } else {
    //   console.log("댓글 이펙트, 마운티드 통과 못함")
    //   isMounted.current = true
    // }
  }, [fetchedComments])

  return (
    <Grid.Column mobile={16} tablet={8} computer={8}>
      <Header>{`댓글 ${props.post.commentCounts}`}</Header>
      <Divider />
      <ScrollPanel style={{ width: "100%", height: "70vh" }}>
        <Comment.Group>
          {comments.map((comment, index) => {
            return (
              <MyCommentsItem
                key={comment.commentId}
                comment={comment}
                addNewComment={addNewComment}
                refreshComments={refreshComments}
              />
            )
          })}
          <div ref={ref} />
        </Comment.Group>
      </ScrollPanel>
      <Divider />
      <Form
        reply
        onSubmit={(e) => {
          addNewComment(newComment, -1)
          // e.target[0].value = ""
          
        }}
      >
        <Form.Input
          fluid
          placeholder="댓글을 입력하세요."
          action={{
            color: "teal",
            icon: "paper plane",
          }}
          size="tiny"
          // content={newComment}
          onChange={(e) => {
            setNewComment(e.target.value)
          }}
        />
      </Form>
    </Grid.Column>
  )
}

export default MyComments
