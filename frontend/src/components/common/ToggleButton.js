import React, { useState } from "react"
import { Button } from "semantic-ui-react"

const ToggleButton = (props) => {
  const [active, setActive] = useState(false)
  const handleClick = () => {
    setActive(!active)
  }
  const {
    fluid = false,
    inverted = true,
    basic = false,
    compact = false,
    color,
    icon,
  } = props
  return (
    <Button
      toggle
      fluid={fluid}
      inverted={inverted}
      basic={basic}
      active={active}
      compact={compact}
      onClick={handleClick}
      color={props.color}
      icon={props.icon}
      content={props.content}
    />
  )
}

export default ToggleButton
