import { useEffect, Fragment, useState } from "react"
import { Progress } from "semantic-ui-react"

const CafeTimer = (props) => {
  const cafeAuth = sessionStorage.getItem("cafeAuth")
  const accTime = props.accTime

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
    <Fragment>
      <Progress
        total={120}
        color="green"
        progress="value"
        value={accTime}
        disabled={(cafeAuth === '0' || cafeAuth === null)}
      >
        <p style={{ color: "#00754A" }}>
          {hours}시간 {minutes}분 경과! {isComplete ? '[완료]' : ''}
        </p>
      </Progress>
    </Fragment>
  )
}

export default CafeTimer
