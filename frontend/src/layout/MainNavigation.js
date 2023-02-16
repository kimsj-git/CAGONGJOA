import { useLocation, NavLink } from "react-router-dom"
import { AiOutlineHome } from "react-icons/ai"
import { MdOutlineBeenhere } from "react-icons/md"
import { HiOutlineUser } from "react-icons/hi"

import PostForm from "../components/mainPage/PostForm"
import CafeAuth from "../components/certificate/cafeAuth/CafeAuth"

import classes from "./MainNavigation.module.css"

const MainNavigation = () => {
  const location = useLocation()
  const path = location.pathname

  return (
    <div
      className={classes.navbar}
      style={{
        display: path === "/login" || path === "/oauth/kakao" ? "none" : "",
      }}
    >
      <div>
        <NavLink to="/" style={{ color: "black" }}>
          <AiOutlineHome size="30" color="black" />
        </NavLink>
      </div>
      <div>
        <CafeAuth isMainNavigation="1" />
      </div>
      <div>
        <PostForm isMainNavigation="1" />
      </div>
      <div>
        <NavLink to="/today-cafe" style={{ color: "black" }}>
          <MdOutlineBeenhere size="30" color="black" />
        </NavLink>
      </div>
      <div>
        <NavLink to="/mypage" style={{ color: "black" }}>
          <HiOutlineUser size="30" color="black" />
        </NavLink>
      </div>
    </div>
  )
}

export default MainNavigation
