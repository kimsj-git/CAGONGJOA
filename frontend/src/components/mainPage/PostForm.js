import React, { useState } from "react"
import { useHistory } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  Button,
  Icon,
  Modal,
  Form,
  Dropdown,
  Header,
  Label,
} from "semantic-ui-react"
import { BsPencil, BsPencilFill } from "react-icons/bs"
import ImageUploadBox from "./ImageUploadBox"
import { Editor } from "primereact/editor"
import { imageActions } from "../../store/image"
import { postsActions } from "../../store/posts.js"
import { getPosts } from "../../store/posts.js"

const DEFAULT_REST_URL = process.env.REACT_APP_REST_DEFAULT_URL
const PostForm = (props) => {
  const history = useHistory()
  const dispatch = useDispatch()
  // 현재 카페 정보 관리
  const [currentCafe, setCurrentCafe] = useState(null)

  // const { data: newPostId, isLoading, sendRequest: newPost } = useFetch()
  // 모달창 상태 관리
  const [firstOpen, setFirstOpen] = useState(false)
  const [secondOpen, setSecondOpen] = useState(false)
  // post 내용 관리
  const [postContent, setPostContent] = useState("")
  const [postType, setPostType] = useState()
  const postImages = useSelector((state) => state.image.uploadedImage)
  // 자랑하기 여부
  const isStudyHistory = props.isStudyHistory
  // post type 종류
  const postTypes = [
    { key: "free", text: "자유", value: "free", icon: "chat" },
    { key: "qna", text: "궁금해요", value: "qna", icon: "question" },
    { key: "together", text: "같이해요", value: "together", icon: "handshake" },
    { key: "tip", text: "정보공유", value: "tip", icon: "lightbulb" },
    {
      key: "recommend",
      text: "추천해요",
      value: "recommend",
      icon: "thumbs up",
    },
    { key: "help", text: "해주세요", value: "help", icon: "bullhorn" },
    { key: "lost", text: "분실물센터", value: "lost", icon: "box" },
  ]

  const dataURLtoFile = (dataurl, fileName) => {
    let arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n)

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }

    return new File([u8arr], fileName, { type: mime })
  }

  const submitHandler = async () => {
    // post 내용이 없을 경우
    if (!postContent) {
      alert("글 내용을 입력해주세요!")
      return
    }

    setSecondOpen(true)
    const formData = new FormData()

    // 글 수정 요청
    if (props.isEditing) {
      const blob = new Blob(
        [
          JSON.stringify({
            type: postType,
            content: postContent,
          }),
        ],
        { type: "application/json" }
      )

      formData.append("writeForm", blob)
      postImages.forEach((image) => {
        formData.append("imgFiles", dataURLtoFile(image, "test"))
      })

      dispatch(
        postsActions.editPost({
          id: props.postToEdit.id,
          content: postContent,
          type: postType,
          images: postImages,
        })
      )
      const response = await fetch(`${DEFAULT_REST_URL}/writeForm/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
        body: formData,
      })
    }
    // 글 생성 요청
    else {
      const blob = new Blob(
        [
          JSON.stringify({
            type: postType,
            content: postContent,
            latitude: JSON.parse(sessionStorage.getItem("location")).lat,
            longitude: JSON.parse(sessionStorage.getItem("location")).lng,
            dist: 0.3,
          }),
        ],
        { type: "application/json" }
      )

      formData.append("writeForm", blob)
      postImages.forEach((image) => {
        formData.append("imgFiles", dataURLtoFile(image, "test"))
      })

      const response = await fetch(`${DEFAULT_REST_URL}/writeForm/write`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
        body: formData,
      })
      console.log(postType)
    }

    dispatch(
      getPosts({
        location: {
          lat: JSON.parse(sessionStorage.getItem("location")).lat,
          lng: JSON.parse(sessionStorage.getItem("location")).lng,
        },
        postId: -1,
        filters: [
          "free",
          "qna",
          "together",
          "tip",
          "recommend",
          "help",
          "lost",
        ],
      })
    )

    // state 초기화
    setPostContent("")
    setPostType("")
  }

  const onPostFormOpen = () => {
    const isAuthenticated = Number(sessionStorage.getItem("cafeAuth"))
    isAuthenticated
      ? setCurrentCafe(JSON.parse(sessionStorage.getItem("myCafe"))?.cafeName)
      : setCurrentCafe(null)

    setFirstOpen(true)
    if (props.isEditing) {
      setPostContent(props.postToEdit.content)
      setPostType(props.postToEdit.type)
      props.postToEdit.images.length &&
        dispatch(imageActions.uploadImage(props.postToEdit.images))
    } else {
      setPostContent("")
      setPostType(currentCafe ? "free" : "qna")
    }
    console.log("PostForm Opened")
  }

  return (
    <>
      <Modal
        closeIcon
        open={firstOpen}
        onClose={() => {
          setFirstOpen(false)
          dispatch(imageActions.closeModal())
          setPostContent("")
          setPostType("")
        }}
        onOpen={onPostFormOpen}
        trigger={
          isStudyHistory ? (
            <Button
              onClick={props.onCaptureHandler}
              style={{
                marginTop: "1rem",
                backgroundColor: "#FFD700",
                opacity: "36%",
                border: "1.5px dashed black",
                color: "black",
                borderRadius: "10px",
                boxShadow: "0px 4px 4px rgba(0,0,0,0.25)",
              }}
            >
              <Icon name="star" color="orange" style={{ opacity: "100%" }} />
              자랑하기
            </Button>
          ) : props.isEditing ? (
            <Button
              fluid
              circular
              color="orange"
              icon="edit"
              content="수정"
            ></Button>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {props.activeItem === "post" ? (
                <BsPencilFill size="30" color="black" />
              ) : (
                <BsPencil size="30" color="black" />
              )}
              {props.isMainNavigation ? "" : <p>글 쓰기</p>}
            </div>
          )
        }
      >
        <Modal.Header>
          {props.isEditing
            ? props.postToEdit.userType
              ? props.postToEdit.cafeName + "의 이야기를 들려주세요!"
              : "근처 유저들에게 질문을 남겨보세요!"
            : currentCafe
            ? currentCafe + "의 이야기를 들려주세요!"
            : sessionStorage.getItem("address")?.split(" ").at(-1) +
              " 근처 유저들에게 질문을 남겨보세요!"}
        </Modal.Header>

        {/* <Image size="medium" src="/images/wireframe/image.png" wrapped /> */}
        <Modal.Content scrolling>
          {/* <Segment basic> */}
          <Form.Field>
            <Label htmlFor="post-type" color="yellow" pointing="below">
              {props.isEditing
                ? props.postToEdit.userType
                  ? "글 타입을 선택해주세요!"
                  : "카페 인증을 안 받으면 질문글만 쓸 수 있어요!"
                : currentCafe
                ? "글 타입을 선택해주세요!"
                : "카페 인증을 안 받으면 질문글만 쓸 수 있어요!"}
            </Label>
            <Dropdown
              id="post-type"
              fluid
              placeholder="글 타입을 선택해주세요!"
              selection
              floating
              required
              disabled={
                props.isEditing
                  ? props.postToEdit.userType
                    ? true
                    : false
                  : currentCafe
                  ? false
                  : true
              }
              options={postTypes}
              onChange={(event, data) => {
                setPostType(data.value)
              }}
              style={{ marginBottom: "20px" }}
              defaultValue={
                props.isEditing ? postType : currentCafe ? "free" : "qna"
              }
            />
            <div className="card">
              <Editor
                value={postContent}
                onTextChange={(e) => {
                  setPostContent(e.htmlValue)
                }}
                style={{ height: "100px" }}
              />
            </div>
            <ImageUploadBox />
          </Form.Field>
          {/* </Segment> */}
        </Modal.Content>

        <Modal.Actions>
          <Button onClick={submitHandler} color="olive">
            완료
            <Icon name="chevron right" />
          </Button>
        </Modal.Actions>

        <Modal
          onOpen={() => {
            dispatch(imageActions.filterHot(false))
          }}
          onClose={() => {
            setSecondOpen(false)
          }}
          open={secondOpen}
          size="small"
          basic
          closeOnDimmerClick={false}
        >
          <Header icon>
            <Icon name="check circle" />
            {`글 ${props.isEditing ? "수정" : "작성"}이 완료되었습니다!`}
          </Header>
          {/* <Modal.Content>
          <p></p>
        </Modal.Content> */}
          <Modal.Actions>
            <Button
              basic
              color="green"
              icon="checkmark"
              content="확인"
              onClick={() => {
                dispatch(imageActions.closeModal())
                setFirstOpen(false)
                setSecondOpen(false)
                history.push("/")
              }}
            />
          </Modal.Actions>
        </Modal>
      </Modal>
    </>
  )
}

export default PostForm
