// post 관련 상태관리

import { createSlice } from "@reduxjs/toolkit"

const initialPostsState = {
  posts: [
    {
      key: 1,
      id: 1,
      author: "서정",
      createdAt: "2023-02-06T01:31:06",
      type: "free",
      content:
        "이름을 하나에 별빛이 아직 동경과 아이들의 시와 했던 봅니다. 이름과, 사랑과 무엇인지 이름을 그러나 내일 버리었습니다. 피어나듯이 보고, 어머니, 별 이름을 마리아 내일 별 봅니다.\n\n비둘기, 피어나듯이 나는 이네들은 걱정도 가득 까닭입니다. 별 이제 같이 있습니다. 프랑시스 다하지 남은 이름과, 있습니다.",
      imgUrlPath: [
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1178&q=80",
      ],
      likeCnt: 4,
      commentCnt: 1,
      isLoading: false,
    },
    {
      key: 2,
      id: 2,
      author: "경희",
      content: "게시물222",
      createdAt: "2023-02-06T01:31:06",
      type: "together",
      imgUrlPath: [
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1178&q=80",
      ],
      likeCnt: 6,
      commentCnt: 10,
      isLoading: false,
    },
    {
      key: 3,
      id: 3,
      author: "현철",
      content: "게시물333",
      createdAt: "2023-02-06T01:31:06",
      type: "qna",
      imgUrlPath: [
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1178&q=80",
      ],
      likeCnt: 99,
      commentCnt: 25,
      isLoading: false,
    },
    {
      key: 4,
      id: 4,
      author: "종섭",
      content: "게시물444",
      createdAt: "2023-02-06T01:31:06",
      type: "lost",
      imgUrlPath: [
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1178&q=80",
      ],
      likeCnt: 99,
      commentCnt: 25,
      isLoading: true,
    },
    {
      key: 5,
      id: 5,
      author: "준모",
      content: "게시물555",
      createdAt: "2023-02-06T01:31:06",
      type: "tip",
      imgUrlPath: [
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1178&q=80",
      ],
      likeCnt: 99,
      commentCnt: 25,
      isLoading: true,
    },
    {
      key: 6,
      id: 6,
      author: "현철",
      content: "게시물666",
      createdAt: "2023-02-06T01:31:06",
      type: "recommend",
      likeCnt: 99,
      imgUrlPath: [
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1178&q=80",
      ],
      commentCnt: 25,
      isLoading: true,
    },
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
}

const postsSlice = createSlice({
  name: "posts",
  initialState: initialPostsState,
  reducers: {
    // posts 업데이트
    updatePosts(state, action) {
      state.posts = [...action.payload]
    },

    // post 생성은 fetch 요청으로 대체

    // post 삭제
    deletePost(state, action) {
      const deletedPostId = action.payload
      state.posts = state.posts.filter((post) => post.id !== deletedPostId)
    },
    // post 수정
    editPost(state, action) {
      const editedPost = action.payload
      const editIdx = state.posts.findIndex((post) => post.id === editedPost.id)
      state.posts.splice(editIdx, 1, { ...editedPost })
    },
    // post 좋아요
    likePost(state, action) {
      const likedPost = state.posts.find((post) => post.id === action.payload)
      likedPost.likeCnt += 1
    },
    // post 좋아요 취소
    cancleLikePost(state, action) {
      const likeCancledPost = state.posts.find(
        (post) => post.id === action.payload
      )
      likeCancledPost.likeCnt -= 1
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
  },
})

export const postsActions = postsSlice.actions

export default postsSlice.reducer
