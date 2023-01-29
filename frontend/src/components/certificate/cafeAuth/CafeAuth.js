import { useCallback, useEffect, useState } from "react"
import { Modal, Button } from "semantic-ui-react"
import { useSelector, useDispatch } from "react-redux"

import { modalActions } from "../../../store/modal"

const CafeAuth = () => {
  const dispatch = useDispatch()
  const open = useSelector((state) => state.modal.openCafeAuthModal)

  const [location, setLocation] = useState({
    myLocation: {
      lat: 0,
      lng: 0,
    },
    errMsg: null,
  })

  const nextPageHander = () => {
    dispatch(modalActions.toggleNearCafeListModal())
    dispatch(modalActions.toggleCafeAuthModal())
  }

  const getLocation = useCallback(() => {
    if (navigator.geolocation) {
      // GeoLocation을 이용해서 접속 위치를 얻어옵니다
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation((prev) => ({
            ...prev,
            myLocation: {
              lat: position.coords.latitude, // 위도
              lng: position.coords.longitude, // 경도
            },
          }))
        },
        (err) => {
          setLocation((prev) => ({
            ...prev,
            errMsg: err.message,
          }))
        }
      )
    } else {
      // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
      setLocation((prev) => ({
        ...prev,
        errMsg: "geolocation을 사용할수 없어요..",
      }))
    }
  }, [setLocation])
  useEffect(() => {
    getLocation()
    console.log(location)
  }, [getLocation])

  return (
    <Modal
      closeIcon
      onClose={() => dispatch(modalActions.toggleCafeAuthModal())}
      onOpen={() => dispatch(modalActions.toggleCafeAuthModal())}
      open={open}
      size="small"
      trigger={
        <Button circular size="small">
          인증하기
        </Button>
      }
    >
      <Modal.Header>카페 방문 인증</Modal.Header>
      <Modal.Description>
        <div style={{ border: "solid black 2px" }} onClick={nextPageHander}>
          <p>현재 위치로 인증하기</p>
          <p>카페에 머루르는 동안 글을 쓸 수 있어요.</p>
        </div>
        <div style={{ border: "solid black 2px" }}>
          <p>영수증으로 인증하기</p>
          <p>내일 오전 6시까지 글을 쓸 수 있어요.</p>
        </div>
      </Modal.Description>
    </Modal>
  )
}

export default CafeAuth
