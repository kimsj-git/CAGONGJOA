import { Fragment } from "react"
import CafeAuth from "../components/certificate/cafeAuth/CafeAuth"
import NearCafeList from "../components/certificate/cafeAuth/NearCafeList"

const MyPage = () => {
  return (
    <Fragment>
      <h1>My Page</h1>
      <div>
        <CafeAuth />
        <NearCafeList/>
      </div>
    </Fragment>
  )
}

export default MyPage
