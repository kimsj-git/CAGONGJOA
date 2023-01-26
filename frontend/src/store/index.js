// 모든 상태관리를 맡을 Redux

import { configureStore } from "@reduxjs/toolkit"

import authReducer from "./auth"

const store = configureStore({
  reducer: { auth: authReducer },
})

export default store
