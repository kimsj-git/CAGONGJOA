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
      CafeAuthFetch()
    } else if (
      responseData.httpStatus === "UNAUTHORIZED" &&
      responseData.data.sign === "CAFE"
    ) {
      sessionStorage.setItem("cafeAuth", 0)
    } else if (responseData.httpStatus==="OK") {
      sessionStorage.setItem("cafeAuth", 1)
    } else {
      throw new Error("fetch error")
    }
  } catch (err) {
    console.log(err.message)
  }
}

export default CafeAuthFetch
