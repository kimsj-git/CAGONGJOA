import { useLocation } from "react-router-dom"
import { NavLink } from "react-router-dom"
import { Icon, Grid } from "semantic-ui-react"

import classes from "./Settings.module.css"

const Settings = () => {
  const location = useLocation()
  const defaultURL = location.pathname

  return (
    <>
      <Grid.Row style={{marginTop:"10%"}}>
        <Grid.Column as="h1"><Icon name="setting"/>설정</Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <NavLink to={`${defaultURL}/blocklist`} className={classes.navItem}>
            <Icon.Group>
              <Icon name="user outline" />
              <Icon name="ban" corner />
            </Icon.Group>
            차단 목록
          </NavLink>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column>
          <Icon.Group>
            <Icon name="user outline" />
            <Icon name="trash alternate" corner />
          </Icon.Group>
          회원 탈퇴
        </Grid.Column>
      </Grid.Row>
    </>
  )
}

export default Settings
