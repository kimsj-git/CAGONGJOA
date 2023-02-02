import { useState, Fragment } from "react"
import { NavLink } from "react-router-dom"
import { Grid, Container, Button } from "semantic-ui-react"

const TodayCafeNavigation = () => {
  // const [focused, setFocused] = useState('0')

  // const navigationHandler = (selectedBtn) => {
  //   if (selectedBtn === '1') {
  //     setFocused('1')
  //   }
  //   else if (selectedBtn === '2') {
  //     setFocused('2')
  //   }
  // }

  return (
    <Fragment>
      <Grid columns={3} divided>
        <Grid.Column style={{ textAlign: "center" }}>
          <NavLink to="/today-cafe" >
            <Button >현재 카페</Button>
          </NavLink>
        </Grid.Column>
        <Grid.Column style={{ textAlign: "center" }}>
          <NavLink to="/today-cafe/make-coffee" >
            <Button >커피 내리기</Button>
          </NavLink>
        </Grid.Column>
        <Grid.Column style={{ textAlign: "center" }}>
          <NavLink to="/today-cafe/fortune" >
            <Button >오늘의 운세</Button>
          </NavLink>
        </Grid.Column>
      </Grid>
    </Fragment>
  )
}

export default TodayCafeNavigation
