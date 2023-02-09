import { Button } from "semantic-ui-react"
import ToggleButton from "../common/ToggleButton"
import "./PostTypeCarousel.css"
import { useDispatch, useSelector } from "react-redux"
import { postsActions } from "../../store/posts"
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
const PostTypeCarousel = () => {
  const dispatch = useDispatch()
  const selectedFilters = useSelector((state) => state.filters)
  const hotType = { key: "hot", text: "HOT", value: "hot", icon: "hotjar" }

  const postTypeBtns = []
  postTypes.map((type) => {
    return (
      <ToggleButton
        key={type.key}
        typeKey={type.key}
        btnType="type-select"
        icon={type.icon}
        content={type.text}
        basic={true}
        inverted={false}
        selectHandler={(payload) => {
          console.log(payload)
          dispatch(postsActions.changeFilter(payload))
        }}
      />
    )
  })

  // postTypeBtns.unshift(<ToggleButton/>)

  return (
    <div
      id="post-types"
      style={{ display: "flex", whiteSpace: "nowrap", overflow: "scroll" }}
    >
      {postTypeBtns}
    </div>
    // <Carousel
    //   value={postTypes}
    //   // numScroll={2}
    //   numVisible={6}
    //   // responsiveOptions={responsiveOptions}
    //   itemTemplate={carouselTemplate}
    // />
  )
}

export default PostTypeCarousel
