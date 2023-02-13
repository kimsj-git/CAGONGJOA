import { useSelector } from "react-redux"
import PostItem from "../mainPage/PostItem"

const UserSearchResult = () => {
  const searchedByUser = useSelector((state) => state.search.searchedByUser)
  {
    searchedByUser.map((post) => {
      return <PostItem post={post} />
    })
  }
}

export default UserSearchResult
