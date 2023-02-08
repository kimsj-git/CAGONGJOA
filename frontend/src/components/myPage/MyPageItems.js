import { NavLink, useLocation } from "react-router-dom"
import { Grid, Icon } from "semantic-ui-react"

import classes from './MyPageItems.module.css'

const MainPageItems = () => {
  const location = useLocation()
  const defaultURL = location.pathname
  return (
    <>
      <Grid.Row>
        <Grid.Column>
          <NavLink to={`${defaultURL}/study`} className={classes.navItem}>
            <Icon name="calendar alternate outline" />
            카공 생활
          </NavLink>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <NavLink to={`${defaultURL}/cafebadge`} className={classes.navItem}>
            <Icon name="book" />
            방문카페 도감
          </NavLink>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <NavLink to={`${defaultURL}/feed/myposts`} className={classes.navItem}>
            <Icon name="pencil alternate" />
            내가 쓴 글/댓글
          </NavLink>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <NavLink to={`${defaultURL}/setting`} className={classes.navItem}>
            <Icon name="setting" />
            설정
          </NavLink>
        </Grid.Column>
      </Grid.Row>
    </>
  )
}

export default MainPageItems
