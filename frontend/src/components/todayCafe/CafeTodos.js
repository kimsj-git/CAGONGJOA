import { useState, Fragment } from "react"
import { Icon } from "semantic-ui-react"
import { Calendar } from "primereact/calendar"

const CafeTodos = () => {
  const [date, setDate] = useState(new Date())

  return (
    <Fragment>
      <h3>
        {date.getMonth() + 1}월 {date.getDate()}일 오늘의 Todo
      </h3>
      <Calendar
        id="icon"
        value={date}
        onChange={(e) => setDate(e.value)}
        showIcon
      />
      <p>Todo 목록</p>
    </Fragment>
  )
}

export default CafeTodos
