import { useEffect, useState } from "react"
import { useLocation, useHistory } from "react-router"
import { Input, Button, Icon } from "semantic-ui-react"
import { useSelector, useDispatch } from "react-redux"

import { checkNickname } from "../../../store/auth"
import { authActions } from "../../../store/auth"

const DEFAULT_REST_URL = process.env.REACT_APP_REST_DEFAULT_URL

const Signup = () => {
  const history = useHistory()
  const location = useLocation()
  const dispatch = useDispatch()

  // props로 받아옴
  const oauthType = location.state.oauthType
  const oauthId = location.state.oauthId

  const [nickname, setNickname] = useState("") // 닉네임
  const isNicknameValid = useSelector((state) => state.auth.isNicknameValid)
  const isLoading = useSelector((state) => state.auth.checkLoading)
  const [isChecked, setIsChecked] = useState(false)
  const [isTyped, setIsTyped] = useState(false)

  const formSubmissionHandler = (event) => {
    event.preventDefault()
  }

  const nicknameChangeHandler = (event) => {
    setNickname(event.target.value)
    setIsTyped(true)
    setIsChecked(false)
    dispatch(authActions.nowLoading())
  }

  const giveSignupData = async () => {
    // 제출 버튼 클릭시 nickname post api 호출
    try {
      const response = await fetch(`${DEFAULT_REST_URL}/oauth/setNickname`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nickname,
          oauthType,
          oauthId,
        }),
      })
      if (!response.ok) {
        history.push("/error")
      }
      const responseData = await response.json()
      if (responseData.httpStatus === "OK") {
        sessionStorage.setItem("accessToken", responseData.data.accessToken)
        sessionStorage.setItem("refreshToken", responseData.data.refreshToken)
        sessionStorage.setItem("nickname", nickname)
        history.push("/")
      }
    } catch (error) {
      history.push("/error")
    }
  }
  useEffect(() => {
    const identifier = setTimeout(() => {
      dispatch(checkNickname(nickname))
      setIsChecked(true)
    }, 1000)
    return () => {
      clearTimeout(identifier)
    }
  }, [nickname, dispatch])
  const isNicknameLengthValid = nickname.length > 4 && nickname.length < 10
  const isFormValid =
    isNicknameValid &&
    nickname.trim() !== "" &&
    isChecked &&
    isNicknameLengthValid

  return (
    <form onSubmit={formSubmissionHandler}>
      {!isTyped ? (
        <Input
          onChange={nicknameChangeHandler}
          value={nickname}
          placeholder="닉네임"
        />
      ) : isLoading ? (
        <Input onChange={nicknameChangeHandler} value={nickname} loading />
      ) : isFormValid ? (
        <Input
          onChange={nicknameChangeHandler}
          value={nickname}
          icon={<Icon name="check circle" color="green" />}
        />
      ) : (
        <Input
          onChange={nicknameChangeHandler}
          value={nickname}
          icon={<Icon name="check circle" color="red" />}
        />
      )}

      {isFormValid ? (
        <Button onClick={giveSignupData}>제출</Button>
      ) : (
        <Button onClick={giveSignupData} disabled={true}>
          제출
        </Button>
      )}
      {!isNicknameValid && isChecked && isTyped && (
        <p style={{ color: "red" }}>중복된 닉네임입니다.</p>
      )}
      {isChecked && isTyped && !isNicknameLengthValid && (
        <p style={{ color: "red" }}>5글자 이상 10글자 이하만 가능합니다. </p>
      )}
    </form>
  )
}

export default Signup
