import { useSelector, useDispatch } from "react-redux"
import { Modal, Button, Icon } from "semantic-ui-react"

import { modalActions } from "../../../store/modal"
import ConfirmCafe from "./ConfirmCafe"
import NearCafeListItem from "./NearCafeListItem"

const NearCafeList = (props) => {
  const dispatch = useDispatch()
  const open = useSelector((state) => state.modal.openNearCafeList)
  const cafeData = useSelector((state) => state.cafe.nearCafe)
  const isLoading = useSelector((state) => state.cafe.isCafeListLoading)

  const closeHandler = () => {
    props.closeNearCafeList()
    dispatch(modalActions.toggleNearCafeListModal())
  }

  return (
    <Modal closeIcon onClose={closeHandler} open={open} size="tiny">
      <Modal.Header>
        <span>카페 방문 인증</span>
        <Button
          circular
          icon="refresh"
          style={{ backgroundColor: "rgb(255, 168, 168)" }}
          onClick={props.findNearCafe}
        />
      </Modal.Header>
      <Modal.Content>
        {isLoading && (
          <div style={{ textAlign: "center" }}>
            {" "}
            <Icon loading name="spinner" size="big" />
          </div>
        )}
        {!isLoading && (
          <>
            {cafeData.length > 0 && (
              <div style={{ textAlign: "center" }}>
                <p style={{ fontWeight: "bold" }}>
                  현재 계신 카페를 선택해주세요!
                </p>
                {cafeData.map((cafe) => {
                  return <NearCafeListItem key={cafe.id} cafeData={cafe} />
                })}
              </div>
            )}
            {cafeData.length === 0 && (
              <div>
                <p>주변에 카페가 없어요...</p>
                <Button
                  onClick={() => {
                    alert("업데이트 중..")
                  }}
                >
                  영수증으로 인증하기
                </Button>
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
