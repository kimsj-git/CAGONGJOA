import { useCallback, useState } from "react"
import { useHistory } from "react-router-dom"
const REST_DEFAULT_URL = process.env.REACT_APP_REST_DEFAULT_URL

const useFetch = () => {
  const history = useHistory()
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const sendRequest = useCallback(async (requestConfig) => {
    setIsLoading(true)
    try {
      const response = await fetch(requestConfig.url, {
        method: requestConfig.method ? requestConfig.method : "GET",
        headers: requestConfig.headers ? requestConfig.headers : {},
        body: requestConfig.body ? JSON.stringify(requestConfig.body) : null,
      })
      const responseData = await response.json()
      if (responseData.httpStatus === "BAD_REQUEST" && responseData.data.sign==="JWT") {
        //리프레쉬 토큰 보내주기
        const response = await fetch(`${REST_DEFAULT_URL}/member/refresh`,{
          method: "GET",
          headers: {
            "Authorization-RefreshToken" : `Bearer ${sessionStorage.getItem('refreshToken')}`
          }
        })
        const responseData = await response.json()
        if (!responseData.httpStatus==="OK"){
          sessionStorage.clear()
          history.push('/login')
        }
        sessionStorage.setItem('accessToken', responseData.data.accessToken)
        sendRequest(requestConfig)
      } else if (responseData.httpStatus === "OK") {
        setData(responseData.data)
      } else {
        // history.push('/error')
      }
    } catch (err) {
      console.log(err.message)
    }
    setIsLoading(false)
  }, [history])
  return { data, isLoading, sendRequest }
}

export default useFetch
