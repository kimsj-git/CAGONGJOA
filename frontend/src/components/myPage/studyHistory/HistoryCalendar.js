import { useEffect, useState } from "react"
import Calendar from "react-calendar"
import { useDispatch } from "react-redux"

import { studyHistoryActions } from "../../../store/studyHistory"
import "react-calendar/dist/Calendar.css"
import "./HistoryCalendar.css"

const HistoryCalendar = () => {
  const dispatch = useDispatch()
  const [date, setDate] = useState(new Date())
  useEffect(()=>{
    dispatch(
      studyHistoryActions.selectDay({
        year: date.getFullYear(),
        month: date.getMonth(),
        day: date.getDate(),
      })
    )
  }, [date,dispatch])

  const changeDateHandler = (value) => {
    dispatch(studyHistoryActions.selectDay({
      year: value.getFullYear(),
      month: value.getMonth(),
      day: value.getDate(),
    }))
  }
  
  const formatDay = (locale, date) => {
    return `${date.getDate()}`
  }
  const studyDate = [
    { day: "02-02-2023", cafeName: "스타벅스" },
    { day: "02-05-2023", cafeName: "할리스" },
    { day: "02-07-2023", cafeName: "할리스" },
    { day: "02-08-2023", cafeName: "할리스" },
    { day: "02-12-2023", cafeName: "할리스" },
    { day: "02-15-2023", cafeName: "파스쿠찌" },
  ]

  return (
    <Calendar
      value={date}
      onClickDay={changeDateHandler}
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
        const realDate = month + "-" + day + "-" + date.getFullYear()
        const dateData = studyDate.find((val) => val.day === realDate)
        if (dateData) {
          return dateData.cafeName
        }
      }}
    />
  )
}

export default HistoryCalendar
