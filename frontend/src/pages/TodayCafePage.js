import { Fragment } from "react"

import TodayCafeNavigation from '../components/todayCafe/TodayCafeNavigation'

const TodayCafe = (props) => {
  return <Fragment>
    <TodayCafeNavigation/>
    <main>{props.children}</main>
  </Fragment>
}

export default TodayCafe