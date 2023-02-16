import { NavLink, useLocation, useHistory } from "react-router-dom"
import { useState } from "react"

import { Menu, Segment, Image } from "semantic-ui-react"
import PostForm from "../components/mainPage/PostForm"
import {
  AiOutlineHome,
  AiFillHome,
  AiFillStar,
  AiOutlineStar,
} from "react-icons/ai"
import {
  MdOutlineLocalCafe,
  MdLocalCafe,
  MdBeenhere,
  MdOutlineBeenhere,
} from "react-icons/md"
import { HiOutlineUser, HiUser, HiOutlineLogout } from "react-icons/hi"
import { IoIosSearch } from "react-icons/io"
import { IoSearch } from "react-icons/io5"
import CafeAuth from "../components/certificate/cafeAuth/CafeAuth"
import "./SideNavigation.css"
import getAccessToken from "../hooks/getAccessToken"
import Logout from "../components/member/logout/Logout"

const DEFAULT_REST_URL = process.env.REACT_APP_REST_DEFAULT_URL

const SideNavigation = ({
  isCafeAuth,
  setIsCafeAuth,
  setIsJamSurvey,
  setIsAuthenticated,
}) => {
  const location = useLocation()
  const history = useHistory()

  const path = location.pathname
  const directory = {
    "/": "home",
    "/today-cafe": "today-cafe",
    "/chat": "chat",
    "/mypage": "mypage",
    "/search": "search",
  }
  const navigationPath = {
    home: "/",
    "today-cafe": "/today-cafe",
    "make-coffee": "/today-cafe/make-coffee",
    fortune: "/today-cafe/fortune",
    mypage: "/mypage",
    search: "/search",
  }
  // console.log(isCafeAuth)
  const [activeItem, setActiveItem] = useState(directory[location.pathname])
  const [prevItem, setPrevItem] = useState("")
  const menuClickHandler = (e, { name }) => {
    setActiveItem(name)
    if (activeItem !== name) {
      setPrevItem(activeItem)
    }
    if (name === "location") {
      // 위치인증 모달..
    } else if (name === "post") {
      // 글쓰기 모달..
    } else {
      history.push(navigationPath[name])
    }
  }
  const closeModal = () => {
    setActiveItem(prevItem)
  }

  const logout = async () => {
    const response = await fetch(`${DEFAULT_REST_URL}/member/logout`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        "Authorization-RefreshToken": `Bearer ${sessionStorage.getItem(
          "refreshToken"
        )}`,
      },
    })
    const responseData = await response.json()
    if (
      responseData.httpStatus === "UNAUTHORIZED" &&
      responseData.data.sign === "JWT"
    ) {
      getAccessToken({func:logout})
    } else if (responseData.httpStatus === "OK") {
      setIsAuthenticated(undefined)
      setIsCafeAuth("0")
      sessionStorage.clear()
      window.location.href ='/login'
    } else {
      alert("오류가 발생했습니다.")
    }
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
        display: path === "/login" || path === "/oauth/kakao" || path === "/signup" ? "none" : "",
      }}
    >
      <div style={{ margin: "0.5rem 0rem 1.5rem" }}>
        <NavLink
          to="/"
          style={{
            color: "black",
            display: "flex",
            // flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* <Image
            src={require("../assets/icons/kagongjoa_logo.png")}
            style={{ marginBottom: "1rem", width: "50%" }}
          /> */}
          <Image
            src={require("../assets/icons/coffee_location_red.png")}
            // style={{ height: "72px" }}
            size="tiny"
          />
          <p id="title" style={{ fontSize: "2rem" }}>
            카공조아
          </p>
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

        {(isCafeAuth === null || isCafeAuth === "0") && (
          <Menu.Item
            name="location"
            link
            onClick={menuClickHandler}
            active={activeItem === "location"}
          >
            {/* 위치인증 모달 창 */}
            <CafeAuth
              activeItem={activeItem}
              closeModal={closeModal}
              setIsCafeAuth={setIsCafeAuth}
              setIsJamSurvey={setIsJamSurvey}
            />
          </Menu.Item>
        )}
        <Menu.Item
          name="post"
          link
          onClick={menuClickHandler}
          active={activeItem === "post"}
        >
          {/* 글 쓰기 네비 Item */}
          <PostForm
            isEditing={false}
            activeItem={activeItem}
            closeModal={closeModal}
          />
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
                <MdBeenhere size="30" color="black" />
              ) : (
                <MdOutlineBeenhere size="30" color="black" />
              )}
              <p>오늘의 카페</p>
            </div>
          </NavLink>
        </Menu.Item>
        <Menu.Item
          name="make-coffee"
          link
          onClick={menuClickHandler}
          active={activeItem === "make-coffee"}
        >
          <NavLink to="/today-cafe/make-coffee">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {activeItem === "make-coffee" ? (
                <MdLocalCafe size="30" color="black" />
              ) : (
                <MdOutlineLocalCafe size="30" color="black" />
              )}
              <p>커피 내리기</p>
            </div>
          </NavLink>
        </Menu.Item>
        <Menu.Item
          name="fortune"
          link
          onClick={menuClickHandler}
          active={activeItem === "fortune"}
        >
          <NavLink to="/fortune">
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {activeItem === "fortune" ? (
                <AiFillStar size="30" color="black" />
              ) : (
                <AiOutlineStar size="30" color="black" />
              )}
              <p>운세 뽑기</p>
            </div>
          </NavLink>
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
        <Menu.Item name="logout" link onClick={logout}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <HiOutlineLogout size="30" color="black" />
            <p>로그아웃</p>
          </div>
        </Menu.Item>
      </Menu>
    </Segment>
  )
}

export default SideNavigation
