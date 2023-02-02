import { useHistory } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { Modal, Button, ModalActions } from "semantic-ui-react"

import { modalActions } from "../../../store/modal"
import useFetch from "../../../hooks/useFetch"

const REST_DEFAULT_URL = process.env.REACT_APP_REST_DEFAULT_URL

const ConfirmCafe = () => {
  const history = useHistory()
  const dispatch = useDispatch()

  const open = useSelector((state) => state.modal.openConfirmCafe)
  const cafeData = useSelector((state) => state.modal.selectedCafe)

  const { sendRequest: selectCafe } = useFetch()
  const okBtnHandler = () => {
    selectCafe({
      url: `${REST_DEFAULT_URL}/cafe/auth/select`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({ cafeId: `${cafeData.cafeId}` }),
    })
    dispatch(modalActions.toggleConfirmCafeModal())
    dispatch(modalActions.toggleNearCafeListModal())
    history.push("/")
  }
  if (cafeData) {
    return (
      <Modal
        onClose={() => dispatch(modalActions.closeConfirmCafeModal())}
        open={open}
        size="mini"
      >
        <Modal.Description>
          <p>{cafeData.cafeName} 맞습니까?</p>
        </Modal.Description>
        <ModalActions>
          <Button size="tiny" onClick={okBtnHandler}>
            확인
          </Button>
          <Button
            size="tiny"
            onClick={() => dispatch(modalActions.toggleConfirmCafeModal())}
          >
            취소
          </Button>
        </ModalActions>
      </Modal>
    )
  }
}

export default ConfirmCafe
