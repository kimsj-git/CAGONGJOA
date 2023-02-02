const REST_DEFAULT_URL = process.env.REACT_APP_REST_DEFAULT_URL

const CafeAuthFetch = async () => {
  const response = await fetch(`${REST_DEFAULT_URL}/cafeAuth`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
    },
  })

  if (response.status === 401) {
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
  } else if (response.status === 404) {
    sessionStorage.setItem("cafeAuth", 0)
  } else if (!response.ok) {
    throw new Error("Error")
  } else if (response.status === 204) {
    sessionStorage.setItem("cafeAuth", 1)
  }
}

export default CafeAuthFetch
