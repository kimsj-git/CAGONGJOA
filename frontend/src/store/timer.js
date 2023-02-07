// timer 관련 상태관리

import { createSlice } from "@reduxjs/toolkit"

const initialTimerState = {
  accTime: 0,   // 누적시간 저장
}

const timerSlice = createSlice({
  name: "timer",
  initialState: initialTimerState,
  reducers: {
    update(state, action) {
      state.accTime += action.payload
    },
  },
})

export const timerActions = timerSlice.actions

export default timerSlice.reducer
