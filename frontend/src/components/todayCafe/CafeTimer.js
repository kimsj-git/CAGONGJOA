import { useEffect, Fragment, useState } from "react"
import { Progress } from "semantic-ui-react"
import useFetch from "../../hooks/useFetch"
const DEFAULT_REST_URL = process.env.REACT_APP_REST_DEFAULT_URL

const fullDate = (date) => {
  const yyyy = date.getFullYear()
  const mm = date.getMonth() + 1
  const dd = date.getDate()
  return yyyy * 10000 + mm * 100 + dd
}

const CafeTimer = () => {
  const cafeAuth = sessionStorage.getItem("cafeAuth")
  const [accTime, setAccTime] = useState(0)

  const { data: timeData, sendRequest: getTime } = useFetch()
  useEffect(() => {
    if (cafeAuth === "1") {
      getTime({
        url: `${DEFAULT_REST_URL}/todaycafe/main/acctime?todayDate=${fullDate(
          new Date()
        )}`,
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      })
    }
  }, [])

  useEffect(() => {
    setAccTime(timeData)
  }, [timeData])

  // 1분마다 업데이트된 누적시간 가져오기
  useEffect(() => {
    if (cafeAuth === "1" && accTime < 120) {
      const intervalId = setInterval(async () => {
        await getTime({
          url: `${DEFAULT_REST_URL}/todaycafe/main/acctime?todayDate=${fullDate(
            new Date()
          )}`,
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        })
      }, 30000)
      return () => clearInterval(intervalId)
    }
  })

  // 누적 시간 기록
  const hours = parseInt(accTime / 60) % 60
  const minutes = accTime % 60

  // // 2시간 경과 체크
  const [isComplete, setIsComplete] = useState(false)

  // 누적시간(accTime)이 변할 때만 실행되는 useEffect
  // 누적시간 2시간(= 120분) 되면 isComplete를 true로 변경
  useEffect(() => {
    if (accTime >= 120) {
      setIsComplete(true)
    }
  }, [accTime])

  return (
    <Fragment >
      <div style={{backgroundColor: 'lightgrey', borderRadius: '4px'}}>
      <Progress
        total={120}
        inverted
        color="red"
        progress="value"
        value={accTime}
        disabled={cafeAuth === "0" || cafeAuth === null}
      >
        <p style={{ color: "#ff695e" }}>
          {hours}시간 {minutes}분 경과! {isComplete ? "[완료]" : ""}
        </p>
      </Progress>

      </div>
    </Fragment>
  )
}

export default CafeTimer
