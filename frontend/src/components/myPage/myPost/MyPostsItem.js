import { Item } from "semantic-ui-react"
import MyPostDetail from './MyPostDetail'

import classes from "./MyPostsItem.module.css"

const MyPostsItem = ({ post }) => {
  const content = post.content
  const longContent = post.content.split("</p>").map((content)=>content.substr(3,content.length))

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
        {longContent.length > 2 && (
        <Item.Extra>
            {longContent.slice(0, 2).map((content,index) => {
              return <p key={index}>{content}</p>
            })}
            ...
            </Item.Extra>
        )}
        {longContent.length <= 2 && content.length > 50 && (
          <>300
            <Item.Extra
              dangerouslySetInnerHTML={{ __html: content.substr(0, 50)+'...' }}
            ></Item.Extra>
          </>
        )}
        {longContent.length <= 2 && content.length < 50 && (
          <Item.Extra
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
        </Item.Meta>
        <Item.Extra className={classes.detailBtn} >
        <MyPostDetail post={post}/>
        </Item.Extra>
      </Item.Content>
    </Item>
  )
}

export default MyPostsItem
