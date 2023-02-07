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
    console.log(responseData)
    if (
      responseData.httpStatus === "UNAUTHORIZED" &&
      responseData.data.sign === "JWT"
    ) {
      const response = await fetch(`${REST_DEFAULT_URL}/member/refresh`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("refreshToken")}`,
        },
      })
      if (!response.ok) {
        throw new Error("Auth Failed")
      }
      const data = await response.json()
      sessionStorage.setItem("accessToken", data.jwt.accessToken)
      MapGoToPosition()
    } else if (
      responseData.httpStatus === "UNAUTHORIZED" &&
      responseData.data.sign === "CAFE"
    ) {
      return "UNAUTHORIZED CAFE"
    } else if (responseData.httpStatus === "OK") {
      return "AUTHORIZED CAFE"
      //현재 인증한 카페 위치 얻기, MapDiv
    // const selectedCafeData = {lat:responseData.data.latitude, lng:responseData.data.longitude, cafeName:responseData.data.name}
    // sessionStorage.setItem("location",JSON.stringify(selectedCafeData))
    } else {
      throw new Error("fetch error")
    }
  } catch (err) {
    console.log(err.message)
  }
}

export default MapGoToPosition
