import {Comment, Icon, Button, Confirm} from 'semantic-ui-react'
import { useState } from "react"
import ToggleButton from "../common/ToggleButton"
import useFetch from "../../hooks/useFetch"
import { useDispatch, useSelector } from "react-redux"
import { commentsActions } from "../../store/comments"
import ElapsedText from './ElapsedText'
const DEFAULT_REST_URL = process.env.REACT_APP_REST_DEFAULT_URL
const ReplyItem = (props) => {
  const dispatch = useDispatch()
  const reply = props.reply
  const isWriterVerified = reply.writerType
  const [confirmOpen, setConfirmOpen] = useState(false)
  const elapsedTime = ElapsedText(props.reply.createdAt)
  const { data, isLoading, sendRequest: fetchLike } = useFetch()
  const brandLogo = useSelector((state)=>state.cafe.brandLogo)

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
        src={props.reply.cafeBrandType ? require(`../../assets/cafe_logos/${
          brandLogo[props.reply.cafeBrandType]
        }.png`) : require("../../assets/icons/question.png")}
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
          <Comment.Metadata content={elapsedTime} />
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
              iconSize={12}
              isLiked={reply.likeChecked}
              />
          </Comment.Action>

          <Comment.Action>
            {reply.writerNickname === sessionStorage.getItem("nickname") && (
              <ToggleButton
  
                btnType="delete"
                content="삭제"
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
      </Comment.Content>
    </Comment>

  )

}
export default ReplyItem;