import { useDispatch, useSelector } from "react-redux"
import { postsActions } from "../../store/posts"
import { Button } from "semantic-ui-react"
import PostTypeBtns from "./PostTypeBtns"

const TypeSelector = (props) => {
  const dispatch = useDispatch()
  const filterState = useSelector((state) => state.posts.filterState)

  return (
    <div
      id="post-types"
      style={{ display: "flex", whiteSpace: "nowrap", overflow: "scroll" }}
    >
      <Button
        key="hot"
        onClick={(e) => {
          dispatch(postsActions.filterHot(e.target.id === "hot" ? false : true))
        }}
        id={filterState["hot"] ? "hot" : "cancle-hot"}
        basic
        content="HOT"
        icon="hotjar"
      />
      <PostTypeBtns />
    </div>
  )
}

export default TypeSelector
