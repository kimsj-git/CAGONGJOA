// 토큰 주고 받고, 유저 정보 저장을 위한 파일

import { useEffect } from "react"
import { useHistory } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"

import { authActions } from "../../store/auth"

const KakaoLoginGetCode = () => {
  const history = useHistory()
  const dispatch = useDispatch()

  // 화면 생성시 시작
  useEffect(async () => {
    const PARAMS = new URL(document.location).searchParams
    const KAKAO_CODE = PARAMS.get("code")
    try {
      // 토큰 가져오기(백엔드에서 토큰을 주는 url 넣어야함)
      const resToken = await fetch("url")
      if (!resToken.ok) {
        throw new Error("오류")
      }
      const tokenData = await resToken.json()
      localStorage.setItem("token", tokenData.token)
      // 백엔드에서 유저 정보를 주는 url를 넣어야함, 어떤 데이터를 받을껀지 설정도 해줘야함
      const resUserInfo = await fetch("url", {
        headers: {
          Authorization: "Bearer " + tokenData.token,
        },
      })
      const userInfoData = await resUserInfo.json()
      
    } catch (error) {}
    // 아직 어떻게 비교하는지 몰라서 구현 X
    // 최초 로그인일 경우 회원가입 페이지로 이동
    dispatch(authActions.login(userInfoData.username))
    history.push("/signup")
    // 아닌경우 메인페이지로 이동
    history.push("/mainpage")
  }, [history])
}

export default KakaoLoginGetCode
