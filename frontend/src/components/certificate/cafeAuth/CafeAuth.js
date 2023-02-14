import { Grid, GridColumn, Modal } from "semantic-ui-react"
import { useSelector, useDispatch } from "react-redux"
import { HiMapPin, HiOutlineMapPin } from "react-icons/hi2"

import { modalActions } from "../../../store/modal"
import { findNearCafeData } from "../../../store/cafe"
import NearCafeList from "./NearCafeList"
import classes from "./CafeAuth.module.css"

const CafeAuth = (props) => {
  const dispatch = useDispatch()
  const open = useSelector((state) => state.modal.openCafeAuthModal)

  const nextPageHander = () => {
    dispatch(findNearCafeData(0.2))
    dispatch(modalActions.toggleNearCafeListModal())
    dispatch(modalActions.closeCafeAuthModal())
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
        closeIcon
        onClose={closeHandler}
        onOpen={() => dispatch(modalActions.openCafeAuthModal())}
        open={open}
        size="tiny"
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
            <p>위치인증</p>
          </div>
        }
      >
        <Modal.Header>카페 방문 인증</Modal.Header>
        <Modal.Content>
          <Grid divided centered verticalAlign="middle">
            <Grid.Row>
              <GridColumn
                onClick={nextPageHander}
                width={6}
                textAlign="center"
                className={classes.modalContent}
              >
                <p style={{ fontWeight: "bolder" }}>현재 위치로 인증하기</p>
                <hr />
                <p style={{ opacity: "0.5" }}>
                  카페에 머루르는 동안 글을 쓸 수 있어요.
                </p>
              </GridColumn>
              <GridColumn width={1}></GridColumn>
              <GridColumn
              onClick={()=>{alert("업데이트 중..")}}
                width={6}
                textAlign="center"
                verticalAlign="middle"
                className={classes.modalContent}
              >
                <p style={{ fontWeight: "bolder" }}>영수증으로 인증하기</p>
                <hr />
                <p style={{ opacity: "0.5" }}>
                  내일 오전 6시까지 글을 쓸 수 있어요.
                </p>
              </GridColumn>
            </Grid.Row>
          </Grid>
        </Modal.Content>
      </Modal>
      <NearCafeList closeNearCafeList={closeNearCafeList} setIsCafeAuth={props.setIsCafeAuth} setIsJamSurvey={props.setIsJamSurvey}/>
    </>
  )
}

export default CafeAuth
