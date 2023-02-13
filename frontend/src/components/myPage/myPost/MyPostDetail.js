import { useState } from "react"
import { useDispatch } from "react-redux"
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
import CommentItem from "../../mainPage/CommentItem"
import ToggleButton from "../../common/ToggleButton"
import { postsActions } from "../../../store/posts"

const MyPostDetail = (props) => {
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const createdAt = props.post.createdAt.split('T')
  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      size="large"
      trigger={<Button size="mini" color="green" floated="right">자세히</Button>}
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
                    {props.post.imgUrlPath.length >0 && 
                    <Image
                    avatar
                    floated="left"
                    size="huge"
                    src={props.post.imgUrlPath[0]}
                    />
                  }
                    <Card.Header>{props.post.writerNickname}</Card.Header>
                    <Card.Meta>스타벅스 강남R점</Card.Meta>
                    <Card.Meta textAlign="right">
                      {createdAt[0]} {createdAt[1]}
                    </Card.Meta>
                    {props.post.imgUrlPath.length > 0 && <Image
                      src={props.post.imgUrlPath[0]}
                      wrapped
                      ui={true}
                      style={{ marginBlock: "0.5rem" }}
                    />}
                    <Card.Description
                      style={{ fontSize: "1.2rem", lineHeight: "1.8" }}
                    >
                      {props.post.content}
                    </Card.Description>
                  </Card.Content>
                </Card>
              </ScrollPanel>
              <div style={{ display: "flex", marginTop: "1rem" }}>
                {sessionStorage.getItem("nickname") === props.writer && (
                  <Button
                    fluid
                    // inverted
                    color="orange"
                    icon="edit"
                    content="수정"
                  ></Button>
                )}
                {sessionStorage.getItem("nickname") === props.writer && (
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
                )}
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
              <Header>{`댓글 ${props.post.commentCount}`}</Header>
              <Divider />
              <ScrollPanel style={{ width: "100%", height: "70vh" }}>
                <Comment.Group>
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

export default MyPostDetail
