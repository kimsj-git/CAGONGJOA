import { Card, Image, Label, Button } from "semantic-ui-react"
import PostDetail from "./PostDetail"
import LoadingPost from "./LoadingPost"
import ToggleButton from "../common/ToggleButton"
import useFetch from "../../hooks/useFetch.js"
import { BsFillPatchQuestionFill, BsChatDotsFill } from "react-icons/bs"
import { postsActions } from "../../store/posts"
import { useSelector, useDispatch } from "react-redux"
import "./Post.css"
import { Carousel } from "primereact/carousel"
import { useState } from "react"
import ElapsedText from "./ElapsedText"

const DEFAULT_REST_URL = process.env.REACT_APP_REST_DEFAULT_URL

const typeIcon = {
  free: "chat",
  qna: "question",
  together: "handshake",
  tip: "lightbulb",
  recommend: "thumbs up",
  help: "bullhorn",
  lost: "box",
}
const PostItem = (props) => {
  const dispatch = useDispatch()
  const brandLogo = useSelector((state) => state.cafe.brandLogo)
  const longContent = props.content
    .split("</p>")
    .map((content) => content.substr(3, content.length))
  const [lookMore, setLookMore] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const { data, isLoading, sendRequest: fetchLike } = useFetch()
  const elapsedTime = ElapsedText(props.createdAt)

  const tierColor = ["#8B6331", "#C0C0C0", "#FF9614", "#3DFF92"][
    parseInt(props.tier / 1000)
  ]

  const likePost = async (isLiked) => {
    isLiked
      ? dispatch(postsActions.cancleLikePost(props.id))
      : dispatch(postsActions.likePost(props.id))
    await fetchLike({
      url: `${DEFAULT_REST_URL}/main/post/like`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
      body: {
        postId: props.id,
        isChecked: isLiked,
      },
    })
  }
  const commentHandler = (status) => {
    if (status === "write") {
    }
  }
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
        <Image src={img} ui={true} style={{ borderRadius: "0.8rem" }} />
      </div>
    )
  }

  return props.isLoading ? (
    <LoadingPost />
  ) : (
    <Card raised fluid className="post">
      <Label
        corner="right"
        icon={{ name: typeIcon[props.type] }}
        size="large"
      />
      <Card.Content
        onClick={() => {
          setDetailOpen(true)
        }}
      >
        {props.images.length > 1 ? (
          <Carousel
            value={props.images}
            numVisible={1}
            numScroll={1}
            itemTemplate={carouselTemplate}
            style={{ position: "inherit" }}
          />
        ) : props.images.length === 1 ? (
          <Image
            src={props.images[0]}
            ui={true}
            style={{ borderRadius: "0.8rem" }}
          />
        ) : null}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "1rem",
          }}
        >
          <div style={{ whiteSpace: "nowrap" }}>
            {props.userType ? (
              // <div className="circle">
              <Image
                avatar
                floated="left"
                size="massive"
                src={require("../../assets/cafe_logos/banapresso.png")}
                style={{
                  marginInline: "0.5rem",
                  border: `5px solid ${tierColor}`,
                }}
                // className="circle"
                // className="gradient-border"
              />
            ) : (
              // </div>
              <Image avatar floated="left">
                {props.cafeBrand ? (
                  <Image
                    src={require(`../../assets/cafe_logos/${
                      brandLogo[props.cafeBrand]
                    }.png`)}
                  />
                ) : (
                  <BsFillPatchQuestionFill
                    style={{ marginInline: "0.5rem 0.8rem" }}
                    size="36"
                    color="grey"
                    className="gradient-border"
                  />
                )}
              </Image>
            )}
            <Card.Header
              style={{
                fontWeight: "bold",
                fontSize: "1.2rem",
                marginBlock: "0.15rem 0.5rem",
              }}
            >
              {props.writer}
            </Card.Header>
            <Card.Meta>{props.userType ? props.cafeName : null}</Card.Meta>
          </div>

          <Card.Meta textAlign="right">{elapsedTime}</Card.Meta>
        </div>

        {!lookMore && longContent.length > 5 && (
          <Card.Description style={{ fontSize: "1.2rem", lineHeight: "1.8" }}>
            {longContent.slice(0, 4).map((content, index) => {
              return <p key={index}>{content}</p>
            })}
            ...
          </Card.Description>
        )}
        {!lookMore && longContent.length <= 5 && props.content.length > 300 && (
          <>
            <Card.Description
              style={{ fontSize: "1.2rem", lineHeight: "1.8" }}
              dangerouslySetInnerHTML={{ __html: props.content.substr(0, 300) }}
            ></Card.Description>
            <span>...</span>
          </>
        )}
        {!lookMore && longContent.length <= 5 && props.content.length < 300 && (
          <Card.Description
            dangerouslySetInnerHTML={{ __html: props.content }}
            style={{ fontSize: "1.2rem", lineHeight: "1.8" }}
          />
        )}
        {!lookMore &&
          (longContent.length > 5 || props.content.length > 300) && (
            <Card.Meta
              textAlign="right"
              onClick={() => {
                setLookMore(true)
              }}
            >
              더보기
            </Card.Meta>
          )}
        {lookMore && (
          <Card.Description
            dangerouslySetInnerHTML={{ __html: props.content }}
            style={{ fontSize: "1.2rem", lineHeight: "1.8" }}
          />
        )}
      </Card.Content>
      <Card.Content extra>
        <div style={{ display: "flex" }}>
          <ToggleButton
            fluid
            inverted
            content={props.likeCnt}
            btnType="like"
            likeHandler={likePost}
            isLiked={props.isLiked}
            iconSize={24}
          />
          <Button
            id="post-detail-btn"
            fluid
            inverted
            color="green"
            onClick={() => {
              setDetailOpen(true)
            }}
          >
            <BsChatDotsFill size={24} style={{ marginRight: "0.5rem" }} />
            {props.commentCnt}
          </Button>
          <PostDetail
            post={props}
            likeHandler={likePost}
            detailOpen={detailOpen}
            setDetailOpen={setDetailOpen}
          />
        </div>
      </Card.Content>
    </Card>
  )
}

export default PostItem
