import { useSelector, useDispatch } from "react-redux"
import { Modal, Button, Icon } from "semantic-ui-react"

import { modalActions } from "../../../store/modal"
import ConfirmCafe from "./ConfirmCafe"
import NearCafeListItem from "./NearCafeListItem"

const NearCafeList = () => {
  const dispatch = useDispatch()
  const open = useSelector((state) => state.modal.openNearCafeList)
  const cafeData = useSelector((state) => state.cafe.nearCafe)
  const isLoading = useSelector((state) => state.cafe.isCafeListLoading)

  return (
    <Modal
      closeIcon
      onClose={() => dispatch(modalActions.toggleNearCafeListModal())}
      onOpen={() => dispatch(modalActions.toggleNearCafeListModal())}
      open={open}
      size="small"
    >
      <Modal.Header>카페 방문 인증</Modal.Header>
      <Modal.Content>
        {isLoading && <Icon loading name="spinner" size="big" />}
        {!isLoading && (
          <>
            {cafeData.length > 0 && (
              <div>
                <p>현재 계신 카페를 선택해주세요!</p>,
                {cafeData.map((cafe) => {
                  return <NearCafeListItem key={cafe.cafeId} cafeName={cafe.name} cafeId={cafe.cafeId} />
                })}
              </div>
            )}
            {cafeData.length === 0 && (
              <div>
                <p>주변에 카페가 없어요...</p>
                <Button>영수증으로 인증하기</Button>
              </div>
            )}
          </>
        )}
      </Modal.Content>
      <ConfirmCafe />
    </Modal>
  )
}

export default NearCafeList
