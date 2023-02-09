import { Button } from "semantic-ui-react"
import { useHistory } from "react-router"
const DEFAULT_REST_URL = process.env.REACT_APP_REST_DEFAULT_URL

const Logout = () => {
  const history = useHistory()
  const logout = async () => {
    const response = await fetch(`${DEFAULT_REST_URL}/member/logout?nickname=${sessionStorage.getItem('nickname')}`,
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
      history.push('/error')
    }
    sessionStorage.clear()
    history.push('/login')
  }
  return <Button onClick={logout}>로그아웃</Button>
}

export default Logout