import React, { useState, useEffect } from "react"
import { Button } from "semantic-ui-react"
import "./ToggleButton.css"
import useFetch from "../../hooks/useFetch.js"
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
const ToggleButton = (props) => {
  const [btnState, setBtnState] = useState(false)

  const handleClick = () => {
    props.selectHandler({ filterToChange: props.typeKey, exist: btnState })
    setBtnState(!btnState)
  }

  return (
    <Button
      id={btnState ? props.btnType : `cancle-${props.btnType}`}
      basic
      onClick={grouped ? props.onClick : handleClick}
      icon={props.icon}
      content={props.content}
      size={props.size}
      className={grouped ? "btn-group" : null}
      color={props.color}
    />
  )
}

export default ToggleButton
