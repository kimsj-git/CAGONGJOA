// post 관련 상태관리

import { createSlice } from "@reduxjs/toolkit"
const initialPostsState = {
  hasNext: true,
  posts: [
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
      state.hasNext = actions.payload.hasNext
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
        hot: action.payload,
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
  return async (dispatch) => {
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
          latitude: dataSet.location.lat,
          longitude: dataSet.location.lng,  
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
        } else {
          sessionStorage.setItem("accessToken", responseData.data.accessToken)
          sendRequest(dataSet)
        }
      }
      if (responseData.httpStatus === "OK" || responseData.httpStatus === "NO_CONTENT") {
        return responseData.data
      }

    }
    try {
      const {hasNext, post}= await sendRequest()
      
      dispatch(
        postsActions.updatePosts({
          fetchedPosts: post,
          lastPostId: dataSet.postId,
          hasNext: hasNext,
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
