import { useDispatch } from "react-redux"
import { Button } from "semantic-ui-react"

import { modalActions } from "../../../store/modal"

const NearCafeListItem = (props) => {
  const dispatch = useDispatch()

  const confirmHandler = () => {
    dispatch(modalActions.toggleConfirmCafeModal(props))
  }
  return (
    <Button circular size="small" onClick={confirmHandler}>
      {props.cafeName}
    </Button>
  )
}

export default NearCafeListItem
