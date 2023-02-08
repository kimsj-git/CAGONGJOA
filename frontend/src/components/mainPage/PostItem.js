import { Card, Button, Image, Label } from "semantic-ui-react"
import PostDetail from "./PostDetail"
import LoadingPost from "./LoadingPost"
import ToggleButton from "../common/ToggleButton"
import useFetch from "../../hooks/useFetch.js"
const DEFAULT_REST_URL = process.env.REACT_APP_REST_DEFAULT_URL

const PostItem = (props) => {
  const { data, isLoading, sendRequest: fetchLike } = useFetch()
  const likePost = async (btnState) => {
    await fetchLike({
      url: `${DEFAULT_REST_URL}/main/post/like`,
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
        <Image
          avatar
          floated="left"
          size="huge"
          src="https://www.freepnglogos.com/uploads/starbucks-logo-png-transparent-0.png"
        />
        <Card.Header>{props.author}</Card.Header>
        <Card.Meta>스타벅스 강남R점</Card.Meta>
        <Card.Meta textAlign="right">{props.createdAt}</Card.Meta>
        <Image
          src={props.images[0]}
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
          <PostDetail post={props} />
        </div>
      </Card.Content>
    </Card>
  )
}

export default PostItem
