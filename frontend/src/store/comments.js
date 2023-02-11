// comment 관련 상태관리

import { createSlice } from "@reduxjs/toolkit"
const initialCommentsState = {
  comments: [
    {
      commentId: 1,
      content: "댓글1",
      createdAt: "2023-02-05T12:36:19",
      commentLike: 3,
      memberId: 1,
    },
    {
      commentId: 2,
      content: "댓글2",
      createdAt: "2023-02-05T22:36:19",
      commentLike: 5,
      memberId: 2,
    },
  ],
  lastCommentId: -1,
}

const commentsSlice = createSlice({
  name: "comments",
  initialState: initialCommentsState,
  reducers: {
    // comments 업데이트
    updateComments(state, actions) {
      console.log(actions)
      if (actions.payload.lastCommentId === -1) {
        state.comments = []
      }
      if (actions.payload.fetchedComments) {
        state.comments = [...state.comments, ...actions.payload.fetchedComments]
      }
      state.lastCommentId = state.comments.length
        ? state.comments.at(-1).commentId
        : -1
    },

    // comment 생성은 fetch 요청으로 대체

    // comment 삭제
    deleteComment(state, action) {
      const deletedCommentId = action.payload
      state.comments = state.comments.filter(
        (comment) => comment.commentId !== deletedCommentId
      )
      state.lastCommentId = state.comments.length
        ? state.comments.at(-1).commentId
        : -1
    },
    // comment 수정
    editComment(state, action) {
      const editedComment = action.payload
      const editIdx = state.comments.findIndex(
        (comment) => comment.commentId === editedComment.id
      )
      state.comments[editIdx].content = editedComment.content
      state.comments[editIdx].commentType = editedComment.type
      state.comments[editIdx].imgUrlPath = editedComment.images
    },
    // comment 좋아요
    likeComment(state, action) {
      state.comments.find(
        (comment) => comment.commentId === action.payload
      ).commentLike += 1
    },
    // post 좋아요 취소
    cancleLikeComment(state, action) {
      state.comments.find(
        (comment) => comment.commentId === action.payload
      ).commentLike -= 1
    },
  },
})

export const commentsActions = commentsSlice.actions

export default commentsSlice.reducer
