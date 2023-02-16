import {
  Grid,
  GridColumn,
  Modal,
  Button,
  Segment,
  Header,
} from "semantic-ui-react"
import "./CafeAuth.css"
import { useSelector, useDispatch } from "react-redux"
import { HiMapPin, HiOutlineMapPin } from "react-icons/hi2"

import { modalActions } from "../../../store/modal"
import { findNearCafeData } from "../../../store/cafe"
import NearCafeList from "./NearCafeList"
import { GrMapLocation } from "react-icons/gr"
import { TbReceipt2 } from "react-icons/tb"

const CafeAuth = (props) => {
  const dispatch = useDispatch()
  const open = useSelector((state) => state.modal.openCafeAuthModal)

  const nextPageHander = () => {
    findNearCafe()
    dispatch(modalActions.toggleNearCafeListModal())
    dispatch(modalActions.closeCafeAuthModal())
  }

  const findNearCafe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        dispatch(findNearCafeData(location))
      })
    }
  }

  const closeHandler = () => {
    props.closeModal()
    dispatch(modalActions.closeCafeAuthModal())
  }

  const closeNearCafeList = () => {
    props.closeModal()
  }

  return (
    <>
      <Modal
        className="cafe-auth-modal"
        basic
        closeIcon
        onClose={closeHandler}
        onOpen={() => dispatch(modalActions.openCafeAuthModal())}
        open={open}
        // size="small"
        trigger={
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {props.activeItem === "location" ? (
              <HiMapPin size="30" color="black" />
            ) : (
              <HiOutlineMapPin size="30" color="black" />
            )}
            {props.isMainNavigation ? "" : <p>위치인증</p>}
          </div>
        }
      >
        <Modal.Header style={{ textAlign: "center", fontSize: "1.7rem" }}>
          카페에 방문하셨나요?
        </Modal.Header>
        <Modal.Content>
          <Button.Group size="huge">
            <Button
              onClick={nextPageHander}
              style={{ backgroundColor: "var(--custom-pink)" }}
            >
              <GrMapLocation size={50} />
              <Header>현재 위치로 인증하기</Header>
              <p>카페에 머무르는 동안 글을 쓸 수 있어요.</p>
            </Button>
            <Button.Or />
            <Button>
              <TbReceipt2 size={50} />
              <Header>영수증으로 인증하기</Header>
              <p>COMING SOON!</p>
            </Button>
          </Button.Group>
        </Modal.Content>
      </Modal>
      <NearCafeList
        closeNearCafeList={closeNearCafeList}
        setIsCafeAuth={props.setIsCafeAuth}
        setIsJamSurvey={props.setIsJamSurvey}
        findNearCafe={findNearCafe}
      />
    </>
  )
}

export default CafeAuth
