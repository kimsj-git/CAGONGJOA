import { Item } from "semantic-ui-react"

import MyPostDetail from "./MyPostDetail"
const DEFAULT_REST_URL = process.env.REACT_APP_REST_DEFAULT_URL

const MyCommentsItem = ({comment}) => {
  const content = comment.commentContent.length>50 ? `${comment.commentContent.substr(0, 50)}...` : comment.commentContent
  return(
    <Item>
      <Item.Content>
        <Item.Header>[{comment.cafeName ? comment.cafeName : "질문글"}]</Item.Header>
        <Item.Meta>
          <span dangerouslySetInnerHTML={{ __html: content }}></span>
        </Item.Meta>
        <Item.Extra >
        <span dangerouslySetInnerHTML={{ __html: comment.postContent }}></span>
        <MyPostDetail post={comment} />
        </Item.Extra>
      </Item.Content>
    </Item>
  )
}

export default MyCommentsItem
