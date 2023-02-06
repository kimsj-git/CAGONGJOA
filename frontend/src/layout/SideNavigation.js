import { NavLink } from "react-router-dom"
import { useState } from "react"
import { Menu, Segment } from "semantic-ui-react"
import PostForm from "../components/mainPage/PostForm"
import {
  AiOutlineHome,
  AiFillHome,
  AiFillBell,
  AiOutlineBell,
} from "react-icons/ai"
import { BsChatDots, BsChatDotsFill } from "react-icons/bs"
import { MdOutlineLocalCafe, MdLocalCafe } from "react-icons/md"
import { HiOutlineUser, HiUser } from "react-icons/hi"
import { HiOutlineMapPin, HiMapPin } from "react-icons/hi2"
import { IoIosSearch } from "react-icons/io"
import { IoSearch } from "react-icons/io5"
import "./SideNavigation.css"

const SideNavigation = () => {
  const [activeItem, setActiveItem] = useState("home")
  const menuClickHandler = (e, { name }) => {
    setActiveItem(name)
    console.log(name)
  }

  return (
    <Segment
      className="side-bar"
      vertical
      textAlign="left"
      style={{
        position: "sticky",
        top: "0px",
        paddingInline: "1.5rem 0.5rem",
        borderRight: "1px solid lightgray",
        height: "100vh",
      }}
    >
      <div
        className="logo-title"
        style={{ margin: "3rem 1rem 5rem", fontSize: "2.5rem" }}
      >
        <NavLink to="/" style={{ color: "black" }}>
          카공조아
        </NavLink>
      </div>
      <Menu secondary vertical fluid style={{ fontSize: "1.2rem" }}>
        <Menu.Item
          name="home"
          link
          onClick={menuClickHandler}
          active={activeItem === "home"}
        >
          <NavLink to="/">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {activeItem === "home" ? (
                <AiFillHome size="30" color="black" />
              ) : (
                <AiOutlineHome size="30" color="black" />
              )}
              <p>홈</p>
            </div>
          </NavLink>
        </Menu.Item>
        <Menu.Item
          name="location"
          link
          onClick={menuClickHandler}
          active={activeItem === "location"}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {activeItem === "location" ? (
              <HiMapPin size="30" color="black" />
            ) : (
              <HiOutlineMapPin size="30" color="black" />
            )}
            <p>위치인증</p>
          </div>
        </Menu.Item>
        <Menu.Item
          name="post"
          link
          onClick={menuClickHandler}
          active={activeItem === "post"}
        >
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
        <Menu.Item
          name="today-cafe"
          link
          onClick={menuClickHandler}
          active={activeItem === "today-cafe"}
        >
          <NavLink to="/today-cafe">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {activeItem === "today-cafe" ? (
                <MdLocalCafe size="30" color="black" />
              ) : (
                <MdOutlineLocalCafe size="30" color="black" />
              )}
              <p>오늘의 카페</p>
            </div>
          </NavLink>
        </Menu.Item>
        <Menu.Item
          name="chat"
          link
          onClick={menuClickHandler}
          active={activeItem === "chat"}
        >
          <NavLink to="/chat">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {activeItem === "chat" ? (
                <BsChatDotsFill size="30" color="black" />
              ) : (
                <BsChatDots size="30" color="black" />
              )}
              <p>채팅</p>
            </div>
          </NavLink>
        </Menu.Item>
        <Menu.Item
          name="notice"
          link
          onClick={menuClickHandler}
          active={activeItem === "notice"}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {activeItem === "notice" ? (
              <AiFillBell size="30" color="black" />
            ) : (
              <AiOutlineBell size="30" color="black" />
            )}
            <p>알림</p>
          </div>
        </Menu.Item>
        <Menu.Item
          name="mypage"
          link
          onClick={menuClickHandler}
          active={activeItem === "mypage"}
        >
          <NavLink to="/mypage">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {activeItem === "mypage" ? (
                <HiUser size="30" color="black" />
              ) : (
                <HiOutlineUser size="30" color="black" />
              )}
              <p>마이페이지</p>
            </div>
          </NavLink>
        </Menu.Item>
        <Menu.Item
          name="search"
          link
          onClick={menuClickHandler}
          active={activeItem === "search"}
        >
          <NavLink to="/search">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {activeItem === "search" ? (
                <IoSearch size="30" color="black" />
              ) : (
                <IoIosSearch size="30" color="black" />
              )}
              <p>검색</p>
            </div>
          </NavLink>
        </Menu.Item>
      </Menu>
    </Segment>
  )
}

export default SideNavigation
