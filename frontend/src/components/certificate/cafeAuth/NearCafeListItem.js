import { useDispatch } from "react-redux"
import { Button } from "semantic-ui-react"

import { modalActions } from "../../../store/modal"
import useFetch from "../../../hooks/useFetch"

const REST_DEFAULT_URL = process.env.REACT_APP_REST_DEFAULT_URL

const NearCafeListItem = (props) => {
  const dispatch = useDispatch()
  const { sendRequest: selectCafe } = useFetch()

  const confirmHandler = () => {
    dispatch(modalActions.toggleConfirmCafeModal(props.cafeName))
  }
  return (
    <Button circular size="small" onClick={confirmHandler}>
      {props.cafeName}
    </Button>
  )
}

export default NearCafeListItem
