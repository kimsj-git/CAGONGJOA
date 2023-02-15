import { useEffect, useState } from "react"
import Calendar from "react-calendar"
import { useDispatch, useSelector } from "react-redux"
import { Image } from "semantic-ui-react"

import { getMonthStudyHistory } from "../../../store/studyHistory"
import { studyHistoryActions } from "../../../store/studyHistory"
import "react-calendar/dist/Calendar.css"
import "./HistoryCalendar.css"
const BRAND_LOGOS = {
  할리스: "hollys",
  폴바셋: "paulbasset",
  파스쿠찌: "pascucci",
  투썸플레이스: "twosome",
  토프레소: "topresso",
  텐퍼센트커피: "tenpercent",
  탐앤탐스: "tomntoms",
  컴포즈커피: "compose",
  커피에반하다: "coffeebanada",
  커피스미스: "coffeesmith",
  커피빈: "coffeebean",
  커피베이: "coffeebay",
  커피나무: "coffeenamu",
  카페베네: "caffeebene",
  카페띠아모: "caffetiamo",
  전광수:"jungwang",
  이디야커피:"edia",
  요거프레소:"yogerpresso",
  엔제리너스:"angelinus",
  스타벅스: "starbucks",
  스무디킹:"smoothy",
  셀렉토커피:"selecto",
  빽다방: "paiksdabang",
  베스킨라빈스:"baskin",
  메가커피:"megacoffee",
  매머드:"mammoth",
  드롭탑:'droptop',
  더벤티:'theventi',
  달콤커피:"dalkomm",
  나우커피:"nowcoffee",
  공차:'gongcha',
  개인카페:"selfcafedojang",
  바나프레소:"banapresso",
}
const HistoryCalendar = () => {
  const dispatch = useDispatch()
  const [date, setDate] = useState(new Date())

  useEffect(() => {
    const year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    if (month < 10) {
      month = "0" + month
    }
    if (day < 10) {
      day = "0" + day
    }
    dispatch(
      studyHistoryActions.selectDay({
        year,
        month,
        day,
      })
    )
    dispatch(getMonthStudyHistory({ year: year, month: month, day: day }))
  }, [date, dispatch])

  const changeDateHandler = (value) => {
    const year = value.getFullYear()
    let month = value.getMonth() + 1
    let day = value.getDate()
    if (month < 10) {
      month = "0" + month
    }
    if (day < 10) {
      day = "0" + day
    }
    dispatch(
      studyHistoryActions.selectDay({
        year,
        month,
        day,
      })
    )
  }

  const formatDay = (locale, date) => {
    return `${date.getDate()}`
  }

  const studyDate = useSelector((state) => state.studyHistory.monthStudyHistory)
  return (
    <Calendar
      next2Label={null}
      prev2Label={null}
      value={date}
      onClickDay={changeDateHandler}
      onActiveStartDateChange={({ activeStartDate }) => {
        const year = activeStartDate.getFullYear()
        let month = activeStartDate.getMonth() + 1
        let day = activeStartDate.getDate()
        if (month < 10) {
          month = "0" + month
        }
        if (day < 10) {
          day = "0" + day
        }
        dispatch(getMonthStudyHistory({ year: year, month: month, day: day }))
      }}
      formatDay={formatDay}
      minDetail="year"
      tileContent={({ date }) => {
        let day = date.getDate()
        let month = date.getMonth() + 1
        if (date.getMonth() < 10) {
          month = "0" + month
        }
        if (date.getDate() < 10) {
          day = "0" + day
        }
        const realDate = `${date.getFullYear()}${month}${day}`

        const dateData = studyDate
          ? studyDate.find((val) => `${val.visitedAt}` === realDate)
          : ""
        if (dateData) {
          return <Image src={require(`../../../assets/cafe_logos/${BRAND_LOGOS[dateData.cafeInfo.brandType]}.png`)} style={{width:"3rem"}}/>
        }
      }}
      
    />
  )
}

export default HistoryCalendar
