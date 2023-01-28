// 토큰 주고 받고, 유저 정보 저장을 위한 파일
import { useEffect } from "react"
import { useHistory } from "react-router-dom"

const DEFAULT_REST_URL = process.env.REACT_APP_REST_DEFAULT_URL

const KakaoLoginGetCode = () => {
  const history = useHistory()
  // 화면 생성시 시작
  const PARAMS = new URL(document.location).searchParams
  const KAKAO_CODE = PARAMS.get("code")
  useEffect(() => {
    
    const startLogin = async () => {
      try {
        // 토큰 가져오기(백엔드에서 토큰을 주는 url 넣어야함)
        const response = await fetch(`${DEFAULT_REST_URL}/oauth/kakao?code=${KAKAO_CODE}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
        if (!response.ok) {
          throw new Error("오류")
        }
        // DB 저장되어 있는 유저면
        const responseData = await response.json()
        console.log(responseData.memberInfo)
        if (response.status === 200) {
          sessionStorage.setItem("accessToken", responseData.jwt.accessToken)
          sessionStorage.setItem("refreshToken", responseData.jwt.refreshToken)
          history.push("/")
        }
        // 첫 로그인 회원일 경우
        if (response.status === 201) {
          history.push({
            pathname: `/signup`,
            state: { oauthId: responseData.memberInfo.oauthId, oauthType: responseData.memberInfo.oauthType },
          })
        }
      } catch (error) {
        console.log(error)
      }
    }
    startLogin()
  }, [history, KAKAO_CODE])
}

export default KakaoLoginGetCode
