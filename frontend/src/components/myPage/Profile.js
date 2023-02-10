import { Item, Button, Icon, Grid } from "semantic-ui-react"

const Profile = () => {
  const nickname = sessionStorage.getItem('nickname')
  return (
    <Grid.Row columns={2}>
      <Grid.Column width={3} verticalAlign="middle">
        <Item.Image size="tiny" src = {require(`../../assets/cafe_logos/starbucks.png`)} />
      </Grid.Column>
      <Grid.Column width={5}>
        <Item.Content>
          <Item.Header><h2>{nickname}</h2></Item.Header>
        </Item.Content>
      </Grid.Column>
    </Grid.Row>
  )
}

export default Profile
