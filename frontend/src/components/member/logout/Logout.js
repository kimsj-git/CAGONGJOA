import { Button } from "semantic-ui-react"
import { useHistory } from "react-router"
const DEFAULT_REST_URL = process.env.REACT_APP_REST_DEFAULT_URL

const Logout = () => {
  const history = useHistory()
  const logout = async () => {
    await fetch(`${DEFAULT_REST_URL}/member/logout`)
    sessionStorage.clear()
    history.push('/login')
  }
  return <Button onClick={logout}>로그아웃</Button>
}

export default Logout