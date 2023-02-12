// post 관련 상태관리

import { createSlice } from "@reduxjs/toolkit"
const initialPostsState = {
  posts: [
    {
      userType: true,
      postId: 1,
      writerNickname: "서정",
      exp: 2000,
      cafeName: "스타벅스 강남R점",
      brandType: "스타벅스",
      createdAt: "2023-02-06T01:31:06",
      postType: "free",
      imgUrlPath: [
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1178&q=80",
      ],
      content:
        "이름을 하나에 별빛이 아직 동경과 아이들의 시와 했던 봅니다. 이름과, 사랑과 무엇인지 이름을 그러나 내일 버리었습니다. 피어나듯이 보고, 어머니, 별 이름을 마리아 내일 별 봅니다.\n\n비둘기, 피어나듯이 나는 이네들은 걱정도 가득 까닭입니다. 별 이제 같이 있습니다. 프랑시스 다하지 남은 이름과, 있습니다.",
      postLikeCount: 4,
      commentCount: 10,
    },
    {
      userType: false,
      postId: 2,
      writerNickname: "경희",
      exp: 1000,
      cafeName: "바나프레소 테헤란로점",
      brandType: "바나프레소",
      createdAt: "2023-02-06T01:31:06",
      postType: "together",
      imgUrlPath: [
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1178&q=80",
      ],
      content: "게시물222",
      postLikeCount: 6,
      commentCount: 10,
    },
    {
      userType: true,
      postId: 3,
      writerNickname: "현철",
      exp: 300,
      cafeName: "메가커피 역삼역점",
      brandType: "메가커피",
      createdAt: "2023-02-06T01:31:06",
      postType: "qna",
      imgUrlPath: [],
      content: "게시물333",
      postLikeCount: 60,
      commentCount: 14,
    },
    {
      userType: true,
      postId: 4,
      writerNickname: "종섭",
      exp: 0,
      cafeName: "양원재",
      brandType: "개인카페",
      createdAt: "2023-02-06T01:31:06",
      postType: "lost",
      imgUrlPath: [
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1178&q=80",
      ],
      content: "게시물444",
      postLikeCount: 66,
      commentCount: 25,
    },
    // {
    //   userType: true,
    //   postId: 5,
    //   author: "준모",
    //   content: "게시물555",
    //   createdAt: "2023-02-06T01:31:06",
    //   type: "tip",
    //   imgUrlPath: [
    //     "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&ixpostId=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1178&q=80",
    //   ],
    //   postLlikeCount: 99,
    //   commentCount: 25,
    // },
    // {
    //   userType: true,
    //   postId: 6,
    //   author: "현철",
    //   content: "게시물666",
    //   createdAt: "2023-02-06T01:31:06",
    //   type: "recommend",
    //   postLikeCount: 99,
    //   imgUrlPath: [
    //     "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1178&q=80",
    //   ],
    //   commentCount: 25,
    // },
  ],
  filterState: {
    hot: false,
    free: false,
    qna: false,
    together: false,
    tip: false,
    recommend: false,
    help: false,
    lost: false,
  },
  isLoading: false,
}

const postsSlice = createSlice({
  name: "posts",
  initialState: initialPostsState,
  reducers: {
    // posts 업데이트
    updatePosts(state, actions) {
      console.log(actions)
      if (actions.payload.lastPostId === -1) {
        state.posts = []
      }
      if (actions.payload.fetchedPosts) {
        state.posts = [...state.posts, ...actions.payload.fetchedPosts]
      }
    },

    // post 생성은 fetch 요청으로 대체

    // post 삭제
    deletePost(state, action) {
      const deletedPostId = action.payload
      state.posts = state.posts.filter((post) => post.postId !== deletedPostId)
    },
    // post 수정
    editPost(state, action) {
      const editedPost = action.payload
      const editIdx = state.posts.findIndex(
        (post) => post.postId === editedPost.id
      )
      state.posts[editIdx].content = editedPost.content
      state.posts[editIdx].postType = editedPost.type
      state.posts[editIdx].imgUrlPath = editedPost.images
    },
    // post 좋아요
    likePost(state, action) {
      state.posts.find(
        (post) => post.postId === action.payload
      ).postLikeCount += 1
    },
    // post 좋아요 취소
    cancleLikePost(state, action) {
      state.posts.find(
        (post) => post.postId === action.payload
      ).postLikeCount -= 1
    },
    // filter 변경
    changeFilter(state, action) {
      const filterToChange = action.payload
      state.filterState[filterToChange] = !state.filterState[filterToChange]
      state.filterState["hot"] = false
    },
    // hot 필터 선택
    filterHot(state, action) {
      state.filterState = {
        hot: true,
        free: false,
        qna: false,
        together: false,
        tip: false,
        recommend: false,
        help: false,
        lost: false,
      }
    },
    isLoading(state) {
      state.isLoading = !state.isLoading
    },
  },
})
const DEFAULT_REST_URL = process.env.REACT_APP_REST_DEFAULT_URL

export const getPosts = (dataSet) => {
  return async (dispatch, history) => {
    dispatch(postsActions.isLoading())
    const sendRequest = async () => {
      const response = await fetch(`${DEFAULT_REST_URL}/main/post/feed`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          postId: dataSet.postId,
          types: dataSet.filters.length
            ? dataSet.filters
            : ["free", "qna", "together", "tip", "recommend", "help", "lost"],
          latitude: JSON.parse(sessionStorage.getItem("location")).lat,
          longitude: JSON.parse(sessionStorage.getItem("location")).lng,
          dist: 0.5,
        }),
      })
      const responseData = await response.json()
      console.log(responseData)
      if (
        responseData.httpStatus === "BAD_REQUEST" &&
        responseData.data.sign === "JWT"
      ) {
        const response = await fetch(`${DEFAULT_REST_URL}/member/refresh`, {
          method: "GET",
          headers: {
            "Authorization-RefreshToken": `Bearer ${sessionStorage.getItem(
              "refreshToken"
            )}`,
          },
        })
        const responseData = await response.json()
        if (responseData.httpStatus !== "OK") {
          sessionStorage.clear()
          window.location.href = "/login"
        }else{
          sessionStorage.setItem("accessToken", responseData.data.accessToken)
          sendRequest(dataSet)
        }
      }
      if (responseData.httpStatus === "OK") {
        return responseData.data
      }
    }
    try {
      const fetchedPosts = await sendRequest()
      dispatch(
        postsActions.updatePosts({
          fetchedPosts: fetchedPosts,
          lastPostId: dataSet.postId,
        })
      )
    } catch (error) {
      console.error(error)
    }
    dispatch(postsActions.isLoading())
  }
}
export const postsActions = postsSlice.actions

export default postsSlice.reducer
