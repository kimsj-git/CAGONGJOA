import { useState } from "react"
import { Segment, Image, Button, Modal, Header, Icon } from "semantic-ui-react"
import ToggleButton from "../common/ToggleButton"
import GetBeanModal from "./GetBeanModal"

const JamSurvey = ({ setIsJamSurvey }) => {
  const [selectedBtn, setSelectedBtn] = useState(null)
  const handleChoice = (choice) => {
    setSelectedBtn(choice)
  }
  const nowCafe = JSON.parse(sessionStorage.getItem("myCafe"))
    ? JSON.parse(sessionStorage.getItem("myCafe")).cafeName
    : ""
  const isAuthenticated = sessionStorage.getItem("cafeAuth")
  let openModal = false

  return (
    isAuthenticated && (
      <Segment
        raised
        padded
        style={{ borderRadius: "20px", backgroundColor: "var(--custom-beige)" }}
      >
        {nowCafe && <h3>지금 {nowCafe}에 사람이 많은가요...?</h3>}
        <div style={{ display: "flex", marginBlock: "2rem" }}>
          <ToggleButton
            btnType="crowded"
            fluid
            grouped
            icon={null}
            content="혼잡"
            size="large"
            onClick={() => {
              handleChoice(2)
            }}
            id={selectedBtn == 2 ? "crowded" : "cancle-crowded"}
          />
          <ToggleButton
            btnType="average"
            fluid
            grouped
            icon={null}
            content="보통"
            size="large"
            onClick={() => {
              handleChoice(1)
            }}
            id={selectedBtn == 1 ? "average" : "cancle-average"}
          />
          <ToggleButton
            btnType="quiet"
            fluid
            grouped
            icon={null}
            content="여유"
            size="large"
            onClick={() => {
              handleChoice(0)
            }}
            id={selectedBtn == 0 ? "quiet" : "cancle-quiet"}
          />
        </div>
        <div style={{ paddingInline: "1rem" }}>
          {selectedBtn !== null && (
            <GetBeanModal
              selectedBtn={selectedBtn}
              open={openModal}
              setIsJamSurvey={setIsJamSurvey}
              location="jamSurv"
              beanNum={1}
            />
          )}
        </div>
      </Segment>
    )
  )
}

export default JamSurvey
