import React, { useState, useEffect } from "react"
import { Button } from "semantic-ui-react"
import "../common/ToggleButton.css"
import { useDispatch, useSelector } from "react-redux"
import { postsActions } from "../../store/posts"

const DEFAULT_REST_URL = process.env.REACT_APP_REST_DEFAULT_URL
const postTypes = [
  { key: "free", text: "자유", value: "free", icon: "chat" },
  { key: "qna", text: "궁금해요", value: "qna", icon: "question" },
  { key: "together", text: "같이해요", value: "together", icon: "handshake" },
  { key: "tip", text: "정보공유", value: "tip", icon: "lightbulb" },
  {
    key: "recommend",
    text: "추천해요",
    value: "recommend",
    icon: "thumbs up",
  },
  { key: "help", text: "해주세요", value: "help", icon: "bullhorn" },
  { key: "lost", text: "분실물센터", value: "lost", icon: "box" },
]
const PostTypeBtns = (props) => {
  const dispatch = useDispatch()
  const filterState = useSelector((state) => state.posts.filterState)

  return (
    <>
      {postTypes.map((type) => {
        const btnValue = type.value
        return (
          <Button
            key={type.key}
            onClick={() => {
              dispatch(postsActions.changeFilter(btnValue))
            }}
            id={filterState[btnValue] ? "select" : "cancle-select"}
            value={btnValue}
            basic
            content={type.text}
            icon={type.icon}
          />
        )
      })}
    </>
  )
}

export default PostTypeBtns
