import { Card, CardHeader, Header, Image, Label } from "semantic-ui-react"
import PostDetail from "./PostDetail"
import LoadingPost from "./LoadingPost"
import ToggleButton from "../common/ToggleButton"
import useFetch from "../../hooks/useFetch.js"
import { BsFillPatchQuestionFill } from "react-icons/bs"
import { postsActions } from "../../store/posts"
import { useSelector, useDispatch } from "react-redux"
import "./Post.css"

const DEFAULT_REST_URL = process.env.REACT_APP_REST_DEFAULT_URL

const typeIcon = {
  "free": "chat",
  "qna": "question",
  "together": "handshake",
  "tip": "lightbulb",
  "recommend": "thumbs up",
  "help": "bullhorn",
  "lost": "box",
}
const PostItem = (props) => {
  const { data, isLoading, sendRequest: fetchLike } = useFetch()
  const dispatch = useDispatch()
  const elapsedText = (createdTime) => {
    const seconds = 1
    const minute = 60 * seconds
    const hour = 60 * minute
    const day = 24 * hour

    const now = new Date()
    const elapsedTime = Math.trunc(
      (now.getTime() - new Date(createdTime).getTime()) / 1000
    )

    let elapsedText = ""
    if (elapsedTime < seconds) {
      elapsedText = "방금 전"
    } else if (elapsedTime < minute) {
      elapsedText = elapsedTime + "초 전"
    } else if (elapsedTime < hour) {
      elapsedText = Math.trunc(elapsedTime / minute) + "분 전"
    } else if (elapsedTime < day) {
      elapsedText = Math.trunc(elapsedTime / hour) + "시간 전"
    } else if (elapsedTime < day * 15) {
      elapsedText = Math.trunc(elapsedTime / day) + "일 전"
    } else {
      elapsedText = createdTime.split("T")[0]
    }

    return elapsedText
  }

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
    <Card raised fluid className="post">
      <Label
        corner="right"
        color="orange"
        icon={{ name: typeIcon[props.type], color: "white" }}
      />
      <Card.Content>
        {props.images.length ? (
          <Image
            src={props.images.length ? props.images[0] : null}
            ui={true}
            style={{ borderRadius: "0.8rem" }}
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
              // <div className="circle">
              <Image
                avatar
                floated="left"
                size="massive"
                src={require("../../assets/cafe_logos/banapresso.png")}
                style={{
                  marginInline: "0.5rem",
                  border: `5px solid ${tierColor}`,
                }}
                // className="circle"
                // className="gradient-border"
              />
            ) : (
              // </div>
              <Image avatar floated="left">
                <BsFillPatchQuestionFill
                  style={{ marginInline: "0.5rem 0.8rem" }}
                  size="36"
                  color="grey"
                  className="gradient-border"
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

          <Card.Meta textAlign="right">
            {elapsedText(props.createdAt)}
          </Card.Meta>
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
            isLiked={props.isLiked}
          />

          <PostDetail post={props} likeHandler={likePost} />
        </div>
      </Card.Content>
    </Card>
  )
}

export default PostItem
