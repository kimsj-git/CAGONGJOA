const REST_DEFAULT_URL = process.env.REACT_APP_REST_DEFAULT_URL
const MapGoToPosition = async () => {
  try {
    const response = await fetch(`${REST_DEFAULT_URL}/cafe/auth`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
    })
    const responseData = await response.json()
    if (
      responseData.httpStatus === "UNAUTHORIZED" &&
      responseData.data.sign === "JWT"
    ) {
      const response = await fetch(`${REST_DEFAULT_URL}/member/refresh`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("refreshToken")}`,
        },
      })
      if (responseData.httpStatus !== "OK") {
        sessionStorage.clear()
        alert("세션 만료되었습니다.")
      } else {
        const data = await response.json()
        sessionStorage.setItem("accessToken", data.jwt.accessToken)
        MapGoToPosition()
      }
      
    } else if (
      responseData.httpStatus === "UNAUTHORIZED" &&
      responseData.data.sign === "CAFE"
    ) {
      return "UNAUTHORIZED CAFE"
    } else if (responseData.httpStatus === "OK") {
      return "AUTHORIZED CAFE"
    } else {
      window.location.href ='/error'
    }
  } catch (err) {
    window.location.href="/error"
  }
}

export default MapGoToPosition
