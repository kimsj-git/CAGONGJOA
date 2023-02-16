import { useState } from "react"
import { NavLink, useLocation, useHistory } from "react-router-dom"

const TodayCafeNavigation = () => {
  const location = useLocation()
  const history = useHistory()
  const directory = {
    "/today-cafe": "today-cafe",
    "/today-cafe/make-coffee": "make-coffee",
    "/today-cafe/fortune": "fortune",
  }
  const navigationPath = {
    "today-cafe": "/today-cafe",
    "make-coffee": "/today-cafe/make-coffee",
    "fortune": "/today-cafe/fortune",
  }
  const [activeItem, setActiveItem] = useState(directory[location.pathname])
  const menuClickHandler = (e, { name }) => {
    setActiveItem(name)
    if (activeItem !== name) {
      history.push(navigationPath[name])
    }
  }

  const inactiveStyle = {
    fontSize: "140%",
    fontFamily: "GangwonEdu_OTFBoldA",
    color: "rgba(0, 0, 0, .58)",
  }
  const activeStyle = {
    fontSize: "150%",
    fontFamily: "GangwonEdu_OTFBoldA",
    color: "rgba(0, 0, 0, .87)",
    fontWeight: "900",
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        padding: "1.5rem",
      }}
    >
      <div name="today-cafe" onClick={menuClickHandler}>
        <NavLink to="/today-cafe">
          <p style={activeItem === "today-cafe" ? activeStyle : inactiveStyle}>
            현재 카페
          </p>
        </NavLink>
      </div>
      <div>
        <NavLink to="/today-cafe/make-coffee">
          <p style={activeItem === "make-coffee" ? activeStyle : inactiveStyle}>
            커피 내리기
          </p>
        </NavLink>
      </div>
      <div>
        <NavLink to="/today-cafe/fortune">
          <p style={activeItem === "fortune" ? activeStyle : inactiveStyle}>
            오늘의 운세
          </p>
        </NavLink>
      </div>
    </div>
  )
}

export default TodayCafeNavigation
