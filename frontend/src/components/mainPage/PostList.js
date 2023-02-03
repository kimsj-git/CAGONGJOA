import { Fragment } from "react"
import { Feed } from "semantic-ui-react"
import { Button } from "primereact/button"
import PostItem from "./PostItem"
import PostTypeCarousel from "./PostTypeCarousel"

const PostList = (props) => {
  const posts = props.posts

  return (
    <Fragment>
      <PostTypeCarousel />
      <Feed>
        {posts.map((post) => (
          <PostItem
            key={post.id}
            id={post.id}
            author={post.author}
            content={post.content}
            post_likes={post.post_likes}
            comments_cnt={post.comments_cnt}
            isLoading={props.isLoading}
          />
        ))}
      </Feed>
    </Fragment>
  )
}

export default PostList
