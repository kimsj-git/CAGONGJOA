import React, { useState, useEffect } from "react"
import { Button, Transition } from "semantic-ui-react"
import "./ToggleButton.css"
import useFetch from "../../hooks/useFetch.js"
import { IoHeart } from "react-icons/io5"
import {FaReply} from "react-icons/fa"
import {CgClose} from "react-icons/cg"

const DEFAULT_REST_URL = process.env.REACT_APP_REST_DEFAULT_URL
const ToggleButton = (props) => {
  const [btnState, setBtnState] = useState(
    props.btnType === "like" ? props.isLiked : false
  )
  const [visibility, setVisibility] = useState(true)
  const handleClick = () => {
    props.btnType === "like" && props.likeHandler(btnState)
    props.btnType === "hot" && props.onHotSelect()
    props.btnType === "reply" && props.openReplyInput()
    props.btnType === "delete" && props.onDelete()
    setBtnState(!btnState)
    setVisibility((prev) => !prev)
  }

  const {
    grouped = false,
    fluid = false,
    inverted = true,
    basic = false,
    compact = false,
    size = "medium",
    icon = "thumbs up",
  } = props
  return (
    <Transition animation="pulse" duration={300} visible={visibility}>
      <Button
        id={
          grouped
            ? props.id
            : btnState
            ? props.btnType
            : `cancle-${props.btnType}`
        }
        fluid={fluid}
        inverted={inverted}
        basic={basic}
        compact={compact}
        onClick={grouped ? props.onClick : handleClick}
        size={props.size}
        className={grouped ? "btn-group" : null}
        color={props.color}
        style={{display: "flex", alignItems: "center", justifyContent: "center"}}
      >
        {props.btnType === "like" && <IoHeart size={props.iconSize} style={{marginRight: "0.5rem"}}/>}
        {props.btnType === "reply" && <FaReply size={props.iconSize} style={{marginRight: "0.5rem"}}/>}
        {props.btnType === "delete" && <CgClose size={props.iconSize} style={{marginRight: "0.5rem"}}/>}
        {props.content}
      </Button>
    </Transition>
  )
}

export default ToggleButton
