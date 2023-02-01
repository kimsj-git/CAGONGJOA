import { Menu, Icon } from "semantic-ui-react"
import { useHistory,useLocation } from "react-router-dom"


const MainPageTopBar = () => {
  const history = useHistory()
  const location = useLocation()

  const openMapHandler = () => {
    if (location.pathname === "/"){
      history.push('/map')
    }
    if (location.pathname === "/map"){
      history.push('/')
    }
  }

  return (
    <Menu>
      <Menu.Item header>
        <Icon name="question circle outline" size="large" />
      </Menu.Item>
      <Menu.Item name="강남구 역삼동.." />
      <Menu.Item icon="angle down" onClick={openMapHandler}/>
      <Menu.Item icon="bell outline" size='large'/>
      <Menu.Item icon="search"/>
    </Menu>
  )
}

export default MainPageTopBar
