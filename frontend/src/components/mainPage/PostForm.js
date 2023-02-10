import React, { useState } from "react"
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
import { useDispatch, useSelector } from "react-redux"
import useFetch from "../../hooks/useFetch.js"

import ImageUploadBox from "./ImageUploadBox"
import { Editor } from "primereact/editor"
import { imageActions } from "../../store/image"

const DEFAULT_REST_URL = process.env.REACT_APP_REST_DEFAULT_URL
const PostForm = (props) => {
  const dispatch = useDispatch()
  // 현재 카페 정보 가져오기
  const isAuthenticated = sessionStorage.getItem("cafeAuth")
  let currentCafe = ''
  isAuthenticated 
    ? currentCafe = JSON.parse(sessionStorage.getItem("myCafe"))?.cafeName
    : currentCafe = null

  const { data: newPostId, isLoading, sendRequest: newPost } = useFetch()
  // 모달창 상태 관리
  const [firstOpen, setFirstOpen] = useState(false)
  const [secondOpen, setSecondOpen] = useState(false)
  // post 내용 관리
  const [postContent, setPostContent] = useState("")
  const [postType, setPostType] = useState("")
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

  const submitHandler = async () => {
    // post 내용이 없을 경우
    if (!postContent) {
      alert("글 내용을 입력해주세요!")
      return
    }

    await newPost({
      url: `${DEFAULT_REST_URL}/writeForm/write`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
      body: {
        writeForm: { content: postContent, type: postType },
        imgFiles: postImages,
      },
    })
    setSecondOpen(true)
    // state 초기화
    setPostContent("")
    setPostType("")
  }

  return (
    <>
      <Modal
        open={firstOpen}
        onClose={() => {
          setFirstOpen(false)
          dispatch(imageActions.closeModal())
          setPostContent("")
          setPostType("")
        }}
        onOpen={() => setFirstOpen(true)}
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
          {currentCafe
            ? currentCafe + "의 이야기를 들려주세요!"
            : sessionStorage.getItem("address") +
              "근처 유저들에게 질문을 남겨보세요!"}
        </Modal.Header>

        {/* <Image size="medium" src="/images/wireframe/image.png" wrapped /> */}
        <Modal.Content scrolling>
          {/* <Segment basic> */}
          <Form.Field>
            <Label htmlFor="post-type" color="yellow" pointing="below">
              글 타입을 선택해주세요!
            </Label>
            <Dropdown
              id="post-type"
              fluid
              placeholder="글 타입을 선택해주세요!"
              selection
              floating
              required
              options={postTypes}
              onChange={(event, data) => {
                setPostType(data.value)
              }}
              style={{ marginBottom: "20px" }}
              defaultValue={"free"}
            />
            <div className="card">
              <Editor
                value={postContent}
                onTextChange={(e) => setPostContent(e.htmlValue)}
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
          onClose={() => setSecondOpen(false)}
          open={secondOpen}
          size="small"
          basic
          closeOnDimmerClick={false}
        >
          <Header icon>
            <Icon name="check circle" />글 작성이 완료되었습니다!
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
              }}
            />
          </Modal.Actions>
        </Modal>
      </Modal>

      <Modal
        onClose={() => {
          setSecondOpen(false)
        }}
        open={secondOpen}
        size="small"
        basic
        closeOnDimmerClick={false}
      >
        <Header icon>
          <Icon name="check circle" />글 작성이 완료되었습니다!
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
            }}
          />
        </Modal.Actions>
      </Modal>
    </>
  )
}

export default PostForm
