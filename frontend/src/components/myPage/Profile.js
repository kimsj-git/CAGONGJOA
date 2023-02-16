import { useDispatch, useSelector } from "react-redux"
import { Item, Grid, Button } from "semantic-ui-react"
import { modalActions } from "../../store/modal"

import { BsFillPatchQuestionFill } from "react-icons/bs"


const Profile = () => {
  const dispatch = useDispatch()
  const brandLogo = useSelector((state) => state.cafe.brandLogo)
  const nickname = sessionStorage.getItem("nickname")
  const nowCafe = JSON.parse(sessionStorage.getItem("myCafe"))
  const todayCafe = JSON.parse(sessionStorage.getItem("todayCafe"))
  const tierColor = todayCafe && 
    parseInt(todayCafe.exp / 1000) < 4
      ? ["#8B6331", "#C0C0C0", "#FF9614", "#3DFF92"][
          parseInt(todayCafe.exp / 1000)
        ]
      : "#65B1EF"

  return (
    <Grid.Row columns={2}>
      <Grid.Column width={3} verticalAlign="middle">
        {todayCafe ? 
        <Item.Image
          size="tiny"
          src={require(`../../assets/cafe_logos/${brandLogo[todayCafe.brandType]}.png`)}
          style={{ border: `0.5rem solid ${tierColor}`, borderRadius: "70%", marginBottom:"1rem"}}

        /> : 
        <BsFillPatchQuestionFill
              style={{ marginInline: "0.5rem 0.8rem" }}
              size="36"
              color="grey"
            />
        }
      </Grid.Column>
      <Grid.Column width={5} verticalAlign="middle">
        <Item.Content>
          <Item.Header>
            <h2>{nickname}</h2>
          </Item.Header>
        </Item.Content>
        {nowCafe ? (
          <Item.Extra style={{opacity:"50%", fontSize:"8px"}}>{nowCafe.cafeName}</Item.Extra>
        ):<Button onClick={()=>{dispatch(modalActions.openCafeAuthModal())}}>위치 인증</Button>}
      </Grid.Column>
    </Grid.Row>
  )
}

export default Profile
