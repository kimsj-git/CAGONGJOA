// comment 관련 상태관리

import { createSlice } from "@reduxjs/toolkit"
const initialCommentsState = {
  comments: [
    {
      commentId: 2,
            writerId: 3,
            writerNickname: "종스비",
            writerType: true,
            verifiedCafeId: 1,
            verifiedCafeName: "달콤커피 역삼역점",
            cafeBrandType: "달콤커피",
            exp: 500,
            content: "나 사나이 양준모, 돈까스가 고프다",
            createdAt: "2023-02-10T12:54:12",
            commentLikeCnt: 0,
            likeChecked: false,
            replies: [
              {
                commentId: 8,
                      writerId: 3,
                      writerNickname: "리액티스트",
                      writerType: false,
                      verifiedCafeId: null,
                      verifiedCafeName: null,
                      cafeBrandType: null,
                      exp: null,
                      content: "대댓글 작업중",
                      createdAt: "2023-02-14T12:54:12",
                      commentLikeCnt: 0,
                      parentId: 2,
                      likeChecked: false,
              }
            ]
    },
    {
      commentId: 3,
                      writerId: 1,
                      writerNickname: "리액티스트",
                      writerType: false,
                      verifiedCafeId: null,
                      verifiedCafeName: null,
                      cafeBrandType: null,
                      exp: null,
                      content: "나 사나이 양준모, 돈까스가 고프다",
                      createdAt: "2023-02-14T12:54:12",
                      commentLikeCnt: 0,
                      likeChecked: false,
                      replies: [
                        
                      ]
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
      console.log('업데이트코멘츠')
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
      console.log('업데이트리플라이즈')
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
      state.comments.find(
        (comment) => comment.commentId === parentId
      ).find((reply) => reply.commentId === replyId).commentLikeCnt += num
    },
    // // comment 좋아요 취소
    // cancleLikeComment(state, action) {
    //   state.comments.find(
    //     (comment) => comment.commentId === action.payload
    //   ).commentLikeCnt -= 1
    // },
    // // reply 좋아요 취소
    // cancleLikeReply(state, action) {
    //   const {parentId, replyId} = 
    //   state.comments.find(
    //     (comment) => comment.commentId === parentId
    //   ).find((reply) => reply.commentId === replyId).commentLikeCnt -= 1
    // },
  },
})

export const commentsActions = commentsSlice.actions

export default commentsSlice.reducer
