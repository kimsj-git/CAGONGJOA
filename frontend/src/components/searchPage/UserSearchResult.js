import { List, Button, Image } from "semantic-ui-react"

const UserSearchResult = () => {
  const userList = []
  for (let i = 1; i < 10; i++) {
    userList.push(
      <List.Item>
        <List.Content floated="right">
          <Button
            style={{
              backgroundColor: "rgba(97, 202, 114, 1)",
              color: "white",
              borderRadius: "0.6rem !important",
            }}
          >
            채팅 보내기
          </Button>
          <Button
            style={{
              backgroundColor: "rgba(255, 63, 63, 1)",
              color: "white",
              borderRadius: "0.6rem !important",
            }}
          >
            차단하기
          </Button>
        </List.Content>
        <Image
          avatar
          src="https://react.semantic-ui.com/images/avatar/small/helen.jpg"
          size="mini"
        />
        <List.Content>
          <List.Header>Snickerdoodle</List.Header>
        </List.Content>
      </List.Item>
    )
  }

  return (
    <List relaxed="very" divided animated verticalAlign="middle" size="big">
      {userList}
    </List>
  )
}

export default UserSearchResult
