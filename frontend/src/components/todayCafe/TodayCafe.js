import TodayCafePage from "../../pages/TodayCafePage"
import CafeInfo from "./CafeInfo"
import CafeTimer from "./CafeTimer"

const TodayCafe = () => {
  return <TodayCafePage>
    <h1>오늘의 카페</h1>
    <CafeInfo/>
    <CafeTimer/>
  </TodayCafePage>
}

export default TodayCafe