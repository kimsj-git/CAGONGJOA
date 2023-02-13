import PostItem from "../mainPage/PostItem"
import { useSelector } from "react-redux"

const PostSearchResult = () => {
  const searchedByPost = useSelector((state) => state.search.searchedByPost)

  {
    searchedByPost.map((post) => {
      return <PostItem post={post} />
    })
  }
  // <PostList
  //   posts={[
  //     {
  //       id: "p1",
  //       author: "서정",
  //       content:
  //         "이름을 하나에 별빛이 아직 동경과 아이들의 시와 했던 봅니다. 이름과, 사랑과 무엇인지 이름을 그러나 내일 버리었습니다. 피어나듯이 보고, 어머니, 별 이름을 마리아 내일 별 봅니다.\n\n비둘기, 피어나듯이 나는 이네들은 걱정도 가득 까닭입니다. 별 이제 같이 있습니다. 프랑시스 다하지 남은 이름과, 있습니다.",
  //       post_likes: 4,
  //       comments_cnt: 1,
  //     },
  //     {
  //       id: "p2",
  //       author: "경희",
  //       content: "게시물222",
  //       post_likes: 6,
  //       comments_cnt: 10,
  //     },
  //   ]}
  // />
}

export default PostSearchResult
