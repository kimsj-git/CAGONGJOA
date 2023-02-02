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
      url: `${REST_DEFAULT_URL}/cafeAuth/select`,
      method: "POST",
      headers: {Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      body: {cafeId:`${cafeData.cafeId}`}
    },
    })
    history.push("/")
  }

  return (
    <Modal
      onClose={() => dispatch(modalActions.toggleConfirmCafeModal())}
      open={open}
      size="mini"
    >
      <Modal.Description>
        <p>{cafeData.name}이 맞습니까?</p>
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

export default ConfirmCafe
