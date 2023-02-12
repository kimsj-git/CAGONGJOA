import { useDispatch } from "react-redux"
import { Item, Grid, Button } from "semantic-ui-react"
import { modalActions } from "../../store/modal"
import CafeAuth from "../certificate/cafeAuth/CafeAuth"

const Profile = () => {
  const dispatch = useDispatch()
  const nickname = sessionStorage.getItem("nickname")
  const nowCafe = JSON.parse(sessionStorage.getItem("myCafe"))
  return (
    <Grid.Row columns={2}>
      <Grid.Column width={3} verticalAlign="middle">
        <Item.Image
          size="tiny"
          src={require(`../../assets/cafe_logos/starbucks.png`)}
        />
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
