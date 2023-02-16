import PostItem from "../mainPage/PostItem"
import { useSelector } from "react-redux"

const PostSearchResult = () => {
  const searchedByPost = useSelector((state) => state.search.searchedByPost)

  return (
    <>
      {searchedByPost.map((post, index) => (
        <PostItem
          key={post.postId}
          id={post.postId}
          createdAt={post.createdAt}
          type={post.postType}
          writer={post.writerNickname}
          userType={post.userType}
          tier={post.exp}
          cafeName={post.cafeName}
          cafeBrand={post.brandType}
          content={post.content}
          images={post.imgUrlPath}
          likeCnt={post.postLikeCount}
          commentCnt={post.commentCount}
          // isLoading={isLoading}
          isLiked={post.likeChecked}
        />
      ))}
    </>
  )
}

export default PostSearchResult
