import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { Menu, Image, Segment, Button } from "semantic-ui-react"
import { useHistory, useLocation, NavLink } from "react-router-dom"
import { useSelector } from "react-redux"

import { getPosts } from "../../store/posts"
import { BsFillPatchQuestionFill } from "react-icons/bs"
import { IoIosSearch } from "react-icons/io"
import { RiArrowDropDownLine } from "react-icons/ri"
import TypeSelector from "./TypeSelector"
import { cafeActions } from "../../store/cafe"

const MainPageTopBar = (props) => {
  const history = useHistory()
  const location = useLocation()
  const dispatch = useDispatch()
  const isFindFeed = useSelector((state) => state.cafe.isFindFeed)
  const [cafeName, setCafeName] = useState("")
  const filterState = useSelector((state) => state.posts.filterState)
  const isLoading = useSelector((state)=>state.posts.isLoading)
  
  const filters = Object.entries(filterState)
      .filter(([key, value]) => value === true)
      .map(([key, value]) => key)
  let cafeAuth = sessionStorage.getItem('cafeAuth')
  useEffect(() => {
    if (JSON.parse(sessionStorage.getItem("myCafe")) !== null) {
      setCafeName(JSON.parse(sessionStorage.getItem("myCafe")).cafeName)
    }
    props.setIsCafeAuth(sessionStorage.getItem("cafeAuth"))
  }, [props.isCafeAuth, cafeAuth])

  const openMapHandler = () => {
    if (location.pathname === "/") {
      history.push("/map")
    }
    if (location.pathname === "/map") {
      history.push("/")
    }
  }
  const feedAddress = sessionStorage.getItem("address")
  const findFeedMyLocation = () => {
    const location = {
      lat: JSON.parse(sessionStorage.getItem("myCafe")).lat,
      lng: JSON.parse(sessionStorage.getItem("myCafe")).lng,
    }
    dispatch(
      getPosts({
        location,
        postId: -1,
        filters: filters,
      })
    )
    sessionStorage.setItem('location', JSON.stringify(location))
    dispatch(cafeActions.findFeedMyLocation())
  }
  return (
    <Segment.Group style={{ border: "none", borderRadius: "0px" }}>
      <Segment
        basic
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {!(props.isCafeAuth === null || props.isCafeAuth === "0") ? (
            <Image
              src={require("../../assets/icons/iced_coffee_30.png")}
              size="mini"
              style={{ marginInline: "0.5rem 0.8rem" }}
            />
          ) : (
            <BsFillPatchQuestionFill
              style={{ marginInline: "0.5rem 0.8rem" }}
              size="36"
              color="grey"
            />
          )}
          <span
            style={{
              whiteSpace: "nowrap",
              fontSize: "1.3rem",
              fontWeight: "bold",
            }}
          >
            {isFindFeed ? feedAddress : props.isCafeAuth==="1" ? cafeName : feedAddress}
          </span>
          <RiArrowDropDownLine
            size="40"
            color="black"
            onClick={openMapHandler}
          />
        </div>
        <div style={{display:"flex"}}>
          {props.isCafeAuth === "1" && <Button icon="location arrow" color="red" circular onClick={findFeedMyLocation} loading={isLoading ? true:false}/>}
          <NavLink to="/search" style={{ marginInliButtonne: "0.5rem 0.3rem" }}>
            <IoIosSearch size="30" color="black" />
          </NavLink>
        </div>
      </Segment>

      <Segment basic>
        {/* <PostTypeCarousel /> */}
        <TypeSelector />
      </Segment>
    </Segment.Group>
  )
}

export default MainPageTopBar
