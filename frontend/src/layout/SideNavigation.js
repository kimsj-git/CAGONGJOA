import { NavLink } from "react-router-dom"
import { Menu, Icon, Segment } from "semantic-ui-react"
import PostForm from "../components/mainPage/PostForm"
import {
  AiOutlineHome,
  AiFillHome,
  AiFillBell,
  AiOutlineBell,
} from "react-icons/ai"
import { BsChat, BsChatFill, BsChatDots, BsChatDotsFill } from "react-icons/bs"
import { MdOutlineLocalCafe, MdLocalCafe } from "react-icons/md"
import { HiOutlineUser, HiUser } from "react-icons/hi"
import { HiOutlineMapPin, HiMapPin } from "react-icons/hi2"
import { IoIosSearch, IoSearch } from "react-icons/io"

const SideNavigation = () => {
  return (
    <Segment
      vertical
      textAlign="left"
      style={{ paddingInline: "1.5rem 0.5rem" }}
    >
      <div style={{ margin: "3rem 1rem 5rem", fontSize: "2.5rem" }}>
        카공조아
      </div>
      <Menu secondary vertical fluid style={{ fontSize: "1.3rem" }}>
        <Menu.Item name="home" link>
          <NavLink to="/">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <AiOutlineHome size="36" color="black" />
              <p>홈</p>
            </div>
          </NavLink>
        </Menu.Item>
        <Menu.Item name="location" link>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <HiOutlineMapPin size="36" color="black" />
            <p>위치인증</p>
          </div>
        </Menu.Item>
        <Menu.Item name="post" link>
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
              <MdOutlineLocalCafe size="36" color="black" />
              <p>오늘의 카페</p>
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
              <BsChatDots size="36" color="black" />
              <p>채팅</p>
            </div>
          </NavLink>
        </Menu.Item>
        <Menu.Item name="notice" link>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <AiOutlineBell size="36" color="black" />
            <p>알림</p>
          </div>
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
              <HiOutlineUser size="36" color="black" />
              <p>마이페이지</p>
            </div>
          </NavLink>
        </Menu.Item>
        <Menu.Item name="search" link>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <IoIosSearch size="36" color="black" />
            <p>검색</p>
          </div>
        </Menu.Item>
      </Menu>
    </Segment>
  )
}

export default SideNavigation
