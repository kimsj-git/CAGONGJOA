import { useEffect, useState } from "react"
import { Button } from "semantic-ui-react"
import useFetch from "../../hooks/useFetch"
import exceptionHandler from "../common/exceptionHandler"

import TodayCafePage from "../../pages/TodayCafePage"
const DEFAULT_REST_URL = process.env.REACT_APP_REST_DEFAULT_URL

const Fortune = () => {
  const cafeAuth = sessionStorage.getItem("cafeAuth")
  const { data: initialFortune, sendRequest: getFortune } = useFetch()
  const [todayFortune, setTodayFortune] = useState("")
  const [coffeeCnt, setCoffeeCnt] = useState(0)

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
    const response = await fetch(`${DEFAULT_REST_URL}/fortune`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
    })
    const responseData = await response.json()
    if (responseData.httpStatus === "OK") {
      console.log(responseData)
      setTodayFortune(responseData.data.content)
      setCoffeeCnt(responseData.data.coffeeCnt)
    } else if (responseData.httpStatus === "UNAUTHORIZED") {
      alert("카페 인증 후 운세를 뽑을 수 있어요.\uD83D\uDE4F")
      // exceptionHandler({
      //   status: responseData.httpStatus,
      //   data: responseData.data,
      // })
    } 
    else if (responseData.httpStatus === "NOT_ACCEPTABLE") {
      alert("커피가 부족합니다.\uD83D\uDE22")
    }
  }

  return (
    <TodayCafePage>
      <div
        style={{
          // backgroundColor: "#dfc49d",
          // borderRadius: "10px",
          padding: "3rem",
        }}
      >
        {cafeAuth === "1" && todayFortune && <p
          style={{
            textAlign: "center",
            color: "#1E3932",
            fontSize: "220%",
            fontFamily: "GangwonEdu_OTFBoldA",
            wordBreak: "keep-all",
          }}
        >
          {todayFortune}
        </p>}
        <div
          style={{
            textAlign: "center",
            color: "#1E3932",
            fontSize: "150%",
            fontFamily: "GangwonEdu_OTFBoldA",
            wordBreak: "keep-all",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {(cafeAuth === "0" || cafeAuth === null) && (
            <p>카페 인증 후 오늘의 운세를 뽑아보세요.</p>
          )}
          {cafeAuth === "1" && <p>내 커피: {coffeeCnt}잔</p>}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          marginTop: "3rem",
        }}
      >
        {!todayFortune && (
          <Button color="orange" onClick={(e) => pickHandler(1)}>운세 뽑기!</Button>
        )}
        {todayFortune && (
          <Button color="brown" onClick={(e) => pickHandler(2)}>다시 뽑기 (1 커피)</Button>
        )}
      </div>
    </TodayCafePage>
  )
}

export default Fortune
