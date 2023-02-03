const REST_DEFAULT_URL = process.env.REACT_APP_REST_DEFAULT_URL

const CafeAuthFetch = async () => {
  try {
    const response = await fetch(`${REST_DEFAULT_URL}/cafe/auth`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
    })
    if (response.status === 401 && response.statusText === "A100") {
      const response = await fetch(`${REST_DEFAULT_URL}/member/refresh`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("refreshToken")}`,
        },
      })
      if (!response.ok) {
        throw new Error("Auth Failed")
      }
      const data = await response.json()
      console.log(data)
      sessionStorage.setItem("accessToken", data.jwt.accessToken)
      CafeAuthFetch()
    } else if (response.status === 401 && response.statusText === "A101") {
      sessionStorage.setItem("cafeAuth", 0)
    } else if (response.status === 200) {
      sessionStorage.setItem("cafeAuth", 1)
    }
  } catch (err) {
    console.log(err.message)
  }
}

export default CafeAuthFetch
