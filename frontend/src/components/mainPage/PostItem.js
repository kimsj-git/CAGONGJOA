import { Card, Button, Image, Label } from "semantic-ui-react"
import PostDetail from "./PostDetail"
import LoadingPost from "./LoadingPost"
import ToggleButton from "../common/ToggleButton"

const PostItem = (props) => {
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
        <Card.Meta textAlign="right">13분</Card.Meta>
        <Image
          src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1178&q=80"
          // src={props.images[0]}
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
          <ToggleButton fluid inverted content="12" btnType="like" />
          <PostDetail post={props} />
        </div>
      </Card.Content>
    </Card>
  )
}

export default PostItem
