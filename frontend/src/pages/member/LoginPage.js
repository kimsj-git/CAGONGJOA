// 로그인 페이지
import { useEffect } from "react"
import SetLocation from "../../components/map/SetLocation"
import KakaoLogin from "../../components/member/login/KakaoLogin"

const LoginPage = () => {
  useEffect(()=> {
    SetLocation()
  }, [])
  
  return (
    <div id="login-wrapper">
      <h1>카공조아</h1>
      <KakaoLogin />
    </div>
  )
}

export default LoginPage