import { Item } from "semantic-ui-react"
import MyPostDetail from "./MyPostDetail"

const MyCommentsItem = ({comment}) => {
    const myComment = `${comment.comment.substr(0,20)}...`
    const postContent = comment.postContent.substr(0,20)
  return (
    <Item>
      <Item.Content>
        <Item.Header>[{comment.cafeName}]</Item.Header>
        <Item.Meta>
          <span>{myComment}</span>
        </Item.Meta>
        <Item.Extra>{postContent}</Item.Extra>
      </Item.Content>
      {/* <MyPostDetail post={comment}/> */}
    </Item>
  )
}

export default MyCommentsItem
