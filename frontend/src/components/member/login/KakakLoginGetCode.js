// 토큰 주고 받고, 유저 정보 저장을 위한 파일
import { useEffect } from "react"
import { useHistory } from "react-router-dom"

const DEFAULT_REST_URL = process.env.REACT_APP_REST_DEFAULT_URL

const KakaoLoginGetCode = () => {
  const history = useHistory()
  // 화면 생성시 시작
  useEffect(() => {
    const PARAMS = new URL(document.location).searchParams
    const KAKAO_CODE = PARAMS.get("code")
    const startLogin = async () => {
      try {
        // 토큰 가져오기(백엔드에서 토큰을 주는 url 넣어야함)
        const response = await fetch(`${DEFAULT_REST_URL}/oauth/kakao`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: KAKAO_CODE,
          }),
        })
        console.log(response)
        if (!response.ok) {
          throw new Error("오류")
        }
        // DB 저장되어 있는 유저면
        if (response.status === 200) {
          const responseData = await response.json()
          sessionStorage.setItem("token", responseData.token)
          sessionStorage.setItem("nickname", responseData.nickname)
          history.push("/mainpage")
        }
        // 첫 로그인 회원일 경우
        if (response.status === 201) {
          history.push({
            pathname: `/signup`,
            props: { oAuthId: response.oAuth_Id, type: response.type },
          })
        }
      } catch (error) {
        console.log(error)
      }
    }
    startLogin()
  }, [history])
}

export default KakaoLoginGetCode
