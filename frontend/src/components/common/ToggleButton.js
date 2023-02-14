import React, { useState, useEffect } from "react"
import { Button, Transition } from "semantic-ui-react"
import "./ToggleButton.css"
import useFetch from "../../hooks/useFetch.js"
const DEFAULT_REST_URL = process.env.REACT_APP_REST_DEFAULT_URL
const ToggleButton = (props) => {
  const [btnState, setBtnState] = useState(
    props.btnType === "like" ? props.isLiked : false
  )
  const [visibility, setVisibility] = useState(true)
  const handleClick = () => {
    props.btnType === "like" && props.likeHandler(btnState)
    props.btnType === "hot" && props.onHotSelect()
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
        icon={icon}
        content={props.content}
        size={props.size}
        className={grouped ? "btn-group" : null}
        color={props.color}
      />
    </Transition>
  )
}

export default ToggleButton
