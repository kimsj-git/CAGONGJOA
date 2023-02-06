import { useCallback, useState } from "react"

const REST_DEFAULT_URL = process.env.REACT_APP_REST_DEFAULT_URL

const useFetch = () => {
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

      if (response.status === 401) {
        //리프레쉬 토큰 보내주기
        const response = await fetch(`${REST_DEFAULT_URL}/member/refresh`,{
          method: "GET",
          headers: {
            "Authorization" : `Bearer ${sessionStorage.getItem('refreshToken')}`
          }
        })
        if (!response.ok){
          throw new Error('Failed refresh')
        }
        const data = await response.json()
        sessionStorage.setItem('accessToken', data.jwt.accessToken)
        sendRequest(requestConfig)
      } else if (!response.ok) {
        throw new Error("Request failed")
      } else {
        const data = await response.json()
        setData(data)
      }
    } catch (err) {
      console.log(err.message)
    }
    setIsLoading(false)
  }, [])
  return { data, isLoading, sendRequest }
}

export default useFetch
