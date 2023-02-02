import { Item, Button, Icon, Grid } from "semantic-ui-react"

const Profile = () => {
  return (
    <Grid.Row columns={2}>
      <Grid.Column width={4}>
        <Item.Image size="tiny" src="/images/wireframe/image.png" />
      </Grid.Column>
      <Grid.Column width={2}>
        <Item.Content>
          <Item.Header>닉네임 칭호</Item.Header>
          <Item.Meta>
            <Button size="tiny">닉네임 수정</Button>
          </Item.Meta>
          <Item.Description>
            <Icon name="coffee" />
            30
          </Item.Description>
        </Item.Content>
      </Grid.Column>
    </Grid.Row>
  )
}

export default Profile