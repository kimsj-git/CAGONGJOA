import { useState } from "react"
import { useHistory } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { Modal, Button, ModalActions, Icon } from "semantic-ui-react"

import { modalActions } from "../../../store/modal"
import exceptionHandler from "../../common/exceptionHandler"

const REST_DEFAULT_URL = process.env.REACT_APP_REST_DEFAULT_URL

const ConfirmCafe = ({ setIsCafeAuth, setIsJamSurvey }) => {
  const history = useHistory()
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const open = useSelector((state) => state.modal.openConfirmCafe)
  const cafeData = useSelector((state) => state.modal.selectedCafe)
  const date = new Date()
  const [year, month, day] = date.toLocaleDateString().split(".")
  const confirmHandler = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        okBtnHandler(location)
      })
    }
  }
  const okBtnHandler = async (location) => {
    setIsLoading(true)
    const response = await fetch(`${REST_DEFAULT_URL}/cafe/auth/select`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        cafeId: cafeData.id,
        latitude: location.lat,
        longitude: location.lng,
        todayDate: `${year}${month < 10 ? "0" + month.trim() : month.trim()}${
          day < 10 ? "0" + day.trim() : day.trim()
        }`,
      }),
    })
    setIsLoading(false)
    const responseData = await response.json()
    const rewardCoin = responseData.data.rewardCoin
    if (responseData.httpStatus === "CREATED") {
      const response = await fetch(`${REST_DEFAULT_URL}/cafe/auth/data`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      })
      const responseData = await response.json()
      if (responseData.httpStatus === "OK") {
        //현재 위치
        const location = { lat: cafeData.latitude, lng: cafeData.longitude }
        // 선택한 카페 정보
        const selectedCafeData = {
          lat: cafeData.latitude,
          lng: cafeData.longitude,
          cafeName: cafeData.name,
        }
        sessionStorage.setItem("myCafe", JSON.stringify(selectedCafeData))
        sessionStorage.setItem("location", JSON.stringify(location))
        sessionStorage.setItem("cafeAuth", 1)
        // 오늘의 카페에서 사용할 정보
        const todayCafe = {
          coffeeBeanCnt: responseData.data.coffeeBeanCnt,
          coffeeCnt: responseData.data.coffeeCnt,
          exp: responseData.data.exp,
          fortune: responseData.data.fortune,
          isSurveySubmitted: responseData.data.isSurveySubmitted,
          isCrowdSubmitted: responseData.data.isCrowdSubmitted,
          brandType: responseData.data.brandType,
          accTime: responseData.data.accTime,
        }
        sessionStorage.setItem("todayCafe", JSON.stringify(todayCafe))
        sessionStorage.setItem("todoList", responseData.data.todoList)
        setIsJamSurvey(responseData.data.isCrowdSubmitted)
        setIsCafeAuth("1")
        if (rewardCoin === 10) {
          alert("출석 보상: 커피콩 10개 획득!")
          dispatch(modalActions.toggleConfirmCafeModal())
          dispatch(modalActions.toggleNearCafeListModal())
        }
      } else if (
        responseData.httpStatus === "UNAUTHORIZED" &&
        responseData.data.sign === "JWT"
      ) {
        const response = await fetch(`${REST_DEFAULT_URL}/member/refresh`, {
          method: "GET",
          headers: {
            "Authorization-RefreshToken": `Bearer ${sessionStorage.getItem(
              "refreshToken"
            )}`,
          },
        })
        const responseData = await response.json()
        if (responseData.httpStatus !== "OK") {
          sessionStorage.clear()
          alert("세션 만료되었습니다.")
          window.location.href = '/login'
        } else if (responseData.httpStatus === "OK") {
          sessionStorage.setItem("accessToken", responseData.data.accessToken)
          okBtnHandler(location)
        }
      } else {
        exceptionHandler({status:responseData.httpStatus, data:responseData.data, func:okBtnHandler, dataSet:location})
        window.location.href = '/error'
      }
    } else {
      exceptionHandler({status:responseData.httpStatus, data:responseData.data, func:okBtnHandler, dataSet:location})
      window.location.href = '/error'
    }
    dispatch(modalActions.toggleConfirmCafeModal())
    dispatch(modalActions.toggleNearCafeListModal())
    window.location.href = '/'
  }

  if (cafeData) {
    return (
      <Modal
        onClose={() => dispatch(modalActions.closeConfirmCafeModal())}
        open={open}
        // size="mini"
      >
        {isLoading ? (
          <Modal.Content style={{ textAlign: "center" }}>
            <Icon name="spinner" loading />
          </Modal.Content>
        ) : (
          <>
            <Modal.Content style={{ textAlign: "center" }}>
              <p>
                <b>{cafeData.name}</b> 가 맞나요?
              </p>
            </Modal.Content>
            <ModalActions>
              <Button size="mini" onClick={confirmHandler} color="blue">
                확인
              </Button>
              <Button
                size="mini"
                color="green"
                onClick={() => dispatch(modalActions.toggleConfirmCafeModal())}
              >
                취소
              </Button>
            </ModalActions>
          </>
        )}
      </Modal>
    )
  }
}

export default ConfirmCafe
