import { NavLink } from "react-router-dom"
import { Icon } from "semantic-ui-react"

import PostForm from "../components/member/mainPage/PostForm"

import classes from "./MainNavigation.module.css"

const MainNavigation = () => {
  return (
    <header className={classes.header}>
      <nav className={classes.nav}>
        <ul>
          <li>
            <NavLink to="/">
              <Icon name="home" size="big" />
            </NavLink>
          </li>
          <li>
            <NavLink to="/chat">
              <Icon name="talk" size="big" />
            </NavLink>
          </li>
          <li>
            <PostForm />
          </li>
          <li>
            <NavLink to="/today-cafe">
              <Icon name="coffee" size="big" />
            </NavLink>
          </li>
          <li>
            <NavLink to="/mypage">
              <Icon name="user" size="big" />
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default MainNavigation
