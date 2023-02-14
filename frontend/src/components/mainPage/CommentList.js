import { Header, Grid, Comment, Form, Divider } from "semantic-ui-react"
import { ScrollPanel } from "primereact/scrollpanel"
import CommentItem from "./CommentItem"
import { useInView } from "react-intersection-observer"
import { useDispatch, useSelector } from "react-redux"
import { commentsActions } from "../../store/comments.js"
import { useEffect, useRef, useState } from "react"
import useFetch from "../../hooks/useFetch.js"
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

  const refreshComments = async (id) => {
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

  const addNewComment = async (text, id) => {
    console.log(props.post.id)
    await fetch(`${DEFAULT_REST_URL}/main/postDetail/comment/write`, {
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
    })

    refreshComments(lastCommentId)
  }

  useEffect(
    () => {
      console.log("인뷰 이펙트 실행")
      console.log(inView)
      if (inView) {
        console.log("인뷰 이펙트, 마운티드 통과")
        console.log("인뷰 이펙트, 인뷰 통과")
        console.log(lastCommentId)
        refreshComments(lastCommentId)
      }
    },
    // else {
    // console.log("인뷰 이펙트, 마운티드 통과 못함")
    // refreshComments(-1)
    // }
    // }
    [inView]
  )
  useEffect(() => {
    console.log("댓글 이펙트 실행")
    if (isMounted.current) {
      console.log("댓글 이펙트, 마운티드 통과")
      dispatch(
        commentsActions.updateComments({
          fetchedComments: fetchedComments,
          lastCommentId: lastCommentId,
        })
      )
    } else {
      console.log("댓글 이펙트, 마운티드 통과 못함")
      isMounted.current = true
    }
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
                key={comment.commentId}
                comment={comment}
                addNewComment={addNewComment}
              />
            )
          })}
          <div ref={ref} />
        </Comment.Group>
      </ScrollPanel>
      <Divider />
      <Form
        reply
        onSubmit={() => {
          addNewComment(newComment, -1)
          setNewComment("")
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
          // value={newComment}
          onChange={(e) => {
            setNewComment(e.target.value)
          }}
        />
      </Form>
    </Grid.Column>
  )
}

export default CommentList
