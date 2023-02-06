import { useHistory } from "react-router-dom"
import { Button } from "semantic-ui-react"

import classes from "./MapLookFeed.module.css"

const MapLookFeed = (props) => {
  const history = useHistory()

  const lookFeedHandler = () => {
    const location = { lat: props.lat, lng: props.lng }
    sessionStorage.setItem("location", JSON.stringify(location))
    history.push('/')
  }
  return (
    <Button
      className={classes.btn}
      onClick={lookFeedHandler}
      color="yellow"
    >
      이 위치에서 주변 소식 보기
    </Button>
  )
}

export default MapLookFeed
