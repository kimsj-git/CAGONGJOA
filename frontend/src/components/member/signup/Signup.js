import { useEffect, useState } from "react"
import { useLocation, useHistory } from "react-router"
import { Input, Button, Icon } from "semantic-ui-react"
import { useSelector, useDispatch } from "react-redux"

import { checkNickname } from "../../../store/auth"
import { authActions } from "../../../store/auth"
import exceptionHandler from "../../common/exceptionHandler"

const DEFAULT_REST_URL = process.env.REACT_APP_REST_DEFAULT_URL

const Signup = ({ setIsAuthenticated }) => {
  const history = useHistory()
  const location = useLocation()
  const dispatch = useDispatch()
  const hangelcheck = /^[가-힣a-zA-Z0-9]+$/
  // props로 받아옴
  const oauthType = location.state.oauthType
  const oauthId = location.state.oauthId

  const [nickname, setNickname] = useState("") // 닉네임
  const isNicknameValid = useSelector((state) => state.auth.isNicknameValid)
  const isLoading = useSelector((state) => state.auth.checkLoading)
  const [isChecked, setIsChecked] = useState(false)
  const [isTyped, setIsTyped] = useState(false)

  let nicklength = 0
  for (var i = 0; i < nickname.length; i++) {
    //한글은 2, 영문은 1로 치환
    const nick = nickname.charAt(i)
    if (escape(nick).length > 4) {
      nicklength += 2
    } else {
      nicklength += 1
    }
  }

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
      const responseData = await response.json()
      if (responseData.httpStatus === "OK") {
        sessionStorage.setItem(
          "accessToken",
          responseData.data.jwtTokens.accessToken
        )
        sessionStorage.setItem(
          "refreshToken",
          responseData.data.jwtTokens.refreshToken
        )
        sessionStorage.setItem("nickname", responseData.data.nickname)
        setIsAuthenticated(true)
        history.push("/")
      } else {
        exceptionHandler(responseData)
      }
    } catch (error) {
        window.location.href='/login'
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
  const isNicknameLengthValid =
    nicklength > 3 && nicklength < 11 && nickname !== "" && nickname !== null
  const isFormValid =
    isNicknameValid &&
    nickname.trim() !== "" &&
    isChecked &&
    isNicknameLengthValid &&
    hangelcheck.test(nickname)

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
      {!isLoading && !isNicknameValid && isChecked && isTyped ? (
        <p style={{ color: "red" }}>사용할 수 없는 닉네임 입니다.</p>
      ) : !isLoading && nickname.search(/\s/) !== -1 ? (
        <p style={{ color: "red" }}>닉네임은 공백을 포함할 수 없습니다. </p>
      ) : !isLoading && !hangelcheck.test(nickname) && isTyped && isChecked ? (
        <p style={{ color: "red" }}>닉네임을 확인해주세요. </p>
      ) : !isLoading && isChecked && isTyped && !isNicknameLengthValid ? (
        <p style={{ color: "red" }}>
          영어 4~10글자 한글 2~5글자만 가능합니다.{" "}
        </p>
      ) : (
        !isLoading &&
        isTyped &&
        isChecked && <p style={{ color: "green" }}>사용 가능한 닉네임입니다!</p>
      )}
    </form>
  )
}

export default Signup
