import { useSelector, useDispatch } from "react-redux"
import { Modal, Button } from "semantic-ui-react"

import { modalActions } from "../../../store/modal"
import ConfirmCafe from "./ConfirmCafe"
import NearCafeListItem from "./NearCafeListItem"

const CAFE_LIST_DUMMY_DATA = [
  "스타벅스 역삼",
  "할리스 역삼",
  "바나프레소 테헤란로",
]

const NearCafeList = () => {
  const dispatch = useDispatch()
  const open = useSelector((state) => state.modal.openNearCafeList)

  return (
    <Modal
      closeIcon
      onClose={() => dispatch(modalActions.toggleNearCafeListModal())}
      onOpen={() => dispatch(modalActions.toggleNearCafeListModal())}
      open={open}
      size="small"
    >
      <Modal.Header>카페 방문 인증</Modal.Header>
      <Modal.Description>
        {CAFE_LIST_DUMMY_DATA.length > 0 && (
          <div>
            <p>현재 계신 카페를 선택해주세요!</p>,
            {CAFE_LIST_DUMMY_DATA.map((cafe) => {
              return <NearCafeListItem cafeName={cafe} key={cafe} />
            })}
          </div>
        )}
        {CAFE_LIST_DUMMY_DATA.length === 0 && (
          <div>
            <p>주변에 카페가 없어요...</p>
            <Button>영수증으로 인증하기</Button>
          </div>
        )}
      </Modal.Description>
      <ConfirmCafe />
    </Modal>
  )
}

export default NearCafeList
