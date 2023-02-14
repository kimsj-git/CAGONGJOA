import Logout from "../../member/logout/Logout"

const REST_DEFAULT_URL = process.env.REACT_APP_REST_DEFAULT_URL

const GetMyCafe = async () => {
    const response = await fetch(`${REST_DEFAULT_URL}/myPage/cafeList`, {
        method:"GET",
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        }
    })
    const responseData = await response.json()
    if (responseData.httpStatus === "OK"){
        return responseData.data
    } else if (responseData.httpStatus === "BAD_REQUEST" && responseData.data.sign==="JWT"){
        const response = await fetch(`${REST_DEFAULT_URL}/member/refresh`, {
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
            Logout()
          } else if (responseData.httpStatus === "OK") {
            sessionStorage.setItem("accessToken", responseData.data.accessToken)
            GetMyCafe()
          }
    } else {
        return "ERROR"
    }
}

export default GetMyCafe