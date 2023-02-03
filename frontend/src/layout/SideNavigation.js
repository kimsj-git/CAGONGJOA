import { NavLink } from "react-router-dom"
import { Menu, Icon, Segment } from "semantic-ui-react"
import PostForm from "../components/mainPage/PostForm"

const SideNavigation = () => {
  return (
    <Segment vertical textAlign="left" style={{ paddingLeft: "3rem" }}>
      <div style={{ marginBlock: "2rem 5rem", fontSize: "2rem" }}>카공조아</div>
      <Menu secondary vertical fluid>
        <Menu.Item name="home" link>
          <NavLink to="/">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Icon name="home" size="big" />
              <p>홈</p>
            </div>
          </NavLink>
        </Menu.Item>
        <Menu.Item name="chat" link>
          <NavLink to="/chat">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Icon name="talk" size="big" />
              <p>채팅</p>
            </div>
          </NavLink>
        </Menu.Item>
        <Menu.Item name="chat" link>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <PostForm />
            <p>글 쓰기</p>
          </div>
        </Menu.Item>
        <Menu.Item name="today-cafe" link>
          <NavLink to="/today-cafe">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Icon name="coffee" size="big" />
              <p>오늘의 카페</p>
            </div>
          </NavLink>
        </Menu.Item>
        <Menu.Item name="mypage" link>
          <NavLink to="/mypage">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Icon name="user" size="big" />
              <p>마이페이지</p>
            </div>
          </NavLink>
        </Menu.Item>
      </Menu>
    </Segment>
  )
}

export default SideNavigation
