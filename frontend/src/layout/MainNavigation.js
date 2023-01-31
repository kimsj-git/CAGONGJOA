import { NavLink } from "react-router-dom"
import { Icon, Grid } from "semantic-ui-react"

import PostForm from "../components/member/mainPage/PostForm"

import classes from './MainNavigation.module.css'

const MainNavigation = () => {
  return (
    <div>
      <Grid className={classes.footer}>
        <Grid.Row columns={5} only="mobile tablet" >
          <Grid.Column>
            <NavLink to="/">
              <Icon name="home" size="big" />
            </NavLink>
          </Grid.Column>
          <Grid.Column>
            <NavLink to="/chat">
              <Icon name="talk" size="big" />
            </NavLink>
          </Grid.Column>
          <Grid.Column>
            <PostForm />
          </Grid.Column>
          <Grid.Column>
            <NavLink to="/today-cafe">
              <Icon name="coffee" size="big" />
            </NavLink>
          </Grid.Column>
          <Grid.Column>
            <NavLink to="/mypage">
              <Icon name="user" size="big" />
            </NavLink>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  )
}

export default MainNavigation
