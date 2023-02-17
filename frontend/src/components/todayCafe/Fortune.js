import { useEffect, useState } from "react"
import { Button } from "semantic-ui-react"
import useFetch from "../../hooks/useFetch"
import exceptionHandler from "../common/exceptionHandler"

import TodayCafePage from "../../pages/TodayCafePage"
const DEFAULT_REST_URL = process.env.REACT_APP_REST_DEFAULT_URL

const Fortune = () => {
  const cafeAuth = sessionStorage.getItem('cafeAuth')
  const { data: initialFortune, sendRequest: getFortune } = useFetch()
  // const { data: fetchedFortune, sendRequest: postFortune } = useFetch()
  const [todayFortune, setTodayFortune] = useState("")
  const [coffeeCnt, setCoffeeCnt] = useState(0)
  // const todayCafe = JSON.parse(sessionStorage.getItem("todayCafe"))
  // let initialFortune = ''
  // let initialCoffeeCnt = 0 

  // if (todayCafe !== null) {
  //   initialFortune = todayCafe.fortune
  //   initialCoffeeCnt = todayCafe.coffeeCnt
  // }

  useEffect(() => {
    getFortune({
      url: `${DEFAULT_REST_URL}/fortune`,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
    })
  }, [])

  useEffect(() => {
    setTodayFortune(initialFortune.content)
    setCoffeeCnt(initialFortune.coffeeCnt)
  }, [initialFortune, cafeAuth])
  
  const pickHandler = async () => {
    // await postFortune({
    //   url: `${DEFAULT_REST_URL}/fortune`,
    //   method: "POST",
    //   headers: {
    //     Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
    //     "Content-Type": "application/json",
    //   },
    // })
    // console.log(fetchedFortune)

    const response = await fetch(`${DEFAULT_REST_URL}/fortune`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
    })
    const responseData = await response.json()
    if (responseData.httpStatus === 'OK') {
      console.log(responseData)
      setTodayFortune(responseData.data.content)
      setCoffeeCnt(responseData.data.coffeeCnt)
      // let todayCafe = JSON.parse(sessionStorage.getItem("todayCafe"))
      // todayCafe = {...todayCafe, fortune: responseData.data.content, coffeeCnt: responseData.data.coffeeCnt}
      // sessionStorage.setItem("todayCafe", JSON.stringify(todayCafe))
    } else {
      exceptionHandler({status:responseData.httpStatus, data:responseData.data})
      // console.log(responseData)
      alert('커피가 부족합니다.')
    }
  }
  
  // useEffect(() => {
  //   sessionStorage.setItem('fortune', fetchedFortune.content)
  //   setTodayFortune(fetchedFortune.content)
  // }, [fetchedFortune])

  return (
    <TodayCafePage>
      <h1>오늘의 운세</h1>
      {(cafeAuth === '0' || cafeAuth === null) && <p>카페 인증 후 오늘의 운세를 뽑아보세요.</p>}
      {(cafeAuth === '1') && <p>내 커피: {coffeeCnt}잔</p>}
      {(cafeAuth === '1') && todayFortune && <p>{todayFortune}</p>}
      {!todayFortune && <Button onClick={(e) => pickHandler(1)}>운세 뽑기!</Button>}
      {todayFortune && <Button onClick={(e) => pickHandler(2)}>다시 뽑기 (1 커피)</Button>}
    </TodayCafePage>
  )
}

export default Fortune
