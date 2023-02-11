import { Card, CardHeader, Header, Image, Label } from "semantic-ui-react"
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
  const tierColor = ["#8B6331", "#C0C0C0", "#FF9614", "#3DFF92"][
    parseInt(props.tier / 1000)
  ]

  const likePost = async (isLiked) => {
    console.log(props.id)
    isLiked
      ? dispatch(postsActions.cancleLikePost(props.id))
      : dispatch(postsActions.likePost(props.id))
    await fetchLike({
      url: `${DEFAULT_REST_URL}/main/post/like`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
      body: {
        postId: props.id,
        isChecked: isLiked,
      },
    })
  }
  return props.isLoading ? (
    <LoadingPost />
  ) : (
    <Card raised fluid>
      <Label
        corner="right"
        color="orange"
        icon={{ name: "lightbulb", color: "white" }}
      />
      <Card.Content>
        {props.images.length ? (
          <Image
            src={props.images.length ? props.images[0] : null}
            wrapped
            ui={true}
          />
        ) : null}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "1rem",
          }}
        >
          <div style={{ whiteSpace: "nowrap" }}>
            {props.userType ? (
              <Image
                avatar
                floated="left"
                size="massive"
                src="https://www.freepnglogos.com/uploads/starbucks-logo-png-transparent-0.png"
                style={{
                  marginLeft: "0.5rem",
                  border: `5px solid ${tierColor}`,
                }}
              />
            ) : (
              <Image avatar floated="left">
                <BsFillPatchQuestionFill
                  style={{ marginInline: "0.5rem 0.8rem" }}
                  size="36"
                  color="grey"
                />
              </Image>
            )}
            <Card.Header
              style={{
                fontWeight: "bold",
                fontSize: "1.2rem",
                marginBlock: "0.15rem 0.5rem",
              }}
            >
              {props.writer}
            </Card.Header>
            <Card.Meta>{props.userType ? props.cafeName : null}</Card.Meta>
          </div>

          <Card.Meta textAlign="right">{props.createdAt}</Card.Meta>
        </div>
        <Card.Description
          dangerouslySetInnerHTML={{ __html: props.content }}
          style={{ fontSize: "1.2rem", lineHeight: "1.8" }}
        />
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
