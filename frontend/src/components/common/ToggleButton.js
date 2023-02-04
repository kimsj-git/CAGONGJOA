import React, { useState } from "react"
import { Button } from "semantic-ui-react"
import "./ToggleButton.css"

const ToggleButton = (props) => {
  const [btnState, setBtnState] = useState(false)
  const handleClick = () => {
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
    />
  )
}

export default ToggleButton
