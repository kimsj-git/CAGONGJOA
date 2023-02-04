import React, { useState, useRef, useEffect } from "react"
import {
  Button,
  Icon,
  Modal,
  Form,
  Dropdown,
  Header,
  Label,
  Segment,
} from "semantic-ui-react"
import { BsPencil } from "react-icons/bs"
import ImageUploadBox from "./ImageUploadBox"
import { Editor } from "primereact/editor"

const PostForm = (props) => {
  // 유저 정보 가져오기
  // const nickname = sessionStorage.getItem('nickname');
  // const currentCafe = sessionStorage.getItem('currentCafe');
  const currentCafe = "스타벅스 강남R점"
  const [firstOpen, setFirstOpen] = useState(false)
  const [secondOpen, setSecondOpen] = useState(false)
  // const [open, setOpen] = useState(false)
  const [postContent, setPostContent] = useState("")
  const [postImages, setPostImages] = useState([])
  const [postType, setPostType] = useState("")
  const isStudyHistory = props.isStudyHistory
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

  const submitHandler = () => {
    setPostImages([...uploadedImagesRef.current.reportImages()])
    setSecondOpen(true)
  }
  const uploadedImagesRef = useRef()
  useEffect(() => {
    const post = {
      postContent: postContent,
      postImage: postImages,
      postType: postType,
    }
    console.log(post)

    // state 초기화
    setPostContent("")
    setPostType("")

    // post request!!
    //   fetch('localhost:9999/post/writeForm', {
    //     method: 'post',
    //     header: {
    //       "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`
    //     },
    //     body: JSON.stringify({
    //       ...post,
    //     })
    //   })
    //   .then(setOpen(false))
  }, [postImages])
  return (
    <>
      {isStudyHistory && (
        <Modal
          open={firstOpen}
          onClose={() => setFirstOpen(false)}
          onOpen={() => setFirstOpen(true)}
          trigger={<Button onClick={props.onCaptureHandler}>자랑하기</Button>}
        >
          <Modal.Header>{currentCafe + "의 이야기를 들려주세요!"}</Modal.Header>
          <Modal.Content image scrolling>
            {/* <Image size="medium" src="/images/wireframe/image.png" wrapped /> */}

            <Form.Field>
              <Segment raised>
                <Label htmlFor="post-type" color="yellow" ribbon>
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
                <ImageUploadBox
                  ref={uploadedImagesRef}
                  max={10}
                  studyHistoryImage={props.studyHistoryImage}
                />
              </Segment>
            </Form.Field>
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
                  setFirstOpen(false)
                  setSecondOpen(false)
                }}
              />
            </Modal.Actions>
          </Modal>
        </Modal>
      )}
      {!isStudyHistory && (
        <Modal
          open={firstOpen}
          onClose={() => setFirstOpen(false)}
          onOpen={() => setFirstOpen(true)}
          trigger={<BsPencil size="36" color="black" />}
        >
          <Modal.Header>{currentCafe + "의 이야기를 들려주세요!"}</Modal.Header>
          <Modal.Content image scrolling>
            {/* <Image size="medium" src="/images/wireframe/image.png" wrapped /> */}

            <Form.Field>
              <Segment raised>
                <Label htmlFor="post-type" color="yellow" ribbon>
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
                <ImageUploadBox
                  ref={uploadedImagesRef}
                  max={10}
                  studyHistroyImage={props.studyHistroyImage}
                />
              </Segment>
            </Form.Field>
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
                  setFirstOpen(false)
                  setSecondOpen(false)
                }}
              />
            </Modal.Actions>
          </Modal>
        </Modal>
      )}
    </>
  )
}

export default PostForm
