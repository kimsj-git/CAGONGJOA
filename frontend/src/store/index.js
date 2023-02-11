// 모든 상태관리를 맡을 Redux

import { configureStore } from "@reduxjs/toolkit"

import authReducer from "./auth"
import modalReducer from "./modal"
import timerReducer from "./timer"
import cafeReducer from "./cafe"
import todoReducer from "./todo"
import studyHistoryReducer from "./studyHistory"
import imageReducer from "./image"
import postsReducer from "./posts"
import commentsReducer from "./comments"

const store = configureStore({
  reducer: {
    auth: authReducer,
    modal: modalReducer,
    timer: timerReducer,
    todo: todoReducer,
    cafe: cafeReducer,
    studyHistory: studyHistoryReducer,
    image: imageReducer,
    posts: postsReducer,
    comments: commentsReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
})

export default store
