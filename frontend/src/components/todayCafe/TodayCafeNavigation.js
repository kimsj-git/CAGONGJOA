import { Fragment } from "react"
import { NavLink } from "react-router-dom"

const TodayCafeNavigation = () => {
  return (
    <Fragment>
      <ul>
        <li>
          <NavLink to="/today-cafe">현재 카페</NavLink>
        </li>
        <li>
          <NavLink to="/today-cafe/make-coffee">커피 내리기</NavLink>
        </li>
        <li>
          <NavLink to="/today-cafe/fortune">오늘의 운세</NavLink>
        </li>
      </ul>
    </Fragment>
  )
}

export default TodayCafeNavigation
