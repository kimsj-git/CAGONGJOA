import {Comment, Icon, Button, Confirm} from 'semantic-ui-react'
import { useState } from "react"
import ToggleButton from "../common/ToggleButton"
import useFetch from "../../hooks/useFetch"
import { useDispatch } from "react-redux"
import { commentsActions } from "../../store/comments"
const DEFAULT_REST_URL = process.env.REACT_APP_REST_DEFAULT_URL
const ReplyItem = (props) => {
  const dispatch = useDispatch()
  const reply = props.reply
  const isWriterVerified = reply.writerType
  const [confirmOpen, setConfirmOpen] = useState(false)
  const { data, isLoading, sendRequest: fetchLike } = useFetch()

  const likeReply = (isLiked) => {
    dispatch(commentsActions.likeReply({parentId: reply.parentId, replyId: reply.commentId, num: isLiked ? -1 : 1}))
    fetchLike({
      url: `${DEFAULT_REST_URL}/main/postDetail/comment/like`,
      method: "PUT",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
      body: {
        isChecked: isLiked,
        commentId: reply.commentId,
      },
    })
  }
  return (
        <Comment>
      <Comment.Avatar
        style={{ width: "3.5rem" }}
        as="a"
        src={require("../../assets/cafe_logos/compose.png")}
      />
      <Comment.Content>
        <Comment.Author
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <div style={{ fontSize: "1.1rem", lineHeight: "1.2" }}>
            {reply.writerNickname}
            <Icon name="chess queen" color="orange" />
            <Comment.Metadata content={isWriterVerified ? reply.verifiedCafeName : null } />
          </div>
          <Comment.Metadata content={reply.createdAt} />
        </Comment.Author>
        <Comment.Text style={{ fontSize: "1.1rem", lineHeight: "1.5" }}>
          {reply.content}
        </Comment.Text>
        <Comment.Actions>
          <Comment.Action>
            <ToggleButton
              btnType="like"
              content={reply.commentLikeCnt}
              likeHandler={likeReply}
              compact
              size="mini"
              isLiked={reply.likeChecked}
            />

            {/* comment.nickname 변수명 추후 확인 필요!!! */}
            {reply.writerNickname === sessionStorage.getItem("nickname") && (
              <Button
                size="mini"
                compact
                toggle
                color="grey"
                icon="delete"
                content="삭제"
                onClick={() => {
                  setConfirmOpen(true)
                }}
              ></Button>
            )}
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
                console.log("이건 있겠지?", reply.parentId, reply.commentId)
                dispatch(commentsActions.deleteReply({parentId: reply.parentId, deletedReplyId: reply.commentId}))
                fetch(
                  `${DEFAULT_REST_URL}/main/postDetail/comment/delete?commentId=${reply.commentId}`,
                  {
                    method: "DELETE",
                    headers: {
                      Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
                    },
                  }
                )
              }}
            />
          </Comment.Action>
        </Comment.Actions>
      </Comment.Content>
    </Comment>

  )

}
export default ReplyItem;