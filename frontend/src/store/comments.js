// comment 관련 상태관리

import { createSlice } from "@reduxjs/toolkit"
const initialCommentsState = {
  comments: [
  ],
  lastCommentId: -1,
}

const commentsSlice = createSlice({
  name: "comments",
  initialState: initialCommentsState,
  reducers: {
    // comments 업데이트
    updateComments(state, actions) {
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

    updateReplies(state, action) {
      const parentComment = action.payload
      const parentIdx = state.comments.findIndex(
        (comment) => comment.commentId === parentComment.commentId
      )
      state.comments[parentIdx] = parentComment
    // comment 생성은 fetch 요청으로 대체
      },
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
    // reply 삭제
    deleteReply(state, action) {
      const {parentId, deletedReplyId} = action.payload
      const parentIdx = state.comments.findIndex((comment) => comment.commentId === parentId)
      state.comments[parentIdx].replies = state.comments[parentIdx].replies.filter((reply) => reply.commentId !== deletedReplyId)
      
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
    
    // comment 좋아요/좋아요 취소
    likeComment(state, action) {
      const {commentId, num} = action.payload
      state.comments.find(
        (comment) => comment.commentId === commentId
      ).commentLikeCnt += num
    },
    // reply 좋아요/좋아요 취소
    likeReply(state, action) {
      const {parentId, replyId, num} = action.payload
      const parentComment = state.comments.find(
        (comment) => comment.commentId === parentId)
      parentComment.replies.find((reply) => reply.commentId === replyId).commentLikeCnt += num
    },
    closeModal(state){
      state.lastCommentId = -1
      state.comments = []
    },
  },
})

export const commentsActions = commentsSlice.actions

export default commentsSlice.reducer
