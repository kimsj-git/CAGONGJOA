import { useState } from "react"
import { useLocation } from "react-router-dom"
import { NavLink } from "react-router-dom"
import { Icon, Grid } from "semantic-ui-react"
import DeleteMember from "./DeleteMember"

import classes from "./Settings.module.css"

const Settings = () => {
  const location = useLocation()
  const defaultURL = location.pathname
  const [open, setOpen] = useState(false)
  return (
    <>
      <Grid.Row style={{ marginTop: "10%" }}>
        <Grid.Column as="h1">
          <Icon name="setting" />
          설정
        </Grid.Column>
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
          <DeleteMember open={open} setOpen={setOpen}>회원 탈퇴</DeleteMember>
        </Grid.Column>
      </Grid.Row>
    </>
  )
}

export default Settings
