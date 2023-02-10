import { useState } from "react"
import { Button } from "semantic-ui-react"
import useFetch from "../../hooks/useFetch"

import TodayCafePage from "../../pages/TodayCafePage"
const DEFAULT_REST_URL = process.env.REACT_APP_REST_DEFAULT_URL

const Fortune = () => {
  const cafeAuth = sessionStorage.getItem('cafeAuth')
  const [todayFortune, setTodayFortune] = useState(sessionStorage.getItem('fortune'))

  const { data: fetchedFortune, isLoading, sendRequest: getFortune } = useFetch()
  
  const pickHandler = async (fortuneType) => {
    await getFortune({
      url: `${DEFAULT_REST_URL}/todaycafe/fortune/${fortuneType}`,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
    })
    sessionStorage.setItem('fortune', fetchedFortune.content)
    setTodayFortune(fetchedFortune.content)
  }

  return (
    <TodayCafePage>
      <h1>오늘의 운세</h1>
      {!cafeAuth && <p>카페 인증 후 오늘의 운세를 뽑아보세요.</p>}
      {cafeAuth && todayFortune && <p>{todayFortune}</p>}
      {!todayFortune && <Button onClick={(e) => pickHandler(1)}>운세 뽑기!</Button>}
      {todayFortune && <Button onClick={(e) => pickHandler(2)}>다시 뽑기 (1 커피)</Button>}
    </TodayCafePage>
  )
}

export default Fortune
