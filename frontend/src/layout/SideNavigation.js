import { NavLink } from "react-router-dom"
import { Menu, Icon } from "semantic-ui-react"

const SideNavigation = () => {
  return (
    <Menu icon='labeled' vertical>
      <Menu.Item name="home">
        <NavLink to="/">
          <Icon name="home" size="big" />
          <p>Home</p>
        </NavLink>
      </Menu.Item>
      <Menu.Item name="chat">
        <NavLink to="/chat">
          <Icon name="talk" size="big" />
          <p>Chat</p>
        </NavLink>
      </Menu.Item>
      <Menu.Item name="today-cafe">
        <NavLink to="/today-cafe">
          <Icon name="coffee" size="big" />
          <p>Cafe</p>
        </NavLink>
      </Menu.Item>
      <Menu.Item name="mypage">
        <NavLink to="/mypage">
          <Icon name="user" size="big" />
          <p>My Page</p>
        </NavLink>
      </Menu.Item>
    </Menu>
  )
}

export default SideNavigation
