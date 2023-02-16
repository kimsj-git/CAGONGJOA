import { useSelector, useDispatch } from "react-redux"
import { Modal, Button, Icon, Popup } from "semantic-ui-react"
import { useState } from "react"

import { modalActions } from "../../../store/modal"
import ConfirmCafe from "./ConfirmCafe"
import NearCafeListItem from "./NearCafeListItem"
import { TbMoodCry } from "react-icons/tb"

const NearCafeList = (props) => {
  const dispatch = useDispatch()
  const open = useSelector((state) => state.modal.openNearCafeList)
  const cafeData = useSelector((state) => state.cafe.nearCafe)
  const isLoading = useSelector((state) => state.cafe.isCafeListLoading)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const closeHandler = () => {
    props.closeNearCafeList()
    dispatch(modalActions.toggleNearCafeListModal())
  }

  return (
    <Modal closeIcon onClose={closeHandler} open={open} size="tiny">
      <Modal.Header>
        <span style={{ marginRight: "1rem" }}>카페 방문 인증</span>
        <Button
          circular
          icon="refresh"
          style={{ backgroundColor: "rgb(255, 168, 168)" }}
          onClick={props.findNearCafe}
        />
      </Modal.Header>
      <Modal.Content
        scrolling
        style={{ backgroundColor: "var(--background-color)" }}
      >
        {isLoading && (
          <div
            style={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {" "}
            <Icon loading name="spinner" size="big" />
          </div>
        )}
        {!isLoading && (
          <>
            {cafeData.length > 0 && (
              <div
                style={{
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <p style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
                  현재 계신 카페를 선택해주세요!
                </p>
                <div
                  style={{
                    display: "flex",
                    flexGrow: 1,
                    flexWrap: "wrap",
                    flex: 1,
                    justifyContent: "center",
                  }}
                >
                  {cafeData.map((cafe) => {
                    return <NearCafeListItem key={cafe.id} cafeData={cafe} />
                  })}
                </div>
              </div>
            )}
            {cafeData.length === 0 && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBlock: "1rem 2.5rem",
                  }}
                >
                  <span style={{ fontSize: "1.5rem", marginRight: "0.5rem" }}>
                    주변에 카페가 없어요...
                  </span>
                  <TbMoodCry size={30} />
                </div>

                <Popup
                  trigger={
                    <Button
                      size="large"
                      style={{
                        backgroundColor: "var(--custom-brown)",
                        color: "var(--custom-beige)",
                        borderRadius: "15px",
                      }}
                      // inverted
                      fluid
                      onClick={() => {}}
                    >
                      영수증으로 인증하기
                    </Button>
                  }
                  content="COMMING SOON !"
                  inverted
                  position="top center"
                  offset={[0, 10]}
                  size="huge"
                />
              </div>
            )}
          </>
        )}
      </Modal.Content>
      <ConfirmCafe
        setIsCafeAuth={props.setIsCafeAuth}
        setIsJamSurvey={props.setIsJamSurvey}
      />
    </Modal>
  )
}

export default NearCafeList
