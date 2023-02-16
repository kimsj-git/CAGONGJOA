import { Item } from "semantic-ui-react"

import classes from "./MyCommentsItem.module.css"
import MyPostDetail from "./MyPostDetail"
const DEFAULT_REST_URL = process.env.REACT_APP_REST_DEFAULT_URL

const MyCommentsItem = ({ comment }) => {
  const content =
    comment.commentContent.length > 50
      ? `${comment.commentContent.substr(0, 50)}...`
      : comment.commentContent
  const postContent = comment.postContent
  const longContent = postContent.split("</p>").map((content)=>content.substr(3,content.length))

  return (
    <Item className={classes.items}>
      <Item.Content className={classes.content}>
        <Item.Header>
          [{comment.cafeName ? comment.cafeName : "질문글"}]
        </Item.Header>
        <Item.Meta>
          <span dangerouslySetInnerHTML={{ __html: content }}></span>
        </Item.Meta>
        {longContent.length > 5 && (
        <Item.Extra>
            {longContent.slice(0, 2).map((content,index) => {
              return <p key={index}>{content}</p>
            })}
            ...
            </Item.Extra>
        )}
        {longContent.length <= 2 && postContent.length > 50 && (
          <>300
            <Item.Extra
              dangerouslySetInnerHTML={{ __html: postContent.substr(0, 50)+'...' }}
            ></Item.Extra>
          </>
        )}
        {longContent.length <= 2 && postContent.length < 50 && (
          <Item.Extra
            dangerouslySetInnerHTML={{ __html: postContent }}
          />
        )}
          <div className={classes.detailBtn}>
            <MyPostDetail post={comment} />
          </div>
      </Item.Content>
    </Item>
  )
}

export default MyCommentsItem
