import { Fragment } from "react"
import { Feed, Icon } from "semantic-ui-react"
import PostItem from "./PostItem"

const PostList = () => {
  return (
    <Fragment>
      <h1>Feed</h1>
      <Feed>
        <PostItem/>
        <PostItem/>
        <PostItem/>
      </Feed>
    </Fragment>
  )
}

export default PostList
