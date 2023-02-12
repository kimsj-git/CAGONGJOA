import { Button } from "semantic-ui-react"
import { useHistory } from "react-router"
const DEFAULT_REST_URL = process.env.REACT_APP_REST_DEFAULT_URL

const Logout = ({setIsAuthenticated, setIsCafeAuth}) => {
  const history = useHistory()
  const logout = async () => {
    const response = await fetch(`${DEFAULT_REST_URL}/member/logout`,
    {
      method: "GET",
      headers: {
        "Authorization" : `Bearer ${sessionStorage.getItem('accessToken')}`,
        "Authorization-RefreshToken" : `Bearer ${sessionStorage.getItem('refreshToken')}`
      }
    })
    const responseData = await response.json()
    console.log(responseData)
    if (responseData.httpStatus === "BAD_REQUEST" && responseData.data.sign === "JWT"){
      console.log('logout, 1.유효하지 않은 토큰')
    }
    else if (responseData.httpStatus==="OK"){
      setIsAuthenticated(false)
      setIsCafeAuth(false)
      sessionStorage.clear()
      history.push('/login')
    } else{
      alert("오류가 발생했습니다.")
    }
  }
  return <Button onClick={logout}>로그아웃</Button>
}

export default Logout