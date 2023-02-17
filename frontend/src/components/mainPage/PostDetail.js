import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  Button,
  Modal,
  Card,
  Image,
  Grid,
  Label,
  Confirm,
} from "semantic-ui-react"
import { postsActions } from "../../store/posts"
import { commentsActions } from "../../store/comments"
import { BsChatDotsFill, BsFillPatchQuestionFill } from "react-icons/bs"
import { ScrollPanel } from "primereact/scrollpanel"
import { Carousel } from "primereact/carousel"
import CommentList from "./CommentList"
import ToggleButton from "../common/ToggleButton"
import PostForm from "./PostForm"

const DEFAULT_REST_URL = process.env.REACT_APP_REST_DEFAULT_URL

const PostDetail = (props) => {
  const dispatch = useDispatch()
  // const [open, setOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const createdAt = props.post.createdAt.split("T")
  const brandLogo = useSelector((state) => state.cafe.brandLogo)

  const carouselTemplate = (img) => {
    return (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image src={img} wrapped ui={true} style={{ marginBlock: "0.5rem" }} />
      </div>
    )
  }
  return (
    <Modal
      closeIcon
      onClose={() => {
        dispatch(commentsActions.closeModal())
        props.setDetailOpen(false)
      }}
      onOpen={() => {
        props.setDetailOpen(true)
      }}
      open={props.detailOpen}
      size="large"
      // trigger={
      //   <Button id="post-detail-btn" fluid inverted color="green">
      //     <BsChatDotsFill size={24} style={{ marginRight: "0.5rem" }} />
      //     {props.post.commentCnt}
      //   </Button>
      // }
    >
      <Label
        corner="right"
        color="orange"
        icon={{
          name: "comment",
          size: "large",
          style: { margin: "0px" },
        }}
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
                      src={
                        props.post.cafeBrand
                          ? require(`../../assets/cafe_logos/${
                              brandLogo[props.post.cafeBrand]
                            }.png`)
                          : require("../../assets/icons/question.png")
                      }
                    />

                    <Card.Header>{props.post.writer}</Card.Header>
                    <Card.Meta>{props.post.cafeName}</Card.Meta>
                    <Card.Meta textAlign="right">
                      {createdAt[0]} {createdAt[1].substr(0, 5)}
                    </Card.Meta>
                    {props.post.images.length > 1 ? (
                      <Carousel
                        value={props.post.images}
                        numVisible={1}
                        numScroll={1}
                        itemTemplate={carouselTemplate}
                        style={{ position: "inherit" }}
                      />
                    ) : props.post.images.length === 1 ? (
                      <Image
                        src={props.post.images[0]}
                        ui={true}
                        style={{
                          borderRadius: "0.8rem",
                        }}
                      />
                    ) : null}
                    <Card.Description
                      dangerouslySetInnerHTML={{
                        __html: props.post.content,
                      }}
                      style={{
                        marginTop: "2rem",
                        fontSize: "1.8rem",
                        lineHeight: "1.8",
                      }}
                    />
                  </Card.Content>
                </Card>
              </ScrollPanel>
              <div style={{ display: "flex", marginTop: "1rem" }}>
                {sessionStorage.getItem("nickname") === props.post.writer && (
                  <PostForm isEditing={true} postToEdit={props.post} />
                )}
                {sessionStorage.getItem("nickname") === props.post.writer && (
                  <Button
                    fluid
                    circular
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
                  isLiked={props.post.isLiked}
                  iconSize={30}
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
                      headers: {
                        Authorization: `Bearer ${sessionStorage.getItem(
                          "accessToken"
                        )}`,
                      },
                    }
                  )
                  props.setDetailOpen(false)
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
