import getAccessToken from "../../hooks/getAccessToken"
import Logout from "../member/logout/Logout"
const REST_DEFAULT_URL = process.env.REACT_APP_REST_DEFAULT_URL

const GetCafeDetail = async (props) => {
  const date = new Date()
  const TIME_ZONE = 3240 * 10000
  const sendDate = new Date(+date + TIME_ZONE).toISOString().substr(0, 19)
  const response = await fetch(
    `${REST_DEFAULT_URL}/cafe/survey?latitude=${props.lat}&longitude=${props.lng}&todayTime=${sendDate}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
    }
  )
  const responseData = await response.json()
  if (
    responseData.httpStatus === "UNAUTHORIZED" &&
    responseData.data.sign === "JWT"
  ) {
    getAccessToken({func:GetCafeDetail, dataSet:{props}})
  } else if (responseData.httpStatus === "OK") {
    return responseData.data
  }
}

export default GetCafeDetail