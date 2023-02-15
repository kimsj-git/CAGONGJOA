import { Item } from "semantic-ui-react"
import { useDispatch } from "react-redux"
import MyPostDetail from './MyPostDetail'

import classes from "./MyPostsItem.module.css"
import { postsActions } from "../../../store/posts"
import useFetch from "../../../hooks/useFetch"

const DEFAULT_REST_URL = process.env.REACT_APP_REST_DEFAULT_URL

const MyPostsItem = ({ post, likePlus, likeCancel }) => {
  const dispatch = useDispatch()
  const content = post.content.length>50 ? `${post.content.substr(0, 50)}...` : post.content
  const { data, isLoading, sendRequest: fetchLike } = useFetch()
  console.log(post)
  
  const likePost = async (isLiked) => {
    isLiked
      ? likePlus(post.postId)
      : likeCancel(post.postId)
    await fetchLike({
      url: `${DEFAULT_REST_URL}/main/post/like`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
      body: {
        postId: post.postId,
        isChecked: isLiked,
      },
    })
    console.log(data)
  }

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
        <Item.Extra className={classes.detailBtn} >
        <MyPostDetail post={post} likeHandler={likePost}/>
        </Item.Extra>
      </Item.Content>
    </Item>
  )
}

export default MyPostsItem
