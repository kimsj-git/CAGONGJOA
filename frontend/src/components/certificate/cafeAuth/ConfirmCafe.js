import { useHistory } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { Modal,Button, ModalActions } from "semantic-ui-react"

import { modalActions } from "../../../store/modal"

const ConfirmCafe = () => {
  const history = useHistory()
  const dispatch = useDispatch()

  const open = useSelector((state) => state.modal.openConfirmCafe)
  const cafeName = useSelector((state) => state.modal.selectedCafe)

  const okBtnHandler = () => {
    history.push("/")
  }

  return (
    <Modal
      onClose={()=>dispatch(modalActions.toggleConfirmCafeModal())}
      open={open}
      size="mini"
    >
      <Modal.Description>
        <p>{cafeName}이 맞습니까?</p>
      </Modal.Description>
      <ModalActions>
        <Button size="tiny" onClick={okBtnHandler}>확인</Button>
        <Button size="tiny" onClick={()=>dispatch(modalActions.toggleConfirmCafeModal())}>취소</Button>
      </ModalActions>
    </Modal>
  )
}

export default ConfirmCafe
