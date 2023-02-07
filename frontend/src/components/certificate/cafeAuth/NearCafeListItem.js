import { useDispatch } from "react-redux"
import { Button } from "semantic-ui-react"

import { modalActions } from "../../../store/modal"

const NearCafeListItem = (props) => {
  const dispatch = useDispatch()

  const confirmHandler = () => {
    dispatch(modalActions.toggleConfirmCafeModal(props.cafeData))
  }
  return (
    <Button
      circular
      size="small"
      onClick={confirmHandler}
      color="blue"
      style={{ width: "10em", margin:"10px" }}
    >
      {props.cafeData.name.length > 5
        ? `${props.cafeData.name.substr(0, 5)}...`
        : props.cafeData.name}
    </Button>
  )
}

export default NearCafeListItem
