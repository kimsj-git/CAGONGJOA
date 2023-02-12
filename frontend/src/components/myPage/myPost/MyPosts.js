import { useEffect } from "react"
import { useInView } from "react-intersection-observer"
import { Item } from "semantic-ui-react"

import MyPostsItem from "./MyPostsItem"

const DUMMY_DATA = [
  {
    id: 1,
    images: ["chat_bubble.png"],
    cafeName: "스타벅스 강남점",
    postContent:
      "이름을 하나에 별빛이 아직 동경과 아이들의 시와 했던\
봅니다. 이름과, 사랑과 무엇인지 이름을 그러나 내일\
버리었습니다. 피어나듯이 보고, 어머니, 별 이름을 마리아\
내일 별 봅니다. 비둘기, 피어나듯이 나는 이네들은 걱정도\
가득 까닭입니다. 별 이제 같이 있습니다. 프랑시스 다하지\
",
    postType: "자유",
    author: "나야나",
    createdAt: "2020-02-02",
    commentCnt: 6,
  },
  {
    id: 2,
    images: ["coffee_location_red.png"],
    cafeName: "스타벅스 테헤란로",
    postContent:
      "이름을 하나에 별빛이 아직 동경과 아이들의 시와 했던\
봅니다. 이름과, 사랑과 무엇인지 이름을 그러나 내일\
버리었습니다. 피어나듯이 보고, 어머니, 별 이름을 마리아\
내일 별 봅니다. 비둘기, 피어나듯이 나는 이네들은 걱정도\
",
    postType: "자랑",
    author: "나야나",
    createdAt: "2020-02-02",
    commentCnt: 6,
  },
  {
    id: 3,
    images: [],
    cafeName: "스타벅스 테헤란로",
    postContent:
      "이름을 하나에 별빛이 아직 동경과 아이들의 시와 했던\
봅니다. 이름과, 사랑과 무엇인지 이름을 그러나 내일\
버리었습니다. 피어나듯이 보고, 어머니, 별 이름을 마리아\
내일 별 봅니다. 비둘기, 피어나듯이 나는 이네들은 걱정도\
",
    postType: "자랑",
    author: "나야나",
    createdAt: "2020-02-02",
    commentCnt: 6,
  },
  {
    id: 4,
    images: ["chat_bubble.png"],
    cafeName: "스타벅스 강남점",
    postContent:
      "이름을 하나에 별빛이 아직 동경과 아이들의 시와 했던\
봅니다. 이름과, 사랑과 무엇인지 이름을 그러나 내일\
버리었습니다. 피어나듯이 보고, 어머니, 별 이름을 마리아\
내일 별 봅니다. 비둘기, 피어나듯이 나는 이네들은 걱정도\
가득 까닭입니다. 별 이제 같이 있습니다. 프랑시스 다하지\
",
    postType: "자유",
    author: "나야나",
    createdAt: "2020-02-02",
    commentCnt: 6,
  },
  {
    id: 5,
    images: ["coffee_location_red.png"],
    cafeName: "스타벅스 테헤란로",
    postContent:
      "이름을 하나에 별빛이 아직 동경과 아이들의 시와 했던\
봅니다. 이름과, 사랑과 무엇인지 이름을 그러나 내일\
버리었습니다. 피어나듯이 보고, 어머니, 별 이름을 마리아\
내일 별 봅니다. 비둘기, 피어나듯이 나는 이네들은 걱정도\
",
    postType: "자랑",
    author: "나야나",
    createdAt: "2020-02-02",
    commentCnt: 6,
  },
  {
    id: 6,
    images: [],
    cafeName: "스타벅스 테헤란로",
    postContent:
      "이름을 하나에 별빛이 아직 동경과 아이들의 시와 했던\
봅니다. 이름과, 사랑과 무엇인지 이름을 그러나 내일\
버리었습니다. 피어나듯이 보고, 어머니, 별 이름을 마리아\
내일 별 봅니다. 비둘기, 피어나듯이 나는 이네들은 걱정도\
",
    postType: "자랑",
    author: "나야나",
    createdAt: "2020-02-02",
    commentCnt: 6,
  },
]

const MyPosts = () => {
  const [ref, inView] = useInView({
    threshold: 1,
  })
  
  const getMorePost = () => {
    console.log("get")
  }
  if (inView === true){
    getMorePost()
  }

  return (
    <>
      <Item.Group divided style={{ width: "100%" }}>
        {DUMMY_DATA.map((post) => {
          return <MyPostsItem post={post} key={post.id} />
        })}
      </Item.Group>
      <div ref={ref}></div>
    </>
  )
}

export default MyPosts
