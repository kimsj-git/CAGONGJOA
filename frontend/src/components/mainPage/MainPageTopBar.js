import { Menu, Icon } from "semantic-ui-react"

const MainPageTopBar = () => {
  return (
    <Menu>
      <Menu.Item header>
        <Icon name="question circle outline" size="large" />
      </Menu.Item>
      <Menu.Item name="강남구 역삼동.." />
      <Menu.Item icon="angle down"/>
      <Menu.Item icon="bell outline" size='large'/>
      <Menu.Item icon="search"/>
    </Menu>
  )
}

export default MainPageTopBar
