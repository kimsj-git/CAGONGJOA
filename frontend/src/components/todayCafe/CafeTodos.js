import { useEffect, useState } from "react"
import { Grid } from "semantic-ui-react"
import { Calendar } from "primereact/calendar"

import CafeTodoList from "./CafeTodoList"

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
        <Grid.Column>
          <p>
            {date.getMonth() + 1}월 {date.getDate()}일 Todo
          </p>
        </Grid.Column>
        <Grid.Column textAlign="right">
          <Calendar
            id="icon"
            value={date}
            onChange={(e) => changeDate(e.value)}
            showIcon
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
