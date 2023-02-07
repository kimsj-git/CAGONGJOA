import { useState } from "react"

import TodayCafePage from "../../pages/TodayCafePage"

import { Button, Popup } from "semantic-ui-react"

const Fortune = () => {
  let DUMMY_FORTUNES = [
    { msg: "알고보면 나도 참 매력적", member: "서정", date: "230131" },
    { msg: "오늘은 술이 땡기네", member: "종섭", date: "230131" },
    { msg: "관계를 돈독히 하세요.", member: "현철", date: "230131" },
    { msg: "부족할 것 없는 날입니다.", member: "경희", date: "230131" },
    { msg: "꼬인 것이 풀립니다.", member: "준모", date: "230131" },
    { msg: "오늘도 내가 너무 고생이 많아", member: "현철", date: "230131" },
    { msg: "사랑을 심는 하루네요.", member: "서정", date: "230201" },
    { msg: "아름다운 하루 만드세요.", member: "서정", date: "230202" },
    { msg: "대화가 필요한 날입니다.", member: "현철", date: "230202" },
    { msg: "자신의 의견을 관철하세요.", member: "현철", date: "230202" },
    { msg: "약속한 것은 지켜야합니다.", member: "현철", date: "230203" },
    { msg: "귀인 덕분에 위기를 넘깁니다.", member: "서정", date: "230203" },
  ]
  
  const [todayFortune, setTodayFortune] = useState(null)
  
  const pickHandler = () => {
    let pick = Math.floor(Math.random() * DUMMY_FORTUNES.length)
    while (todayFortune && todayFortune.msg === DUMMY_FORTUNES[pick]) {
      pick = Math.floor(Math.random() * DUMMY_FORTUNES.length)
    }
    setTodayFortune(DUMMY_FORTUNES[pick])
  }

  const fortuneMsg = todayFortune && <p>{todayFortune.msg}</p>
  const fortuneMem = todayFortune && <p>{todayFortune.member}</p>

  return (
    <TodayCafePage>
      <h1>오늘의 운세</h1>
      <Popup content={fortuneMem} trigger={fortuneMsg}/>
      {!todayFortune && <Button onClick={pickHandler}>운세 뽑기!</Button>}
      {todayFortune && <Button onClick={pickHandler}>다시 뽑기 (1 커피)</Button>}
    </TodayCafePage>
  )
}

export default Fortune
