const REST_DEFAULT_URL = process.env.REACT_APP_REST_DEFAULT_URL

const CafeAuthFetch = async () => {
  try {
    const response = await fetch(`${REST_DEFAULT_URL}/cafe/auth`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
    })
    const responseData = await response.json()
    // jwt access 토큰 만료된 경우
    if (
      responseData.httpStatus === "UNAUTHORIZED" &&
      responseData.data.sign === "JWT"
    ) {
      const response = await fetch(`${REST_DEFAULT_URL}/member/refresh`, {
        headers: {
          "Authorization-RefreshToken": `Bearer ${sessionStorage.getItem(
            "refreshToken"
          )}`,
        },
      })
      const responseData = response.json()
      if (!responseData.httpStatus === "OK") {
        sessionStorage.clear()
      } else {
        const data = await response.json()
        sessionStorage.setItem("accessToken", data.jwt.accessToken)
        CafeAuthFetch()
      }
    } else if (
      // 미인증 상태인 경우
      responseData.httpStatus === "UNAUTHORIZED" &&
      responseData.data.sign === "CAFE"
    ) {
      sessionStorage.setItem("cafeAuth", 0)
    } else if (responseData.httpStatus === "OK") {
      // 인증된 경우
      sessionStorage.setItem("cafeAuth", 1)
      // const response = await fetch(`${REST_DEFAULT_URL}/`)
      // const responseData = await response.json()
    } else {
      throw new Error("fetch error")
    }
  } catch (err) {
    console.log(err.message)
  }
}

export default CafeAuthFetch
