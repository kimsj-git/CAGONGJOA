import { useLocation, NavLink } from "react-router-dom"
import { AiOutlineHome } from "react-icons/ai"
import { MdOutlineBeenhere } from "react-icons/md"
import { HiOutlineUser } from "react-icons/hi"
import { GrMapLocation } from "react-icons/gr"
import { HiOutlineMapPin } from "react-icons/hi2"
import { useDispatch } from "react-redux"
import { modalActions } from "../store/modal"

import PostForm from "../components/mainPage/PostForm"
import classes from "./MainNavigation.module.css"

const MainNavigation = (props) => {
  const cafeAuth = props.isCafeAuth
  const location = useLocation()
  const path = location.pathname
  const dispatch = useDispatch()

  return (
    <div
      className={classes.navbar}
      style={{
        display: path === "/login" || path === "/oauth/kakao" || path === "/signup" ?  "none" : "",
        zIndex: "10",
      }}
    >
      <div>
        <NavLink to="/" style={{ color: "black" }}>
          <AiOutlineHome size="35" color="black" />
        </NavLink>
      </div>
      <div>
        {(cafeAuth === "0" || cafeAuth === null) && (
          <HiOutlineMapPin
            size="35"
            color="black"
            onClick={() => {
              dispatch(modalActions.openCafeAuthModal())
            }}
          />
        )}
        {cafeAuth === "1" && (
          <NavLink to="/map" style={{ color: "black" }}>
            <GrMapLocation size="35" color="black" />
          </NavLink>
        )}
      </div>
      <div>
        <PostForm isMainNavigation="1" />
      </div>
      <div>
        <NavLink to="/today-cafe" style={{ color: "black" }}>
          <MdOutlineBeenhere size="35" color="black" />
        </NavLink>
      </div>
      <div>
        <NavLink to="/mypage" style={{ color: "black" }}>
          <HiOutlineUser size="35" color="black" />
        </NavLink>
      </div>
    </div>
  )
}

export default MainNavigation
