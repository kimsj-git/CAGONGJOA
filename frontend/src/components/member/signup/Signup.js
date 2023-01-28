import { useCallback, useEffect, useState } from "react"
import { useLocation, useHistory } from "react-router"

const DEFAULT_REST_URL = process.env.REACT_APP_REST_DEFAULT_URL

const Signup = () => {
  const history = useHistory()
  const location = useLocation()

  // props로 받아옴
  const oauthType = location.state.oauthType
  const oauthId = location.state.oauthId

  const [nickname, setNickname] = useState("") // 닉네임
  const [isNicknameValid, setIsNicknameValid] = useState(false) // 닉네임 유효성
  const formSubmissionHandler = (event) => {
    event.preventDefault()
  }
  
  const nicknameChangeHandler = (event) => {
    setNickname(event.target.value)
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
        throw new Error("오류")
      }
      const responseData = await response.json()
      sessionStorage.setItem("accessToken", responseData.jwt.accessToken)
      sessionStorage.setItem("refreshToken", responseData.jwt.refreshToken)
      history.push('/')
    } catch (error) {
      console.log(error)
    }
  }

  const checkNickname = useCallback(async () => {
    const response = await fetch(
      `${DEFAULT_REST_URL}/member/checkDuplicatedNickname?nickname=${nickname}`
    )
    if (!response.ok) {
      setIsNicknameValid(false)
    } else {
      setIsNicknameValid(true)
    }
  }, [nickname])

  useEffect(() => {
    const identifier = setTimeout(() => {
      checkNickname()
    }, 1000)
    return () => {
      clearTimeout(identifier)
    }
  }, [nickname, checkNickname])
  const isFormValid = isNicknameValid && nickname.trim() !== ""
  return (
    <form onSubmit={formSubmissionHandler}>
      <input
        onChange={nicknameChangeHandler}
        value={nickname}
      />
      {!isFormValid && (
        <p style={{ color: "red" }}>중복된 닉네임입니다.</p>
      )}
      {isFormValid ? (
        <button onClick={giveSignupData}>제출</button>
      ) : (
        <button onClick={giveSignupData} disabled={true}>
          제출
        </button>
      )}
    </form>
  )
}

export default Signup
