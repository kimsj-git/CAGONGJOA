import MapDiv from "../components/map/MapDiv"
import { Segment, Image } from "semantic-ui-react"
import { useHistory } from "react-router-dom"
import { useSelector } from "react-redux"
import { BsFillPatchQuestionFill } from "react-icons/bs"
import { RiArrowDropUpLine } from "react-icons/ri"

const MapPage = () => {
  const history = useHistory()
  const isCafeAuth = sessionStorage.getItem("cafeAuth")
  const isFindFeed = useSelector((state) => state.cafe.isFindFeed)

  const closeMapHandler = () => {
    history.push("/")
  }

  return (
    <div
      style={{
        // width: "90vw",
        height: "98vh",
      }}
    >
      <Segment
        basic
        style={{
          borderRadius: "50px",
          backgroundColor: "rgb(255 191 174 / 15%)",
          boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.10)",
          // width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {!(isCafeAuth === null || isCafeAuth === "0") ? (
            <Image
              src={require("../assets/icons/iced_coffee_30.png")}
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
            {isFindFeed
              ? sessionStorage.getItem("address")
              : isCafeAuth === "1"
              ? JSON.parse(sessionStorage.getItem("myCafe")).cafeName
              : sessionStorage.getItem("address")}
          </span>
          <RiArrowDropUpLine
            size="40"
            color="black"
            onClick={closeMapHandler}
          />
        </div>
      </Segment>
      <MapDiv />
    </div>
  )
}

export default MapPage
