import { useEffect, useState } from "react"
import Calendar from "react-calendar"
import { useDispatch, useSelector } from "react-redux"
import { Image } from "semantic-ui-react"

import { getMonthStudyHistory } from "../../../store/studyHistory"
import { studyHistoryActions } from "../../../store/studyHistory"
import "react-calendar/dist/Calendar.css"
import "./HistoryCalendar.css"

const HistoryCalendar = () => {
  const dispatch = useDispatch()
  const [date, setDate] = useState(new Date())
  const brandLogo = useSelector((state) => state.cafe.brandLogo)
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
          return (
            <Image
              src={require(`../../../assets/cafe_logos/${
                brandLogo[dateData.cafeInfo.brandType]
              }.png`)}
              style={{ width: "3rem" }}
            />
          )
        }
      }}
    />
  )
}

export default HistoryCalendar
