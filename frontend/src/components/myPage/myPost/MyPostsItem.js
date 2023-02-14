import { Item } from "semantic-ui-react"
import MyPostDetail from './MyPostDetail'
import classes from "./MyPostsItem.module.css"
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

      <Item.Content className={classes.content}>
        <Item.Header>[{post.cafeName ? post.cafeName : "질문글"}]</Item.Header>
        <Item.Meta>
          <span dangerouslySetInnerHTML={{ __html: content }}></span>
        </Item.Meta>
        <Item.Extra className={classes.detailBtn} >{post.postType}
        <MyPostDetail post={post}/>
        </Item.Extra>
      </Item.Content>
    </Item>
  )
}

export default MyPostsItem
