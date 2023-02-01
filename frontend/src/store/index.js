// 모든 상태관리를 맡을 Redux

import { configureStore } from "@reduxjs/toolkit"

import authReducer from "./auth"
import modalReducer from "./modal"
import timerReducer from "./timer"
import todoReducer from "./todo"

const store = configureStore({
  reducer: { auth: authReducer, modal: modalReducer, timer: timerReducer, todo: todoReducer },
})

export default store
