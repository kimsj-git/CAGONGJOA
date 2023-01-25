// auth 관련 상태관리

import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = { username: '' }

const authSlice = createSlice({
  name: "username",
  initialState: initialAuthState,
  reducers: {
    login(state, action){
      state.username = action.payload
    },
    logout(state){
      state.username = ''
    },
  }
})

export const authActions = authSlice.actions

export default authSlice.reducer