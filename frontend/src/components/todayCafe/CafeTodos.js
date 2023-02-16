import { useEffect, useState } from "react"
import { Grid } from "semantic-ui-react"
import { Calendar } from "primereact/calendar"

import CafeTodoList from "./CafeTodoList"
import './CustomCalendar.css'

const CafeTodos = () => {
  const [date, setDate] = useState(new Date())

  const changeDate = (inputDate) => {
    setDate(inputDate)
  }

  useEffect(() => {
    setDate(date)
  }, [date])

  return (
    <Grid>
      <Grid.Row columns={2}>
        <Grid.Column style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <p style={{fontSize: '24px', fontFamily: 'GangwonEdu_OTFBoldA'}}>
            {date.getMonth() + 1}월 {date.getDate()}일 할일 목록
          </p>
        </Grid.Column>
        <Grid.Column textAlign="center">
          <Calendar
            id="icon"
            value={date}
            onChange={(e) => changeDate(e.value)}
            showIcon
            className="custom-icon"
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row columns={1}>
        <Grid.Column>
          <CafeTodoList selectedDate={date}/>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

export default CafeTodos
