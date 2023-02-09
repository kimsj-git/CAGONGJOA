import React, { useState, useEffect } from "react"
import { Button } from "semantic-ui-react"
import "./ToggleButton.css"
import useFetch from "../../hooks/useFetch.js"
const DEFAULT_REST_URL = process.env.REACT_APP_REST_DEFAULT_URL
const ToggleButton = (props) => {
  const [btnState, setBtnState] = useState(false)
  const handleClick = () => {
    props.btnType === "like" &&
      props.likeHandler({
        url: `${DEFAULT_REST_URL}/main/post/like`,
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
        body: {
          isChecked: btnState,
        },
      })
    props.btnType === "type-select" &&
      props.selectHandler({ filterToChange: props.typeKey, exist: btnState })
    setBtnState(!btnState)
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
  )
}

export default ToggleButton
