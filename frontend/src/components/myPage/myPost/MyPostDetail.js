import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
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
  Icon,
} from "semantic-ui-react"
import { ScrollPanel } from "primereact/scrollpanel"
import ToggleButton from "../../common/ToggleButton"
import { postsActions } from "../../../store/posts"
import CommentList from "../../mainPage/CommentList"
import { commentsActions } from "../../../store/comments"
import MyPostForm from "./MyPostForm"
import LoadingPost from "../../mainPage/LoadingPost"
import useFetch from "../../../hooks/useFetch"

const DEFAULT_REST_URL = process.env.REACT_APP_REST_DEFAULT_URL

const MyPostDetail = (props) => {
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const [postDetail, setPostDetail] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const createdAt = postDetail.createdAt && postDetail.createdAt.split("T")
  const brandLogo = useSelector((state) => state.cafe.brandLogo)
  const {sendRequest: fetchLike } = useFetch()

  const likePlus = () => {
    postDetail.likeCounts += 1
  }
  const likeMinus = () => {
    postDetail.likeCounts -= 1
  }

  const likePost = async (isLiked) => {
    isLiked ? likeMinus() : likePlus()
    await fetchLike({
      url: `${DEFAULT_REST_URL}/main/post/like`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
      body: {
        postId: postDetail.postId,
        isChecked: postDetail.isLikeChecked,
      },
    })
  }

  console.log(postDetail)
  const clickHandler = async () => {
    setIsLoading(true)
    const response = await fetch(
      `${DEFAULT_REST_URL}/main/post/detail?postId=${props.post.postId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      }
    )
    const responseData = await response.json()
    if (responseData.httpStatus === "OK") {
      setPostDetail(responseData.data)
    } else if (
      responseData.httpStatus === "BAD_REQUEST" &&
      responseData.data.sign === "JWT"
    ) {
      const response = await fetch(`${DEFAULT_REST_URL}/member/refresh`, {
        method: "GET",
        headers: {
          "Authorization-RefreshToken": `Bearer ${sessionStorage.getItem(
            "refreshToken"
          )}`,
        },
      })
      const responseData = await response.json()
      if (responseData.httpStatus !== "OK") {
        sessionStorage.clear()
        alert("세션 만료 되었습니다.")
        window.location.href = "/login"
      } else if (responseData.httpStatus === "OK") {
        sessionStorage.setItem("accessToken", responseData.data.accessToken)
        alert("다시 시도해주세요")
      }
    } else {
      alert("오류가 발생했습니다.")
    }
    setIsLoading(false)
  }
  useEffect(() => {
    clickHandler()
  }, [props.likeCheck])


  return (
    <>
    {isLoading ? <LoadingPost/> :
    <>
    <Modal
    onClose={() => {
      dispatch(commentsActions.closeModal())
      setOpen(false)
    }}
    onOpen={() => setOpen(true)}
    open={open}
    size="large"
    trigger={
      <Button
      onClick={clickHandler}
      size="mini"
      color="green"
      style={{ margin: 0 }}
      >
          자세히
          </Button>
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
                        src={
                          postDetail.verifiedCafeBrand
                          ? require(`../../../assets/cafe_logos/${
                            brandLogo[postDetail.verifiedCafeBrand]
                          }.png`)
                          : require(`../../../assets/icons/question.png`)
                        }
                        />
                      <Card.Header>{postDetail.nickname}</Card.Header>
                      <Card.Meta>
                        {postDetail.verifiedCafeName
                          ? postDetail.verifiedCafeName
                          : ""}
                      </Card.Meta>
                      <Card.Meta textAlign="right">
                        {createdAt &&
                          `${createdAt[0]} ${createdAt[1].substr(0, 5)}`}
                      </Card.Meta>
                      {postDetail.imgPathList &&
                        postDetail.imgPathList.length > 0 &&
                        postDetail.imgPathList.map((img, index) => {
                          return (
                            <Image
                            key={index}
                            src={img}
                            wrapped
                            ui={true}
                            style={{ marginBlock: "0.5rem" }}
                            />
                            )
                          })}
                      <Card.Description
                        style={{ fontSize: "1.2rem", lineHeight: "1.8" }}
                        dangerouslySetInnerHTML={{
                          __html: postDetail.postContent,
                        }}
                        ></Card.Description>
                    </Card.Content>
                  </Card>
                </ScrollPanel>
                <div style={{ display: "flex", marginTop: "1rem" }}>
                  {postDetail.nickname &&
                    sessionStorage.getItem("nickname") ===
                    postDetail.nickname && (
                      <MyPostForm isEditing postToEdit={props.post} />
                        )}
                  {postDetail.nickname &&
                    sessionStorage.getItem("nickname") ===
                    postDetail.nickname && (
                      <Button
                      fluid
                      toggle
                      // inverted
                      color="grey"
                      icon="delete"
                      content="삭제"
                      onClick={() => {
                        dispatch(postsActions.deletePost(postDetail.postId))
                        setOpen(false)
                      }}
                      ></Button>
                      )}
                    {postDetail &&
                  <ToggleButton
                  btnType="like"
                  fluid
                  inverted
                  content={postDetail.likeCounts}
                  likeHandler={likePost}
                  isLiked={postDetail.isLikeChecked}
                  />
                }
                </div>
              </Grid.Column>
              <CommentList
                post={{
                  id: postDetail.postId,
                  commentCnt: postDetail.commentCounts,
                }}
                />
            </Grid>
          </div>
        </Modal.Content>
      </Modal>
      </>
    }
    </>
  )
}

export default MyPostDetail
