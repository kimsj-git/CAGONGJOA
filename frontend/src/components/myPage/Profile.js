import { useDispatch, useSelector } from "react-redux"
import { Item, Image, Button } from "semantic-ui-react"
import { modalActions } from "../../store/modal"
import { BsFillPatchQuestionFill } from "react-icons/bs"
import { useState, useEffect } from "react"
import useFetch from "../../hooks/useFetch"
const DEFAULT_REST_URL = process.env.REACT_APP_REST_DEFAULT_URL

const Profile = () => {
  const { data: fetchedCoffee, sendRequest: fetchCoffee } = useFetch()
  const [coffeeBeanCnt, setCoffeeBeanCnt] = useState(0)
  const [coffeeCnt, setCoffeeCnt] = useState(0)

  useEffect(() => {
    fetchCoffee({
      url: `${DEFAULT_REST_URL}/member/coin`,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
    })
  }, [])

  useEffect(() => {
    setCoffeeBeanCnt(fetchedCoffee.coffeeBeanCnt)
    setCoffeeCnt(fetchedCoffee.coffeeCnt)
  }, [fetchedCoffee])
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

  fetch(`${DEFAULT_REST_URL}/api/memeber/coin`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
    },
  })
  return (
    <Item.Group unstackable>
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
              style={{ width: "auto !important" }}
              size="80"
              color="grey"
            />
          </Item.Image>
        )}

        <Item.Content>
          <Item.Header>
            <h2>{nickname}</h2>
          </Item.Header>
          <Item.Description style={{ display: "flex" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "1rem",
                fontSize: "1.5rem",
              }}
            >
              <Image
                src={require("../../assets/icons/coffee_beans.png")}
                size="mini"
                style={{ marginRight: "0.5rem" }}
              />
              {coffeeBeanCnt}개
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "1rem",
                fontSize: "1.5rem",
              }}
            >
              <Image
                src={require("../../assets/icons/coffee_cup.png")}
                size="mini"
                style={{ marginRight: "0.5rem" }}
              />
              {coffeeCnt}개
            </div>
          </Item.Description>

          {nowCafe ? (
            <Item.Extra style={{ opacity: "50%", fontSize: "8px" }}>
              {nowCafe.cafeName}
            </Item.Extra>
          ) : (
            <Button
              floated="right"
              onClick={() => {
                dispatch(modalActions.openCafeAuthModal())
              }}
              style={{
                backgroundColor: "var(--custom-pink)",
                color: "white",
                borderRadius: "20px",
                marginTop: "2vh",
              }}
            >
              카페 방문 인증 하러가기
            </Button>
          )}
        </Item.Content>
      </Item>
    </Item.Group>
  )
}

export default Profile
