import { Item } from "semantic-ui-react"

const MyPostsItem = ({ post }) => {
  const content = `${post.postContent.substr(0, 50)}...`
  return (
    <Item>
      <Item.Image
        size="tiny"
        src={
          post.postImg
            ? require(`../../../assets/icons/${post.postImg}`)
            : require("../../../assets/icons/kagongjoa_logo.png")
        }
        alt="#"
      />

      <Item.Content>
        <Item.Header>[{post.cafeName}]</Item.Header>
        <Item.Meta>
          <span>{content}</span>
        </Item.Meta>
        <Item.Extra>{post.postType}</Item.Extra>
      </Item.Content>
    </Item>
  )
}

export default MyPostsItem
