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
        window.location.href = "/login"
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
      sessionStorage.removeItem("todayCafe")
      sessionStorage.removeItem("todoList")
      sessionStorage.removeItem("myCafe")
    } else if (responseData.httpStatus === "OK") {
      // 인증된 경우 위경도,카페 이름 가져오고
      sessionStorage.setItem("cafeAuth", 1)
      if (sessionStorage.getItem("todayCafe") === null) {
        // todayCafe 없을 경우 (최초 로그인)
        const response = await fetch(
          `${REST_DEFAULT_URL}/cafe/auth/initCheck`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            },
          }
        )
        const response2 = await fetch(`${REST_DEFAULT_URL}/cafe/auth/data`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        })
        const responseData = await response.json()
        const response2Data = await response2.json()
        const myCafe = responseData.data
        const todayCafe = {
          coffeeBeanCnt: response2Data.data.coffeeBeanCnt,
          coffeeCnt: response2Data.data.coffeeCnt,
          exp: response2Data.data.exp,
          fortune: response2Data.data.fortune,
          isSurveySubmitted: response2Data.data.isSurveySubmitted,
          isCrowdSubmitted: response2Data.data.isCrowdSubmitted,
          brandType: response2Data.data.brandType,
          accTime: response2Data.data.accTime,
        }
        if (
          (responseData.httpStatus === "401" &&
            responseData.data.sign === "JWT") ||
          (response2Data.httpStatus === "401" &&
            response2Data.data.sign === "JWT")
        ) {
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
            alert("세션 만료되었습니다.")
            window.location.href = "/login"
          } else if (responseData.httpStatus === "OK") {
            sessionStorage.setItem("accessToken", responseData.data.accessToken)
            CafeAuthFetch()
          }
        }
        sessionStorage.setItem("todayCafe", JSON.stringify(todayCafe))
        sessionStorage.setItem("myCafe", JSON.stringify(myCafe))
      }
    } else {
      throw new Error("fetch error")
    }
  } catch (err) {
    console.log(err.message)
  }
}

export default CafeAuthFetch
