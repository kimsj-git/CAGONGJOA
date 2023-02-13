import { Item } from "semantic-ui-react"
import MyPostDetail from './MyPostDetail'
const MyPostsItem = ({ post }) => {
  const content = `${post.content.substr(0, 50)}...`
  return (
    <Item>
      <Item.Image
        size="tiny"
        src={
          post.imgUrlPath.length>0
            ? require(`../../../assets/icons/${post.images[0]}`)
            : require("../../../assets/icons/kagongjoa_logo.png")
        }
        alt="#"
      />

      <Item.Content>
        <Item.Header>[{post.cafeName}]</Item.Header>
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
