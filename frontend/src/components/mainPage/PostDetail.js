import { useState } from "react"
import {
  Button,
  Modal,
  Header,
  Card,
  Image,
  Grid,
  Comment,
  Form,
  Divider,
  Label,
} from "semantic-ui-react"
import { ScrollPanel } from "primereact/scrollpanel"
import CommentItem from "./CommentItem"
import ToggleButton from "../common/ToggleButton"
import { useDispatch, useSelector } from "react-redux"
import { postsActions } from "../../store/posts"

const PostDetail = (props) => {
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size="large"
      trigger={
        <Button
          fluid
          inverted
          color="green"
          icon="comment"
          content={props.post.commentCnt}
        ></Button>
      }
    >
      <Label
        color="orange"
        floating
        icon={{ name: "comment", size: "large", style: { margin: "0px" } }}
      />

      <Modal.Content>
        <div>
          <Grid>
            <Grid.Column mobile={16} tablet={8} computer={8}>
              <ScrollPanel style={{ width: "100%", height: "77.5vh" }}>
                <Card fluid style={{ boxShadow: "none" }}>
                  <Card.Content>
                    <Image
                      avatar
                      floated="left"
                      size="huge"
                      src="https://www.freepnglogos.com/uploads/starbucks-logo-png-transparent-0.png"
                    />
                    <Card.Header>{props.post.author}</Card.Header>
                    <Card.Meta>스타벅스 강남R점</Card.Meta>
                    <Card.Meta textAlign="right">
                      {props.post.createdAt}
                    </Card.Meta>
                    <Image
                      // src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1178&q=80"
                      src={props.post.images[0]}
                      wrapped
                      ui={true}
                      style={{ marginBlock: "0.5rem" }}
                    />
                    <Card.Description
                      style={{ fontSize: "1.2rem", lineHeight: "1.8" }}
                    >
                      {props.post.content}
                    </Card.Description>
                  </Card.Content>
                </Card>
              </ScrollPanel>
              <div style={{ display: "flex", marginTop: "1rem" }}>
                <Button
                  fluid
                  // inverted
                  color="orange"
                  icon="edit"
                  content="수정"
                ></Button>
                <Button
                  fluid
                  toggle
                  // inverted
                  color="grey"
                  icon="delete"
                  content="삭제"
                  onClick={() => {
                    dispatch(postsActions.deletePost(props.post.id))
                    setOpen(false)
                  }}
                ></Button>
                <ToggleButton
                  btnType="like"
                  fluid
                  inverted
                  content={props.post.likeCnt}
                  likeHandler={props.likeHandler}
                />
              </div>
            </Grid.Column>
            <Grid.Column mobile={16} tablet={8} computer={8}>
              <Header>{`댓글 ${props.post.commentCnt}`}</Header>
              <Divider />
              <ScrollPanel style={{ width: "100%", height: "70vh" }}>
                <Comment.Group>
                  <CommentItem />
                  <CommentItem />
                  <CommentItem />
                  <CommentItem />
                  <CommentItem />
                  <CommentItem />
                  <CommentItem />
                </Comment.Group>
              </ScrollPanel>
              <Divider />
              <Form reply>
                <Form.Input
                  fluid
                  placeholder="댓글을 입력하세요."
                  action={{
                    color: "brown",
                    icon: "paper plane",
                  }}
                  size="tiny"
                />
              </Form>
            </Grid.Column>
          </Grid>
        </div>
      </Modal.Content>
    </Modal>
  )
}

export default PostDetail
