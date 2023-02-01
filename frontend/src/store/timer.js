// timer 관련 상태관리

import { createSlice } from "@reduxjs/toolkit"

const initialTimerState = {
  startTime: null, 
  nowTime: null,
}

const timerSlice = createSlice({
  name: "timer",
  initialState: initialTimerState,
  reducers: {
    update(state, action) {
      state.nowTime = action.payload
    },
  },
})

export const timerActions = timerSlice.actions

export default timerSlice.reducer
