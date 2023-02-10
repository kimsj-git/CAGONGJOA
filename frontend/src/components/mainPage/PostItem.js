import { Card, Button, Image, Label } from "semantic-ui-react"
import PostDetail from "./PostDetail"
import LoadingPost from "./LoadingPost"
import ToggleButton from "../common/ToggleButton"
import useFetch from "../../hooks/useFetch.js"
import { BsFillPatchQuestionFill } from "react-icons/bs"
import { postsActions } from "../../store/posts"
import { useSelector, useDispatch } from "react-redux"

const DEFAULT_REST_URL = process.env.REACT_APP_REST_DEFAULT_URL

const PostItem = (props) => {
  const { data, isLoading, sendRequest: fetchLike } = useFetch()
  const dispatch = useDispatch()

  const likePost = async (btnState) => {
    dispatch(postsActions.likePost(props.postId))
    await fetchLike({
      url: `${DEFAULT_REST_URL}/main/post/like`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
      body: {
        isChecked: btnState,
      },
    })
  }
  return props.isLoading ? (
    <LoadingPost />
  ) : (
    <Card raised fluid>
      <Label corner="right" icon={{ name: "lightbulb", color: "orange" }} />
      <Card.Content>
        {props.userType ? (
          <Image
            avatar
            floated="left"
            size="huge"
            src="https://www.freepnglogos.com/uploads/starbucks-logo-png-transparent-0.png"
            style={{
              border: `5px solid ${
                ["#8B6331", "#C0C0C0", "#FF9614", "#3DFF92"][
                  parseInt(props.exp / 1000)
                ]
              }`,
            }}
          />
        ) : (
          <BsFillPatchQuestionFill
            style={{ marginInline: "0.5rem 0.8rem" }}
            size="36"
            color="grey"
          />
        )}
        <Card.Header>{props.writer}</Card.Header>
        <Card.Meta>{props.userType ? props.cafeName : null}</Card.Meta>
        <Card.Meta textAlign="right">{props.createdAt}</Card.Meta>
        <Image
          src={props.images.length ? props.images[0] : null}
          wrapped
          ui={true}
          style={{ marginBlock: "0.5rem" }}
        />
        <Card.Description style={{ fontSize: "1.2rem", lineHeight: "1.8" }}>
          {props.content}
        </Card.Description>
        <Card.Meta textAlign="right">더보기</Card.Meta>
      </Card.Content>
      <Card.Content extra>
        <div style={{ display: "flex" }}>
          <ToggleButton
            fluid
            inverted
            content={props.likeCnt}
            btnType="like"
            likeHandler={likePost}
          />

          <PostDetail post={props} likeHandler={likePost} />
        </div>
      </Card.Content>
    </Card>
  )
}

export default PostItem
