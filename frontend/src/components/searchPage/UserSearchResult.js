import { useSelector } from "react-redux"
import PostItem from "../mainPage/PostItem"

const UserSearchResult = () => {
  const searchedByUser = useSelector((state) => state.search.searchedByUser)
  return (
    <>
      {searchedByUser.map((post, index) => (
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

export default UserSearchResult
