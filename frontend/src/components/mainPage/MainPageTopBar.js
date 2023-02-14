import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { Menu, Image, Segment, Button } from "semantic-ui-react"
import { useHistory, useLocation, NavLink } from "react-router-dom"
import { useSelector } from "react-redux"

import { getPosts } from "../../store/posts"
import { BsFillPatchQuestionFill } from "react-icons/bs"
import { AiOutlineBell } from "react-icons/ai"
import { IoIosSearch } from "react-icons/io"
import { RiArrowDropDownLine } from "react-icons/ri"
import PostTypeCarousel from "./PostTypeCarousel"
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
    dispatch(
      getPosts({
        location: {
          lat: JSON.parse(sessionStorage.getItem("myCafe")).lat,
          lng: JSON.parse(sessionStorage.getItem("myCafe")).lng,
        },
        postId: -1,
        filters: filters,
      })
    )
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
              src="https://s3-alpha-sig.figma.com/img/0207/5992/b4ca9f4af86076f8b39354c7b31c0526?Expires=1676246400&Signature=Sk89L11wkpikP8yd71d2ErDCIimjqaCTKDn6WJhA7ZrNUAeCOsxKr79HaNCEnRQHSwh124lDWkJmcapf7j7BtrxUMbOvN6fC0WEotXP3-UEhC3UghL0JFVQdvK8SIaJk7VObcl8y19fIEimk4nA-oTnwV1UZ1k5GHsO4yTf7nhlPER1ntq652jYv3prrMHXreXVUFe4XG3PpNIh8n2tH8rNyWL6CcECjFmyzodWjFgUQ24Yvno8PGHzZoSo5zfAnMU0JgAaKRpboihC5tCLmQ22DF58mPrPVq7XdOeW0xA4qMC7XjXiA0atZRUSLWJp~Vaebvtppjc5oCYj9Jhg-qw__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4"
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
          <Button icon="location arrow" circular onClick={findFeedMyLocation} loading={isLoading ? true:false}></Button>
          <NavLink to="/search" style={{ marginInline: "0.5rem 0.3rem" }}>
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
