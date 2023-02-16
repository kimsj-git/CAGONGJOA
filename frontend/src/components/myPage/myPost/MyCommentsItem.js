import { Item } from "semantic-ui-react"

import classes from "./MyCommentsItem.module.css"
import MyPostDetail from "./MyPostDetail"
const DEFAULT_REST_URL = process.env.REACT_APP_REST_DEFAULT_URL

const MyCommentsItem = ({ comment }) => {
  const content =
    comment.commentContent.length > 50
      ? `${comment.commentContent.substr(0, 50)}...`
      : comment.commentContent
  return (
    <Item className={classes.items}>
      <Item.Content className={classes.content}>
        <Item.Header>
          [{comment.cafeName ? comment.cafeName : "질문글"}]
        </Item.Header>
        <Item.Meta>
          <span dangerouslySetInnerHTML={{ __html: content }}></span>
        </Item.Meta>
        <Item.Extra>
          <span
            dangerouslySetInnerHTML={{ __html: comment.postContent }}
          ></span>
          <div className={classes.detailBtn}>
            <MyPostDetail post={comment} />
          </div>
        </Item.Extra>
      </Item.Content>
    </Item>
  )
}

export default MyCommentsItem
