import { NavLink } from "react-router-dom"
import { Icon } from "semantic-ui-react"
import { Dock } from "primereact/dock"

import PostForm from "../components/mainPage/PostForm"

import classes from "./MainNavigation.module.css"

const MainNavigation = () => {
  const items = [
    {
      label: "home",
      icon: () => (
        <NavLink to="/">
          <Icon name="home" size="big" />
        </NavLink>
      ),
    },
    {
      label: "chat",
      icon: () => (
        <NavLink to="/chat">
          <Icon name="talk" size="big" />
        </NavLink>
      ),
    },
    { label: "post", icon: () => <PostForm /> },
    {
      label: "today-cafe",
      icon: () => (
        <NavLink to="/today-cafe">
          <Icon name="coffee" size="big" />
        </NavLink>
      ),
    },
    {
      label: "mypage",
      icon: () => (
        <NavLink to="/mypage">
          <Icon name="user" size="big" />
        </NavLink>
      ),
    },
  ]
  return (
    <section className={classes.nav}>
      <Dock className={classes.nav} model={items} />
    </section>
  )
}

export default MainNavigation
