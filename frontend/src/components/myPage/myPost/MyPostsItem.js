import { Item } from "semantic-ui-react"
import MyPostDetail from './MyPostDetail'
import classes from "./MyPostItem.module.css"
const MyPostsItem = ({ post }) => {
  const content = post.content.length>50 ? `${post.content.substr(0, 50)}...` : post.content
  return (
    <Item className={classes.items}>
      <Item.Image
        size="tiny"
        src={
          post.imgUrlPath.length>0
            ? post.imgUrlPath[0]
            : require("../../../assets/icons/kagongjoa_logo.png")
        }
        alt="#"
      />

      <Item.Content>
        <Item.Header>[{post.cafeName ? post.cafeName : "질문글"}]</Item.Header>
        <Item.Meta>
          <span>{content}</span>
        </Item.Meta>
        <Item.Extra>{post.postType}
        <MyPostDetail post={post}/>
        </Item.Extra>
      </Item.Content>
    </Item>
  )
}

export default MyPostsItem
