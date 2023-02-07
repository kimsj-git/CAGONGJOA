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
  const okBtnHandler = async () => {
    await selectCafe({
      url: `${REST_DEFAULT_URL}/cafe/auth/select`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
      body: {
        cafeId: cafeData.id,
        latitude: JSON.parse(sessionStorage.getItem("location")).lat,
        longitude: JSON.parse(sessionStorage.getItem("location")).lng,
      },
    })
    const location = { lat: cafeData.latitude, lng: cafeData.longitude }
    const selectedCafeData = {
      lat: cafeData.latitude,
      lng: cafeData.longitude,
      cafeName: cafeData.name,
    }
    sessionStorage.setItem("location", JSON.stringify(location))
    sessionStorage.setItem("myCafe", JSON.stringify(selectedCafeData))
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
        <Modal.Content style={{textAlign:"center"}}>
          <p><b>{cafeData.name}</b> 맞습니까?</p>
        </Modal.Content>
        <ModalActions>
          <Button size="mini" onClick={okBtnHandler} color="blue">
            확인
          </Button>
          <Button
            size="mini"
            color="red"
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
