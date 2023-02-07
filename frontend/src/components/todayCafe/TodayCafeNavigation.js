import { useState, Fragment } from "react"
import { NavLink } from "react-router-dom"
import { Grid, Container, Button } from "semantic-ui-react"

const TodayCafeNavigation = () => {
  // const [focused, setFocused] = useState({btn1: true, btn2: false, btn2: false})

  // 아직 안됨... useState로 저장해서, 라우터로 다른 페이지 가면 초기화돼서 그런듯.
  // const navigationHandler = (selectedBtn, e) => {
  //   // e.preventDefault()
  //   if (selectedBtn === 0) {
  //     setFocused({btn1: true, btn2: false, btn2: false})
  //   }
  //   else if (selectedBtn === 1) {
  //     setFocused({btn1: false, btn2: true, btn2: false})
  //   }
  //   else if (selectedBtn === 2) {
  //     setFocused({btn1: false, btn2: false, btn2: true})
  //   }
  // }

  return (
    <Fragment>
      <Grid columns={3} divided>
        <Grid.Column style={{ textAlign: "center" }}>
          <NavLink to="/today-cafe" >
            {/* <Button active={focused.btn1} onClick={(e) => navigationHandler(0, e)}>현재 카페</Button> */}
            현재 카페
          </NavLink>
        </Grid.Column>
        <Grid.Column style={{ textAlign: "center" }}>
          <NavLink to="/today-cafe/make-coffee" >
            {/* <Button active={focused.btn2} onClick={(e) => navigationHandler(1, e)}>커피 내리기</Button> */}
            커피 내리기
          </NavLink>
        </Grid.Column>
        <Grid.Column style={{ textAlign: "center" }}>
          <NavLink to="/today-cafe/fortune" >
            {/* <Button active={focused.btn3} onClick={(e) => navigationHandler(2, e)}>오늘의 운세</Button> */}
            오늘의 운세
          </NavLink>
        </Grid.Column>
      </Grid>
    </Fragment>
  )
}

export default TodayCafeNavigation
