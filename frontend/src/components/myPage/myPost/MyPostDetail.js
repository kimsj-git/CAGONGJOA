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
  Icon,
} from "semantic-ui-react"
import { ScrollPanel } from "primereact/scrollpanel"
import MyComments from "./MyComments"
import ToggleButton from "../../common/ToggleButton"
import { postsActions } from "../../../store/posts"
import MyPostForm from "./MyPostForm"

const REST_DEFAULT_URL = process.env.REACT_APP_REST_DEFAULT_URL

const BRAND_LOGOS = {
  할리스: "hollys",
  폴바셋: "paulbasset",
  파스쿠찌: "pascucci",
  투썸플레이스: "twosome",
  토프레소: "topresso",
  텐퍼센트커피: "tenpercent",
  탐앤탐스: "tomntoms",
  컴포즈커피: "compose",
  커피에반하다: "coffeebanada",
  커피스미스: "coffeesmith",
  커피빈: "coffeebean",
  커피베이: "coffeebay",
  커피나무: "coffeenamu",
  카페베네: "caffeebene",
  카페띠아모: "caffetiamo",
  전광수: "jungwang",
  이디야커피: "edia",
  요거프레소: "yogerpresso",
  엔제리너스: "angelinus",
  스타벅스: "starbucks",
  스무디킹: "smoothy",
  셀렉토커피: "selecto",
  빽다방: "paiksdabang",
  베스킨라빈스: "baskin",
  메가커피: "megacoffee",
  매머드: "mammoth",
  드롭탑: "droptop",
  더벤티: "theventi",
  달콤커피: "dalkomm",
  나우커피: "nowcoffee",
  공차: "gongcha",
  개인카페: "selfcafe",
  바나프레소: "banapresso",
}

const MyPostDetail = (props) => {
  console.log(props)
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const [postDetail, setPostDetail] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [firstMounted, setFirstMounted] = useState(false)
  const createdAt = props.post.createdAt.split("T")
  const clickHandler = async () => {
    setIsLoading(true)
    const response = await fetch(
      `${REST_DEFAULT_URL}/main/post/detail?postId=${props.post.postId}`,
      {
        method: "POST",
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
      const response = await fetch(`${REST_DEFAULT_URL}/member/refresh`, {
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
    console.log(responseData)
    setIsLoading(false)
    setFirstMounted(true)
  }

  console.log(postDetail.nickname && sessionStorage.getItem("nickname") === postDetail.nickname.trim("\""))
  return (
    <>
      {isLoading && <Icon name="spinner" loading />}
      {!isLoading && (
        <Modal
          onClose={() => setOpen(false)}
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
                        {postDetail.imgPathList && postDetail.imgPathList.length > 0 && (
                          <Image
                            avatar
                            floated="left"
                            size="huge"
                            src={
                              props.post.brandType
                                ? require(`../../../assets/cafe_logos/${
                                    BRAND_LOGOS[postDetail.verifiedCafeBrand]
                                  }.png`)
                                : ""
                            }
                          />
                        )}
                        <Card.Header>{postDetail.nickname}</Card.Header>
                        <Card.Meta>
                          {postDetail.verifiedCafeName ? postDetail.verifiedCafeName : ""}
                        </Card.Meta>
                        <Card.Meta textAlign="right">
                          {/* {createdAt[0]} {createdAt[1]} */}
                        </Card.Meta>
                        {postDetail.imgPathList && postDetail.imgPathList.length > 0 &&
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
                    {postDetail.nickname && sessionStorage.getItem("nickname") ===
                      postDetail.nickname.substr(1,postDetail.nickname.length-2) && (
                      <MyPostForm isEditing postToEdit={props.post} />
                    )}
                    {postDetail.nickname && sessionStorage.getItem("nickname") === postDetail.nickname.substr(1,postDetail.nickname.length-2) && (
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
                    <ToggleButton
                      btnType="like"
                      fluid
                      inverted
                      content={postDetail.likeCounts}
                      likeHandler={props.likeHandler}
                      isLiked={postDetail.isLiked}
                    />
                  </div>
                </Grid.Column>
                {/* <MyComments post={postDetail} /> */}
              </Grid>
            </div>
          </Modal.Content>
        </Modal>
      )}
    </>
  )
}

export default MyPostDetail
