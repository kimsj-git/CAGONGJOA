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
  Confirm,
} from "semantic-ui-react"
import { ScrollPanel } from "primereact/scrollpanel"
import CommentList from "./CommentList"
import ToggleButton from "../common/ToggleButton"
import { useDispatch, useSelector } from "react-redux"
import { postsActions } from "../../store/posts"
import PostForm from "./PostForm"
const DEFAULT_REST_URL = process.env.REACT_APP_REST_DEFAULT_URL

const PostDetail = (props) => {
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

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
                    <Card.Header>{props.post.writer}</Card.Header>
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
                      dangerouslySetInnerHTML={{ __html: props.post.content }}
                      style={{ fontSize: "1.2rem", lineHeight: "1.8" }}
                    />
                  </Card.Content>
                </Card>
              </ScrollPanel>
              <div style={{ display: "flex", marginTop: "1rem" }}>
                {sessionStorage.getItem("nickname") !== props.post.writer && (
                  <PostForm isEditing postToEdit={props.post} />
                )}
                {sessionStorage.getItem("nickname") !== props.post.writer && (
                  <Button
                    fluid
                    toggle
                    color="grey"
                    icon="delete"
                    content="삭제"
                    onClick={() => {
                      setConfirmOpen(true)
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
              <Confirm
                open={confirmOpen}
                content="정말 삭제할까요?"
                cancelButton="취소"
                confirmButton="삭제"
                onCancel={() => {
                  setConfirmOpen(false)
                }}
                onConfirm={() => {
                  setConfirmOpen(false)
                  dispatch(postsActions.deletePost(props.post.id))
                  fetch(
                    `${DEFAULT_REST_URL}/main/postDetail/delete?postId=${props.post.id}`,
                    {
                      method: "DELETE",
                    }
                  )
                  setOpen(false)
                }}
              />
            </Grid.Column>
            <CommentList post={props.post} />
          </Grid>
        </div>
      </Modal.Content>
    </Modal>
  )
}

export default PostDetail
