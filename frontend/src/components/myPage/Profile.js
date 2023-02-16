import { useDispatch, useSelector } from "react-redux"
import { Item, Image, Button } from "semantic-ui-react"
import { modalActions } from "../../store/modal"

import { BsFillPatchQuestionFill } from "react-icons/bs"

const Profile = () => {
  const dispatch = useDispatch()
  const brandLogo = useSelector((state) => state.cafe.brandLogo)
  const nickname = sessionStorage.getItem("nickname")
  const nowCafe = JSON.parse(sessionStorage.getItem("myCafe"))
  const todayCafe = JSON.parse(sessionStorage.getItem("todayCafe"))
  const tierColor =
    todayCafe && parseInt(todayCafe.exp / 1000) < 4
      ? ["#8B6331", "#C0C0C0", "#FF9614", "#3DFF92"][
          parseInt(todayCafe.exp / 1000)
        ]
      : "#65B1EF"

  return (
    <Item.Group>
      <Item>
        {todayCafe ? (
          <Item.Image
            size="small"
            src={require(`../../assets/cafe_logos/${
              brandLogo[todayCafe.brandType]
            }.png`)}
            style={{
              border: `0.5rem solid ${tierColor}`,
              borderRadius: "70%",
              marginBottom: "1rem",
            }}
          />
        ) : (
          <Item.Image size="tiny">
            <BsFillPatchQuestionFill
              style={{ marginInline: "0.5rem 0.8rem" }}
              size="70"
              color="grey"
            />
          </Item.Image>
        )}

        <Item.Content>
          <Item.Header>
            <h2>{nickname}</h2>
          </Item.Header>
          <Item.Description>
            <Image
              src={require("../../assets/icons/coffee_bean.png")}
              size="mini"
              style={{ display: "inline" }}
            />
            3개
            <Image
              src={require("../../assets/icons/expresso.png")}
              size="mini"
              style={{ display: "inline" }}
            />{" "}
            2잔
          </Item.Description>
          {/* <Item.Description>라얼아ㅓ라어라</Item.Description> */}

          {nowCafe ? (
            <Item.Extra style={{ opacity: "50%", fontSize: "8px" }}>
              {nowCafe.cafeName}
            </Item.Extra>
          ) : (
            <Button
              onClick={() => {
                dispatch(modalActions.openCafeAuthModal())
              }}
              style={{
                backgroundColor: "var(--custom-pink)",
                color: "white",
                borderRadius: "20px",
              }}
            >
              위치 인증
            </Button>
          )}
        </Item.Content>
      </Item>
    </Item.Group>
  )
}

export default Profile
