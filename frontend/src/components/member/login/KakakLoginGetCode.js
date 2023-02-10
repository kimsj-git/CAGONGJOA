// 토큰 주고 받고, 유저 정보 저장을 위한 파일
import { useEffect } from "react"
import { useHistory } from "react-router-dom"

const DEFAULT_REST_URL = process.env.REACT_APP_REST_DEFAULT_URL

const KakaoLoginGetCode = () => {
  // 화면 생성시 시작
  const history = useHistory()
  const PARAMS = new URL(document.location).searchParams
  const KAKAO_CODE = PARAMS.get("code")
  useEffect(() => {
    
    const startLogin = async () => {
      try {
        // 토큰 가져오기(백엔드에서 토큰을 주는 url 넣어야함)
        const response = await fetch(`${DEFAULT_REST_URL}/oauth/kakao?code=${KAKAO_CODE}`, {
          method: "GET",
        })
        // DB 저장되어 있는 유저면
        const responseData = await response.json()
        if (responseData.httpStatus === "OK") {
          console.log('kakaoLogin, 1. 로그인 성공 세션스토리지 확인')
          sessionStorage.setItem("accessToken", responseData.data.jwtTokens.accessToken)
          sessionStorage.setItem("refreshToken", responseData.data.jwtTokens.refreshToken)
          sessionStorage.setItem("nickname", responseData.data.nickname)
          history.push("/")
        }
        // 첫 로그인 회원일 경우
        else if (responseData.httpStatus === "CREATED") {
          console.log('kakaoLogin, 2. 회원가입이 필요한 회원')
          history.push({
            pathname: `/signup`,
            state: { oauthId: responseData.data.kakaoMemberId, oauthType: responseData.data.oauthType },
          })
        }
        else {
          console.log('kakaoLogin,3. 로그인 싪패, error')
          console.log(responseData)
        }
      } catch (error) {
        console.log(error)
      }
    }
    startLogin()
  }, [history, KAKAO_CODE])
}

export default KakaoLoginGetCode
