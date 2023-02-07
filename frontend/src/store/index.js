// 모든 상태관리를 맡을 Redux

import { configureStore } from "@reduxjs/toolkit"

import authReducer from "./auth"
import modalReducer from "./modal"
import timerReducer from "./timer"
import cafeReducer from "./cafe"
import todoReducer from "./todo"
import studyHistoryReducer from "./studyHistory"
import postReducer from "./post"

const store = configureStore({
  reducer: {
    auth: authReducer,
    modal: modalReducer,
    timer: timerReducer,
    todo: todoReducer,
    cafe: cafeReducer,
    studyHistory: studyHistoryReducer,
    post: postReducer,
  },
})

export default store
