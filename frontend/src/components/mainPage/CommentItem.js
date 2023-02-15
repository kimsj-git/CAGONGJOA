import { useState } from "react"
import { Comment, Icon, Button, Form, Confirm } from "semantic-ui-react"
import ToggleButton from "../common/ToggleButton"
import useFetch from "../../hooks/useFetch"
import { useDispatch } from "react-redux"
import { commentsActions } from "../../store/comments"
import ReplyItem from "./ReplyItem"
const DEFAULT_REST_URL = process.env.REACT_APP_REST_DEFAULT_URL

const CommentItem = (props) => {
  const { data, isLoading, sendRequest: fetchLike } = useFetch()
  const dispatch = useDispatch()
  const comment = props.comment
  const [replyMode, setReplyMode] = useState(false)
  const [newReply, setNewReply] = useState("")
  const [confirmOpen, setConfirmOpen] = useState(false)
  const isWriterVerified = comment.writerType

  const likeComment = async (isLiked) => {
    dispatch(commentsActions.likeComment({commentId: comment.commentId, num: isLiked ? -1 : 1}))
    await fetchLike({
      url: `${DEFAULT_REST_URL}/main/postDetail/comment/like`,
      method: "PUT",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
      body: {
        isChecked: isLiked,
        commentId: comment.commentId,
      },
    })
  }


  return (
    // <Comment.Group>
    <Comment>
      <Comment.Avatar
        style={{ width: "3.5rem" }}
        as="a"
        src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F223BA433586D069517"
      />
      <Comment.Content>
        <Comment.Author
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <div style={{ fontSize: "1.1rem", lineHeight: "1.2" }}>
            {comment.writerNickname}
            <Icon name="chess queen" color="orange" />
            <Comment.Metadata content={isWriterVerified ? comment.verifiedCafeName : null } />
          </div>
          <Comment.Metadata content={comment.createdAt} />
        </Comment.Author>
        <Comment.Text style={{ fontSize: "1.1rem", lineHeight: "1.5" }}>
          {comment.content}
        </Comment.Text>
        <Comment.Actions>
          <Comment.Action>
            <ToggleButton

              btnType="like"
              content={comment.commentLikeCnt}
              likeHandler={likeComment}
              compact
              size="mini"
              iconSize={12}
              isLiked={comment.likeChecked}
              />
          </Comment.Action>

          <Comment.Action>
            <ToggleButton

              btnType="reply"
              content="대댓글"
              openReplyInput={() => {
                setReplyMode(!replyMode)
              }}
              compact
              size="mini"
              iconSize={12}
              isLiked={comment.likeChecked}
              />
            
          </Comment.Action>
          <Comment.Action>
            {comment.writerNickname === sessionStorage.getItem("nickname") && (
              <ToggleButton
  
                btnType="delete"
                content="삭제"
                openReplyInput={() => {
                  setReplyMode(!replyMode)
                }}
                compact
                size="mini"
                iconSize={12}
                onDelete={() => {
                  setConfirmOpen(true)
                }}
                />
              )}
          </Comment.Action>
        </Comment.Actions>

        {/* 대댓글 입력창 */}
              {replyMode && (
                <Form
                  reply
                  onSubmit={(e) => {
                    props.addNewComment(newReply, comment.commentId)
                    // setNewReply("")
                    // e.target[0].value = ""
                    console.log(e.target)
              
                  }}
                >
                  <Form.Input
                    fluid
                    placeholder="대댓글을 입력하세요."
                    action={{
                      icon: "paper plane",
                      color: "teal",
                    }}
                    size="mini"
                    // content={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                  />
                </Form>
              )}
        {/* 대댓글 창 */}
        {comment.replies.length &&
        
        <Comment.Group>
          {comment.replies.map((reply) => {
            return <ReplyItem reply={reply} addNewComment={props.addNewComment}/>
          })}
        </Comment.Group>
        }

        {/* 삭제 확인 모달 */}
        <Confirm
          open={confirmOpen}
          content="정말 삭제할까요?"
          cancelButton="취소"
          confirmButton="삭제"
          onCancel={() => {
            setConfirmOpen(false)
          }}
          onConfirm={() => {
            setConfirmOpen(false)
            dispatch(commentsActions.deleteComment(props.comment.commentId))
            fetch(
              `${DEFAULT_REST_URL}/main/postDetail/comment/delete?commentId=${props.comment.commentId}`,
              {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
                },
              }
            )
          }}
        />
      </Comment.Content>
    </Comment>
    // </Comment.Group>
  )
}

export default CommentItem
