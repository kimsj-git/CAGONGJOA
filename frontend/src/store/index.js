// 모든 상태관리를 맡을 Redux

import { configureStore } from "@reduxjs/toolkit"

import authReducer from "./auth"
import modalReducer from "./modal"
import timerReducer from "./timer"

const store = configureStore({
  reducer: { auth: authReducer, modal: modalReducer, timer: timerReducer },
})

export default store
