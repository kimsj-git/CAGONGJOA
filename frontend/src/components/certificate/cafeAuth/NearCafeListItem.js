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
      // size="small"
      onClick={confirmHandler}
      style={{
        width: "100%",
        margin: "2%",
        whiteSpace: "nowrap",
        backgroundColor: "var(--custom-pink)",
        color: "black",
        border: "3px solid var(--custom-beige)",
      }}
      size="large"
    >
      {props.cafeData.name}
    </Button>
  )
}

export default NearCafeListItem
