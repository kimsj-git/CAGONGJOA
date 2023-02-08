import { List, Button, Image } from "semantic-ui-react"
const BlockListItem = (props) => {
  return (
    <>
      <List.Item style={{ marginBottom: "10px", marginTop: "10px" }}>
        <List.Content floated="right">
          <Button>차단 해제</Button>
        </List.Content>
        <Image avatar src="/images/avatar/small/lena.png" />
        <List.Content>{props.userName}</List.Content>
      </List.Item>
      <hr />
    </>
  )
}

export default BlockListItem
