import { Fragment } from "react"
import { Feed } from "semantic-ui-react"
import { Button } from "primereact/button"
import PostItem from "./PostItem"

const PostList = (props) => {
  const posts = props.posts

  return (
    <Fragment>
      <Feed>
        {posts.map((post) => (
          <PostItem
            key={post.postId}
            // id={post.postId}
            createdAt={post.createdAt}
            type={post.type}
            author={post.author}
            content={post.content}
            images={post.imgUrlPath}
            likeCnt={post.postLikeCount}
            commentCnt={post.commentCount}
            isLoading={props.isLoading}
          />
        ))}
      </Feed>
    </Fragment>
  )
}

export default PostList
