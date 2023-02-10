// auth 관련 상태관리

import { createSlice } from "@reduxjs/toolkit"

const initialAuthState = {
  username: "",
  checkLoading: false,
  isNicknameValid: false,
}

const authSlice = createSlice({
  name: "username",
  initialState: initialAuthState,
  reducers: {
    check(state, actions) {
      state.isNicknameValid = actions.payload
    },
    nowLoading(state) {
      state.checkLoading = true
    },
    finishLoading(state){
      state.checkLoading = false
    }
  },
})

const DEFAULT_REST_URL = process.env.REACT_APP_REST_DEFAULT_URL

export const checkNickname = (nickname) => {
  return async (dispatch) => {
    const sendRequest = async () => {
      const response = await fetch(
        `${DEFAULT_REST_URL}/member/checkDuplicatedNickname?nickname=${nickname}`
      )
      const result = await response.json()
      if (result.httpStatus==="OK"){
        console.log("auth.js, 중복된 닉네임X, 제출하세요")
        return true
      } else if (result.httpStatus==="BAD_REQUEST" && result.data.sign==="MEMBER"){
        comsole.log("auth.js, 중복된 닉네임입니다.")
        return false
      }
    }
    try{
      const result = await sendRequest()
      dispatch(authActions.check(result))
    }catch (error) {
      console.error(error)
    }
    dispatch(authActions.finishLoading())
  }
}

export const authActions = authSlice.actions

export default authSlice.reducer
