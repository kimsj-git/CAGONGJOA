import { Modal, Image, Header, Icon, Button } from "semantic-ui-react"
import { useHistory } from "react-router-dom"
import { useState } from "react"
const REST_DEFAULT_URL = process.env.REACT_APP_REST_DEFAULT_URL

const GetBeanModal = (props) => {
  const history = useHistory()
  const [open, setOpen] = useState(props.open)

  const submitHandler = async (e) => {
    const date = new Date()
    const year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    if (month < 10) {
      month = "0" + month
    }
    if (day < 10) {
      day = "0" + day
    }
    const response = await fetch(`${REST_DEFAULT_URL}/cafe/crowd/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        crowdLevel: props.selectedBtn + 1,
        todayDate: `${year}${month}${day}`,
      }),
    })
    const responseData = await response.json()
    if (
      responseData.httpStatus === "UNAUTHORIZED" &&
      responseData.data.sign === "CAFE"
    ) {
      setOpen(false)
      alert("카페 인증이 필요합니다.")
    } else if (
      responseData.httpStatus === "BAD_REQUEST" &&
      responseData.data.sign === "CAFE"
    ) {
      setOpen(false)
      props.setIsJamSurvey(true)
      alert("이미 혼잡도 설문을 제출 했습니다.")
    } else if (
      responseData.httpStatus === "BAD_REQUEST" &&
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
        alert("세션이 만료되었습니다.")
        sessionStorage.clear()
        setOpen(false)
        history.push("/login")
      } else if (responseData.httpStatus === "OK") {
        sessionStorage.setItem("accessToken", responseData.data.accessToken)
        setOpen(false)
        alert("다시 시도해주세요.")
      }
    } else if (responseData.httpStatus === "CREATED") {
      setOpen(true)
      let todayCafe = JSON.parse(sessionStorage.getItem("todayCafe"))
      todayCafe = { ...todayCafe, isCrowdSubmitted: true }
      sessionStorage.setItem("todayCafe", JSON.stringify(todayCafe))
      setTimeout(() => {
        props.setIsJamSurvey(true)
        window.location.reload()
      }, 1500)
    }
  }
  return (
    <Modal
      open={open}
      basic
      onOpen={() => {
        setTimeout(() => {
          setOpen(false)
        }, 1500)
      }}
      trigger={
        props.location === "jamSurv" && (
          <Button
            onClick={submitHandler}
            fluid
            style={{ border: "2px solid black", borderRadius: "20px" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.3rem",
              }}
            >
              제보하고 커피콩 받기
              <Image
                style={{ marginLeft: "1rem" }}
                size="mini"
                src={require("../../assets/icons/give_beans.png")}
              />
            </div>
          </Button>
        )
      }
    >
      <Header icon style={{ fontSize: "2rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "3rem",
          }}
        >
          <Image
            // style={{ marginLeft: "1rem" }}
            // size="mini"
            src={require("../../assets/icons/get_beans.png")}
          />
        </div>
        커피콩 {props.beanNum}개 획득!
      </Header>
    </Modal>
  )
}

export default GetBeanModal
