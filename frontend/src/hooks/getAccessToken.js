const REST_DEFAULT_URL = process.env.REACT_APP_REST_DEFAULT_URL

const getAccessToken = async (func, dataSet) => {
  //리프레쉬 토큰 보내주기
  const response = await fetch(`${REST_DEFAULT_URL}/member/refresh`, {
    method: "GET",
    headers: {
      "Authorization-RefreshToken": `Bearer ${sessionStorage.getItem(
        "refreshToken"
      )}`,
    },
  })
  const responseData = await response.json()
  console.log(responseData, 'JWT 확인')
  if (responseData.httpStatus !== "OK") {
    alert('세션이 만료 되었습니다.')
    sessionStorage.clear()
    window.location.href = '/login'
} else if (responseData.httpStatus === "OK") {
    sessionStorage.setItem("accessToken", responseData.data.accessToken)
    func(dataSet)
  }
}

export default getAccessToken
