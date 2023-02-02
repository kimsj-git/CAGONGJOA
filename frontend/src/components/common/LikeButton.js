import React, { useState } from "react"
import { Button } from "semantic-ui-react"
import "./LikeButton.css"

const LikeButton = (props) => {
  const [likeState, setLikeState] = useState(false)
  const handleClick = () => {
    setLikeState(!likeState)
  }
  const {
    fluid = false,
    inverted = true,
    basic = false,
    compact = false,
    size = "medium",
  } = props
  return (
    <Button
      id={likeState ? "like" : "unlike"}
      fluid={fluid}
      inverted={inverted}
      basic={basic}
      compact={compact}
      onClick={handleClick}
      icon="thumbs up"
      content={props.content}
      size={props.size}
    />
  )
}

export default LikeButton
