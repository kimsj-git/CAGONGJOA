import { useState } from "react"
import { useHistory } from "react-router-dom"
import { Modal, Icon, Input, Button } from "semantic-ui-react"

const REST_DEFAULT_URL = process.env.REACT_APP_REST_DEFAULT_URL

const DeleteMember = ({ open, setOpen }) => {
  const history = useHistory()
  const [inputValue, setInputValue] = useState("")

  const inputHandler = (e) => {
    setInputValue(e.target.value)
  }

  const deleteHandler = async () => {
    const response = await fetch(`${REST_DEFAULT_URL}/member`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
    })
    const responseData = await response.json()
    if (responseData.httpStatus === "OK") {
      sessionStorage.clear()
      history.push("/login")
    } else if (
      responseData.httpStatus === "UNAUTHORIZED" &&
      responseData.data.sign === "JWT"
    ) {
      //리프레쉬 토큰 보내주기
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
        history.push("/login")
        alert("세션이 만료되었습니다.")
      } else if (responseData.httpStatus === "OK") {
        sessionStorage.setItem("accessToken", responseData.data.accessToken)
        deleteHandler()
      }
    }
  }

  return (
    <Modal
      size="tiny"
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={
        <div>
          <Icon.Group>
            <Icon name="user outline" />
            <Icon name="trash alternate" corner />
          </Icon.Group>
          <span>회원 탈퇴</span>
        </div>
      }
    >
      <Modal.Header>회원 탈퇴</Modal.Header>
      <Modal.Content>
        회원 탈퇴를 완료할려면 <b>"회원 탈퇴"</b>를 입력해 주세요.
        <Input value={inputValue} onChange={inputHandler} />
        <Button
          disabled={inputValue !== "회원 탈퇴" ? true : false}
          onClick={deleteHandler}
          color="red"
        >
          회원 탈퇴
        </Button>
      </Modal.Content>
    </Modal>
  )
}

export default DeleteMember
