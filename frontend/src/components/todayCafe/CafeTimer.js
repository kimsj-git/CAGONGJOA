import { useState, useEffect, useRef, Fragment } from "react"
import { useSelector, useDispatch} from 'react-redux'
import { timerActions } from "../../store/timer"
import { Progress } from "semantic-ui-react"

const CafeTimer = () => {
  // const dispatch = useDispatch()
  // const sTime = useSelector((state) => state.timer.startTime)
  // const eTime = useSelector((state) => state.timer.nowTime)

  let nowTime = new Date()
  const startTime = useRef(nowTime) // 시작시간 기록
  const laterTime = useRef(nowTime) // 타이머 계산용 현재시간 기록
  const [now, setNow] = useState(nowTime) // Re-rendering 위한 useState 사용
  const interval = useRef(null)
  const timer = useRef(0)

  // sTime = useRef(nowTime).current
  // eTime = useRef(nowTime).current

  useEffect(() => {
    // 1초(1000ms)마다 경과시간 계산
    interval.current = setInterval(() => {
      // 경과시간 = (현재시간 - 시작시간), 초단위
      timer.current =
        (laterTime.current.getTime() - startTime.current.getTime()) / 1000

      nowTime = new Date()

      // useState 사용: state 변화 후에 컴포넌트 Re-rendering 위해
      setNow(nowTime)

      // useRef 사용: 현재 시간의 정확한 값을 1초마다 갱신 -> Re-rendering (x)
      laterTime.current = nowTime

      // 리덕스 사용 테스트
      
    }, 1000)
    return () => clearInterval(interval.current)
  }, [])

  // 경과시간(timer.current)이 변할 때만 실행되는 useEffect
  // 경과시간 2시간(= 7200초) 되면 interval을 멈춘다.
  useEffect(() => {
    if (timer.current >= 7200) {
      clearInterval(interval.current)
    }
  }, [timer.current])

  return (
    <Fragment>
      <Progress
        total={120}
        color="green"
        progress="value"
        value={parseInt(timer.current / 60)}
      >
        <p style={{ color: "green" }}>{parseInt(timer.current / 60)}분 경과!</p>
      </Progress>
      <section style={{border: 'dotted'}}>
        <h3>시간 확인용 정보.. (임시)</h3>
        <p>시작시간: {startTime.current.toString()}</p>
        <p>현재시간: {now.toString()}</p>
        <p>경과시간: {timer.current}초</p>
      </section>
    </Fragment>
  )
}

export default CafeTimer
