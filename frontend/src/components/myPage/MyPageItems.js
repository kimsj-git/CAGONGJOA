import { NavLink, useLocation } from "react-router-dom"
import { Segment, Icon } from "semantic-ui-react"
import { FaRegCalendarAlt } from "react-icons/fa"
import { GrBook } from "react-icons/gr"
import { TbWriting } from "react-icons/tb"
import { TfiWrite } from "react-icons/tfi"
import { TbSettings } from "react-icons/tb"
import Logout from "../../components/member/logout/Logout"

import "../../pages/MyPage.css"

const MainPageItems = ({ setIsAuthenticated, setIsCafeAuth }) => {
  const location = useLocation()
  const defaultURL = location.pathname
  return (
    <div>
      <Segment vertical padded basic>
        <NavLink to={`${defaultURL}/study`} className="navItem">
          <FaRegCalendarAlt size={30} />
          카공 생활
        </NavLink>
      </Segment>
      <Segment vertical padded basic>
        <NavLink to={`${defaultURL}/cafebadge`} className="navItem">
          <GrBook size={30} />
          방문카페 도감
        </NavLink>
      </Segment>
      <Segment vertical padded basic>
        <NavLink to={`${defaultURL}/feed`} className="navItem">
          <TbWriting size={30} />
          내가 쓴 글/댓글
        </NavLink>
      </Segment>
      <Segment vertical padded basic>
        <NavLink to={`${defaultURL}/setting`} className="navItem">
          <TbSettings size={30} />
          설정
        </NavLink>
      </Segment>
      <Logout
        setIsAuthenticated={setIsAuthenticated}
        setIsCafeAuth={setIsCafeAuth}
      />
    </div>
  )
}

export default MainPageItems
