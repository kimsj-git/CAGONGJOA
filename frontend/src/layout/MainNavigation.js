import { useLocation } from "react-router-dom"
import { NavLink } from "react-router-dom"
import { Icon } from "semantic-ui-react"
import { Dock } from "primereact/dock"

import PostForm from "../components/mainPage/PostForm"

import classes from "./MainNavigation.module.css"

const MainNavigation = () => {
  const location = useLocation()
  const path = location.pathname
  const items = [
    {
      label: "home",
      icon: () => (
        <NavLink to="/" className={classes.navItem}>
          <Icon name="home" size="big" />
        </NavLink>
      ),
    },
    {
      label: "chat",
      icon: () => (
        <NavLink to="/chat" className={classes.navItem}>
          <Icon name="talk" size="big" />
        </NavLink>
      ),
    },
    { label: "post", icon: () => <PostForm isMainNavigation="1"/> },
    {
      label: "today-cafe",
      icon: () => (
        <NavLink to="/today-cafe" className={classes.navItem}>
          <Icon name="coffee" size="big" />
        </NavLink>
      ),
    },
    {
      label: "mypage",
      icon: () => (
        <NavLink to="/mypage" className={classes.navItem}>
          <Icon name="user" size="big" />
        </NavLink>
      ),
    },
  ]
  return (
    <section className={classes.nav} style={{display: path === "/login"|| path === "/oauth/kakao" ? "none": ""}}>
      <Dock className={classes.nav} model={items} />
    </section>
  )
}

export default MainNavigation
