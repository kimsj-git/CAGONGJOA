import { Button, Segment } from "semantic-ui-react"
import { useHistory } from "react-router"
import { HiOutlineLogout } from "react-icons/hi"
const DEFAULT_REST_URL = process.env.REACT_APP_REST_DEFAULT_URL

const Logout = ({ setIsAuthenticated, setIsCafeAuth }) => {
  const history = useHistory()
  const logout = async () => {
    const response = await fetch(`${DEFAULT_REST_URL}/member/logout`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        "Authorization-RefreshToken": `Bearer ${sessionStorage.getItem(
          "refreshToken"
        )}`,
      },
    })
    const responseData = await response.json()
    console.log(responseData)
    if (
      responseData.httpStatus === "UNAUTHORIZED" &&
      responseData.data.sign === "JWT"
    ) {
      const response = await fetch(`${DEFAULT_REST_URL}/member/refresh`, {
        method: "GET",
        headers: {
          "Authorization-RefreshToken": `Bearer ${sessionStorage.getItem(
            "refreshToken"
          )}`,
        },
      })
      const responseData = await response.json()
      if (responseData.httpStatus !== "OK") {
        sessionStorage.clear()
        alert("세션이 만료되었습니다.")
        history("/login")
      } else if (responseData.httpStatus === "OK") {
        sessionStorage.setItem("accessToken", responseData.data.accessToken)
        alert("다시 시도해주세요")
      }
    } else if (responseData.httpStatus === "OK") {
      setIsAuthenticated(undefined)
      setIsCafeAuth("0")
      sessionStorage.clear()
      history.push("/login")
    } else {
      alert("오류가 발생했습니다.")
    }
  }
  return (
    <Segment vertical padded basic onClick={logout}>
      <div className="navItem">
        <HiOutlineLogout size="30" color="black" />
        로그아웃
      </div>
    </Segment>
  )
}

export default Logout
