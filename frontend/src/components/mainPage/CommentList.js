import { Header, Grid, Comment, Form, Divider } from "semantic-ui-react"
import { ScrollPanel } from "primereact/scrollpanel"
import CommentItem from "./CommentItem"
import { useInView } from "react-intersection-observer"
import { useDispatch, useSelector } from "react-redux"
import { commentsActions } from "../../store/comments.js"
import { useEffect, useRef, useState } from "react"
import useFetch from "../../hooks/useFetch.js"
import { postsActions } from "../../store/posts"
const DEFAULT_REST_URL = process.env.REACT_APP_REST_DEFAULT_URL

const CommentList = (props) => {
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

  const refreshComments = async (id = -1) => {
    await getComments({
      url: `${DEFAULT_REST_URL}/main/postDetail/comment/feed`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
      body: {
        postId: props.post.id,
        commentId: id,
      },
    })
  }

  const addNewComment = async (text, id = -1) => {
    if (id === -1) {
      const v = await fetch(
        `${DEFAULT_REST_URL}/main/postDetail/comment/write`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            postId: props.post.id,
            content: text,
            commentId: id,
          }),
        }
      )
      refreshComments(lastCommentId)
    } else {
      const response = await fetch(
        `${DEFAULT_REST_URL}/main/postDetail/comment/write`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            postId: props.post.id,
            content: text,
            commentId: id,
          }),
        }
      )
      const parentComment = await response.json()
      dispatch(commentsActions.updateReplies(parentComment.data))
    }
  }

  useEffect(() => {
    if (isMounted && inView) {
      refreshComments(lastCommentId)
    }
  }, [inView])
  useEffect(() => {
    dispatch(
      commentsActions.updateComments({
        fetchedComments: fetchedComments,
        lastCommentId: lastCommentId,
      })
    )
  }, [fetchedComments])

  return (
    <Grid.Column mobile={16} tablet={8} computer={8}>
      <Header>{`댓글 ${props.post.commentCnt}`}</Header>
      <Divider />
      <ScrollPanel style={{ width: "100%", height: "70vh" }}>
        <Comment.Group>
          {comments.map((comment, index) => {
            return (
              <CommentItem
                key={`${props.post.id}-${comment.commentId}`}
                comment={comment}
                postId={props.post.id}
                addNewComment={addNewComment}
                refreshComments={refreshComments}
                myPage={props.myPage}
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
          if (props.myPage) {
          } else {
            dispatch(postsActions.createComment(props.post.id))
          }
        }}
      >
        <Form.Input
          fluid
          placeholder="댓글을 입력하세요."
          action={{
            color: "teal",
            icon: "paper plane",
          }}
          // content={newComment}
          onChange={(e) => {
            setNewComment(e.target.value)
          }}
        />
      </Form>
    </Grid.Column>
  )
}

export default CommentList
